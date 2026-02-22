// Mission Control - Trading Dashboard
// Tool 1: Stock Scanner

'use client';

import { useState } from 'react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: string;
  sector: string;
}

const SAMPLE_STOCKS: Stock[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: 881.23, change: 2.34, volume: 45230000, marketCap: '2.18T', sector: 'Technology' },
  { ticker: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -1.22, volume: 89120000, marketCap: '790B', sector: 'Consumer Cyclical' },
  { ticker: 'META', name: 'Meta Platforms', price: 585.20, change: 1.87, volume: 21340000, marketCap: '1.48T', sector: 'Technology' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', price: 178.45, change: 3.12, volume: 67890000, marketCap: '288B', sector: 'Technology' },
  { ticker: 'PLTR', name: 'Palantir Technologies', price: 72.30, change: 5.67, volume: 89230000, marketCap: '158B', sector: 'Technology' },
  { ticker: 'SMCI', name: 'Super Micro Computer', price: 892.10, change: -2.45, volume: 3456000, marketCap: '52B', sector: 'Technology' },
  { ticker: 'RIVN', name: 'Rivian Automotive', price: 12.45, change: 8.92, volume: 156780000, marketCap: '12B', sector: 'Consumer Cyclical' },
  { ticker: 'LCID', name: 'Lucid Group', price: 3.21, change: 4.56, volume: 89234000, marketCap: '7B', sector: 'Consumer Cyclical' },
];

export default function StockScanner() {
  const [stocks, setStocks] = useState<Stock[]>(SAMPLE_STOCKS);
  const [filters, setFilters] = useState({
    minCap: '0',
    minVolume: '0',
    minPrice: '0',
    sector: 'all',
  });
  const [sortBy, setSortBy] = useState<'change' | 'volume' | 'marketCap'>('change');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = stocks
    .filter(s => {
      const capNum = parseFloat(s.marketCap.replace('T', '000').replace('B', ''));
      if (capNum < parseFloat(filters.minCap) * 1000) return false;
      if (s.volume < parseInt(filters.minVolume) * 1000000) return false;
      if (s.price < parseFloat(filters.minPrice)) return false;
      if (filters.sector !== 'all' && s.sector !== filters.sector) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortBy === 'marketCap') {
        aVal = parseFloat(a.marketCap.replace('T', '1000').replace('B', '1'));
        bVal = parseFloat(b.marketCap.replace('T', '1000').replace('B', '1'));
      } else if (sortBy === 'volume') {
        aVal = a.volume;
        bVal = b.volume;
      } else {
        aVal = a.change;
        bVal = b.change;
      }
      return sortDesc ? bVal - aVal : aVal - bVal;
    });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Min Cap ($B)</label>
            <input
              type="number"
              value={filters.minCap}
              onChange={e => setFilters({ ...filters, minCap: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Min Volume (M)</label>
            <input
              type="number"
              value={filters.minVolume}
              onChange={e => setFilters({ ...filters, minVolume: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Min Price ($)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={e => setFilters({ ...filters, sector: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Consumer Cyclical">Consumer Cyclical</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financial">Financial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            >
              <option value="change">% Change</option>
              <option value="volume">Volume</option>
              <option value="marketCap">Market Cap</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Ticker</th>
              <th className="text-left p-4 text-slate-400 font-medium">Name</th>
              <th className="text-right p-4 text-slate-400 font-medium">Price</th>
              <th className="text-right p-4 text-slate-400 font-medium">% Change</th>
              <th className="text-right p-4 text-slate-400 font-medium">Volume</th>
              <th className="text-right p-4 text-slate-400 font-medium">Market Cap</th>
              <th className="text-left p-4 text-slate-400 font-medium">Sector</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, i) => (
              <tr key={stock.ticker} className={`border-t border-slate-700 hover:bg-slate-700/30 ${i % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                <td className="p-4 font-semibold text-blue-400">{stock.ticker}</td>
                <td className="p-4 text-slate-300">{stock.name}</td>
                <td className="p-4 text-right text-white">${stock.price.toFixed(2)}</td>
                <td className={`p-4 text-right font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </td>
                <td className="p-4 text-right text-slate-300">{(stock.volume / 1000000).toFixed(1)}M</td>
                <td className="p-4 text-right text-slate-300">{stock.marketCap}</td>
                <td className="p-4 text-slate-400">{stock.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500">No stocks match your filters</div>
        )}
      </div>

      <div className="text-sm text-slate-500">
        Showing {filtered.length} of {stocks.length} stocks
      </div>
    </div>
  );
}
