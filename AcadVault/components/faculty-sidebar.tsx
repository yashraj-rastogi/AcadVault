import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, CheckCircle, Users, Settings, HelpCircle, ArrowLeft, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Dashboard", href: "/faculty", icon: LayoutDashboard, current: true },
  { name: "Verify Achievements", href: "/faculty/verify", icon: CheckCircle, current: false },
  { name: "Student Management", href: "/faculty/students", icon: Users, current: false },
  { name: "Settings", href: "/faculty/settings", icon: Settings, current: false },
  { name: "Support", href: "/faculty/support", icon: HelpCircle, current: false },
]

export function FacultySidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AcadVault Logo" width={32} height={32} className="rounded-lg shadow-[0_0_10px_rgba(78,222,163,0.2)]" />
            <span className="text-lg font-semibold text-sidebar-foreground">AcadVault</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="md:hidden">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="px-2 pt-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faculty Portal</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={item.current}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="md:hidden">
        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
