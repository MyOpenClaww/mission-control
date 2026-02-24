import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), '../../workspace/mission-control/tasks.json');

export async function GET() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    const tasks = JSON.parse(data);
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request: Request) {
  try {
    const tasks = await request.json();
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
