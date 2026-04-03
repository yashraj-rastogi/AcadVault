import { FacultySidebar } from "@/components/faculty-sidebar"
import { SupportPage } from "@/components/support-page"

export default function FacultySupportPage() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto">
        <SupportPage />
      </main>
    </div>
  )
}
