import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    // If it's a student, only show their achievements. If faculty/admin, show all.
    const whereClause = user?.role === 'student' ? { userId: user.userId } : {};

    const achievements = await prisma.achievement.findMany({ 
      where: whereClause,
      orderBy: { date: 'desc' } 
    });
    
    const data = achievements.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      organization: a.organization,
      date: a.date,
      status: a.status,
      description: a.description,
      skills: JSON.parse(a.skills),
      proofUrl: a.proofUrl,
      feedback: a.feedback,
      userId: a.userId,
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Get achievements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const achievement = await prisma.achievement.create({
      data: {
        title: body.title || '',
        type: body.type || '',
        organization: body.organization || '',
        date: body.date || new Date().toISOString().split('T')[0],
        status: 'Pending',
        description: body.description,
        skills: JSON.stringify(body.skills || []),
        proofUrl: body.proofUrl,
        feedback: undefined,
        userId: user.userId, // Link to the authenticated user
      }
    });
    return NextResponse.json({
      data: {
        id: achievement.id, title: achievement.title, type: achievement.type,
        organization: achievement.organization, date: achievement.date,
        status: achievement.status, description: achievement.description,
        skills: JSON.parse(achievement.skills), proofUrl: achievement.proofUrl, feedback: achievement.feedback,
        userId: achievement.userId,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create achievement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
