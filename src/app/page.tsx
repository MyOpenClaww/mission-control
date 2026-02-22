import Link from 'next/link';

const sections = [
  {
    name: 'Tools',
    description: 'Custom tools and integrations',
    href: '/tools',
    icon: '🛠️',
    color: '#3b82f6',
    items: ['Trading Dashboard', 'Stock Scanner', 'Morning Brief'],
  },
  {
    name: 'Approvals',
    description: 'Pending requests and authorizations',
    href: '/approvals',
    icon: '✅',
    color: '#22c55e',
    items: ['0 pending', 'Last: None'],
  },
  {
    name: 'Calendar',
    description: 'Schedule and events',
    href: '/calendar',
    icon: '📅',
    color: '#f97316',
    items: ['Today: 0 events', 'This week: 0 events'],
  },
  {
    name: 'Projects',
    description: 'Active projects and progress',
    href: '/projects',
    icon: '📁',
    color: '#8b5cf6',
    items: ['Trading Dashboard', 'Morning Brief System'],
  },
  {
    name: 'Memory',
    description: 'Knowledge base and context',
    href: '/memory',
    icon: '🧠',
    color: '#eab308',
    items: ['USER.md', 'SOUL.md', 'TOOLS.md'],
  },
  {
    name: 'Docs',
    description: 'Documentation and guides',
    href: '/docs',
    icon: '📄',
    color: '#64748b',
    items: ['Setup Guide', 'API Docs'],
  },
  {
    name: 'Tasks',
    description: 'Todo list and action items',
    href: '/tasks',
    icon: '🎯',
    color: '#ef4444',
    items: ['0 urgent', '0 pending'],
  },
];

const recentActivity = [
  { time: 'Today', action: 'Mission Control built', status: 'done' },
  { time: 'Today', action: 'Trading Dashboard deployed', status: 'done' },
  { time: 'Yesterday', action: 'QMD skill installed', status: 'done' },
];

const quickActions = [
  { label: 'Run Stock Scan', icon: '🔍' },
  { label: 'Generate Brief', icon: '📰' },
  { label: 'Add Task', icon: '➕' },
];

export default function Home() {
  return (
    <div>
      <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Welcome to Mission Control</h1>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Your central hub for workflow, tools, and collaboration</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="status-dot green"></span>
          <span className="text-green">System Online</span>
        </div>
      </div>

      <div className="card section">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {quickActions.map(action => (
            <button key={action.label} className="btn btn-secondary">
              <span>{action.icon}</span>
              <span style={{ marginLeft: '0.5rem' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Control Center</h2>
        <div className="card-grid">
          {sections.map(section => (
            <Link key={section.name} href={section.href} className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="card-icon" style={{ background: section.color + '20' }}>{section.icon}</div>
              <h3 className="card-title">{section.name}</h3>
              <p className="card-description">{section.description}</p>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                {section.items.slice(0, 2).map(item => (
                  <div key={item} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>• {item}</div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* System Status */}
        <div className="card">
          <h2 className="section-title">System Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Gateway</span>
              <span className="text-green">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Telegram</span>
              <span className="text-green">Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Brave Search</span>
              <span className="text-green">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Skills Loaded</span>
              <span>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Session Time</span>
              <span>2h 34m</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="section-title">Recent Activity</h2>
          <div>
            {recentActivity.map((item, i) => (
              <div key={i} className="list-item">
                <span className="status-dot green"></span>
                <span className="text-secondary" style={{ width: '4rem' }}>{item.time}</span>
                <span style={{ flex: 1 }}>{item.action}</span>
                <span className="badge badge-green">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
