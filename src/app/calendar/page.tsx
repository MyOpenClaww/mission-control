const events = [
  { time: '8:00 AM', title: 'Morning Brief (Cron)', recurring: 'Weekdays' },
  { time: '9:30 AM', title: 'US Market Open', recurring: 'Daily' },
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date().getDay();

export default function Calendar() {
  return (
    <div>
      <h1 className="page-title">Calendar</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {days.map((day, i) => (
          <div 
            key={day} 
            style={{ 
              textAlign: 'center', 
              padding: '0.75rem', 
              borderRadius: '0.5rem',
              background: i === today ? 'var(--accent)' : 'var(--bg-secondary)',
              color: i === today ? 'white' : 'var(--text-secondary)'
            }}
          >
            <div style={{ fontWeight: 500 }}>{day}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="section-title">Scheduled Events</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {events.map((event, i) => (
            <div key={i} className="list-item">
              <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.875rem', width: '6rem' }}>{event.time}</span>
              <span style={{ flex: 1 }}>{event.title}</span>
              <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{event.recurring}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
