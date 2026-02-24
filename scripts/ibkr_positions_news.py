#!/usr/bin/env python3
"""
IBKR Daily Positions News Script
Fetches open positions from Interactive Brokers and gets latest news for each ticker
Posts to Discord/Telegram
"""

import os
import requests
import json
from datetime import datetime

# Configuration - set these as environment variables
IBKR_USERNAME = os.getenv('IBKR_USERNAME', '')
IBKR_PASSWORD = os.getenv('IBKR_PASSWORD', '')
DISCORD_WEBHOOK = os.getenv('DISCORD_WEBHOOK', '')
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '')

# IBKR Client Portal API endpoints
BASE_URL = "https://localhost:5000/v1/api"  # For local gateway, or use ibkr.cloud

def login_ibkr():
    """Authenticate with IBKR Client Portal API"""
    session = requests.Session()
    
    # For paper trading: use /sso/login?local=1
    # For live: use /sso/login
    auth_resp = session.post(
        f"{BASE_URL}/sso/login",
        json={
            "username": IBKR_USERNAME,
            "password": IBKR_PASSWORD
        }
    )
    
    if auth_resp.status_code == 200:
        return session
    else:
        print(f"Login failed: {auth_resp.text}")
        return None

def get_positions(session):
    """Fetch open positions from IBKR"""
    positions_resp = session.get(f"{BASE_URL}/portfolio/positions")
    
    if positions_resp.status_code == 200:
        positions = positions_resp.json()
        # Filter for non-zero positions
        return [p for p in positions if float(p.get('position', 0)) != 0]
    return []

def get_news_for_ticker(ticker):
    """Fetch latest news for a ticker using web search"""
    # Using a simple news API - you can replace with your preferred source
    try:
        # This is a placeholder - you'd integrate with FinViz, NewsAPI, etc.
        # For now, returns empty list
        return []
    except Exception as e:
        print(f"Error getting news for {ticker}: {e}")
        return []

def format_message(positions, news_dict):
    """Format the positions and news as a message"""
    message = "📊 **IBKR Daily Positions Update**\n"
    message += f"_{datetime.now().strftime('%Y-%m-%d %H:%M')}_\n\n"
    
    if not positions:
        message += "No open positions found."
        return message
    
    message += "**Open Positions:**\n"
    
    for pos in positions:
        ticker = pos.get('symbol', pos.get('conid', 'Unknown'))
        position = pos.get('position', 0)
        market_value = pos.get('marketValue', 0)
        pnl = pos.get('unrealizedPnL', 0)
        
        emoji = "🟢" if float(pnl) >= 0 else "🔴"
        
        message += f"\n{emoji} **{ticker}**\n"
        message += f"   Shares: {position}\n"
        message += f"   Value: ${market_value}\n"
        message += f"   P&L: ${pnl}\n"
        
        # Add news if available
        if ticker in news_dict and news_dict[ticker]:
            message += f"   📰 {news_dict[ticker][0][:100]}...\n"
    
    return message

def send_discord(message):
    """Send message to Discord webhook"""
    if not DISCORD_WEBHOOK:
        return
    
    payload = {"content": message}
    requests.post(DISCORD_WEBHOOK, json=payload)

def send_telegram(message):
    """Send message to Telegram"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    requests.post(url, json=payload)

def main():
    print("Starting IBKR Daily Positions News...")
    
    # For demo purposes, let's simulate positions
    # In production, uncomment the login and get_positions calls
    
    # session = login_ibkr()
    # if not session:
    #     print("Failed to login to IBKR")
    #     return
    #
    # positions = get_positions(session)
    
    # Demo positions for testing
    positions = [
        {"symbol": "AAPL", "position": 100, "marketValue": 17500, "unrealizedPnL": 250},
        {"symbol": "MSFT", "position": 50, "marketValue": 15000, "unrealizedPnL": -120},
        {"symbol": "NVDA", "position": 25, "marketValue": 8500, "unrealizedPnL": 450},
    ]
    
    # Get news for each position
    news_dict = {}
    for pos in positions:
        ticker = pos.get('symbol')
        news_dict[ticker] = get_news_for_ticker(ticker)
    
    # Format and send message
    message = format_message(positions, news_dict)
    
    print(message)
    
    send_discord(message)
    send_telegram(message)
    
    print("Done!")

if __name__ == "__main__":
    main()
