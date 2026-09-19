import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2",
        {
          "border-transparent bg-stone-900 text-stone-50": variant === "default",
          "border-transparent bg-stone-100 text-stone-900": variant === "secondary",
          "text-stone-950": variant === "outline",
          "border-transparent bg-[#E8734A] text-white": variant === "accent",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
