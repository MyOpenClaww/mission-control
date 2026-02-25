export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    const db = env.DB;
    const memories = env.MEMORIES;

    // ============ TASKS API (/tasks) ============
    
    // Seed database (run once) - PUT /tasks
    if (path === '/tasks' && request.method === 'PUT') {
      const seedTasks = [
        { id: "1", title: "Set up Discord stock research factory", status: "completed", priority: "high", description: "Configure per-channel prompts and sub-agent automation" },
        { id: "2", title: "Build kanban tasks page in mission-control", status: "completed", priority: "high", description: "Created kanban-style tasks page showing what I'm working on" },
        { id: "3", title: "Set up Notion integration", status: "completed", priority: "medium", description: "Connected to Notion API for task access" },
        { id: "4", title: "Maintain daily memory files", status: "completed", priority: "medium", description: "Updated MEMORY.md and daily notes" },
      ];
      
      for (const task of seedTasks) {
        await db.prepare('INSERT OR REPLACE INTO tasks (id, title, status, priority, description) VALUES (?, ?, ?, ?, ?)')
          .bind(task.id, task.title, task.status, task.priority, task.description)
          .run();
      }
      
      return new Response(JSON.stringify({ success: true, message: 'Database seeded!' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // GET /tasks - fetch all tasks
    if (path === '/tasks' && request.method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // POST /tasks - add new task
    if (path === '/tasks' && request.method === 'POST') {
      const task = await request.json();
      await db.prepare('INSERT INTO tasks (id, title, status, priority, description) VALUES (?, ?, ?, ?, ?)')
        .bind(task.id, task.title, task.status, task.priority, task.description)
        .run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // PATCH /tasks - update task status
    if (path === '/tasks' && request.method === 'PATCH') {
      const { id, status } = await request.json();
      await db.prepare('UPDATE tasks SET status = ? WHERE id = ?')
        .bind(status, id)
        .run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // DELETE /tasks - delete task
    if (path === '/tasks' && request.method === 'DELETE') {
      const { id } = await request.json();
      await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ============ MEMORIES API (/memories) ============

    // GET /memories - fetch all memories (with optional search)
    if (path === '/memories' && request.method === 'GET') {
      const search = url.searchParams.get('search');
      const category = url.searchParams.get('category');
      
      let query = 'SELECT * FROM memories';
      const conditions = [];
      const bindings = [];
      
      if (search) {
        conditions.push('(content LIKE ? OR tags LIKE ?)');
        bindings.push(`%${search}%`, `%${search}%`);
      }
      
      if (category) {
        conditions.push('category = ?');
        bindings.push(category);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY created_at DESC';
      
      const { results } = await memories.prepare(query).bind(...bindings).all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // POST /memories - add new memory
    if (path === '/memories' && request.method === 'POST') {
      const memory = await request.json();
      const id = memory.id || Date.now().toString();
      const created_at = new Date().toISOString();
      
      await memories.prepare('INSERT INTO memories (id, date, content, category, tags, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, memory.date, memory.content, memory.category || '', memory.tags || '', created_at)
        .run();
      
      return new Response(JSON.stringify({ success: true, id }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // PATCH /memories - update memory
    if (path === '/memories' && request.method === 'PATCH') {
      const { id, content, category, tags } = await request.json();
      await memories.prepare('UPDATE memories SET content = ?, category = ?, tags = ? WHERE id = ?')
        .bind(content, category, tags, id)
        .run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // DELETE /memories - delete memory
    if (path === '/memories' && request.method === 'DELETE') {
      const { id } = await request.json();
      await memories.prepare('DELETE FROM memories WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ============ DEFAULT ============
    return new Response('Not Found', { status: 404 });
  },
};