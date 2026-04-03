"use client"

import { useState, useEffect } from "react"
import { FileText, Download, BarChart3, PieChart, TrendingUp, Users, Award, Building, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AdminSidebar } from "@/components/admin-sidebar"
import { toast } from "sonner"

interface ReportData {
  title: string
  generatedAt: string
  [key: string]: any
}

function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey))
    } else if (Array.isArray(obj[key])) {
      result[fullKey] = JSON.stringify(obj[key])
    } else {
      result[fullKey] = String(obj[key] ?? "")
    }
  }
  return result
}

function downloadCSV(data: ReportData, filename: string) {
  let csvContent = ""

  // Summary section
  csvContent += `${data.title}\n`
  csvContent += `Generated At,${data.generatedAt}\n\n`

  // Flatten and output all sections
  const flat = flattenObject(data)
  for (const [key, value] of Object.entries(flat)) {
    if (key === "title" || key === "generatedAt") continue
    if (key === "achievementDetails") continue
    csvContent += `"${key}","${String(value).replace(/"/g, '""')}"\n`
  }

  // Achievement details as table
  if (data.achievementDetails && data.achievementDetails.length > 0) {
    csvContent += "\n\nAchievement Details\n"
    const headers = ["ID", "Title", "Type", "Organization", "Date", "Status", "Student"]
    csvContent += headers.join(",") + "\n"
    data.achievementDetails.forEach((a: any) => {
      csvContent += [a.id, `"${a.title}"`, `"${a.type}"`, `"${a.organization}"`, a.date, a.status, `"${a.student}"`].join(",") + "\n"
    })
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function downloadJSON(data: ReportData, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedYear, setSelectedYear] = useState("2026")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null)
  const [generatedReportType, setGeneratedReportType] = useState("")

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch("/api/admin/reports?type=annual")
      const json = await res.json()
      if (json.data) setAnalyticsData(json.data)
    } catch {
      console.error("Failed to fetch analytics")
    }
    setAnalyticsLoading(false)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleGenerateReport = async (type: string) => {
    setIsGenerating(type)
    try {
      const res = await fetch(`/api/admin/reports?type=${type}`)
      const json = await res.json()
      if (json.data) {
        setGeneratedReport(json.data)
        setGeneratedReportType(type)
        toast.success(`${json.data.title} generated successfully!`)
      } else {
        toast.error("Failed to generate report")
      }
    } catch {
      toast.error("Network error generating report")
    }
    setIsGenerating("")
  }

  const handleDownloadCSV = () => {
    if (!generatedReport) return
    downloadCSV(generatedReport, `${generatedReportType}_report_${new Date().toISOString().split('T')[0]}.csv`)
    toast.success("CSV downloaded!")
  }

  const handleDownloadJSON = () => {
    if (!generatedReport) return
    downloadJSON(generatedReport, `${generatedReportType}_report_${new Date().toISOString().split('T')[0]}.json`)
    toast.success("JSON downloaded!")
  }

  const prebuiltTemplates = [
    {
      id: "naac",
      name: "NAAC Accreditation Report",
      description: "Comprehensive report for NAAC accreditation with student performance, faculty data, and research output",
      icon: Building,
      criteria: ["Student Performance", "Faculty-Student Ratio", "Achievement Verification", "Research Output"],
      color: "blue",
    },
    {
      id: "nirf",
      name: "NIRF Ranking Report",
      description: "National Institutional Ranking Framework report with teaching, research, and outreach metrics",
      icon: Award,
      criteria: ["Teaching & Learning", "Research & Professional Practice", "Graduation Outcomes", "Outreach & Inclusivity"],
      color: "purple",
    },
    {
      id: "annual",
      name: "Annual Performance Report",
      description: "Yearly institutional performance summary with achievement trends and department analytics",
      icon: TrendingUp,
      criteria: ["Student Achievements", "Faculty Performance", "Department Growth", "Overall Metrics"],
      color: "green",
    },
  ]

  // Compute analytics from real data
  const totalAch = analyticsData?.overview?.totalAchievements || 0
  const typeDistribution = analyticsData?.achievementsByType || {}
  const statusDistribution = analyticsData?.achievementsByStatus || {}
  const departments = analyticsData?.departments || []

  // Compute type percentages
  const typeEntries = Object.entries(typeDistribution).map(([name, count]) => ({
    name,
    count: count as number,
    percentage: totalAch > 0 ? Math.round(((count as number) / totalAch) * 100) : 0,
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">Generate institutional reports with real data for accreditation and analysis</p>
          </div>

          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Pre-built Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Report Builder</TabsTrigger>
              <TabsTrigger value="analytics">Data Visualization</TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <div className="grid gap-6">
                {prebuiltTemplates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <template.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{template.name}</CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">Real Data</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Included Criteria:</h4>
                          <div className="flex flex-wrap gap-2">
                            {template.criteria.map((criterion) => (
                              <Badge key={criterion} variant="secondary">{criterion}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex gap-2">
                            {generatedReportType === template.id && generatedReport && (
                              <>
                                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                                  <Download className="mr-2 h-4 w-4" />
                                  CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                                  <Download className="mr-2 h-4 w-4" />
                                  JSON
                                </Button>
                              </>
                            )}
                          </div>
                          <Button onClick={() => handleGenerateReport(template.id)} disabled={!!isGenerating}>
                            {isGenerating === template.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Show generated report preview */}
                        {generatedReportType === template.id && generatedReport && (
                          <div className="border rounded-lg p-4 mt-4 bg-muted/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm text-green-600">✓ Report Generated Successfully</h4>
                              <span className="text-xs text-muted-foreground">{new Date(generatedReport.generatedAt).toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              {template.id === "naac" && generatedReport.institution && (
                                <>
                                  <div><span className="text-muted-foreground">Students:</span> <strong>{generatedReport.institution.totalStudents}</strong></div>
                                  <div><span className="text-muted-foreground">Faculty:</span> <strong>{generatedReport.institution.totalFaculty}</strong></div>
                                  <div><span className="text-muted-foreground">Ratio:</span> <strong>{generatedReport.institution.studentFacultyRatio}</strong></div>
                                  <div><span className="text-muted-foreground">Depts:</span> <strong>{generatedReport.institution.departments?.length || 0}</strong></div>
                                </>
                              )}
                              {template.id === "nirf" && generatedReport.teachingLearning && (
                                <>
                                  <div><span className="text-muted-foreground">Students:</span> <strong>{generatedReport.teachingLearning.totalStudents}</strong></div>
                                  <div><span className="text-muted-foreground">Faculty:</span> <strong>{generatedReport.teachingLearning.totalFaculty}</strong></div>
                                  <div><span className="text-muted-foreground">Publications:</span> <strong>{generatedReport.researchProfessionalPractice?.totalPublications || 0}</strong></div>
                                  <div><span className="text-muted-foreground">Engagement:</span> <strong>{generatedReport.graduationOutcomes?.engagementRate}</strong></div>
                                </>
                              )}
                              {template.id === "annual" && generatedReport.overview && (
                                <>
                                  <div><span className="text-muted-foreground">Students:</span> <strong>{generatedReport.overview.totalStudents}</strong></div>
                                  <div><span className="text-muted-foreground">Achievements:</span> <strong>{generatedReport.overview.totalAchievements}</strong></div>
                                  <div><span className="text-muted-foreground">Approved:</span> <strong>{generatedReport.overview.approvedAchievements}</strong></div>
                                  <div><span className="text-muted-foreground">Engagement:</span> <strong>{generatedReport.overview.engagementRate}</strong></div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Custom Report Tab */}
            <TabsContent value="custom" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Report Builder</CardTitle>
                  <CardDescription>Create custom reports with specific filters and criteria — downloads as CSV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((d: any) => (
                            <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Academic Year</Label>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Report Type</Label>
                      <Select defaultValue="annual">
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Performance</SelectItem>
                          <SelectItem value="naac">NAAC Report</SelectItem>
                          <SelectItem value="nirf">NIRF Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DatePickerWithRange />
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { handleGenerateReport("annual").then(() => { if (generatedReport) handleDownloadCSV() }) }}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { handleGenerateReport("annual").then(() => { if (generatedReport) handleDownloadJSON() }) }}>
                        <Download className="mr-2 h-4 w-4" />
                        JSON
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" onClick={() => handleGenerateReport("annual")} disabled={!!isGenerating}>
                      {isGenerating ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Custom Report...</>
                      ) : (
                        "Generate Custom Report"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {analyticsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Achievement Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Achievement Type Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {typeEntries.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No achievement data available</p>
                        ) : (
                          typeEntries.map(entry => (
                            <div key={entry.name}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{entry.name}</span>
                                <span className="text-sm font-medium">{entry.percentage}% ({entry.count})</span>
                              </div>
                              <Progress value={entry.percentage} className="h-2" />
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Verification Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(statusDistribution).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm">{status}</span>
                            <Badge variant={status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"}>
                              {String(count)}
                            </Badge>
                          </div>
                        ))}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">Total</span>
                            <span className="font-bold">{totalAch}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Department Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Department Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {departments.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No departments configured</p>
                        ) : (
                          departments.map((dept: any) => (
                            <div key={dept.code} className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-medium">{dept.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">{dept.code}</Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">{dept.students} students</span>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Key Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Total Students</span>
                          <span className="font-medium">{analyticsData?.overview?.totalStudents ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Faculty</span>
                          <span className="font-medium">{analyticsData?.overview?.totalFaculty ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement Rate</span>
                          <span className="font-medium">{analyticsData?.overview?.engagementRate ?? "0%"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Verification Rate</span>
                          <span className="font-medium">{analyticsData?.overview?.verificationRate ?? "0%"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending Verifications</span>
                          <span className="font-medium text-orange-600">{analyticsData?.overview?.pendingVerifications ?? 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
