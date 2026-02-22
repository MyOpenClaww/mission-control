const projects = [
  { name: 'Trading Dashboard', description: 'Stock scanner, morning brief, trade journal', progress: 90, status: 'active' },
  { name: 'Morning Brief System', description: 'Automated daily brief via cron', progress: 60, status: 'active' },
  { name: 'Stock Scanner', description: 'Automated filtering and pattern detection', progress: 20, status: 'planning' },
  { name: 'Market Breadth Dashboard', description: 'Real-time breadth indicators', progress: 0, status: 'pending' },
];

export default function Projects() {
  return (
    <div>
      <h1 className="page-title">Projects</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map((project, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontWeight: 600 }}>{project.name}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{project.description}</p>
              </div>
              <span className={`badge ${project.status === 'active' ? 'badge-green' : project.status === 'planning' ? 'badge-yellow' : ''}`}>
                {project.status}
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                <span className="text-secondary">Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: project.progress + '%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
