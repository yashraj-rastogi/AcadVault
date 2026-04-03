import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.priority && { priority: body.priority }),
        ...(body.status && { status: body.status }),
        ...(body.category && { category: body.category }),
        ...(body.assigned_to && { assignedTo: body.assigned_to }),
      }
    });
    return NextResponse.json({
      data: {
        id: ticket.id, title: ticket.title, description: ticket.description,
        priority: ticket.priority, status: ticket.status,
        created_at: ticket.createdAt.toISOString(), updated_at: ticket.updatedAt.toISOString(),
        category: ticket.category, assigned_to: ticket.assignedTo,
      }
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
