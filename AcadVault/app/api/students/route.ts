import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // First, try getting students from the Student table
    const students = await prisma.student.findMany({ include: { department: true } });
    
    if (students.length > 0) {
      const data = students.map(s => ({
        id: s.id,
        name: s.name,
        roll_no: s.rollNo,
        email: s.email,
        phone: s.phone,
        year: s.year,
        attendance: s.attendance,
        achievements_count: s.achievementsCount,
        department: s.departmentId,
        status: s.status,
        cgpa: s.cgpa,
        branch: s.branch,
        mentor: s.mentor,
        avatar: s.avatar,
        lastActive: s.lastActive,
      }));
      return NextResponse.json({ data });
    }

    // Fallback: synthesize student data from User table for users with role "student"
    const studentUsers = await prisma.user.findMany({
      where: { role: 'student' },
      include: {
        achievements: true,
      },
    });

    const data = await Promise.all(studentUsers.map(async (u) => {
      const achievementsCount = u.achievements.length;
      const approvedCount = u.achievements.filter(a => a.status === 'Approved').length;
      
      return {
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username,
        roll_no: `STU${String(u.id).padStart(5, '0')}`,
        email: u.email,
        phone: u.phone || '',
        year: '1st Year',
        attendance: 0,
        achievements_count: achievementsCount,
        department: null,
        status: 'active',
        cgpa: 0,
        branch: 'Not Assigned',
        mentor: 'Not Assigned',
        avatar: u.avatar,
        lastActive: u.createdAt.toISOString().split('T')[0],
      };
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: {
        name: body.name || '',
        rollNo: body.roll_no || '',
        email: body.email || '',
        phone: body.phone,
        year: body.year || '1st Year',
        attendance: body.attendance || 0,
        achievementsCount: 0,
        departmentId: body.department || null,
        status: 'active',
        cgpa: body.cgpa || 0,
        branch: body.branch || 'Computer Science',
      }
    });
    return NextResponse.json({
      data: {
        id: student.id, name: student.name, roll_no: student.rollNo,
        email: student.email, phone: student.phone, year: student.year,
        attendance: student.attendance, achievements_count: student.achievementsCount,
        department: student.departmentId, status: student.status, cgpa: student.cgpa,
        branch: student.branch,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
