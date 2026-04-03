"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Award, TrendingUp, FileText, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"

interface RecentActivity {
  id: number
  type: string
  title: string
  description: string
  time: string
  color: string
}

interface AdminStats {
  totalStudents: number
  totalFaculty: number
  totalAchievements: number
  pendingVerifications: number
  engagementRate: number
  recentActivity: RecentActivity[]
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const json = await res.json()
        if (json.data) {
          setMetrics(json.data)
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    )
  }

  const stats = metrics || {
    totalStudents: 0,
    totalFaculty: 0,
    totalAchievements: 0,
    pendingVerifications: 0,
    engagementRate: 0,
    recentActivity: [],
  }

  const dotColor = (color: string) => {
    switch (color) {
      case "green": return "bg-green-500"
      case "red": return "bg-red-500"
      case "orange": return "bg-orange-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Institutional overview and management center</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Registered in the system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFaculty}</div>
                <p className="text-xs text-muted-foreground">Active mentors and verifiers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAchievements.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Student achievement submissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.engagementRate}%</div>
                <p className="text-xs text-muted-foreground">Users with achievements</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start">
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/admin/reports">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/admin/users?action=add">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New User
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Verifications</span>
                  <span className="text-sm font-medium text-orange-600">{stats.pendingVerifications} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Health</span>
                  <span className="text-sm font-medium text-green-600">All systems operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <span className="text-sm font-medium text-green-600">Connected (SQLite)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Users</span>
                  <span className="text-sm font-medium">{stats.totalStudents + stats.totalFaculty} registered</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity found.</p>
                  </div>
                ) : (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`h-2 w-2 ${dotColor(activity.color)} rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
