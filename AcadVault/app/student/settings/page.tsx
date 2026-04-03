import { StudentSidebar } from "@/components/student-sidebar"
import { SettingsPage } from "@/components/settings-page"

export default function StudentSettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <SettingsPage />
      </main>
    </div>
  )
}
