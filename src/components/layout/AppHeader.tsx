import { useState } from "react";
import { Search, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileMenu } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, subtitle, action }: AppHeaderProps) {
  const { profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setMobileOpen } = useMobileMenu();
  const [searchOpen, setSearchOpen] = useState(false);

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {isMobile && (
            <Button variant="ghost" size="icon" className="flex-shrink-0 -ml-1" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-semibold truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          {/* Search */}
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 hover:border-border transition-colors">
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
          )}

          {action}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-card" />
          </Button>

          {/* Profile */}
          <Avatar
            className="w-8 h-8 cursor-pointer ring-2 ring-border hover:ring-primary/50 transition-all"
            onClick={() => navigate("/settings")}
          >
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobile && searchOpen && (
        <div className="px-4 pb-3 bg-card/80 backdrop-blur-md border-b border-border/50 animate-fade-in">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
