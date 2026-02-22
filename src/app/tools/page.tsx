'use client';

import { useState } from 'react';

const tools = [
  { name: 'Trading Dashboard', description: 'Stock scanner, morning brief, trade journal', url: 'http://localhost:3001', status: 'available', icon: '📈' },
  { name: 'QMD Search', description: 'Local markdown search for notes and docs', status: 'available', icon: '🔍' },
  { name: 'Browser Control', description: 'Web automation and scraping', status: 'available', icon: '🌐' },
  { name: 'Weather', description: 'Weather forecasts and conditions', status: 'available', icon: '🌤️' },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? tools : tools.filter(t => t.status === activeTab);

  return (
    <div>
      <h1 className="page-title">Tools</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'running', 'available'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.map(tool => (
          <div key={tool.name} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="card-icon">{tool.icon}</div>
                <div>
                  <h3 className="card-title">{tool.name}</h3>
                  <p className="card-description">{tool.description}</p>
                </div>
              </div>
              <span className={`badge ${tool.status === 'running' ? 'badge-green' : ''}`}>
                {tool.status}
              </span>
            </div>
            {tool.url && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: '0.875rem' }}>
                  {tool.url} →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
