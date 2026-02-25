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

const API_URL = 'https://openclaw-memories.my-open-claww.workers.dev/memories';

export default function Memory() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newMemory, setNewMemory] = useState({ date: '', content: '', category: '', tags: '' });

  useEffect(() => {
    fetchMemories();
  }, [category]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchMemories();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  // Format content with proper line breaks
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return <li key={i}>{trimmed.substring(2)}</li>;
      }
      if (trimmed.startsWith('## ')) {
        return <h4 key={i} style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{trimmed.substring(3)}</h4>;
      }
      if (trimmed.startsWith('### ')) {
        return <h5 key={i} style={{ marginTop: '0.75rem', marginBottom: '0.25rem', fontWeight: 500, color: '#6b7280' }}>{trimmed.substring(4)}</h5>;
      }
      if (trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]')) {
        return <li key={i} style={{ color: '#10b981', textDecoration: 'line-through' }}>✓ {trimmed.substring(6)}</li>;
      }
      if (trimmed.startsWith('- [')) {
        return <li key={i}>☐ {trimmed.substring(4)}</li>;
      }
      if (trimmed === '') {
        return <br key={i} />;
      }
      return <span key={i}>{trimmed}<br /></span>;
    });
  };

  const categories = ['context', 'daily', 'trading', 'work', 'personal', 'technical', 'goals', 'learnings'];

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
          onChange={(e) => {
            setCategory(e.target.value);
            fetchMemories();
          }}
          className="input"
          style={{ minWidth: '150px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {category && (
          <button 
            onClick={() => setCategory('')}
            className="btn btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            ✕ Clear
          </button>
        )}
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
                placeholder="What do you want to remember? (Use ## for headers, - for bullets)"
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                className="input"
                rows={6}
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
          <div className="text-secondary">No memories found. {category && 'Try clearing the filter.'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {memories.map((memory) => (
            <div key={memory.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: getCategoryColor(memory.category) }}>
                      {memory.category}
                    </span>
                    <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                      {memory.date === 'long-term' ? 'Long-term' : memory.date}
                    </span>
                  </div>
                  <div style={{ lineHeight: 1.6 }}>
                    {formatContent(memory.content)}
                  </div>
                  {memory.tags && (
                    <div className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>
                      {memory.tags.split(',').map((tag, i) => (
                        <span key={i} style={{ marginRight: '0.5rem' }}>#{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginLeft: '1rem' }}
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
        .btn-secondary {
          background: #6b7280;
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
          color: white;
        }
        .text-secondary {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    context: '#8b5cf6',
    daily: '#3b82f6',
    trading: '#10b981',
    work: '#f59e0b',
    personal: '#ec4899',
    technical: '#06b6d4',
    goals: '#6366f1',
    learnings: '#84cc16'
  };
  return colors[category] || '#6b7280';
}