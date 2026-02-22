const memoryFiles = [
  { name: 'USER.md', description: 'Your profile and preferences' },
  { name: 'SOUL.md', description: 'My character and behavior' },
  { name: 'TOOLS.md', description: 'Your setup and tools' },
  { name: 'MEMORY.md', description: 'Long-term memories' },
  { name: 'IDENTITY.md', description: 'My identity info' },
];

export default function Memory() {
  return (
    <div>
      <h1 className="page-title">Memory</h1>
      
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="section-title">Memory Files</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {memoryFiles.map((file, i) => (
            <div key={i} className="list-item" style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              <div>
                <div style={{ fontWeight: 500 }}>{file.name}</div>
                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>{file.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Recent Context</h2>
        <div className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          • Trading goals: Swing trade US markets full-time<br/>
          • Pain points: Scanning takes too long<br/>
          • Timezone: Melbourne, trades US markets<br/>
          • Character: Confident, loyal, curious, night owl
        </div>
      </div>
    </div>
  );
}
