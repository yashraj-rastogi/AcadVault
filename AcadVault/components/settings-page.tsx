"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Bell, Shield, Download, Trash2, Camera, Save, Key, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileData, setProfileData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
    role: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await apiClient.getMe()
      if (response.data) {
        setProfileData({
          id: response.data.id,
          firstName: response.data.first_name || "",
          lastName: response.data.last_name || "",
          email: response.data.email || "",
          phone: (response.data as any).phone || "",
          address: "Lucknow, Uttar Pradesh", // Static for now as per original
          bio: (response.data as any).bio || "",
          avatar: (response.data as any).avatar || "",
          role: response.data.role || "student",
        })
      } else {
        toast.error("Failed to load profile data")
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = apiClient.getToken()
      const res = await fetch(`/api/users/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: profileData.phone,
          email: profileData.email,
          bio: profileData.bio,
          avatar: profileData.avatar,
        }),
      })

      if (res.ok) {
        toast.success("Profile updated successfully")
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to update profile")
      }
    } catch (err) {
      toast.error("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const token = apiClient.getToken()
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setProfileData(prev => ({ ...prev, avatar: data.url }))
        toast.success("Avatar uploaded! Remember to save changes.")
      } else {
        toast.error("Upload failed")
      }
    } catch (err) {
      toast.error("Network error during upload")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Settings</h1>
        <p className="mt-1" style={{ color: '#86948a' }}>Manage your account preferences and profile details</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md rounded-xl p-1" style={{ background: 'rgba(19, 27, 46, 0.6)' }}>
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-[#003824] data-[state=active]:text-[#4edea3]">Profile</TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-[#003824] data-[state=active]:text-[#4edea3]">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-fade-up">
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription style={{ color: '#86948a' }}>Update your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 border-2" style={{ borderColor: 'rgba(78, 222, 163, 0.3)' }}>
                  <AvatarImage src={profileData.avatar || "/placeholder.svg?height=96&width=96"} alt="Profile" className="object-cover" />
                  <AvatarFallback className="text-2xl bg-[#060e20] text-[#4edea3]">
                    {profileData.firstName?.[0] || "U"}
                    {profileData.lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                  <Button variant="outline" size="sm" className="gap-2 border-[#4edea3]/30 text-[#4edea3] hover:bg-[#4edea3]/10"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  <p className="text-xs mt-2" style={{ color: '#86948a' }}>JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator style={{ background: 'rgba(78, 222, 163, 0.1)' }} />

              {/* Personal Information */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" style={{ color: '#b9c7e0' }}>First Name (Read-only)</Label>
                  <Input id="firstName" value={profileData.firstName} disabled className="rounded-xl border-[#3c4a5e] bg-[#131b2e]/50 text-[#86948a]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" style={{ color: '#b9c7e0' }}>Last Name (Read-only)</Label>
                  <Input id="lastName" value={profileData.lastName} disabled className="rounded-xl border-[#3c4a5e] bg-[#131b2e]/50 text-[#86948a]" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#b9c7e0' }}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#86948a' }} />
                    <Input id="email" type="email" value={profileData.email} onChange={(e) => handleProfileUpdate("email", e.target.value)} 
                           className="pl-10 rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3] focus-visible:border-[#4edea3]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" style={{ color: '#b9c7e0' }}>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#86948a' }} />
                    <Input id="phone" value={profileData.phone} onChange={(e) => handleProfileUpdate("phone", e.target.value)} 
                           className="pl-10 rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3] focus-visible:border-[#4edea3]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" style={{ color: '#b9c7e0' }}>Bio</Label>
                <Textarea id="bio" value={profileData.bio} onChange={(e) => handleProfileUpdate("bio", e.target.value)} placeholder="Tell us about yourself..." rows={4}
                          className="rounded-xl border-[#3c4a5e] bg-[#060e20] focus-visible:ring-[#4edea3] focus-visible:border-[#4edea3] resize-none" />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="btn-glow gap-2 rounded-xl px-6" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 animate-fade-up">
           {/* Note: In a real app we'd wire up password reset APIs here, for now keeping it UI only */}
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                <Key className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription style={{ color: '#86948a' }}>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" style={{ color: '#b9c7e0' }}>Current Password</Label>
                <Input id="currentPassword" type="password" className="rounded-xl border-[#3c4a5e] bg-[#060e20]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" style={{ color: '#b9c7e0' }}>New Password</Label>
                <Input id="newPassword" type="password" className="rounded-xl border-[#3c4a5e] bg-[#060e20]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: '#b9c7e0' }}>Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="rounded-xl border-[#3c4a5e] bg-[#060e20]" />
              </div>
              <Button className="border border-[#4edea3]/50 text-[#4edea3] bg-transparent hover:bg-[#4edea3]/10 rounded-xl">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
