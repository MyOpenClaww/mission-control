'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Set up Discord stock research factory",
    status: "in_progress",
    priority: "high",
    description: "Configure per-channel prompts and sub-agent automation"
  },
  {
    id: "2",
    title: "Build kanban tasks page in mission-control",
    status: "completed",
    priority: "high",
    description: "Created kanban-style tasks page showing what I'm working on"
  },
  {
    id: "3",
    title: "Set up Notion integration",
    status: "completed",
    priority: "medium",
    description: "Connected to Notion API for task access"
  },
  {
    id: "4",
    title: "Maintain daily memory files",
    status: "completed",
    priority: "medium",
    description: "Updated MEMORY.md and daily notes"
  },
  {
    id: "test",
    title: "Test task",
    status: "todo",
    priority: "low",
    description: "Testing real-time task updates"
  }
];

const columns = [
  { id: 'todo', title: 'To Do', color: '#64748b' },
  { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'completed', title: 'Done', color: '#22c55e' },
];

export default function AgentTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);

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

  const moveTask = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t
    );
    setTasks(updatedTasks);
    // Store in localStorage for persistence
    localStorage.setItem('agent-tasks', JSON.stringify(updatedTasks));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('agent-tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>🤖 Agent Tasks</h1>
          <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            What I'm working on • Changes saved locally
          </p>
        </div>
      </div>

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
                    {column.id !== 'completed' && (
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
                        {columns.filter(c => c.id !== column.id).map(c => (
                          <button
                            key={c.id}
                            onClick={() => moveTask(task.id, c.id)}
                            className="btn btn-secondary"
                            style={{ 
                              fontSize: '0.625rem', 
                              padding: '0.25rem 0.5rem',
                              background: c.id === 'completed' ? '#22c55e20' : '#3b82f620',
                              color: c.id === 'completed' ? '#22c55e' : '#3b82f6'
                            }}
                          >
                            → {c.title}
                          </button>
                        ))}
                      </div>
                    )}
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
