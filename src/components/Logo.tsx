import { cn } from "@/lib/utils";
import taskoraLogo from "@/assets/taskora-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  const logoOnlySize = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {showText ? (
        <img 
          src={taskoraLogo} 
          alt="Taskora AI" 
          className={cn(sizeClasses[size], "w-auto object-contain")}
        />
      ) : (
        <img 
          src={taskoraLogo} 
          alt="Taskora AI" 
          className={cn(logoOnlySize[size], "object-cover object-left")}
          style={{ clipPath: 'inset(0 60% 0 0)' }}
        />
      )}
    </div>
  );
}
