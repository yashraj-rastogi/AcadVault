import { Sidebar } from "@/components/sidebar"
import { AcademicRecords } from "@/components/academic-records"

export default function Academics() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AcademicRecords />
      </main>
    </div>
  )
}
