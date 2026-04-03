import { FacultySidebar } from "@/components/faculty-sidebar"
import { VerificationQueue } from "@/components/verification-queue"

export default function VerifyPage() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto">
        <VerificationQueue />
      </main>
    </div>
  )
}
