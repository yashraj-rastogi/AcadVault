import { StudentSidebar } from "@/components/student-sidebar"
import { PortfolioGenerator } from "@/components/portfolio-generator"

export default function StudentPortfolioPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <PortfolioGenerator />
      </main>
    </div>
  )
}
