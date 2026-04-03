import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const records = await prisma.academicRecord.findMany();
    const data = records.map(r => ({
      id: r.id, student_id: r.studentId, semester: r.semester,
      subject: r.subject, credits: r.credits, grade: r.grade, marks: r.marks,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get academic records error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
