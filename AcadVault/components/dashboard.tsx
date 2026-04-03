"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, BookOpen, Award } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { apiClient, Achievement } from "@/lib/api"
import { toast } from "sonner"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="h-4 w-4" style={{ color: '#4edea3' }} />
    case "Pending":
      return <Clock className="h-4 w-4" style={{ color: '#ffb300' }} />
    case "Rejected":
      return <XCircle className="h-4 w-4" style={{ color: '#fc7c78' }} />
    default:
      return <AlertCircle className="h-4 w-4" style={{ color: '#86948a' }} />
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Approved": return "badge-approved"
    case "Pending": return "badge-pending"
    case "Rejected": return "badge-rejected"
    default: return ""
  }
}

export function Dashboard() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await apiClient.getAchievements()
      if (response.error) {
        toast.error("Failed to load achievements")
        setAchievements([])
      } else if (response.data) {
        setAchievements(response.data)
      }
      setLoading(false)
    }

    fetchAchievements()
  }, [])

  const approvedCount = achievements.filter((a) => a.status === "Approved").length
  const pendingCount = achievements.filter((a) => a.status === "Pending").length

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: '#0b1326', minHeight: '100vh' }}>
      {/* Aurora glow at top */}
      <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% -50%, rgba(78, 222, 163, 0.06) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 animate-fade-up">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>
              Welcome back, Student!
            </h1>
            <p className="mt-1 text-sm md:text-base" style={{ color: '#86948a' }}>
              Track your academic journey and build your professional portfolio
            </p>
          </div>
        </div>
        <Button className="btn-glow gap-2 text-sm md:text-base rounded-xl px-5 py-2.5" onClick={() => router.push('/student/achievements')}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Activity</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 relative z-10">
        {[
          { title: "Academic Performance", value: "8.5/10", subtitle: "Current CGPA", icon: TrendingUp, progress: 85, color: '#4edea3', delay: '1' },
          { title: "Pending Approvals", value: String(pendingCount), subtitle: "Awaiting review", icon: Clock, color: '#ffb300', delay: '2' },
          { title: "Approved Activities", value: String(approvedCount), subtitle: "Verified achievements", icon: CheckCircle, color: '#4edea3', delay: '3' },
          { title: "Portfolio Score", value: "92%", subtitle: "Completeness rating", icon: Award, color: '#6ffbbe', delay: '4' },
        ].map((card, i) => (
          <div key={i} className={`glass-card rounded-2xl p-5 hover-lift animate-fade-up-delay-${card.delay}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs md:text-sm font-medium" style={{ color: '#86948a' }}>{card.title}</span>
              <card.icon className="h-4 w-4" style={{ color: card.color, opacity: 0.7 }} />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold mb-1" style={{ color: card.color, letterSpacing: '-0.03em' }}>
              {card.value}
            </div>
            <p className="text-xs" style={{ color: '#86948a' }}>{card.subtitle}</p>
            {card.progress && (
              <div className="progress-emerald mt-3 h-1.5">
                <div style={{ width: `${card.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="glass-card rounded-2xl p-6 relative z-10 animate-fade-up-delay-2">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5" style={{ color: '#4edea3' }} />
          <h2 className="text-lg md:text-xl font-bold" style={{ color: '#dae2fd' }}>
            Recent Activity Timeline
          </h2>
        </div>
        <p className="text-sm mb-5" style={{ color: '#86948a' }}>Your latest submissions and their approval status</p>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-shimmer h-12 rounded-xl mb-3" style={{ background: 'rgba(34, 42, 61, 0.4)' }} />
              <div className="animate-shimmer h-12 rounded-xl mb-3" style={{ background: 'rgba(34, 42, 61, 0.4)' }} />
              <div className="animate-shimmer h-12 rounded-xl" style={{ background: 'rgba(34, 42, 61, 0.4)' }} />
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: '#86948a' }}>
              No achievements found. Start by adding your first achievement!
            </div>
          ) : (
            achievements.map((activity, index) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover-glow transition-all duration-300"
                style={{
                  background: 'rgba(19, 27, 46, 0.4)',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  {getStatusIcon(activity.status)}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm md:text-base truncate" style={{ color: '#dae2fd' }}>
                      {activity.title}
                    </h4>
                    <p className="text-xs md:text-sm" style={{ color: '#86948a' }}>
                      {activity.organization} • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 mt-2 sm:mt-0">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(60, 74, 94, 0.4)', color: '#b9c7e0' }}>
                    {activity.type}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadgeClass(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
