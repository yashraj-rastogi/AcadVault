"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const response = await apiClient.login({ username, password })

    if (response.data?.token) {
      toast.success("Login successful!")
      const role = response.data.user?.role || "student"
      switch (role) {
        case "faculty":
          router.push("/faculty")
          break
        case "admin":
          router.push("/admin")
          break
        default:
          router.push("/student")
      }
    } else {
      toast.error(response.error || "Login failed")
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.register({
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      })

      if (response.data && response.data.message) {
        toast.success("Account created successfully! Please log in.")
        setSignupData({
          username: "",
          email: "",
          password: "",
          firstName: "",
          lastName: "",
        })
      } else if (response.error) {
        toast.error(response.error)
      } else {
        toast.error("Registration failed - please try again")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed - network error")
    }

    setIsLoading(false)
  }

  return (
    <div className="glass-card rounded-2xl w-full max-w-md animate-scale-in" style={{ border: '1px solid rgba(78, 222, 163, 0.08)' }}>
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <Image src="/logo.png" alt="AcadVault Logo" width={44} height={44} className="rounded-xl shadow-[0_0_15px_rgba(78,222,163,0.3)] animate-glow-pulse" />
            <h1 className="text-2xl font-bold" style={{ color: '#dae2fd' }}>AcadVault</h1>
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: '#dae2fd' }}>Welcome Back</h2>
          <p className="text-sm" style={{ color: '#86948a' }}>Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 mb-6" style={{ background: 'rgba(19, 27, 46, 0.6)' }}>
            <TabsTrigger value="login" className="rounded-lg text-sm font-medium data-[state=active]:text-[#003824]"
              style={{ transition: 'all 0.3s ease' }}>
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg text-sm font-medium data-[state=active]:text-[#003824]"
              style={{ transition: 'all 0.3s ease' }}>
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="rounded-xl h-11 text-sm transition-all duration-300"
                  style={{
                    background: '#060e20',
                    border: '1px solid rgba(60, 74, 66, 0.2)',
                    color: '#dae2fd',
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#b9c7e0' }}>Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl h-11 text-sm pr-10 transition-all duration-300"
                    style={{
                      background: '#060e20',
                      border: '1px solid rgba(60, 74, 66, 0.2)',
                      color: '#dae2fd',
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#86948a' }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" 
                      className="btn-glow w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                      disabled={isLoading || !username || !password}
                      style={{ opacity: (isLoading || !username || !password) ? 0.5 : 1 }}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 rounded-full animate-spin" 
                         style={{ borderColor: 'rgba(0,56,36,0.3)', borderTopColor: '#003824' }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm" style={{ color: '#b9c7e0' }}>First Name</Label>
                  <Input id="firstName" placeholder="John" value={signupData.firstName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="rounded-xl h-11 text-sm"
                    style={{ background: '#060e20', border: '1px solid rgba(60, 74, 66, 0.2)', color: '#dae2fd' }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm" style={{ color: '#b9c7e0' }}>Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={signupData.lastName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="rounded-xl h-11 text-sm"
                    style={{ background: '#060e20', border: '1px solid rgba(60, 74, 66, 0.2)', color: '#dae2fd' }} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupUsername" className="text-sm" style={{ color: '#b9c7e0' }}>Username</Label>
                <Input id="signupUsername" placeholder="johndoe" value={signupData.username}
                  onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))} required
                  className="rounded-xl h-11 text-sm"
                  style={{ background: '#060e20', border: '1px solid rgba(60, 74, 66, 0.2)', color: '#dae2fd' }} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-sm" style={{ color: '#b9c7e0' }}>Email</Label>
                <Input id="signupEmail" type="email" placeholder="john.doe@university.edu" value={signupData.email}
                  onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))} required
                  className="rounded-xl h-11 text-sm"
                  style={{ background: '#060e20', border: '1px solid rgba(60, 74, 66, 0.2)', color: '#dae2fd' }} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="text-sm" style={{ color: '#b9c7e0' }}>Password</Label>
                <div className="relative">
                  <Input id="signupPassword" type={showPassword ? "text" : "password"} placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))} required
                    className="rounded-xl h-11 text-sm pr-10"
                    style={{ background: '#060e20', border: '1px solid rgba(60, 74, 66, 0.2)', color: '#dae2fd' }} />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#86948a' }}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit"
                      className="btn-glow w-full py-3 rounded-xl font-semibold text-sm"
                      disabled={isLoading || !signupData.username || !signupData.email || !signupData.password}
                      style={{ opacity: (isLoading || !signupData.username || !signupData.email || !signupData.password) ? 0.5 : 1 }}>
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link href="/" className="link-emerald text-sm" style={{ color: '#86948a' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
