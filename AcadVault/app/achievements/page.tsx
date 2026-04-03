import { Sidebar } from "@/components/sidebar"
import { AchievementsPage } from "@/components/achievements-page"

export default function Achievements() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AchievementsPage />
      </main>
    </div>
  )
}
