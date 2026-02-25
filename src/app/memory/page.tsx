'use client';

import { useState, useEffect } from 'react';

interface Memory {
  id: string;
  date: string;
  content: string;
  category: string;
  tags: string;
  created_at: string;
}

const API_URL = 'https://openclaw-tasks.my-open-claww.workers.dev/memories';

export default function Memory() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ date: '', content: '', category: '', tags: '' });

  useEffect(() => {
    fetchMemories();
  }, [search, category]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const url = `${API_URL}${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setMemories(data);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
    setLoading(false);
  };

  const addMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemory),
      });
      setNewMemory({ date: '', content: '', category: '', tags: '' });
      setShowForm(false);
      fetchMemories();
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!confirm('Delete this memory?')) return;
    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const categories = ['trading', 'work', 'personal', 'technical', 'goals', 'learnings'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title">🧠 Memory</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '✕ Cancel' : '+ Add Memory'}
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          style={{ minWidth: '150px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Add Memory Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={addMemory}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                  className="input"
                  required
                  style={{ flex: 1 }}
                />
                <select
                  value={newMemory.category}
                  onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                  className="input"
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="What do you want to remember?"
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                className="input"
                rows={4}
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newMemory.tags}
                onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                className="input"
              />
              <button type="submit" className="btn btn-primary">Save Memory</button>
            </div>
          </form>
        </div>
      )}

      {/* Memory List */}
      {loading ? (
        <div className="text-secondary">Loading memories...</div>
      ) : memories.length === 0 ? (
        <div className="card">
          <div className="text-secondary">No memories found. Add your first memory!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {memories.map((memory) => (
            <div key={memory.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge">{memory.category}</span>
                    <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                      {memory.date}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>{memory.content}</div>
                  {memory.tags && (
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                      Tags: {memory.tags}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
        }
        .btn-danger {
          background: #ef4444;
          color: white;
          border: none;
        }
        .badge {
          background: #e5e7eb;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          text-transform: capitalize;
        }
        .text-secondary {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}