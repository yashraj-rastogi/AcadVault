"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, TrendingUp, AlertCircle, Eye, Loader2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { apiClient, type Achievement, type Student } from "@/lib/api"

export function FacultyDashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [studentCount, setStudentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [achRes, stuRes] = await Promise.all([
        apiClient.getAchievements(),
        apiClient.getStudents(),
      ])
      if (achRes.data) setAchievements(achRes.data)
      if (stuRes.data) setStudentCount(stuRes.data.length)
      setLoading(false)
    }
    fetchData()
  }, [])

  const pendingAchievements = achievements.filter(a => a.status === "Pending")
  const approvedThisMonth = achievements.filter(a => {
    if (a.status !== "Approved") return false
    const d = new Date(a.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const pendingVerifications = pendingAchievements.length

  const stats = [
    {
      title: "Pending Verifications",
      value: pendingVerifications,
      icon: Clock,
      color: "text-[#fc7c78]",
      bgColor: "bg-[#fc7c78]/10",
      href: "/faculty/verify",
    },
    {
      title: "Total Students",
      value: studentCount,
      icon: Users,
      color: "text-[#b9c7e0]",
      bgColor: "bg-[#b9c7e0]/10",
      href: "/faculty/students",
    },
    {
      title: "Verified This Month",
      value: approvedThisMonth.length,
      icon: CheckCircle,
      color: "text-[#4edea3]",
      bgColor: "bg-[#4edea3]/10",
    },
    {
      title: "Total Achievements",
      value: achievements.length,
      icon: TrendingUp,
      color: "text-[#d946ef]",
      bgColor: "bg-[#d946ef]/10",
    },
  ]

  const recentSubmissions = pendingAchievements.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0b1326' }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 md:p-8 space-y-6 md:space-y-8" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden text-[#4edea3]" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Faculty Dashboard</h1>
            <p className="mt-1 text-sm md:text-base" style={{ color: '#86948a' }}>
              Welcome back! Here's an overview of your mentorship activities.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Verifications Alert */}
      {pendingVerifications > 0 && (
        <Card className="glass-card border-[#fc7c78]/30 rounded-2xl animate-fade-up-delay-1" style={{ background: 'linear-gradient(135deg, rgba(252, 124, 120, 0.05) 0%, rgba(6, 14, 32, 0) 100%)' }}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-full bg-[#fc7c78]/10 flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-[#fc7c78]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base md:text-lg">
                  {pendingVerifications} achievements awaiting verification
                </h3>
                <p className="text-sm text-[#86948a] mt-1">
                  Students are waiting for your review. Quick verification helps maintain engagement.
                </p>
              </div>
              <Button asChild className="w-full sm:w-auto btn-glow border border-[#fc7c78]/50 text-white rounded-xl" style={{ backgroundColor: '#fc7c78' }}>
                <Link href="/faculty/verify">Review Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-up-delay-2">
        {stats.map((stat, i) => (
          <Card key={stat.title} className="glass-card border-0 rounded-2xl hover-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#b9c7e0' }}>{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              {stat.href && (
                <Button asChild variant="ghost" size="sm" className="mt-4 p-0 h-auto text-sm text-[#86948a] hover:text-[#4edea3] hover:bg-transparent">
                  <Link href={stat.href}>View Details →</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-3">
        <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl" style={{ color: '#4edea3' }}>Recent Submissions</CardTitle>
              <CardDescription style={{ color: '#86948a' }}>Latest achievement submissions from your mentees</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-transparent border-[#3c4a5e] hover:border-[#4edea3]/50 text-[#b9c7e0]">
              <Link href="/faculty/verify">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-10 text-[#86948a]">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#4edea3]" />
                <p>No pending submissions. All caught up!</p>
              </div>
            ) : (
              recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#3c4a5e]/50 rounded-xl bg-[#131b2e]/50 hover:bg-[#131b2e] hover:border-[#4edea3]/30 transition-all gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white text-base md:text-lg">{submission.title}</h4>
                      <Badge variant="outline" className="text-xs bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30">
                        {submission.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30">
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-base text-[#b9c7e0] font-medium truncate">{submission.organization}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#86948a]">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(submission.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto bg-transparent border-[#3c4a5e] text-white hover:border-[#4edea3]/50">
                    <Link href="/faculty/verify">
                      <Eye className="h-4 w-4 mr-2" /> Review
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
