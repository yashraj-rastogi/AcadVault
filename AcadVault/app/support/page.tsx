import { Sidebar } from "@/components/sidebar"
import { SupportPage } from "@/components/support-page"

export default function Support() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <SupportPage />
      </main>
    </div>
  )
}
