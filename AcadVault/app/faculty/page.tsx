import { FacultySidebar } from "@/components/faculty-sidebar"
import { FacultyDashboard } from "@/components/faculty-dashboard"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function FacultyPage() {
  return (
    <SidebarProvider>
      <FacultySidebar />
      <SidebarInset>
        <FacultyDashboard />
      </SidebarInset>
    </SidebarProvider>
  )
}
