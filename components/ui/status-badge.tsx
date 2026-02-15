import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-normal",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
        error: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
        neutral: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
