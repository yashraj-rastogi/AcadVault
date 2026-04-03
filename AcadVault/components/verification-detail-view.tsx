"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, CheckCircle, XCircle, FileText, ImageIcon, Eye } from "lucide-react"
import type { SubmissionEntry, Evidence } from "./verification-queue"

interface VerificationDetailViewProps {
  submission: SubmissionEntry
  onBack: () => void
  onApprove: (id: number) => void
  onReject: (id: number, comment: string) => void
}

export function VerificationDetailView({ submission, onBack, onApprove, onReject }: VerificationDetailViewProps) {
  const [rejectComment, setRejectComment] = useState("")
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReject = () => {
    if (rejectComment.trim()) {
      onReject(submission.id, rejectComment)
      setShowRejectDialog(false)
      setRejectComment("")
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-8">
        <Button variant="ghost" className="bg-[#131b2e] hover:bg-[#3c4a5e] text-white rounded-full px-6" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Queue
        </Button>
        <div className="flex-1 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Achievement Review</h1>
          <p className="text-[#86948a]">Review submission details and attached evidence</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student & Achievement Info */}
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    {submission.studentName}
                    {submission.rollNo && <Badge variant="outline" className="text-xs border-[#3c4a5e] text-[#86948a]">{submission.rollNo}</Badge>}
                  </CardTitle>
                  <CardDescription style={{ color: '#86948a' }} className="mt-1">Submitted on {formatDate(submission.submittedAt)}</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30 px-4 py-1">
                  {submission.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-[#4edea3] mb-4">{submission.achievement}</h3>
              <div className="bg-[#131b2e]/50 border border-[#3c4a5e]/50 rounded-xl p-5">
                 <p className="text-[#e2e8f0] text-lg leading-relaxed whitespace-pre-wrap">{submission.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Files */}
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
              <CardTitle className="text-xl text-white">Attached Evidence</CardTitle>
              <CardDescription style={{ color: '#86948a' }}>Official documents provided by the student</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {submission.evidence.length === 0 ? (
                <div className="bg-[#131b2e]/50 border border-[#3c4a5e]/50 rounded-xl p-8 text-center text-[#86948a]">
                   <FileText className="h-10 w-10 mx-auto mb-3 opacity-50 text-[#fc7c78]" />
                   <p>No evidence files attached to this submission.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {submission.evidence.map((evidence, index) => (
                    <div key={index} className="border border-[#3c4a5e] bg-[#060e20] rounded-xl p-4 hover:border-[#4edea3]/50 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        {evidence.type === "pdf" ? (
                          <div className="p-3 bg-[#fc7c78]/10 rounded-lg">
                             <FileText className="h-6 w-6 text-[#fc7c78]" />
                          </div>
                        ) : (
                          <div className="p-3 bg-[#4edea3]/10 rounded-lg">
                             <ImageIcon className="h-6 w-6 text-[#4edea3]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-white truncate">{evidence.name}</p>
                          <p className="text-xs text-[#86948a] uppercase tracking-wider font-bold mt-1">{evidence.type} File</p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-[#131b2e] hover:bg-[#3c4a5e] text-white border-0"
                        onClick={() => setSelectedEvidence(evidence)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Document
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
              <CardTitle className="text-xl text-white">Verification Decision</CardTitle>
              <CardDescription style={{ color: '#86948a' }}>Approve or reject this request</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button className="w-full btn-glow border border-[#4edea3]/50 text-[#0b1326] font-bold rounded-xl h-12" style={{ backgroundColor: '#4edea3' }} onClick={() => onApprove(submission.id)}>
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve & Mark Verified
              </Button>

              <Button variant="outline" className="w-full bg-transparent border-[#fc7c78]/50 text-[#fc7c78] hover:bg-[#fc7c78]/10 rounded-xl h-12 font-bold" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="h-5 w-5 mr-2" />
                Reject Submission
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="glass-card border-0 rounded-2xl">
             <CardHeader className="border-b border-[#3c4a5e]/50 pb-4">
              <CardTitle className="text-lg text-white">Quick Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm font-medium">
              <div className="flex flex-col gap-1 pb-3 border-b border-[#3c4a5e]/30">
                <span className="text-[#86948a] text-xs uppercase tracking-wider">Student Name</span>
                <span className="text-white text-base">{submission.studentName}</span>
              </div>
              <div className="flex flex-col gap-1 pb-3 border-b border-[#3c4a5e]/30">
                <span className="text-[#86948a] text-xs uppercase tracking-wider">Category</span>
                <span className="text-[#b9c7e0] text-base">{submission.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#86948a] text-xs uppercase tracking-wider">Current Status</span>
                <span className="text-[#d946ef] text-base capitalize">{submission.status}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

       {/* Reject Dialog */}
       <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="glass-card border-[#3c4a5e] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#fc7c78] flex items-center gap-2">
               <XCircle className="h-5 w-5" /> Reject Achievement
            </DialogTitle>
            <DialogDescription className="text-[#86948a] mt-2">
              Please provide feedback to explain why the proof is insufficient or rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g. Document resolution is too low, please re-upload..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="bg-[#060e20] border-[#3c4a5e] text-white focus-visible:ring-[#fc7c78] min-h-[120px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="bg-transparent border-[#3c4a5e] text-white hover:bg-[#3c4a5e]/50">
              Cancel
            </Button>
            <Button className="bg-[#fc7c78] text-[#0b1326] font-bold hover:bg-[#fc7c78]/80" onClick={handleReject} disabled={!rejectComment.trim()}>
              Reject with Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Viewer Dialog */}
      {selectedEvidence && (
        <Dialog open={!!selectedEvidence} onOpenChange={() => setSelectedEvidence(null)}>
          <DialogContent className="max-w-5xl h-[90vh] flex flex-col glass-card border-[#3c4a5e] text-white overflow-hidden p-0">
             <div className="flex items-center justify-between p-4 border-b border-[#3c4a5e] bg-[#060e20]">
                <DialogTitle className="flex items-center gap-2 text-lg text-[#4edea3]">
                  {selectedEvidence.type === "pdf" ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                  {selectedEvidence.name}
                </DialogTitle>
             </div>
            <div className="flex-1 bg-black/50 overflow-auto relative flex items-center justify-center p-4">
              {selectedEvidence.type === "image" ? (
                // Using standard img tag without Next/Image for simple external loaded urls
                <img
                  src={selectedEvidence.url}
                  alt={selectedEvidence.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                 <iframe 
                   src={selectedEvidence.url} 
                   className="w-full h-full rounded-lg border-0 bg-white"
                   title="PDF Viewer"
                 />
              )}
            </div>
             <div className="p-4 border-t border-[#3c4a5e] bg-[#060e20] flex justify-end">
                <Button variant="outline" onClick={() => window.open(selectedEvidence.url, '_blank')} className="bg-transparent border-[#4edea3]/50 text-[#4edea3] hover:bg-[#4edea3]/10">
                   Open in New Tab
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
