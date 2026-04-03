import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
    const data = tickets.map(t => ({
      id: t.id, title: t.title, description: t.description,
      priority: t.priority, status: t.status,
      created_at: t.createdAt.toISOString(), updated_at: t.updatedAt.toISOString(),
      category: t.category, assigned_to: t.assignedTo,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ticket = await prisma.ticket.create({
      data: {
        title: body.title || '',
        description: body.description || '',
        priority: body.priority || 'Low',
        status: 'Open',
        category: body.category || 'General',
        assignedTo: 'Support Team',
      }
    });
    return NextResponse.json({
      data: {
        id: ticket.id, title: ticket.title, description: ticket.description,
        priority: ticket.priority, status: ticket.status,
        created_at: ticket.createdAt.toISOString(), updated_at: ticket.updatedAt.toISOString(),
        category: ticket.category, assigned_to: ticket.assignedTo,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
