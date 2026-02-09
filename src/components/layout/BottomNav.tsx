import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  MessageSquare,
  Bot,
} from "lucide-react";

const bottomNavItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: MessageSquare, label: "Chat", href: "/messaging" },
  { icon: Bot, label: "AI", href: "/ai-assistant" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border md:hidden">
      <div className="flex items-center justify-around h-14">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-all duration-150 active:scale-75 active:opacity-60",
                isActive
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-150", isActive && "scale-110")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
