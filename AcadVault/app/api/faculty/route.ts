import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faculty = await prisma.faculty.findMany();
    const data = faculty.map(f => ({
      id: f.id, name: f.name, email: f.email,
      department: f.department, specialization: f.specialization,
      experience: f.experience,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get faculty error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
