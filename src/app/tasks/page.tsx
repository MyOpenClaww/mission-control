'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const GIST_URL = 'https://raw.githubusercontent.com/MyOpenClaww/mission-control/main/tasks.json';

const columns = [
  { id: 'todo', title: 'To Do', color: '#64748b' },
  { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'completed', title: 'Done', color: '#22c55e' },
];

export default function AgentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTasks = () => {
    setLoading(true);
    fetch(GIST_URL + '?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLastUpdated(new Date());
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(t => t.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>🤖 Agent Tasks</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            What I'm working on • Auto-refreshes every 30s
          </p>
        </div>
        <button 
          onClick={fetchTasks}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem' }}
        >
          🔄 Refresh
        </button>
      </div>

      {lastUpdated && (
        <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '1.5rem' }}>
          Last synced: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {loading ? (
        <p className="text-secondary">Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {columns.map(column => (
            <div key={column.id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: `2px solid ${column.color}`
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: column.color }}></span>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                  {column.title}
                </h3>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: column.color + '20', 
                  color: column.color,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '999px',
                  marginLeft: 'auto'
                }}>
                  {getTasksByStatus(column.id).length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {getTasksByStatus(column.id).map(task => (
                  <div 
                    key={task.id} 
                    className="card"
                    style={{ 
                      borderLeft: `3px solid ${getPriorityColor(task.priority)}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.625rem', 
                        textTransform: 'uppercase', 
                        fontWeight: 600,
                        color: getPriorityColor(task.priority)
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.5rem 0' }}>
                      {task.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {task.description}
                    </p>
                  </div>
                ))}
                {getTasksByStatus(column.id).length === 0 && (
                  <div style={{ 
                    padding: '1rem', 
                    border: '1px dashed var(--border)', 
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem'
                  }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
