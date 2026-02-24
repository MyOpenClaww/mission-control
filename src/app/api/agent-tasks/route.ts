import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

export async function GET() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ tasks: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const { taskId, status } = await request.json();
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    
    const updatedTasks = tasks.map((t: any) => 
      t.id === taskId ? { ...t, status } : t
    );
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(updatedTasks, null, 2));
    return NextResponse.json({ success: true, tasks: updatedTasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newTask = await request.json();
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    
    tasks.push(newTask);
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add' }, { status: 500 });
  }
}
