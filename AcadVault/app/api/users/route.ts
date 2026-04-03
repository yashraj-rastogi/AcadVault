import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = users.map(u => ({
      id: String(u.id),
      name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username,
      email: u.email,
      role: u.role as 'student' | 'faculty' | 'admin',
      department: '', // User model doesn't have department — can be extended later
      status: 'active' as const,
      lastLogin: '',
      joinDate: u.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Hash password (simple hash for demo — in production use bcrypt)
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(body.password || 'defaultPassword123', 10);

    const user = await prisma.user.create({
      data: {
        username: body.email?.split('@')[0] || body.username || '',
        email: body.email || '',
        passwordHash,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        role: body.role || 'student',
      },
    });

    return NextResponse.json({
      data: {
        id: String(user.id),
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username,
        email: user.email,
        role: user.role,
        department: '',
        status: 'active',
        lastLogin: '',
        joinDate: user.createdAt.toISOString().split('T')[0],
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A user with that email or username already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
