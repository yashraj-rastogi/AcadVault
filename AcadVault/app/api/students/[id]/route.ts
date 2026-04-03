import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({
      data: {
        id: student.id, name: student.name, roll_no: student.rollNo,
        email: student.email, phone: student.phone, year: student.year,
        attendance: student.attendance, achievements_count: student.achievementsCount,
        department: student.departmentId, status: student.status, cgpa: student.cgpa,
        branch: student.branch, mentor: student.mentor, avatar: student.avatar,
        lastActive: student.lastActive,
      }
    });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.roll_no && { rollNo: body.roll_no }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.year && { year: body.year }),
        ...(body.attendance !== undefined && { attendance: body.attendance }),
        ...(body.department !== undefined && { departmentId: body.department }),
        ...(body.status && { status: body.status }),
        ...(body.cgpa !== undefined && { cgpa: body.cgpa }),
        ...(body.branch && { branch: body.branch }),
      }
    });
    return NextResponse.json({
      data: {
        id: student.id, name: student.name, roll_no: student.rollNo, email: student.email,
        phone: student.phone, year: student.year, attendance: student.attendance,
        achievements_count: student.achievementsCount, department: student.departmentId,
        status: student.status, cgpa: student.cgpa, branch: student.branch,
      }
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ data: { message: 'Student deleted successfully' } });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
