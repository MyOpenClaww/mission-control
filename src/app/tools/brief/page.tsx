// Mission Control - Trading Dashboard
// Tool 2: Morning Brief

'use client';

import { useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  source: string;
  category: string;
}

const SAMPLE_NEWS: NewsItem[] = [
  { id: 1, title: "Stocks Rally on Supreme Court Tariff Ruling", source: "247 Wall St", category: "Market" },
  { id: 2, title: "Tech Weakness Continues - Nasdaq Down 2%+ YTD", source: "CNBC", category: "Tech" },
  { id: 3, title: "Q4 GDP and PCE Inflation Data Due This Week", source: "Investopedia", category: "Economy" },
  { id: 4, title: "Sector Rotation: Money Flowing into Digital Infrastructure", source: "CNBC", category: "Sectors" },
  { id: 5, title: "Bonds and Dollar Slip Post-Tariff Decision", source: "Bloomberg", category: "Macro" },
];

const SAMPLE_TASKS = [
  { id: 1, title: "Scan for breakout candidates in tech/digital infrastructure", priority: "high" },
  { id: 2, title: "Review market breadth - was yesterday's rally broad or narrow?", priority: "medium" },
  { id: 3, title: "Set up FinViz scan with $500M+ cap, increasing volume filters", priority: "medium" },
];

export default function MorningBrief() {
  const [date] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Morning Brief</h1>
        <span className="text-slate-400">{date}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Market News */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📰</span>
            <h2 className="text-lg font-semibold text-white">Top Market News</h2>
          </div>
          <ul className="space-y-3">
            {SAMPLE_NEWS.map((item) => (
              <li key={item.id} className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/30 transition">
                <div className="text-white text-sm font-medium">{item.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{item.source}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">{item.category}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Trending */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h2 className="text-lg font-semibold text-white">Trending on Social</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-slate-400 text-sm">Top Mentions</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['NVDA', 'TSLA', 'PLTR', 'AMD', 'SMCI'].map(ticker => (
                  <span key={ticker} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                    ${ticker}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-slate-400 text-sm">Hot Sectors</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['AI Infrastructure', 'Digital Energy', 'Semiconductors'].map(sector => (
                  <span key={sector} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-slate-400 text-sm">Sentiment</div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '62%' }}></div>
                  </div>
                  <span className="text-green-400 text-sm font-medium">62% Bullish</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
        </div>
        <div className="space-y-3">
          {SAMPLE_TASKS.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/30 transition cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-600" />
              <span className="text-white flex-1">{task.title}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                task.priority === 'high' ? 'bg-red-600/20 text-red-400' : 'bg-yellow-600/20 text-yellow-400'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">S&P 500</div>
          <div className="text-2xl font-bold text-white mt-1">6,907</div>
          <div className="text-green-400 text-sm">+0.66%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Nasdaq</div>
          <div className="text-2xl font-bold text-white mt-1">19,628</div>
          <div className="text-red-400 text-sm">-0.22%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">VIX</div>
          <div className="text-2xl font-bold text-white mt-1">18.42</div>
          <div className="text-slate-400 text-sm">-2.1%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">US 10Y</div>
          <div className="text-2xl font-bold text-white mt-1">4.32%</div>
          <div className="text-slate-400 text-sm">-4 bps</div>
        </div>
      </div>
    </div>
  );
}
