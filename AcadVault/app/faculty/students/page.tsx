import { FacultySidebar } from "@/components/faculty-sidebar"
import { StudentList } from "@/components/student-list"

export default function StudentsPage() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto">
        <StudentList />
      </main>
    </div>
  )
}
