import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function MailToolbar() {
  return (
    <div className="flex items-center justify-between p-3 rounded-md border border-border bg-card">
      <span className="text-sm text-muted-foreground">
        15 mensajes
      </span>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        </Button>
        <Button size="icon" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </Button>
        <Button size="icon" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/></svg>
        </Button>
      </div>
    </div>
  );
}