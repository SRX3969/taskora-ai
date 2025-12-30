import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center flex-shrink-0",
        sizeClasses[size]
      )}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cn("text-white", size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6")}
        >
          <path 
            d="M9 12l2 2 4-4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 3c-1.5 0-2.8.4-4 1.2a8 8 0 0 0 0 15.6c1.2.8 2.5 1.2 4 1.2s2.8-.4 4-1.2a8 8 0 0 0 0-15.6C14.8 3.4 13.5 3 12 3z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-pulse" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold", textSizeClasses[size])}>
          Taskora <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
