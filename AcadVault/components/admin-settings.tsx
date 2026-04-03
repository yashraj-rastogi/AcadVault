"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building, Bell, Shield, Database, Globe, Save, Loader2, Plus, Trash2, Users, Settings2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { toast } from "sonner"

interface Department {
  id: number
  name: string
  code: string
  head: string | null
}

export function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Institution settings
  const [institution, setInstitution] = useState({
    name: "AcadVault University",
    code: "AVU",
    address: "Lucknow, Uttar Pradesh, India",
    website: "https://acadvault.edu",
    email: "admin@acadvault.edu",
    phone: "+91-522-1234567",
    accreditationBody: "NAAC",
    accreditationGrade: "A+",
  })

  // System preferences
  const [preferences, setPreferences] = useState({
    autoApproveAchievements: false,
    emailNotifications: true,
    maintenanceMode: false,
    maxFileUploadMB: 5,
    academicYearStart: "August",
    defaultStudentRole: "student",
  })

  // Departments
  const [departments, setDepartments] = useState<Department[]>([])
  const [newDeptName, setNewDeptName] = useState("")
  const [newDeptCode, setNewDeptCode] = useState("")
  const [newDeptHead, setNewDeptHead] = useState("")

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalStudents: 0, totalFaculty: 0, dbSize: "N/A" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, statsRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/admin/stats"),
        ])
        const deptJson = await deptRes.json()
        const statsJson = await statsRes.json()

        if (deptJson.data) setDepartments(deptJson.data)
        if (statsJson.data) {
          setStats({
            totalUsers: (statsJson.data.totalStudents || 0) + (statsJson.data.totalFaculty || 0),
            totalStudents: statsJson.data.totalStudents || 0,
            totalFaculty: statsJson.data.totalFaculty || 0,
            dbSize: "SQLite",
          })
        }
      } catch (e) {
        console.error("Failed to load settings data:", e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSaveInstitution = async () => {
    setSaving(true)
    // Save to localStorage for now (in a real app, this would be a settings API)
    localStorage.setItem("institutionSettings", JSON.stringify(institution))
    localStorage.setItem("systemPreferences", JSON.stringify(preferences))
    await new Promise(r => setTimeout(r, 500))
    toast.success("Settings saved successfully")
    setSaving(false)
  }

  const handleAddDepartment = async () => {
    if (!newDeptName || !newDeptCode) {
      toast.error("Department name and code are required")
      return
    }
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDeptName, code: newDeptCode, head: newDeptHead || null }),
      })
      const json = await res.json()
      if (res.ok && json.data) {
        setDepartments(prev => [...prev, json.data])
        setNewDeptName("")
        setNewDeptCode("")
        setNewDeptHead("")
        toast.success("Department added")
      } else {
        toast.error(json.error || "Failed to add department")
      }
    } catch {
      toast.error("Network error")
    }
  }

  const handleDeleteDepartment = async (id: number) => {
    if (!confirm("Delete this department?")) return
    try {
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDepartments(prev => prev.filter(d => d.id !== id))
        toast.success("Department deleted")
      } else {
        toast.error("Failed to delete department")
      }
    } catch {
      toast.error("Network error")
    }
  }

  // Load saved settings from localStorage on init
  useEffect(() => {
    const savedInst = localStorage.getItem("institutionSettings")
    const savedPrefs = localStorage.getItem("systemPreferences")
    if (savedInst) {
      try { setInstitution(JSON.parse(savedInst)) } catch {}
    }
    if (savedPrefs) {
      try { setPreferences(JSON.parse(savedPrefs)) } catch {}
    }
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

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground mt-2">Configure system settings, manage departments, and preferences</p>
          </div>

          <Tabs defaultValue="institution" className="space-y-6">
            <TabsList>
              <TabsTrigger value="institution">Institution</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            {/* Institution Tab */}
            <TabsContent value="institution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Institution Information
                  </CardTitle>
                  <CardDescription>Basic information about your institution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Institution Name</Label>
                      <Input value={institution.name} onChange={e => setInstitution({...institution, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution Code</Label>
                      <Input value={institution.code} onChange={e => setInstitution({...institution, code: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea value={institution.address} onChange={e => setInstitution({...institution, address: e.target.value})} rows={2} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input value={institution.website} onChange={e => setInstitution({...institution, website: e.target.value})} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input value={institution.email} onChange={e => setInstitution({...institution, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input value={institution.phone} onChange={e => setInstitution({...institution, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Accreditation Body</Label>
                      <Input value={institution.accreditationBody} onChange={e => setInstitution({...institution, accreditationBody: e.target.value})} />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveInstitution} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      {saving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Departments Tab */}
            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Department Management
                  </CardTitle>
                  <CardDescription>Add, view, and remove departments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Department */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Add New Department</h4>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input placeholder="Computer Science" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Code *</Label>
                        <Input placeholder="CSE" value={newDeptCode} onChange={e => setNewDeptCode(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Head</Label>
                        <Input placeholder="Dr. Smith" value={newDeptHead} onChange={e => setNewDeptHead(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={handleAddDepartment} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </div>

                  <Separator />

                  {/* Department List */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Existing Departments ({departments.length})</h4>
                    {departments.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No departments configured. Add one above.</p>
                    ) : (
                      departments.map(dept => (
                        <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{dept.code}</Badge>
                            <div>
                              <p className="font-medium text-sm">{dept.name}</p>
                              {dept.head && <p className="text-xs text-muted-foreground">Head: {dept.head}</p>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteDepartment(dept.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    System Preferences
                  </CardTitle>
                  <CardDescription>Configure application behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Auto-Approve Achievements</p>
                      <p className="text-xs text-muted-foreground">Skip faculty verification for all submissions</p>
                    </div>
                    <Switch checked={preferences.autoApproveAchievements} onCheckedChange={v => setPreferences({...preferences, autoApproveAchievements: v})} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Send email alerts for new submissions and verifications</p>
                    </div>
                    <Switch checked={preferences.emailNotifications} onCheckedChange={v => setPreferences({...preferences, emailNotifications: v})} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Maintenance Mode</p>
                      <p className="text-xs text-muted-foreground">Disable access for non-admin users</p>
                    </div>
                    <Switch checked={preferences.maintenanceMode} onCheckedChange={v => setPreferences({...preferences, maintenanceMode: v})} />
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Max File Upload Size (MB)</Label>
                      <Input type="number" value={preferences.maxFileUploadMB} onChange={e => setPreferences({...preferences, maxFileUploadMB: parseInt(e.target.value) || 5})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Academic Year Start Month</Label>
                      <Input value={preferences.academicYearStart} onChange={e => setPreferences({...preferences, academicYearStart: e.target.value})} />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveInstitution} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Students", value: stats.totalStudents, icon: Users },
                  { label: "Total Faculty", value: stats.totalFaculty, icon: Users },
                  { label: "Total Users", value: stats.totalUsers, icon: Shield },
                  { label: "Database", value: stats.dbSize, icon: Database },
                ].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="text-2xl font-bold mt-1">{item.value}</p>
                        </div>
                        <item.icon className="h-8 w-8 text-muted-foreground opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Application Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Framework</span>
                    <span className="font-medium">Next.js 15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Database</span>
                    <span className="font-medium">SQLite (Prisma ORM)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Environment</span>
                    <span className="font-medium">Development</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
