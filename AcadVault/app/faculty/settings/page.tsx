import { FacultySidebar } from "@/components/faculty-sidebar"
import { SettingsPage } from "@/components/settings-page"

export default function FacultySettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto">
        <SettingsPage />
      </main>
    </div>
  )
}
