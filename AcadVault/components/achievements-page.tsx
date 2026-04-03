"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Calendar, Building, Tag, Upload, CheckCircle, Clock, XCircle, Eye, Trash2, Edit, Loader2 } from "lucide-react"
import { apiClient, type Achievement } from "@/lib/api"
import { toast } from "sonner"

const activityTypes = ["Workshop", "Internship", "Volunteer Work", "Certification", "Competition", "Project", "Research Paper", "Hackathon"]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved": return <CheckCircle className="h-4 w-4 text-[#4edea3]" />
    case "Pending": return <Clock className="h-4 w-4 text-[#ffb300]" />
    case "Rejected": return <XCircle className="h-4 w-4 text-[#fc7c78]" />
    default: return <Clock className="h-4 w-4 text-[#86948a]" />
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

export function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAchievements = async () => {
    setLoading(true)
    const response = await apiClient.getAchievements()
    if (response.data) {
      setAchievements(response.data)
    } else {
      toast.error("Failed to load achievements")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pending achievement?")) return
    
    try {
      const res = await apiClient.deleteAchievement(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Achievement deleted")
        fetchAchievements()
      }
    } catch (e) {
      toast.error("Network error")
    }
  }

  const openEditModal = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setIsEditModalOpen(true)
  }

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || achievement.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || achievement.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading && achievements.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Achievements</h1>
          <p className="mt-1 text-sm md:text-base" style={{ color: '#86948a' }}>Manage your academic and extracurricular achievements</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="btn-glow gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-[#4edea3]/20" style={{ background: '#0b1326', color: '#dae2fd' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#4edea3' }}>Add New Achievement</DialogTitle>
              <DialogDescription style={{ color: '#86948a' }}>Submit an achievement with proof for faculty verification.</DialogDescription>
            </DialogHeader>
            <AchievementForm 
              onClose={() => setIsAddModalOpen(false)} 
              onSuccess={() => { setIsAddModalOpen(false); fetchAchievements() }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-[#4edea3]/20" style={{ background: '#0b1326', color: '#dae2fd' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#4edea3' }}>Edit Pending Achievement</DialogTitle>
            <DialogDescription style={{ color: '#86948a' }}>Update your submission before faculty review.</DialogDescription>
          </DialogHeader>
          {editingAchievement && (
            <AchievementForm 
              initialData={editingAchievement}
              onClose={() => setIsEditModalOpen(false)} 
              onSuccess={() => { setIsEditModalOpen(false); fetchAchievements() }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 animate-fade-up-delay-1">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#86948a' }} />
              <Input placeholder="Search achievements..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10 rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3]" />
            </div>
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl border-[#3c4a5e] bg-[#060e20]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-[#3c4a5e]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] rounded-xl border-[#3c4a5e] bg-[#060e20]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="glass-card border-[#3c4a5e]">
                <SelectItem value="all">All Types</SelectItem>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4 animate-fade-up-delay-2">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12" style={{ color: '#86948a' }}>No achievements found matching that criteria.</div>
        ) : (
          filteredAchievements.map((achievement) => (
            <div key={achievement.id} className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(achievement.status)}
                    <h3 className="text-lg font-semibold" style={{ color: '#dae2fd' }}>{achievement.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: '#86948a' }}>
                    <div className="flex items-center gap-1"><Building className="h-4 w-4 text-[#4edea3]/70" /> {achievement.organization}</div>
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4 text-[#4edea3]/70" /> {new Date(achievement.date).toLocaleDateString()}</div>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#b9c7e0' }}>{achievement.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4" style={{ color: '#86948a' }} />
                    <div className="flex gap-1.5 flex-wrap">
                      {achievement.skills && achievement.skills.map((skill) => (
                        <span key={skill} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(60, 74, 94, 0.4)', color: '#b9c7e0' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {achievement.feedback && (
                    <div className="rounded-xl p-4 mt-2" style={{ background: 'rgba(252, 124, 120, 0.1)', border: '1px solid rgba(252, 124, 120, 0.2)' }}>
                      <p className="text-sm" style={{ color: '#fc7c78' }}><strong>Faculty Feedback:</strong> {achievement.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getStatusBadgeClass(achievement.status)}`}>
                    {achievement.status}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#86948a' }}>{achievement.type}</span>
                  
                  <div className="flex gap-2 mt-2">
                    {/* View Proof Button */}
                    {achievement.proofUrl && (
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent border-[#4edea3]/30 text-[#4edea3] hover:bg-[#4edea3]/10" 
                              onClick={() => window.open(achievement.proofUrl as string, '_blank')}>
                        <Eye className="h-3 w-3" /> Proof
                      </Button>
                    )}
                    
                    {/* Edit & Delete for Pending only */}
                    {achievement.status === "Pending" && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent border-[#b9c7e0]/30 text-[#b9c7e0] hover:bg-[#b9c7e0]/10"
                                onClick={() => openEditModal(achievement)}>
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent border-[#fc7c78]/30 text-[#fc7c78] hover:bg-[#fc7c78]/10"
                                onClick={() => handleDelete(achievement.id)}>
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function AchievementForm({ initialData, onClose, onSuccess }: { initialData?: Achievement, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "",
    organization: initialData?.organization || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    skills: initialData?.skills ? initialData.skills.join(", ") : "",
    proofUrl: initialData?.proofUrl || "",
  })
  
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let finalProofUrl = formData.proofUrl

      // Upload file first if selected
      if (file) {
        const uploadData = new FormData()
        uploadData.append("file", file)
        const token = apiClient.getToken()
        
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: uploadData,
        })
        
        if (!res.ok) throw new Error("File upload failed")
        const data = await res.json()
        finalProofUrl = data.url
      }

      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean)
      const payload = {
        title: formData.title,
        type: formData.type,
        organization: formData.organization,
        date: formData.date,
        description: formData.description,
        skills: skillsArray,
        proofUrl: finalProofUrl
      }
      
      let response;
      if (initialData) {
        response = await apiClient.updateAchievement(initialData.id, payload)
      } else {
        response = await apiClient.createAchievement(payload)
      }
      
      if (response.data) {
        toast.success(initialData ? "Achievement updated!" : "Achievement submitted!")
        onSuccess()
      } else {
        toast.error(response.error || "Failed to submit achievement")
      }
    } catch (error) {
      toast.error("An error occurred during submission")
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" style={{ color: '#b9c7e0' }}>Achievement Title *</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                 className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3]" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type" style={{ color: '#b9c7e0' }}>Activity Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="rounded-xl border-[#3c4a5e] bg-[#060e20]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="glass-card border-[#3c4a5e]">
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="organization" style={{ color: '#b9c7e0' }}>Organization *</Label>
          <Input id="organization" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                 className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3]" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" style={{ color: '#b9c7e0' }}>Date of Completion *</Label>
          <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                 className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3] custom-calendar-icon" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" style={{ color: '#b9c7e0' }}>Description *</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3] min-h-[100px]" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" style={{ color: '#b9c7e0' }}>Skills & Tags</Label>
        <Input id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="React, Leadership (comma separated)"
               className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3]" />
      </div>

      <div className="space-y-2">
        <Label style={{ color: '#b9c7e0' }}>Proof of Achievement (File)</Label>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        
        <div className="rounded-xl border-2 border-dashed border-[#3c4a5e] bg-[#060e20]/50 p-6 text-center cursor-pointer hover:bg-[#131b2e] transition-colors"
             onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-8 w-8 text-[#4edea3] mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: '#dae2fd' }}>{file ? file.name : "Click to upload certificate or proof"}</p>
          <p className="text-xs mt-1" style={{ color: '#86948a' }}>Supports PDF, JPG, PNG up to 5MB</p>
        </div>
        {formData.proofUrl && !file && (
          <p className="text-xs text-[#b9c7e0] mt-2">Current file: <a href={formData.proofUrl} target="_blank" className="text-[#4edea3] underline">View Proof</a></p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl bg-transparent border-[#3c4a5e] hover:bg-[#131b2e]">Cancel</Button>
        <Button type="submit" className="btn-glow rounded-xl gap-2" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Saving..." : initialData ? "Update Achievement" : "Submit for Review"}
        </Button>
      </div>
    </form>
  )
}
