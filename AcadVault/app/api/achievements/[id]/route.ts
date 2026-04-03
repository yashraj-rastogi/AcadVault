import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const achievement = await prisma.achievement.findUnique({ where: { id } });
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }
    return NextResponse.json({
      data: {
        id: achievement.id, title: achievement.title, type: achievement.type,
        organization: achievement.organization, date: achievement.date,
        status: achievement.status, description: achievement.description,
        skills: JSON.parse(achievement.skills), proofUrl: achievement.proofUrl, feedback: achievement.feedback,
      }
    });
  } catch (error) {
    console.error('Get achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.type && { type: body.type }),
        ...(body.organization && { organization: body.organization }),
        ...(body.date && { date: body.date }),
        ...(body.status && { status: body.status }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.skills && { skills: JSON.stringify(body.skills) }),
        ...(body.proofUrl !== undefined && { proofUrl: body.proofUrl }),
        ...(body.feedback !== undefined && { feedback: body.feedback }),
      }
    });
    return NextResponse.json({
      data: {
        id: achievement.id, title: achievement.title, type: achievement.type,
        organization: achievement.organization, date: achievement.date,
        status: achievement.status, description: achievement.description,
        skills: JSON.parse(achievement.skills), proofUrl: achievement.proofUrl, feedback: achievement.feedback,
      }
    });
  } catch (error) {
    console.error('Update achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing.status !== 'Pending') {
      return NextResponse.json({ error: 'Only pending achievements can be deleted' }, { status: 403 });
    }

    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ data: { message: 'Achievement deleted successfully' } });
  } catch (error) {
    console.error('Delete achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
