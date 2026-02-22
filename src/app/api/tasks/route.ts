import { NextResponse } from 'next/server';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET() {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    return NextResponse.json({ error: 'Notion not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: response.status });
    }

    const data = await response.json();

    const tasks = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props['Task name']?.title?.[0]?.plain_text || 'Untitled',
        status: props['Status']?.status?.name || 'Unknown',
        priority: props['Priority']?.select?.name || 'Unknown',
        description: props['Description']?.rich_text?.[0]?.plain_text || '',
        dueDate: props['Due date']?.date?.start || null,
      };
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
