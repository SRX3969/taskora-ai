import { cn } from "@/lib/utils";
import taskoraIcon from "@/assets/taskora-icon.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const iconSize = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src={taskoraIcon} 
        alt="Taskora AI" 
        className={cn(iconSize[size], "object-contain rounded-lg")}
      />
      {showText && (
        <span className={cn(textSize[size], "font-bold tracking-tight")}>
          Taskora AI
        </span>
      )}
    </div>
  );
}
