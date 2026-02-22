'use client';

import { useState } from 'react';

const presets = [
  {
    name: 'Morning Task Review',
    description: 'Check Notion tasks at 8am Melbourne time',
    cron: '0 21 * * 1-5',
    message: 'Fetch tasks from Notion database 30f6f185199d809b88ffd9d317cf918b, list them with status/priority, ask which to work on today.',
  },
  {
    name: 'Morning Brief',
    description: 'Daily market briefing at 8am Melbourne time',
    cron: '0 21 * * 1-5',
    message: 'Search for top US stock market news (max 7 items), search for trending stocks on X/Twitter, provide a concise morning brief.',
  },
];

export default function CronRequests() {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCron, setCustomCron] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [generated, setGenerated] = useState('');

  const generate = () => {
    const preset = presets.find(p => p.name === selectedPreset);
    const config = {
      crons: {
        entries: {
          [customName.toLowerCase().replace(/\s+/g, '-')]: {
            name: customName || preset?.name,
            schedule: {
              kind: 'cron',
              expr: customCron || preset?.cron,
              tz: 'UTC',
            },
            sessionTarget: 'isolated',
            payload: {
              kind: 'agentTurn',
              message: customMessage || preset?.message,
            },
            delivery: {
              mode: 'announce',
              channel: 'telegram',
              to: '7854384760',
            },
            enabled: true,
          },
        },
      },
    };
    setGenerated(JSON.stringify(config, null, 2));
  };

  return (
    <div>
      <h1 className="page-title">Cron Job Requests</h1>
      <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
        Select a preset or create a custom scheduled task.
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Presets</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {presets.map(preset => (
            <div 
              key={preset.name}
              onClick={() => setSelectedPreset(preset.name)}
              style={{ 
                padding: '1rem', 
                background: selectedPreset === preset.name ? 'var(--accent)' + '20' : 'var(--bg-tertiary)', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                border: selectedPreset === preset.name ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              <div style={{ fontWeight: 600 }}>{preset.name}</div>
              <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{preset.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Or Custom</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Task Name</label>
            <input 
              type="text" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., Evening Summary"
              style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
            />
          </div>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Cron Expression</label>
            <input 
              type="text" 
              value={customCron}
              onChange={(e) => setCustomCron(e.target.value)}
              placeholder="e.g., 0 21 * * 1-5"
              style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white' }}
            />
          </div>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Message</label>
            <textarea 
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="What should I do?"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'white', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      <button onClick={generate} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
        Generate Config
      </button>

      {generated && (
        <div className="card">
          <h2 className="section-title">Generated Config</h2>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
            Copy this and add it to your <code>~/.openclaw/openclaw.json</code>, then restart the gateway.
          </p>
          <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem' }}>
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}
