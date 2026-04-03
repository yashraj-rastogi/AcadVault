"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, Mail, Phone, GraduationCap, Award, TrendingUp, Loader2 } from "lucide-react"
import { HolisticStudentProfile } from "@/components/holistic-student-profile"
import { apiClient, type Student } from "@/lib/api"
import { toast } from "sonner"

export function StudentList() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterYear, setFilterYear] = useState("all")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await apiClient.getStudents()
      if (response.data) {
        setStudents(response.data)
      } else {
        toast.error("Failed to load students")
      }
      setLoading(false)
    }
    fetchStudents()
  }, [])

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesYear = filterYear === "all" || student.year.includes(filterYear)
      return matchesSearch && matchesYear
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "rollNo") {
        return a.roll_no.localeCompare(b.roll_no)
      } else if (sortBy === "cgpa") {
        return (b.cgpa || 0) - (a.cgpa || 0)
      } else if (sortBy === "achievements") {
        return b.achievements_count - a.achievements_count
      }
      return 0
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0b1326' }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
      </div>
    )
  }

  if (selectedStudent) {
    // Adapter to convert our Student type to the type expected by HolisticStudentProfile
    const adaptedStudent = {
      ...selectedStudent,
      rollNo: selectedStudent.roll_no,
      achievements: selectedStudent.achievements_count,
      phone: selectedStudent.phone || "",
      branch: selectedStudent.branch || "Computer Science",
      cgpa: selectedStudent.cgpa || 0,
      lastActive: selectedStudent.lastActive || new Date().toISOString().split('T')[0],
      avatar: selectedStudent.avatar || "/placeholder.svg",
      mentor: selectedStudent.mentor || "Dr. Smith",
      status: "active" as const
    }
    return <HolisticStudentProfile student={adaptedStudent} onBack={() => setSelectedStudent(null)} />
  }

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Student Management</h1>
          <p className="mt-1 text-sm md:text-base" style={{ color: '#86948a' }}>Manage and mentor your assigned students</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-4 py-1 border-[#b9c7e0] bg-[#131b2e] text-[#b9c7e0]">
            {filteredStudents.length} Students
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
                  placeholder="Search by name, roll number, or email..."
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
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="rollNo">Sort by Roll No</SelectItem>
                  <SelectItem value="cgpa">Sort by CGPA</SelectItem>
                  <SelectItem value="achievements">Sort by Achievements</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-40 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-[#86948a]" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-[#3c4a5e] text-white">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up-delay-2">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="glass-card border-0 rounded-2xl hover-glow transition-all duration-300 cursor-pointer overflow-hidden border border-[#3c4a5e]/30 bg-[#131b2e]/30 hover:bg-[#131b2e]/60 group"
            onClick={() => setSelectedStudent(student)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-14 w-14 border border-[#3c4a5e] group-hover:border-[#4edea3]/50 transition-colors">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="bg-[#131b2e] text-[#4edea3]">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-white truncate group-hover:text-[#4edea3] transition-colors">{student.name}</h3>
                  <p className="text-sm text-[#86948a] font-medium">{student.roll_no}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs ${student.status === "active" ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30" : "bg-transparent text-[#b9c7e0] border-[#3c4a5e]"}`}>
                      {student.status || "active"}
                    </Badge>
                    <span className="text-xs font-semibold text-[#86948a] bg-[#060e20] px-2 py-0.5 rounded-full">{student.year}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-[#060e20] p-4 rounded-xl border border-[#3c4a5e]/30">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] font-medium">CGPA</span>
                  </div>
                  <span className="font-bold text-white">{student.cgpa}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] font-medium">Attendance</span>
                  </div>
                  <span className="font-bold text-white">{student.attendance}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#86948a]" />
                    <span className="text-[#86948a] font-medium">Achievements</span>
                  </div>
                  <span className="font-bold text-white">{student.achievements_count}</span>
                </div>
              </div>

               <div className="flex gap-2 mt-5">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent border-[#4edea3]/50 text-[#4edea3] hover:bg-[#4edea3]/10">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-[#3c4a5e] text-[#86948a] hover:text-white hover:border-[#4edea3]/50">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-[#3c4a5e] text-[#86948a] hover:text-white hover:border-[#4edea3]/50">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
         <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-2">
          <CardContent className="p-16 text-center">
            <Search className="h-16 w-16 text-[#3c4a5e] mx-auto mb-6" />
             <h3 className="text-xl font-bold text-[#b9c7e0] mb-2">No students found</h3>
            <p className="text-[#86948a] max-w-sm mx-auto">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
