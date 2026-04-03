import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      studentTableCount,
      facultyTableCount,
      totalAchievements,
      pendingVerifications,
      totalUsers,
      recentAchievements,
      studentUserCount,
      facultyUserCount,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.achievement.count(),
      prisma.achievement.count({ where: { status: 'Pending' } }),
      prisma.user.count(),
      prisma.achievement.findMany({
        orderBy: { id: 'desc' },
        take: 5,
        include: { user: { select: { firstName: true, lastName: true, username: true } } },
      }),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'faculty' } }),
    ]);

    // Use dedicated table counts, but fall back to User table counts if tables are empty
    const totalStudents = studentTableCount > 0 ? studentTableCount : studentUserCount;
    const totalFaculty = facultyTableCount > 0 ? facultyTableCount : facultyUserCount;

    // Calculate engagement rate as percentage of users who have at least one achievement
    const usersWithAchievements = await prisma.achievement.groupBy({
      by: ['userId'],
      where: { userId: { not: null } },
    });
    const engagementRate = totalUsers > 0
      ? Math.round((usersWithAchievements.length / totalUsers) * 1000) / 10
      : 0;

    const recentActivity = recentAchievements.map(a => {
      const userName = a.user
        ? [a.user.firstName, a.user.lastName].filter(Boolean).join(' ') || a.user.username
        : 'Unknown User';
      return {
        id: a.id,
        type: a.status === 'Approved' ? 'verified' : a.status === 'Rejected' ? 'rejected' : 'submission',
        title: a.status === 'Approved'
          ? 'Achievement verified'
          : a.status === 'Rejected'
            ? 'Achievement rejected'
            : 'New achievement submitted',
        description: `${userName} — ${a.title}`,
        time: a.date,
        color: a.status === 'Approved' ? 'green' : a.status === 'Rejected' ? 'red' : 'orange',
      };
    });

    return NextResponse.json({
      data: {
        totalStudents,
        totalFaculty,
        totalAchievements,
        pendingVerifications,
        engagementRate,
        recentActivity,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
