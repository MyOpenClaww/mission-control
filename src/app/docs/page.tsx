const docs = [
  { name: 'OpenClaw Docs', description: 'Main documentation' },
  { name: 'Skills', description: 'Available skills and how to use' },
  { name: 'Configuration', description: 'Gateway and agent config' },
  { name: 'Troubleshooting', description: 'Common issues and solutions' },
];

export default function Docs() {
  return (
    <div>
      <h1 className="page-title">Docs</h1>
      
      <div className="card-grid">
        {docs.map((doc, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              <h3 style={{ fontWeight: 600 }}>{doc.name}</h3>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{doc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
