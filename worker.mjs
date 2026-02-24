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

    const db = env.DB;

    // Seed database (run once)
    if (request.method === 'PUT') {
      const seedTasks = [
        { id: "1", title: "Set up Discord stock research factory", status: "in_progress", priority: "high", description: "Configure per-channel prompts and sub-agent automation" },
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

    // GET - fetch all tasks
    if (request.method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM tasks ORDER BY id').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // POST - add new task
    if (request.method === 'POST') {
      const task = await request.json();
      await db.prepare('INSERT INTO tasks (id, title, status, priority, description) VALUES (?, ?, ?, ?, ?)')
        .bind(task.id, task.title, task.status, task.priority, task.description)
        .run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // PATCH - update task status
    if (request.method === 'PATCH') {
      const { id, status } = await request.json();
      await db.prepare('UPDATE tasks SET status = ? WHERE id = ?')
        .bind(status, id)
        .run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // DELETE - delete task
    if (request.method === 'DELETE') {
      const { id } = await request.json();
      await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
