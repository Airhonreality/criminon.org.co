import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import MailRow from "./MailRow";
import { emptyMessage, type MailEmail, type MailFolder } from "./types";

function SkeletonRows() {
  return (
    <ul className="divide-y" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-3.5">
          <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-stone-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function MailList({
  emails,
  loading,
  refreshing,
  error,
  folder,
  selectedIds,
  onOpen,
  onToggleSelect,
  onToggleSelectAll,
  onToggleStar,
  onRetry,
}: {
  emails: MailEmail[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  folder: MailFolder;
  selectedIds: Set<string>;
  onOpen: (email: MailEmail) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onToggleStar: (email: MailEmail) => void;
  onRetry: () => void;
}) {
  if (error && emails.length === 0) {
    return (
      <div className="rounded-md border bg-card p-4">
        <p className="mb-2 text-sm text-red-600">{error}</p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (loading && emails.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border bg-card">
        <SkeletonRows />
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-md border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage(folder)}</p>
      </div>
    );
  }

  const allSelected = selectedIds.size > 0 && selectedIds.size === emails.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="relative overflow-hidden rounded-md border bg-card">
      <div className="flex items-center gap-3 border-b bg-stone-50/60 px-3 py-2">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={onToggleSelectAll}
          aria-label={
            allSelected ? "Deseleccionar todos" : "Seleccionar todos los mensajes"
          }
          className="h-4 w-4 cursor-pointer accent-stone-800"
        />
        {refreshing ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
            <RefreshCw size={12} className="animate-spin" />
            Actualizando…
          </span>
        ) : (
          <span className="text-xs text-stone-500">
            {emails.length} mensaje{emails.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <ul className="divide-y">
        {emails.map((email) => (
          <MailRow
            key={email.id}
            email={email}
            folder={folder}
            selected={selectedIds.has(email.id)}
            onOpen={() => onOpen(email)}
            onToggleSelect={() => onToggleSelect(email.id)}
            onToggleStar={() => onToggleStar(email)}
          />
        ))}
      </ul>
    </div>
  );
}
