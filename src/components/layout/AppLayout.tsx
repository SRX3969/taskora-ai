import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  Calendar,
  Layout,
  FileText,
  Palette,
  Bot,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Layout, label: "Boards", href: "/boards" },
  { icon: FileText, label: "Notes", href: "/notes" },
  { icon: Palette, label: "Canvas", href: "/canvas" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-bold">Proddy</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
