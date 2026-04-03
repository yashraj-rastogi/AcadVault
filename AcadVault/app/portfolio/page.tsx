import { Sidebar } from "@/components/sidebar"
import { PortfolioGenerator } from "@/components/portfolio-generator"

export default function Portfolio() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <PortfolioGenerator />
      </main>
    </div>
  )
}
