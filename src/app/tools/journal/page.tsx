// Mission Control - Trading Dashboard
// Tool 3: Trade Journal

'use client';

import { useState } from 'react';

interface Trade {
  id: number;
  ticker: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  status: 'open' | 'closed';
  entryDate: string;
  exitDate?: string;
  notes: string;
  pnl?: number;
}

const SAMPLE_TRADES: Trade[] = [
  { id: 1, ticker: 'NVDA', type: 'long', entryPrice: 850.00, exitPrice: 881.23, size: 100, status: 'closed', entryDate: '2026-02-14', exitDate: '2026-02-19', notes: 'Breakout from cup handle', pnl: 3123 },
  { id: 2, ticker: 'PLTR', type: 'long', entryPrice: 65.50, exitPrice: 72.30, size: 500, status: 'closed', entryDate: '2026-02-10', exitDate: '2026-02-18', notes: 'Volume spike breakout', pnl: 3400 },
  { id: 3, ticker: 'TSLA', type: 'short', entryPrice: 255.00, size: 200, status: 'open', entryDate: '2026-02-19', notes: 'Failed breakout, weakness', pnl: -1300 },
  { id: 4, ticker: 'AMD', type: 'long', entryPrice: 168.00, size: 300, status: 'open', entryDate: '2026-02-20', notes: 'New high breakout', pnl: 3135 },
];

export default function TradeJournal() {
  const [trades] = useState<Trade[]>(SAMPLE_TRADES);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  const filtered = trades.filter(t => filter === 'all' || t.status === filter);
  
  const totalPnl = trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + (t.pnl || 0), 0);
  const openPnl = trades.filter(t => t.status === 'open').reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = (() => {
    const closed = trades.filter(t => t.status === 'closed');
    const wins = closed.filter(t => (t.pnl || 0) > 0).length;
    return closed.length > 0 ? Math.round((wins / closed.length) * 100) : 0;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Trade Journal</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
          + New Trade
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Closed P&L</div>
          <div className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Open P&L</div>
          <div className={`text-2xl font-bold mt-1 ${openPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {openPnl >= 0 ? '+' : ''}${openPnl.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Win Rate</div>
          <div className="text-2xl font-bold text-white mt-1">{winRate}%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm">Total Trades</div>
          <div className="text-2xl font-bold text-white mt-1">{trades.length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'open', 'closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Trades Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Ticker</th>
              <th className="text-left p-4 text-slate-400 font-medium">Type</th>
              <th className="text-right p-4 text-slate-400 font-medium">Entry</th>
              <th className="text-right p-4 text-slate-400 font-medium">Exit</th>
              <th className="text-right p-4 text-slate-400 font-medium">Size</th>
              <th className="text-right p-4 text-slate-400 font-medium">P&L</th>
              <th className="text-left p-4 text-slate-400 font-medium">Entry Date</th>
              <th className="text-left p-4 text-slate-400 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trade, i) => (
              <tr key={trade.id} className={`border-t border-slate-700 hover:bg-slate-700/30 ${i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                <td className="p-4">
                  <span className={`font-semibold ${trade.type === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.ticker}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${trade.status === 'open' ? 'bg-yellow-600/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>
                    {trade.status}
                  </span>
                </td>
                <td className="p-4 text-slate-300 capitalize">{trade.type}</td>
                <td className="p-4 text-right text-white">${trade.entryPrice.toFixed(2)}</td>
                <td className="p-4 text-right text-white">
                  {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                </td>
                <td className="p-4 text-right text-slate-300">{trade.size}</td>
                <td className={`p-4 text-right font-medium ${(trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl ? (trade.pnl >= 0 ? '+' : '') + `$${trade.pnl.toLocaleString()}` : '-'}
                </td>
                <td className="p-4 text-slate-400">{trade.entryDate}</td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{trade.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">No trades found</div>
        )}
      </div>
    </div>
  );
}
