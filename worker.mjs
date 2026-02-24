export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const db = env.DB;

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
