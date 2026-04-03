"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, Calendar, Award, BarChart3, Download, GraduationCap, Loader2 } from "lucide-react"
import { apiClient, type AcademicRecord } from "@/lib/api"

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A+": return "bg-[#4edea3]/20 text-[#4edea3] border-[#4edea3]/30"
    case "A": return "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20"
    case "A-": return "bg-[#b9c7e0]/20 text-[#b9c7e0] border-[#b9c7e0]/30"
    case "B+": return "bg-[#86948a]/20 text-[#86948a] border-[#86948a]/30"
    case "B": return "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/20"
    case "B-": return "bg-[#fc7c78]/20 text-[#fc7c78] border-[#fc7c78]/30"
    default: return "bg-[#3c4a5e]/20 text-[#b9c7e0] border-[#3c4a5e]/30"
  }
}

const getPerformanceInsight = (gpa: number) => {
  if (gpa >= 9.0) return { text: "Excellent Performance", color: "text-[#4edea3]" }
  if (gpa >= 8.0) return { text: "Good Performance", color: "text-[#b9c7e0]" }
  if (gpa >= 7.0) return { text: "Satisfactory Performance", color: "text-[#86948a]" }
  return { text: "Needs Improvement", color: "text-[#fc7c78]" }
}

interface SemesterData {
  id: string
  name: string
  gpa: number
  credits: number
  subjects: { code: string; name: string; credits: number; grade: string; points: number }[]
}

function groupBySemester(records: AcademicRecord[]): SemesterData[] {
  const grouped: Record<string, AcademicRecord[]> = {}
  for (const rec of records) {
    if (!grouped[rec.semester]) grouped[rec.semester] = []
    grouped[rec.semester].push(rec)
  }

  return Object.entries(grouped).map(([semester, recs]) => {
    const totalCredits = recs.reduce((sum, r) => sum + r.credits, 0)
    const weightedSum = recs.reduce((sum, r) => sum + r.marks * r.credits, 0)
    const gpa = totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 10) / 100 : 0

    return {
      id: semester.toLowerCase().replace(/\s+/g, "-"),
      name: semester,
      gpa,
      credits: totalCredits,
      subjects: recs.map(r => ({
        code: r.subject.substring(0, 6).toUpperCase().replace(/\s/g, ""),
        name: r.subject,
        credits: r.credits,
        grade: r.grade,
        points: r.marks / 10,
      })),
    }
  })
}

export function AcademicRecords() {
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [records, setRecords] = useState<AcademicRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await apiClient.getAcademicRecords()
      if (res.data) setRecords(res.data)
      setLoading(false)
    }
    fetchRecords()
  }, [])

  const semesters = groupBySemester(records)
  const totalCredits = records.reduce((sum, r) => sum + r.credits, 0)
  const completedCredits = totalCredits
  const targetCredits = Math.max(totalCredits, 120)

  const allMarks = records.map(r => r.marks)
  const avgMark = allMarks.length > 0 ? allMarks.reduce((a, b) => a + b, 0) / allMarks.length : 0
  const currentCGPA = Math.round(avgMark) / 10

  const currentSemester = semesters.length > 0 ? semesters[0].name : "N/A"

  const filteredSemesters = selectedSemester === "all" ? semesters : semesters.filter((sem) => sem.id === selectedSemester)
  const progressPercentage = targetCredits > 0 ? (completedCredits / targetCredits) * 100 : 0
  const insight = getPerformanceInsight(currentCGPA)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: '#0b1326' }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="p-6 md:p-8 space-y-6" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
        <div>
          <h1 className="text-3xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Academic Records</h1>
          <p className="mt-1" style={{ color: '#86948a' }}>Track your academic performance and semester-wise progress</p>
        </div>
        <Card className="glass-card border-0 rounded-2xl animate-fade-up">
          <CardContent className="p-16 text-center">
            <BookOpen className="h-16 w-16 text-[#3c4a5e] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2" style={{ color: '#b9c7e0' }}>No academic records found</h3>
            <p className="text-[#86948a] max-w-md mx-auto">Your academic records will appear here automatically once uploaded by the university administration. This section is strictly read-only.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const aPlusCount = records.filter(r => r.grade === "A+").length
  const aCount = records.filter(r => r.grade === "A").length
  const highestGpa = semesters.length > 0 ? Math.max(...semesters.map(s => s.gpa)) : 0

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Academic Records</h1>
          <p className="mt-1" style={{ color: '#86948a' }}>Read-only view of your official academic performance</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent border-[#4edea3]/30 text-[#4edea3] hover:bg-[#4edea3]/10">
          <Download className="h-4 w-4" />
          Export Transcript
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-up-delay-1">
        <Card className="glass-card border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Current CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#4edea3]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{currentCGPA.toFixed(2)}</div>
            <p className={`text-xs font-medium ${insight.color}`}>{insight.text}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Credits Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-[#b9c7e0]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{completedCredits}<span className="text-lg text-[#86948a]">/{targetCredits}</span></div>
            <Progress value={progressPercentage} className="h-1.5 bg-[#131b2e] [&>div]:bg-[#4edea3]" />
            <p className="text-xs mt-2" style={{ color: '#86948a' }}>{Math.round(progressPercentage)}% Complete</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Latest Semester</CardTitle>
            <Calendar className="h-4 w-4 text-[#b9c7e0]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">{currentSemester}</div>
            <p className="text-xs" style={{ color: '#86948a' }}>Most recent records</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Subjects Completed</CardTitle>
            <Award className="h-4 w-4 text-[#b9c7e0]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{records.length}</div>
            <p className="text-xs" style={{ color: '#86948a' }}>Across {semesters.length} semesters</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="semesters" className="space-y-6 animate-fade-up-delay-2">
        <TabsList className="grid w-full grid-cols-2 max-w-md rounded-xl p-1 relative z-10" style={{ background: 'rgba(19, 27, 46, 0.6)' }}>
          <TabsTrigger value="semesters" className="rounded-lg data-[state=active]:bg-[#003824] data-[state=active]:text-[#4edea3]">Semester Records</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-[#003824] data-[state=active]:text-[#4edea3]">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="semesters" className="space-y-6">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <label className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Filter by Semester:</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48 rounded-xl border-[#3c4a5e] bg-[#060e20]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-[#3c4a5e]">
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>{semester.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filteredSemesters.map((semester) => (
              <Card key={semester.id} className="glass-card border-0 rounded-2xl overflow-hidden hover-glow transition-all duration-300">
                <CardHeader className="bg-[#131b2e]/50 border-b border-[#3c4a5e]/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                        <GraduationCap className="h-5 w-5" />
                        {semester.name}
                      </CardTitle>
                      <CardDescription style={{ color: '#86948a' }}>
                        {semester.credits} Credits • {semester.subjects.length} Subjects
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-1 font-semibold" style={{ background: 'rgba(78, 222, 163, 0.1)', color: '#4edea3', borderColor: 'rgba(78, 222, 163, 0.3)' }}>
                      GPA: {semester.gpa.toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#3c4a5e]/50 text-left" style={{ color: '#b9c7e0' }}>
                          <th className="py-4 px-6 font-medium whitespace-nowrap">Course Code</th>
                          <th className="py-4 px-6 font-medium whitespace-nowrap hidden sm:table-cell">Course Name</th>
                          <th className="py-4 px-6 font-medium text-center">Credits</th>
                          <th className="py-4 px-6 font-medium text-center">Grade</th>
                          <th className="py-4 px-6 font-medium text-right hidden lg:table-cell">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.subjects.map((subject, index) => (
                          <tr key={index} className="border-b border-[#131b2e] last:border-0 hover:bg-[#131b2e]/30 transition-colors">
                            <td className="py-4 px-6 font-mono text-[#86948a]">{subject.code}</td>
                            <td className="py-4 px-6 font-medium text-white hidden sm:table-cell">{subject.name}</td>
                            <td className="py-4 px-6 text-center text-[#b9c7e0]">{subject.credits}</td>
                            <td className="py-4 px-6 text-center">
                              <Badge variant="outline" className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                            </td>
                            <td className="py-4 px-6 text-right font-medium text-[#4edea3] hidden lg:table-cell">{subject.points.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                  <BarChart3 className="h-5 w-5" />
                  GPA Trend
                </CardTitle>
                <CardDescription style={{ color: '#86948a' }}>Semester-wise GPA progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 mt-2">
                  {[...semesters].reverse().map((semester) => (
                    <div key={semester.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{semester.name}</span>
                        <span className="text-sm font-bold text-[#4edea3]">{semester.gpa.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#131b2e] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#003824] to-[#4edea3] h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                          style={{ width: `${(semester.gpa / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {semesters.length === 0 && (
                    <p className="text-sm text-center py-4 text-[#86948a]">No data available yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 rounded-2xl h-fit">
              <CardHeader>
                <CardTitle className="text-xl" style={{ color: '#4edea3' }}>Performance Summary</CardTitle>
                <CardDescription style={{ color: '#86948a' }}>Overall academic statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex justify-between items-center py-2 border-b border-[#3c4a5e]/50">
                  <span className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Highest Semester GPA</span>
                  <Badge variant="outline" className="text-lg px-3 bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30">
                    {highestGpa ? highestGpa.toFixed(2) : "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#3c4a5e]/50">
                  <span className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Total A+ Grades</span>
                  <Badge variant="secondary" className="bg-[#131b2e] text-white text-base px-3">{aPlusCount}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#3c4a5e]/50">
                  <span className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Total A Grades</span>
                  <Badge variant="secondary" className="bg-[#131b2e] text-white text-base px-3">{aCount}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Subjects Completed</span>
                  <Badge variant="secondary" className="bg-[#131b2e] text-white text-base px-3">{records.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
