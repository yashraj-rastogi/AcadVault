import { StudentSidebar } from "@/components/student-sidebar"
import { Dashboard } from "@/components/dashboard"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function StudentPage() {
  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
