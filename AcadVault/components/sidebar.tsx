import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Trophy, FileText, GraduationCap, Settings, HelpCircle } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, current: true },
  { name: "Achievements", href: "/achievements", icon: Trophy, current: false },
  { name: "Portfolio", href: "/portfolio", icon: FileText, current: false },
  { name: "Academic Records", href: "/academics", icon: GraduationCap, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
  { name: "Support", href: "/support", icon: HelpCircle, current: false },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Student Portal</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-4 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  item.current
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
