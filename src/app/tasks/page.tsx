'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  description: string;
  dueDate: string | null;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setTasks(data.tasks || []);
        }
      })
      .catch(err => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => {
    if (filter === 'in-progress') return t.status === 'In progress';
    return t.status.toLowerCase() === filter;
  });

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'badge-red';
      case 'Medium': return 'badge-yellow';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Done': return 'badge-green';
      case 'In progress': return '';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="page-title">Tasks</h1>
        <p className="text-secondary">Loading tasks from Notion...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="page-title">Tasks</h1>
        <p className="text-red">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Tasks</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Synced from Notion</span>
          <span className="status-dot green"></span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'in-progress', 'Not started', 'Done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(task => (
          <div key={task.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="checkbox" checked={task.status === 'Done'} readOnly />
            <span style={{ flex: 1, textDecoration: task.status === 'Done' ? 'line-through' : 'none', opacity: task.status === 'Done' ? 0.5 : 1 }}>
              {task.title}
            </span>
            {task.dueDate && (
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{task.dueDate}</span>
            )}
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`badge ${getStatusClass(task.status)}`} style={{ background: task.status === 'In progress' ? 'rgba(59, 130, 246, 0.2)' : '', color: task.status === 'In progress' ? '#60a5fa' : '' }}>
              {task.status}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-secondary">No tasks found</p>
        )}
      </div>
    </div>
  );
}
