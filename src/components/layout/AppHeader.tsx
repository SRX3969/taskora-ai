import { cn } from "@/lib/utils";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            />
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
          
          {action}
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
          
          {/* Profile */}
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
