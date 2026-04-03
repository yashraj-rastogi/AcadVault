import { StudentSidebar } from "@/components/student-sidebar"
import { AcademicRecords } from "@/components/academic-records"

export default function StudentAcademicsPage() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <AcademicRecords />
      </main>
    </div>
  )
}
