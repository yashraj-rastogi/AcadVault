import { StudentSidebar } from "@/components/student-sidebar"
import { AchievementsPage } from "@/components/achievements-page"

export default function StudentAchievementsPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <AchievementsPage />
      </main>
    </div>
  )
}
