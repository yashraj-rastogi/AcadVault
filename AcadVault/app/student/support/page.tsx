import { StudentSidebar } from "@/components/student-sidebar"
import { SupportPage } from "@/components/support-page"

export default function StudentSupportPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <SupportPage />
      </main>
    </div>
  )
}
