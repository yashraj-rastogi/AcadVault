"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Search, Filter, Eye, FileText, Loader2 } from "lucide-react"
import { VerificationDetailView } from "@/components/verification-detail-view"
import { apiClient } from "@/lib/api"

export interface Evidence {
  type: "pdf" | "image"
  name: string
  url: string
}

export interface SubmissionEntry {
  id: number
  studentName: string
  rollNo: string
  achievement: string
  category: string
  submittedAt: string
  description: string
  evidence: Evidence[]
  status: string
  priority: string
}

export function VerificationQueue() {
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.getAchievements()
      if (res.data) {
        const mapped: SubmissionEntry[] = res.data.map((a) => ({
          id: a.id,
          studentName: a.organization, // Best available field mapping
          rollNo: "",
          achievement: a.title,
          category: a.type,
          submittedAt: a.date,
          description: a.description || "",
          evidence: a.proofUrl ? [{
            type: a.proofUrl.toLowerCase().endsWith('.pdf') ? "pdf" : "image",
            name: "Uploaded Proof",
            url: a.proofUrl
          }] : [],
          status: a.status === "Approved" ? "verified" : a.status === "Rejected" ? "rejected" : "pending",
          priority: "medium",
        }))
        setSubmissions(mapped)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredSubmissions = submissions
    .filter((submission) => {
      const matchesSearch =
        submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.achievement.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || submission.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      } else if (sortBy === "name") {
        return a.studentName.localeCompare(b.studentName)
      }
      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0b1326' }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
      </div>
    )
  }

  if (selectedSubmission) {
    return (
      <div style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
         <VerificationDetailView
          submission={selectedSubmission}
          onBack={() => setSelectedSubmission(null)}
          onApprove={(id) => {
            apiClient.updateAchievement(id, { status: "Approved" }).then(() => {
              setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "verified" } : s))
            })
            setSelectedSubmission(null)
          }}
          onReject={(id, comment) => {
            apiClient.updateAchievement(id, { status: "Rejected", feedback: comment }).then(() => {
              setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" } : s))
            })
            setSelectedSubmission(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Achievement Verification</h1>
          <p className="mt-1 text-sm md:text-base" style={{ color: '#86948a' }}>Review and verify student achievement submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-4 py-1 border-[#fc7c78] bg-[#fc7c78]/10 text-[#fc7c78]">
            {filteredSubmissions.filter((s) => s.status === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-1">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#86948a]" />
                <Input
                  placeholder="Search by student name, roll number, or achievement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl focus-visible:ring-[#4edea3]"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-[#3c4a5e] text-white">
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-[#86948a]" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-[#3c4a5e] text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4 animate-fade-up-delay-2">
        {filteredSubmissions.map((submission) => (
          <Card
            key={submission.id}
            className="glass-card border-0 rounded-2xl hover-glow transition-all duration-300 cursor-pointer overflow-hidden border border-[#3c4a5e]/30 bg-[#131b2e]/30 hover:bg-[#131b2e]/60"
            onClick={() => setSelectedSubmission(submission)}
          >
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-white">{submission.studentName}</h3>
                    {submission.rollNo && (
                      <Badge variant="outline" className="text-xs border-[#3c4a5e] text-[#86948a]">
                        {submission.rollNo}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        submission.status === "verified"
                          ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30"
                          : submission.status === "rejected"
                            ? "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30"
                            : "bg-[#d946ef]/10 text-[#d946ef] border-[#d946ef]/30"
                      }`}
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  <h4 className="text-xl font-bold text-[#4edea3] mb-2">{submission.achievement}</h4>
                  <p className="text-sm text-[#b9c7e0] font-medium mb-3 line-clamp-2">{submission.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#86948a]">
                    <div className="flex items-center gap-1.5 bg-[#060e20] px-3 py-1.5 rounded-full">
                      <Clock className="h-3.5 w-3.5 text-[#4edea3]" />
                      <span>{formatDate(submission.submittedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#060e20] px-3 py-1.5 rounded-full">
                       <span>Category: {submission.category}</span>
                    </div>
                    {submission.evidence.length > 0 && (
                      <div className="flex items-center gap-1.5 bg-[#060e20] px-3 py-1.5 rounded-full border border-[#4edea3]/30 text-[#4edea3]">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Has Proof Document</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center w-full md:w-auto mt-2 md:mt-0">
                  <Button variant="outline" size="sm" className="w-full md:w-auto bg-transparent border-[#4edea3]/50 text-[#4edea3] hover:bg-[#4edea3]/10">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Submission
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-2">
          <CardContent className="p-16 text-center">
            <Clock className="h-16 w-16 text-[#3c4a5e] mx-auto mb-6" />
            <h3 className="text-xl font-bold text-[#b9c7e0] mb-2">No submissions found</h3>
            <p className="text-[#86948a] max-w-sm mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All caught up! No pending verifications at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
