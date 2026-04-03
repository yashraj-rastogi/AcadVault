import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { name: 'asc' },
    });
    const data = departments.map(d => ({
      id: d.id, name: d.name, code: d.code, head: d.head,
      studentCount: d._count.students,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.code) {
      return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
    }
    const dept = await prisma.department.create({
      data: { name: body.name, code: body.code, head: body.head || null },
    });
    return NextResponse.json({ data: dept }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Department name or code already exists' }, { status: 409 });
    }
    console.error('Create department error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
