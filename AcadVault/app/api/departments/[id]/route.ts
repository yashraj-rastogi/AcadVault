import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.department.delete({ where: { id } });
    return NextResponse.json({ message: 'Department deleted' });
  } catch (error) {
    console.error('Delete department error:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
