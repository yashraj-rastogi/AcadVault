"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, BookOpen, Users, FileText, CheckCircle, Clock } from "lucide-react"
import { apiClient, type AcademicRecord, type Achievement } from "@/lib/api"

interface Student {
  id: number
  name: string
  rollNo: string
  email: string
  phone: string
  year: string
  branch: string
  cgpa: number
  attendance: number
  achievements: number
  lastActive: string
  avatar: string
  status: string
  mentor: string
}

interface HolisticStudentProfileProps {
  student: Student
  onBack: () => void
}

interface SemesterSummary {
  semester: string
  gpa: number
  credits: number
  subjects: number
}

export function HolisticStudentProfile({ student, onBack }: HolisticStudentProfileProps) {
  const [records, setRecords] = useState<AcademicRecord[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [recRes, achRes] = await Promise.all([
        apiClient.getAcademicRecords(),
        apiClient.getAchievements(),
      ])
      // Only get achievements that belong to this student. Currently the mock data doesn't map it directly, but in a real app we would pass the student.id as a query param. 
      // For this UI, we just display the returned achievements for demonstration.
      if (recRes.data) setRecords(recRes.data)
      if (achRes.data) setAchievements(achRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Group records by semester
  const semesterMap: Record<string, AcademicRecord[]> = {}
  for (const rec of records) {
    if (!semesterMap[rec.semester]) semesterMap[rec.semester] = []
    semesterMap[rec.semester].push(rec)
  }

  const semesterSummaries: SemesterSummary[] = Object.entries(semesterMap).map(([sem, recs]) => {
    const totalCredits = recs.reduce((s, r) => s + r.credits, 0)
    const weightedSum = recs.reduce((s, r) => s + r.marks * r.credits, 0)
    const gpa = totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 10) / 100 : 0
    return { semester: sem, gpa, credits: totalCredits, subjects: recs.length }
  })
  
  // Sort semesters
  semesterSummaries.sort((a,b) => a.semester.localeCompare(b.semester))

  const totalCredits = records.reduce((s, r) => s + r.credits, 0)

  // Get latest semester subjects
  const latestSemester = semesterSummaries.length > 0 ? semesterSummaries[semesterSummaries.length - 1].semester : null
  const currentSubjects = latestSemester ? (semesterMap[latestSemester] || []) : []

  const academicPerformance = student.cgpa ? Math.round((student.cgpa / 10) * 100) : 0
  const approvedAchievements = achievements.filter(a => a.status === "Approved")

  return (
    <div className="animate-fade-up p-4 md:p-8" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-8">
        <Button variant="ghost" className="bg-[#131b2e] hover:bg-[#3c4a5e] text-white rounded-full px-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <div className="flex-1 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Student Profile</h1>
          <p className="text-[#86948a]">Holistic view of academic and co-curricular performance</p>
        </div>
      </div>

      {/* Student Header Card */}
      <Card className="glass-card border-0 rounded-3xl mb-6">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-[#131b2e] shadow-xl">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback className="bg-[#131b2e] text-2xl font-bold text-[#4edea3]">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">{student.name}</h2>
                <Badge variant="outline" className={`text-xs px-3 py-1 uppercase tracking-wider ${student.status === "active" ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30" : "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30"}`}>
                  {student.status || "active"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <div className="space-y-3 bg-[#060e20] p-4 rounded-xl border border-[#3c4a5e]/30">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-24">Roll Number:</span>
                    <span className="text-white bg-[#131b2e] px-2 py-0.5 rounded text-xs">{student.rollNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-24">Branch:</span>
                    <span className="text-white">{student.branch}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-24">Year:</span>
                    <span className="text-white">{student.year}</span>
                  </div>
                </div>
                <div className="space-y-3 bg-[#060e20] p-4 rounded-xl border border-[#3c4a5e]/30">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-16">Email:</span>
                    <span className="text-white truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-16">Phone:</span>
                    <span className="text-white">{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] w-16">Mentor:</span>
                    <span className="text-white">{student.mentor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button className="w-full justify-start btn-glow border border-[#4edea3]/50 text-[#0b1326] font-bold rounded-xl" style={{ backgroundColor: '#4edea3' }}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent border-[#3c4a5e] text-white hover:border-[#4edea3]/50 rounded-xl">
                <Mail className="h-4 w-4 mr-2" />
                Email Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Overall CGPA", value: student.cgpa, color: "#4edea3" },
          { label: "Attendance", value: `${student.attendance}%`, color: "#b9c7e0" },
          { label: "Achievements", value: achievements.length, color: "#d946ef" },
          { label: "Total Credits", value: totalCredits, color: "#fc7c78" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-0 rounded-2xl hover:-translate-y-1 transition-transform">
            <CardContent className="p-5 text-center flex flex-col items-center justify-center">
               <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#86948a]">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="academic" className="space-y-6">
        <TabsList className="bg-[#131b2e] p-1 rounded-xl flex w-full max-w-2xl">
          <TabsTrigger value="academic" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">Academic Records</TabsTrigger>
          <TabsTrigger value="achievements" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">Achievements</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-6 animate-fade-up">
          {loading ? (
             <div className="flex items-center justify-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4edea3]"></div>
             </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Semester-wise Performance */}
              <Card className="glass-card border-0 rounded-2xl">
                <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
                  <CardTitle className="text-xl text-white">Semester-wise Performance</CardTitle>
                  <CardDescription className="text-[#86948a]">GPA trend across semesters</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {semesterSummaries.length === 0 ? (
                      <p className="text-sm text-[#86948a] text-center py-4">No academic records available yet.</p>
                    ) : (
                      semesterSummaries.map((sem, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-[#3c4a5e]/50 rounded-xl bg-[#060e20] hover:border-[#4edea3]/30 transition-colors">
                          <div>
                            <div className="font-bold text-lg text-white mb-1">{sem.semester}</div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-[#86948a]">
                              {sem.subjects} subjects, {sem.credits} credits
                            </div>
                          </div>
                          <div className="text-right bg-[#131b2e] px-4 py-2 rounded-lg border border-[#3c4a5e]/30">
                            <div className="font-black text-xl text-[#4edea3]">{sem.gpa.toFixed(2)}</div>
                            <div className="text-[10px] uppercase font-bold text-[#86948a] tracking-widest">GPA</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Subjects */}
              <Card className="glass-card border-0 rounded-2xl">
                <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
                  <CardTitle className="text-xl text-white">Latest Semester Subjects</CardTitle>
                  <CardDescription className="text-[#86948a]">{latestSemester ? `${latestSemester} courses` : "No courses yet"}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {currentSubjects.length === 0 ? (
                      <p className="text-sm text-[#86948a] text-center py-4">No subjects recorded yet.</p>
                    ) : (
                      currentSubjects.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-[#3c4a5e]/50 rounded-xl bg-[#060e20] hover:border-[#4edea3]/30 transition-colors">
                           <div className="flex-1">
                            <div className="font-bold text-white mb-1 leading-tight">{subject.subject}</div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-[#86948a]">{subject.credits} credits</div>
                          </div>
                          <Badge variant="outline" className={`ml-3 text-lg font-black px-3 py-1 bg-[#131b2e] border-[#3c4a5e] ${subject.grade.startsWith('A') || subject.grade.startsWith('O') ? 'text-[#4edea3]' : 'text-white'}`}>
                            {subject.grade}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 animate-fade-up">
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
              <CardTitle className="text-xl text-white">Co-curricular & Extracurricular Achievements</CardTitle>
              <CardDescription className="text-[#86948a]">Verified achievements and pending submissions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4edea3]"></div>
                  </div>
                ) : achievements.length === 0 ? (
                  <p className="text-[#86948a] text-center py-12">No achievements recorded yet.</p>
                ) : (
                  achievements.map((achievement) => (
                    <div key={achievement.id} className="border border-[#3c4a5e]/50 rounded-xl p-5 bg-[#060e20] hover:border-[#4edea3]/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-white mb-1">{achievement.title}</h4>
                          <p className="text-sm text-[#b9c7e0] leading-relaxed">{achievement.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                           <Badge variant="outline" className="bg-[#131b2e] border-[#3c4a5e] text-[#86948a]">
                             {achievement.type}
                           </Badge>
                          <Badge variant="outline" className={achievement.status === "Approved" ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30" : achievement.status === "Rejected" ? "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30" : "bg-[#d946ef]/10 text-[#d946ef] border-[#d946ef]/30"}>
                            {achievement.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#3c4a5e]/30 text-xs font-semibold text-[#86948a]">
                        <div className="flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(achievement.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full px-2 py-1 bg-[#131b2e] border border-[#3c4a5e]">
                          <span>{achievement.organization}</span>
                        </div>
                         {achievement.proofUrl && (
                             <div className="flex items-center gap-1.5 rounded-full px-2 py-1 bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3]">
                                <FileText className="h-3.5 w-3.5" /> <span>Proof Attached</span>
                             </div>
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 animate-fade-up">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
                <CardTitle className="text-xl text-white">Performance Metrics</CardTitle>
                <CardDescription className="text-[#86948a]">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-[#b9c7e0]">Academic Performance</span>
                    <span className="text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded">{academicPerformance}%</span>
                  </div>
                  <Progress value={academicPerformance} className="h-3 bg-[#060e20] [&>div]:bg-[#4edea3]" />
                </div>
                <div>
                   <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-[#b9c7e0]">Attendance Rate</span>
                    <span className="text-[#fc7c78] bg-[#fc7c78]/10 px-2 py-0.5 rounded">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-3 bg-[#060e20] [&>div]:bg-[#fc7c78]" />
                </div>
                <div>
                   <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-[#b9c7e0]">Achievements Approved</span>
                    <span className="text-[#d946ef] bg-[#d946ef]/10 px-2 py-0.5 rounded">{achievements.length > 0 ? Math.round((approvedAchievements.length / achievements.length) * 100) : 0}%</span>
                  </div>
                  <Progress value={achievements.length > 0 ? (approvedAchievements.length / achievements.length) * 100 : 0} className="h-3 bg-[#060e20] [&>div]:bg-[#d946ef]" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
                <CardTitle className="text-xl text-white">Mentorship Notes</CardTitle>
                <CardDescription className="text-[#86948a]">Track mentoring sessions and progress</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="bg-[#060e20] border border-[#3c4a5e]/50 rounded-xl p-8 text-center">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30 text-[#4edea3]" />
                    <p className="text-sm font-medium text-[#86948a]">
                      No mentorship notes recorded yet. Notes will appear here as mentors add them.
                    </p>
                    <Button variant="outline" className="mt-4 bg-transparent border-[#3c4a5e] text-white hover:border-[#4edea3]/50">
                       Add First Note
                    </Button>
                 </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
