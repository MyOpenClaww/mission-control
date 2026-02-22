'use client';

import { useState } from 'react';

const approvals = [
  { id: 1, type: 'Message', request: 'Send message to Telegram', status: 'approved', date: '2026-02-22' },
  { id: 2, type: 'Cron', request: 'Morning brief at 8am', status: 'pending', date: '2026-02-22' },
  { id: 3, type: 'Config', request: 'Brave API key configured', status: 'approved', date: '2026-02-20' },
];

export default function Approvals() {
  const [filter, setFilter] = useState('all');
  
  const filtered = filter === 'all' ? approvals : approvals.filter(a => a.status === filter);

  return (
    <div>
      <h1 className="page-title">Approvals</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'pending', 'approved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(approval => (
          <div key={approval.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="text-secondary">{approval.type}</span>
                <span>{approval.request}</span>
              </div>
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{approval.date}</span>
            </div>
            <span className={`badge ${approval.status === 'approved' ? 'badge-green' : 'badge-yellow'}`}>
              {approval.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
