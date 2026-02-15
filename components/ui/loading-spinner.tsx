import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "default" | "subtle";
}

export function LoadingSpinner({ className, size = "md", text, variant = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const variantClasses = {
    default: "text-primary",
    subtle: "text-muted-foreground"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 animate-fade-in", className)}>
      <Loader2 className={cn("animate-spin transition-colors duration-slow", sizeClasses[size], variantClasses[variant])} />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">{text}</span>
      )}
    </div>
  );
}
