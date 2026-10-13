import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function IconButton({
  label,
  onClick,
  disabled,
  active,
  destructive,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  destructive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-600 transition-colors",
        "hover:bg-stone-200/70 hover:text-stone-900",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
        active && "bg-stone-900 text-stone-50 hover:bg-stone-900 hover:text-stone-50",
        destructive && "text-red-600 hover:bg-red-50 hover:text-red-700",
        className
      )}
    >
      {children}
    </button>
  );
}
