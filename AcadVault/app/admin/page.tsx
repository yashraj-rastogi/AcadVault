import { AdminDashboard } from "@/components/admin-dashboard"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AdminDashboard />
    </SidebarProvider>
  )
}
