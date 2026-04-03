"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    FileText,
    Download,
    Eye,
    Palette,
    CheckCircle,
    Calendar,
    Building,
    Award,
    Trophy,
    GraduationCap,
    Star,
    Loader2,
    Printer,
    FileDown,
} from "lucide-react"
import { apiClient, type Achievement } from "@/lib/api"
import { toast } from "sonner"

const portfolioTemplates = [
    {
        id: "tech",
        name: "Ethereal Tech",
        description: "Dark glowing aesthetic matching the scholar system",
        color: "#4edea3",
        bg: "#0b1326",
        cardBg: "#131b2e"
    },
    {
        id: "research",
        name: "Academic Deep",
        description: "Deep navy and white minimal contract",
        color: "#ffffff",
        bg: "#060e20",
        cardBg: "#0b1326"
    },
    {
        id: "creative",
        name: "Neon Creative",
        description: "Vibrant purple and cyan energy",
        color: "#d946ef",
        bg: "#1e1b4b",
        cardBg: "#312e81"
    },
]

const getTypeIcon = (type: string) => {
    switch (type) {
        case "Workshop": return <GraduationCap className="h-4 w-4" />
        case "Certification": return <Award className="h-4 w-4" />
        case "Competition": return <Trophy className="h-4 w-4" />
        case "Research": return <FileText className="h-4 w-4" />
        case "Project": return <Star className="h-4 w-4" />
        default: return <CheckCircle className="h-4 w-4" />
    }
}

function generatePortfolioHTML(user: any, achievements: Achievement[], template: typeof portfolioTemplates[0]) {
    const accent = template.color !== '#ffffff' ? template.color : '#2563eb'
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${user?.name || "Student"} — Portfolio</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222; background: #fff; padding: 48px; max-width: 900px; margin: 0 auto; }
  .header { border-bottom: 4px solid ${accent}; padding-bottom: 24px; margin-bottom: 32px; }
  .header h1 { font-size: 2.8em; font-weight: 800; color: ${accent}; letter-spacing: -0.03em; }
  .header .bio { font-size: 1.1em; color: #555; font-style: italic; margin-top: 6px; }
  .header .contact { margin-top: 12px; font-size: 0.95em; color: #777; }
  .section-title { font-size: 1.6em; font-weight: 700; color: ${accent}; margin-bottom: 20px; }
  .achievement { border-left: 4px solid ${accent}; padding: 12px 0 12px 24px; margin-bottom: 24px; }
  .achievement h3 { font-size: 1.3em; font-weight: 700; color: #111; }
  .achievement .meta { font-size: 0.95em; color: #555; margin: 4px 0 8px; }
  .achievement .desc { color: #444; font-size: 0.95em; line-height: 1.5; }
  .skills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .skill { background: #f1f5f9; color: #334155; padding: 4px 12px; border-radius: 999px; font-size: 0.8em; font-weight: 600; }
  .summary { background: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px; }
  .summary h2 { color: ${accent}; font-size: 1.2em; margin-bottom: 12px; }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .summary-item { text-align: center; }
  .summary-item .num { font-size: 2em; font-weight: 800; color: ${accent}; }
  .summary-item .label { font-size: 0.85em; color: #666; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.8em; color: #999; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
  <div class="header">
    <h1>${user?.name || "Student Portfolio"}</h1>
    <p class="bio">${user?.bio || ""}</p>
    <p class="contact">${user?.email || ""}${user?.phone ? " • " + user.phone : ""}</p>
  </div>

  <div class="summary">
    <h2>Portfolio Summary</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="num">${achievements.length}</div>
        <div class="label">Achievements</div>
      </div>
      <div class="summary-item">
        <div class="num">${[...new Set(achievements.map(a => a.type))].length}</div>
        <div class="label">Categories</div>
      </div>
      <div class="summary-item">
        <div class="num">${[...new Set(achievements.flatMap(a => a.skills || []))].length}</div>
        <div class="label">Skills</div>
      </div>
    </div>
  </div>

  <h2 class="section-title">Verified Achievements</h2>
  ${achievements.map(a => `
  <div class="achievement">
    <h3>${a.title}</h3>
    <p class="meta">${a.organization} • ${a.type} • ${a.date}</p>
    <p class="desc">${a.description || ""}</p>
    ${(a.skills && a.skills.length > 0) ? `<div class="skills">${a.skills.map(s => `<span class="skill">${s}</span>`).join("")}</div>` : ""}
  </div>`).join("")}

  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()} via AcadVault • Verified Achievements Only</p>
  </div>
</body>
</html>`
}

function downloadAchievementsCSV(achievements: Achievement[], userName: string) {
    let csv = "Student Achievements Report\n"
    csv += `Student,${userName}\n`
    csv += `Generated,${new Date().toISOString()}\n\n`
    csv += "ID,Title,Type,Organization,Date,Status,Description,Skills\n"
    achievements.forEach(a => {
        csv += `${a.id},"${a.title}","${a.type}","${a.organization}","${a.date}","${a.status}","${(a.description || "").replace(/"/g, '""')}","${(a.skills || []).join("; ")}"\n`
    })
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `achievements_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

export function PortfolioGenerator() {
    const [selectedTemplate, setSelectedTemplate] = useState("tech")
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([])
    const [selectedAchievements, setSelectedAchievements] = useState<number[]>([])
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isPrintMode, setIsPrintMode] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const [meRes, achRes] = await Promise.all([
                apiClient.getMe(),
                apiClient.getAchievements()
            ])
            
            if (meRes.data) {
                setUser({
                    name: `${meRes.data.first_name || ''} ${meRes.data.last_name || ''}`.trim() || meRes.data.username,
                    email: meRes.data.email,
                    phone: (meRes.data as any).phone || "",
                    bio: (meRes.data as any).bio || "Dedicated student building skills for the future.",
                    avatar: (meRes.data as any).avatar || ""
                })
            }
            if (achRes.data) {
                setAllAchievements(achRes.data)
                const approved = achRes.data.filter(a => a.status === 'Approved')
                setAchievements(approved)
                setSelectedAchievements(approved.slice(0, 5).map(a => a.id))
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleAchievementToggle = (achievementId: number) => {
        setSelectedAchievements((prev) =>
            prev.includes(achievementId) ? prev.filter((id) => id !== achievementId) : [...prev, achievementId],
        )
    }

    const triggerPrint = () => {
        if (selectedAchievements.length === 0) {
            toast.error("Please select at least one achievement to include in your portfolio.")
            return
        }
        setIsPrintMode(true)
        setTimeout(() => {
            window.print()
            setIsPrintMode(false)
        }, 300)
    }

    const handleDownloadPortfolio = () => {
        if (selectedAchievements.length === 0) {
            toast.error("Please select at least one achievement to include.")
            return
        }
        const itemsToPrint = achievements.filter(a => selectedAchievements.includes(a.id))
        const templateData = portfolioTemplates.find(t => t.id === selectedTemplate)!
        const html = generatePortfolioHTML(user, itemsToPrint, templateData)
        
        const blob = new Blob([html], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${(user?.name || "portfolio").replace(/\s+/g, '_')}_portfolio.html`
        link.click()
        URL.revokeObjectURL(url)
        toast.success("Portfolio downloaded! Open the HTML file in your browser and use Ctrl+P to save as PDF.")
    }

    const handleDownloadCSV = () => {
        downloadAchievementsCSV(allAchievements, user?.name || "Student")
        toast.success("Achievements CSV downloaded!")
    }

    if (loading) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#4edea3]" />
            </div>
        )
    }

    const templateData = portfolioTemplates.find(t => t.id === selectedTemplate)!;
    const itemsToPrint = achievements.filter(a => selectedAchievements.includes(a.id))

    // --- PRINTABLE VIEW ---
    if (isPrintMode) {
        return (
            <div className="fixed inset-0 z-[100] bg-white text-black overflow-y-auto" style={{ backgroundColor: templateData.bg, color: templateData.color === '#ffffff' ? '#e2e8f0' : templateData.color }}>
                 <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body * { visibility: hidden; }
                        #printable-portfolio, #printable-portfolio * { visibility: visible; }
                        #printable-portfolio { position: absolute; left: 0; top: 0; width: 100%; color: black !important; background: white !important; }
                        .no-print-bg { background: white !important; color: black !important; border-color: #ddd !important; }
                    }
                 `}} />
                 
                 <div id="printable-portfolio" className="max-w-4xl mx-auto p-12 space-y-8 no-print-bg bg-white text-black min-h-screen">
                    <div className="border-b-4 pb-6" style={{ borderColor: templateData.color !== '#ffffff' ? templateData.color : '#333' }}>
                        <h1 className="text-5xl font-bold tracking-tight mb-2" style={{ color: templateData.color !== '#ffffff' ? templateData.color : '#111'}}>{user?.name}</h1>
                        <p className="text-xl text-gray-700 italic">{user?.bio}</p>
                        <div className="mt-4 flex gap-6 text-sm md:text-base text-gray-600">
                            <span>{user?.email}</span>
                            {user?.phone && <span>• {user?.phone}</span>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6" style={{ color: templateData.color !== '#ffffff' ? templateData.color : '#111'}}>Verified Achievements</h2>
                        <div className="space-y-8">
                            {itemsToPrint.map((ach) => (
                                <div key={ach.id} className="border-l-4 pl-6 py-2 no-print-bg border-gray-200" style={{ borderLeftColor: templateData.color !== '#ffffff' ? templateData.color : '#111'}}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-2xl font-bold text-gray-900">{ach.title}</h3>
                                        <span className="text-gray-500 font-medium">{new Date(ach.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-lg text-gray-700 font-medium mb-2">{ach.organization} • {ach.type}</p>
                                    <p className="text-gray-600 mb-3">{ach.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {ach.skills?.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        )
    }

    // --- NORMAL GENERATOR UI ---
    return (
        <div className="p-6 space-y-6" style={{ background: '#0b1326', minHeight: '100vh', color: '#dae2fd' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-balance" style={{ color: '#dae2fd', letterSpacing: '-0.03em' }}>Portfolio Generator</h1>
                    <p className="mt-1" style={{ color: '#86948a' }}>Create a downloadable professional portfolio from your approved achievements</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" onClick={handleDownloadCSV} className="gap-2 rounded-xl border-[#4edea3]/30 text-[#4edea3] hover:bg-[#4edea3]/10 bg-transparent">
                        <FileDown className="h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPortfolio} className="gap-2 rounded-xl border-[#4edea3]/30 text-[#4edea3] hover:bg-[#4edea3]/10 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download HTML
                    </Button>
                    <Button onClick={triggerPrint} className="btn-glow gap-2 rounded-xl h-10 px-5">
                        <Printer className="h-4 w-4" />
                        Print PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                            <Palette className="h-5 w-5" /> Theme
                        </CardTitle>
                        <CardDescription style={{ color: '#86948a' }}>Select a color theme for your generated document</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="space-y-4">
                            {portfolioTemplates.map((template) => (
                                <Label key={template.id} htmlFor={template.id}
                                    className={`cursor-pointer flex items-center justify-between border-2 rounded-xl p-4 transition-all ${selectedTemplate === template.id ? 'border-[#4edea3] bg-[#4edea3]/10' : 'border-[#3c4a5e] hover:border-[#4edea3]/50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value={template.id} id={template.id} />
                                        <div>
                                            <p className="font-semibold text-white">{template.name}</p>
                                            <p className="text-xs text-[#86948a]">{template.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full shadow-lg" style={{ backgroundColor: template.color }}></div>
                                </Label>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card className="glass-card border-0 rounded-2xl animate-fade-up-delay-2 h-[500px] flex flex-col">
                    <CardHeader className="shrink-0">
                        <CardTitle className="flex items-center gap-2 text-xl" style={{ color: '#4edea3' }}>
                            <CheckCircle className="h-5 w-5" />
                            Select Approved Content
                        </CardTitle>
                        <CardDescription style={{ color: '#86948a' }}>Only "Approved" achievements can be generated into an official portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                         {achievements.length === 0 ? (
                             <div className="text-center py-10 text-[#86948a]">No approved achievements found.</div>
                         ) : (
                            achievements.map((achievement) => (
                                <div key={achievement.id} className="flex items-start space-x-3 p-4 rounded-xl border border-[#3c4a5e] bg-[#131b2e]/50 hover:border-[#4edea3]/50 transition-colors">
                                    <Checkbox
                                        id={`achievement-${achievement.id}`}
                                        checked={selectedAchievements.includes(achievement.id)}
                                        onCheckedChange={() => handleAchievementToggle(achievement.id)}
                                        className="mt-1"
                                    />
                                    <Label htmlFor={`achievement-${achievement.id}`} className="cursor-pointer grid gap-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(achievement.type)}
                                            <h4 className="font-medium text-white">{achievement.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[#86948a]">
                                            <div className="flex items-center gap-1"><Building className="h-3 w-3" />{achievement.organization}</div>
                                            <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(achievement.date).toLocaleDateString()}</div>
                                        </div>
                                        <p className="text-xs text-[#b9c7e0] line-clamp-2">{achievement.description}</p>
                                    </Label>
                                </div>
                            ))
                         )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Download Info */}
            <div className="rounded-xl border border-[#3c4a5e] p-6 text-center animate-fade-up-delay-3" style={{ background: 'linear-gradient(135deg, rgba(78, 222, 163, 0.05) 0%, rgba(6, 14, 32, 0) 100%)' }}>
                <Download className="h-8 w-8 text-[#4edea3] mx-auto mb-3 opacity-80" />
                <h3 className="text-lg font-semibold text-white mb-2">Multiple Download Options</h3>
                <p className="text-sm text-[#86948a] max-w-2xl mx-auto">
                    <strong>Download HTML</strong> — Get a self-contained portfolio file. Open it in your browser and use Ctrl+P → "Save as PDF" for a professional PDF.
                    <br />
                    <strong>Print PDF</strong> — Opens print dialog directly for immediate PDF generation.
                    <br />
                    <strong>Export CSV</strong> — Download all your achievements as a spreadsheet-ready CSV file.
                </p>
            </div>
        </div>
    )
}