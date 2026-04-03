"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  HelpCircle,
  Send,
  MessageSquare,
  Clock,
  ChevronDown,
  Search,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { apiClient, type Ticket } from "@/lib/api"
import { toast } from "sonner"

const faqs = [
  {
    id: 1,
    category: "Achievements",
    question: "How do I submit an achievement for verification?",
    answer: "Navigate to the Achievements page, click 'Add Achievement', fill out the form with details and upload supporting documents. Your achievement will be sent to faculty for review."
  },
  {
    id: 2,
    category: "Achievements",
    question: "What types of achievements can I submit?",
    answer: "You can submit workshops, internships, competitions, certifications, volunteer work, research papers, and other academic or extracurricular activities."
  },
  {
    id: 3,
    category: "Portfolio",
    question: "How do I generate my portfolio?",
    answer: "Go to the Portfolio page, select your approved achievements, choose a template, and click 'Generate Portfolio'. You can download it as PDF or create a shareable link."
  },
  {
    id: 4,
    category: "Technical",
    question: "What file formats are supported for achievement documents?",
    answer: "We support PDF, JPG, and PNG files up to 5MB in size. Make sure your documents are clear and readable."
  },
  {
    id: 5,
    category: "Account",
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your registered email address."
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30"
    case "In Progress":
      return "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30"
    case "Resolved":
      return "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30"
    default:
      return "bg-[#131b2e] text-[#86948a] border-[#3c4a5e]"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-[#fc7c78]/10 text-[#fc7c78] border-[#fc7c78]/30"
    case "Medium":
      return "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30"
    case "Low":
      return "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30"
    default:
      return "bg-[#131b2e] text-[#86948a] border-[#3c4a5e]"
  }
}

export function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    category: "Technical",
  })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await apiClient.getTickets()
      if (response.data) {
        setTickets(response.data)
      }
      setLoading(false)
    }
    fetchTickets()
  }, [])

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await apiClient.createTicket(ticketForm)
      if (response.data) {
        toast.success("Support ticket submitted successfully!", { className: "bg-[#4edea3] text-[#0b1326] border-0" })
        setTicketForm({
          title: "",
          description: "",
          priority: "Medium" as "Low" | "Medium" | "High",
          category: "Technical",
        })
        const updatedResponse = await apiClient.getTickets()
        if (updatedResponse.data) {
          setTickets(updatedResponse.data)
        }
      } else {
        toast.error(response.error || "Failed to submit ticket", { className: "bg-[#fc7c78] text-[#0b1326] border-0" })
      }
    } catch (error) {
      toast.error("Failed to submit ticket", { className: "bg-[#fc7c78] text-[#0b1326] border-0" })
    }
    
    setIsSubmitting(false)
  }

  const categories = ["all", "Achievements", "Portfolio", "Academic", "Technical", "Account"]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: '#0b1326' }}>
          <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
        </div>
      )
  }

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-up" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-balance" style={{ letterSpacing: '-0.03em' }}>Support & Help</h1>
        <p className="text-[#86948a] mt-1 text-sm md:text-base">Find answers to common questions or get help from our support team</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="bg-[#131b2e] p-1 rounded-xl flex w-full max-w-xl">
          <TabsTrigger value="faq" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">FAQ</TabsTrigger>
          <TabsTrigger value="tickets" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">Support Tickets</TabsTrigger>
          <TabsTrigger value="contact" className="flex-1 rounded-lg data-[state=active]:bg-[#4edea3] data-[state=active]:text-[#0b1326] data-[state=active]:font-bold text-[#b9c7e0]">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6 animate-fade-up">
          {/* Search and Filter */}
          <Card className="glass-card border-0 rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#86948a]" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl focus-visible:ring-[#4edea3]"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-56 h-12 bg-[#131b2e]/50 border-[#3c4a5e] text-white rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-[#3c4a5e] text-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="glass-card border-0 rounded-2xl hover:border-[#4edea3]/30 transition-colors bg-[#060e20] hover:bg-[#131b2e]/40">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer p-5 md:p-6 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#4edea3]/10 p-2.5 rounded-lg group-hover:bg-[#4edea3]/20 transition-colors">
                            <HelpCircle className="h-5 w-5 text-[#4edea3]" />
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-base md:text-lg text-white font-semibold">{faq.question}</CardTitle>
                            <Badge variant="outline" className="mt-2 text-xs border-[#3c4a5e] text-[#86948a] bg-[#131b2e]">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-[#86948a] group-hover:text-[#4edea3] transition-colors" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-5 pb-5 md:px-6 md:pb-6 ml-[3.25rem]">
                      <div className="bg-[#131b2e]/50 border border-[#3c4a5e]/50 p-4 rounded-xl">
                         <p className="text-[#e2e8f0] leading-relaxed text-sm md:text-base">{faq.answer}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
            
            {filteredFAQs.length === 0 && (
               <div className="text-center py-12 text-[#86948a]">
                 <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30 text-[#4edea3]" />
                 <p>No FAQs found matching your criteria.</p>
               </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6 animate-fade-up">
          {/* Create New Ticket */}
          <Card className="glass-card border-0 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4edea3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-5">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <MessageSquare className="h-5 w-5 text-[#4edea3]" />
                Create Support Ticket
              </CardTitle>
              <CardDescription className="text-[#86948a]">Can't find an answer? Submit a support ticket and we'll help you out.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTicketSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                     <Label htmlFor="title" className="text-[#b9c7e0]">Subject <span className="text-[#fc7c78]">*</span></Label>
                    <Input
                      id="title"
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                      placeholder="Brief description of your issue"
                      required
                      className="bg-[#060e20] border-[#3c4a5e] text-white focus-visible:ring-[#4edea3] h-11"
                    />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="category" className="text-[#b9c7e0]">Category <span className="text-[#fc7c78]">*</span></Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                    >
                      <SelectTrigger className="bg-[#060e20] border-[#3c4a5e] text-white h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-[#3c4a5e] text-white">
                        <SelectItem value="achievements">Achievements</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="academic">Academic Records</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-[#b9c7e0]">Priority</Label>
                  <Select
                    value={ticketForm.priority}
                    onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value as "Low" | "Medium" | "High" })}
                  >
                    <SelectTrigger className="bg-[#060e20] border-[#3c4a5e] text-white h-11 w-full md:w-1/2">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-[#3c4a5e] text-white">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="description" className="text-[#b9c7e0]">Description <span className="text-[#fc7c78]">*</span></Label>
                   <Textarea
                    id="description"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    placeholder="Please provide detailed information about your issue..."
                    rows={5}
                    required
                    className="bg-[#060e20] border-[#3c4a5e] text-white focus-visible:ring-[#4edea3]"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto mt-2 btn-glow border border-[#4edea3]/50 text-[#0b1326] font-bold rounded-xl h-12 px-8" style={{ backgroundColor: '#4edea3' }}>
                   {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Tickets */}
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-5">
              <CardTitle className="text-xl text-white">Your Support Tickets</CardTitle>
              <CardDescription className="text-[#86948a]">Track the status of your submitted tickets</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-10 bg-[#060e20] rounded-xl border border-[#3c4a5e]/30">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30 text-[#4edea3]" />
                    <p className="text-[#86948a]">No support tickets found. Create one above if you need help!</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-[#3c4a5e]/50 rounded-xl bg-[#060e20] hover:border-[#4edea3]/30 transition-colors gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs font-bold text-[#86948a] bg-[#131b2e] px-2 py-0.5 rounded">#{ticket.id}</span>
                          <h4 className="font-semibold text-white text-lg truncate">{ticket.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#86948a]">
                          <div className="flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5" />
                            Created: {new Date(ticket.created_at).toLocaleDateString()}
                          </div>
                           <div className="flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5" />
                            Updated: {new Date(ticket.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <Badge variant="outline" className={`px-3 py-1 text-xs uppercase tracking-wider font-bold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </Badge>
                        <Badge variant="outline" className={`px-3 py-1 text-xs uppercase tracking-wider font-bold ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 animate-fade-up">
           <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card border-0 rounded-2xl">
              <CardHeader className="border-b border-[#3c4a5e]/50 pb-5">
                <CardTitle className="text-xl text-white">Contact Information</CardTitle>
                <CardDescription className="text-[#86948a]">Get in touch with our support team directly</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                 <div className="flex items-start gap-4 p-4 rounded-xl bg-[#060e20] border border-[#3c4a5e]/30">
                  <div className="p-3 bg-[#4edea3]/10 rounded-lg">
                    <Mail className="h-6 w-6 text-[#4edea3]" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Email Support</p>
                    <p className="text-[#b9c7e0]">support@acadvault.edu</p>
                  </div>
                </div>

                 <div className="flex items-start gap-4 p-4 rounded-xl bg-[#060e20] border border-[#3c4a5e]/30">
                  <div className="p-3 bg-[#4edea3]/10 rounded-lg">
                    <Phone className="h-6 w-6 text-[#4edea3]" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Phone Support</p>
                    <p className="text-[#b9c7e0]">+1 (555) 123-4567</p>
                    <p className="text-xs text-[#86948a] font-semibold uppercase tracking-wider mt-2">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>

                 <div className="flex items-start gap-4 p-4 rounded-xl bg-[#060e20] border border-[#3c4a5e]/30">
                  <div className="p-3 bg-[#4edea3]/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#4edea3]" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Office Location</p>
                    <p className="text-[#b9c7e0] leading-relaxed">
                      Student Services Building<br />
                      Room 201, University Campus
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="glass-card border-0 rounded-2xl flex flex-col">
              <CardHeader className="border-b border-[#3c4a5e]/50 pb-5">
                <CardTitle className="text-xl text-white">Additional Resources</CardTitle>
                <CardDescription className="text-[#86948a]">Helpful links and external documentation</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 bg-[#060e20] border-[#3c4a5e] text-[#b9c7e0] hover:text-[#4edea3] hover:border-[#4edea3]/50 hover:bg-[#4edea3]/5 h-12 rounded-xl">
                    <ExternalLink className="h-4 w-4" />
                    Student Handbook
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-[#060e20] border-[#3c4a5e] text-[#b9c7e0] hover:text-[#4edea3] hover:border-[#4edea3]/50 hover:bg-[#4edea3]/5 h-12 rounded-xl">
                    <ExternalLink className="h-4 w-4" />
                    Academic Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-[#060e20] border-[#3c4a5e] text-[#b9c7e0] hover:text-[#4edea3] hover:border-[#4edea3]/50 hover:bg-[#4edea3]/5 h-12 rounded-xl">
                     <ExternalLink className="h-4 w-4" />
                    University Policies
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 bg-[#060e20] border-[#3c4a5e] text-[#b9c7e0] hover:text-[#4edea3] hover:border-[#4edea3]/50 hover:bg-[#4edea3]/5 h-12 rounded-xl">
                     <ExternalLink className="h-4 w-4" />
                    Technical Requirements
                  </Button>
                </div>
                 
                 <div className="mt-6 pt-6 border-t border-[#3c4a5e]/50">
                   <h4 className="font-bold text-white mb-4">Urgent Assistance</h4>
                   <div className="bg-[#fc7c78]/10 border border-[#fc7c78]/30 rounded-xl p-4 flex gap-3">
                      <Phone className="h-5 w-5 text-[#fc7c78] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#fc7c78] mb-1">Emergency Helpline</p>
                        <p className="text-lg font-black text-white">911-ACAD-HELP</p>
                        <p className="text-xs text-[#fc7c78]/80 mt-1">Available 24/7 for critical system failures</p>
                      </div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
