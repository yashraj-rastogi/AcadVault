import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany();
    const data = portfolios.map(p => ({
      id: p.id, student_id: p.studentId, title: p.title, template: p.template,
      created_at: p.createdAt.toISOString(), updated_at: p.updatedAt.toISOString(),
      public_url: p.publicUrl,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get portfolios error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
