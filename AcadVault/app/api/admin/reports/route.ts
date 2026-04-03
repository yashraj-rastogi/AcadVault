import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'naac';

  try {
    const [
      totalStudents,
      totalFaculty,
      totalAchievements,
      pendingCount,
      approvedCount,
      rejectedCount,
      departments,
      achievements,
      studentUserCount,
      facultyUserCount,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.faculty.count(),
      prisma.achievement.count(),
      prisma.achievement.count({ where: { status: 'Pending' } }),
      prisma.achievement.count({ where: { status: 'Approved' } }),
      prisma.achievement.count({ where: { status: 'Rejected' } }),
      prisma.department.findMany({ include: { _count: { select: { students: true } } } }),
      prisma.achievement.findMany({
        include: { user: { select: { firstName: true, lastName: true, username: true, role: true } } },
        orderBy: { id: 'desc' },
      }),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'faculty' } }),
    ]);

    const effectiveStudents = totalStudents > 0 ? totalStudents : studentUserCount;
    const effectiveFaculty = totalFaculty > 0 ? totalFaculty : facultyUserCount;

    // Group achievements by type
    const typeDistribution: Record<string, number> = {};
    const statusDistribution: Record<string, number> = { Pending: pendingCount, Approved: approvedCount, Rejected: rejectedCount };
    const monthlyData: Record<string, number> = {};

    achievements.forEach(a => {
      // Type distribution
      typeDistribution[a.type] = (typeDistribution[a.type] || 0) + 1;
      // Monthly distribution
      const month = a.date?.substring(0, 7) || 'Unknown';
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    // Users with achievements (engagement)
    const usersWithAchievements = await prisma.achievement.groupBy({
      by: ['userId'],
      where: { userId: { not: null } },
    });
    const totalUsers = await prisma.user.count();
    const engagementRate = totalUsers > 0 ? Math.round((usersWithAchievements.length / totalUsers) * 1000) / 10 : 0;

    // Verification rate
    const verificationRate = totalAchievements > 0 ? Math.round((approvedCount / totalAchievements) * 1000) / 10 : 0;

    // Build report data based on type
    let reportData: any;

    if (type === 'naac') {
      reportData = {
        title: 'NAAC Accreditation Report',
        generatedAt: new Date().toISOString(),
        institution: {
          totalStudents: effectiveStudents,
          totalFaculty: effectiveFaculty,
          studentFacultyRatio: effectiveFaculty > 0 ? `${Math.round(effectiveStudents / effectiveFaculty)}:1` : 'N/A',
          departments: departments.map(d => ({ name: d.name, code: d.code, head: d.head, students: d._count.students })),
        },
        criteria: {
          studentPerformance: {
            totalAchievements,
            approvedAchievements: approvedCount,
            pendingVerifications: pendingCount,
            verificationRate: `${verificationRate}%`,
            engagementRate: `${engagementRate}%`,
          },
          researchOutput: {
            typeDistribution,
            totalSubmissions: totalAchievements,
          },
          qualityIndicators: {
            statusDistribution,
            achievementsByMonth: monthlyData,
          },
        },
        achievementDetails: achievements.map(a => ({
          id: a.id,
          title: a.title,
          type: a.type,
          organization: a.organization,
          date: a.date,
          status: a.status,
          student: a.user ? [a.user.firstName, a.user.lastName].filter(Boolean).join(' ') || a.user.username : 'Unknown',
        })),
      };
    } else if (type === 'nirf') {
      reportData = {
        title: 'NIRF Ranking Report',
        generatedAt: new Date().toISOString(),
        teachingLearning: {
          totalStudents: effectiveStudents,
          totalFaculty: effectiveFaculty,
          studentFacultyRatio: effectiveFaculty > 0 ? `${Math.round(effectiveStudents / effectiveFaculty)}:1` : 'N/A',
          departmentCount: departments.length,
        },
        researchProfessionalPractice: {
          totalPublications: totalAchievements,
          verifiedPublications: approvedCount,
          typeDistribution,
        },
        graduationOutcomes: {
          achievementRate: `${verificationRate}%`,
          engagementRate: `${engagementRate}%`,
        },
        outreachInclusivity: {
          totalDepartments: departments.length,
          departments: departments.map(d => d.name),
        },
      };
    } else {
      // Annual Performance
      reportData = {
        title: 'Annual Performance Report',
        generatedAt: new Date().toISOString(),
        overview: {
          totalStudents: effectiveStudents,
          totalFaculty: effectiveFaculty,
          totalAchievements,
          approvedAchievements: approvedCount,
          pendingVerifications: pendingCount,
          rejectedSubmissions: rejectedCount,
          engagementRate: `${engagementRate}%`,
          verificationRate: `${verificationRate}%`,
        },
        achievementsByType: typeDistribution,
        achievementsByMonth: monthlyData,
        achievementsByStatus: statusDistribution,
        departments: departments.map(d => ({ name: d.name, code: d.code, head: d.head, students: d._count.students })),
      };
    }

    return NextResponse.json({ data: reportData });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
