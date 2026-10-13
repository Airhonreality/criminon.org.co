import {
  Archive,
  CheckCheck,
  Mail,
  Pencil,
  RotateCcw,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import IconButton from "./IconButton";
import { folderLabel, type BulkAction, type MailFolder } from "./types";

interface ActionDef {
  action: BulkAction;
  label: string;
  icon: ReactNode;
  destructive?: boolean;
}

function actionsForFolder(folder: MailFolder): ActionDef[] {
  const base: ActionDef[] = [
    { action: "markRead", label: "Marcar como leído", icon: <CheckCheck size={16} /> },
    { action: "markUnread", label: "Marcar como no leído", icon: <Mail size={16} /> },
    { action: "star", label: "Destacar", icon: <Star size={16} /> },
    { action: "unstar", label: "Quitar destacado", icon: <Star size={16} /> },
  ];
  const archive: ActionDef = { action: "archive", label: "Archivar", icon: <Archive size={16} /> };
  const spam: ActionDef = { action: "spam", label: "Marcar como spam", icon: <ShieldAlert size={16} /> };
  const trash: ActionDef = { action: "trash", label: "Mover a papelera", icon: <Trash2 size={16} /> };
  const restore: ActionDef = { action: "restore", label: "Restaurar", icon: <RotateCcw size={16} /> };
  const notSpam: ActionDef = { action: "notSpam", label: "No es spam", icon: <ShieldAlert size={16} /> };
  const remove: ActionDef = {
    action: "delete",
    label: "Eliminar permanentemente",
    icon: <Trash2 size={16} />,
    destructive: true,
  };

  switch (folder) {
    case "TRASH":
      return [...base, restore, remove];
    case "SPAM":
      return [...base, notSpam, remove];
    case "DRAFTS":
      return [{ ...remove, action: "discard", label: "Descartar borrador" }];
    case "ARCHIVE":
      return [...base, spam, trash];
    default:
      return [...base, archive, spam, trash];
  }
}

export default function MailToolbar({
  folder,
  count,
  loading,
  refreshing,
  selectedCount,
  onRefresh,
  onCompose,
  onClearSelection,
  onBulk,
  onEmptyTrash,
  query,
  searching,
  onQueryChange,
  onSearchSubmit,
  onClearSearch,
}: {
  folder: MailFolder;
  count: number;
  loading: boolean;
  refreshing: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onCompose: () => void;
  onClearSelection: () => void;
  onBulk: (action: BulkAction) => void;
  onEmptyTrash: () => void;
  query: string;
  searching: boolean;
  onQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
}) {
  if (selectedCount > 0) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-card p-2">
        <IconButton label="Cancelar selección" onClick={onClearSelection}>
          <X size={16} />
        </IconButton>
        <span className="mr-auto text-sm font-medium text-stone-700">
          {selectedCount} seleccionado{selectedCount === 1 ? "" : "s"}
        </span>
        <div className="flex flex-wrap items-center gap-0.5">
          {actionsForFolder(folder).map((a) => (
            <IconButton
              key={a.action}
              label={a.label}
              destructive={a.destructive}
              onClick={() => onBulk(a.action)}
            >
              {a.icon}
            </IconButton>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 items-center">
        <div className="relative w-full min-w-0 lg:max-w-md">
          <Search
            size={15}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearchSubmit();
              } else if (e.key === "Escape") {
                onClearSearch();
              }
            }}
            placeholder="Buscar en el correo…"
            aria-label="Buscar mensajes"
            className="w-full rounded-md border bg-white py-1.5 pl-8 pr-8 text-sm outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-stone-300"
          />
          {query && (
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-auto text-xs text-muted-foreground lg:mr-0">
          {searching
            ? "Búsqueda"
            : folderLabel(folder)}{" "}
          ·{" "}
          {loading && count === 0
            ? "Cargando…"
            : `${count} mensaje${count === 1 ? "" : "s"}`}
        </span>
        {folder === "TRASH" && !searching && count > 0 && (
          <Button size="sm" variant="outline" onClick={onEmptyTrash}>
            Vaciar papelera
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Actualizando…" : "Actualizar"}
        </Button>
        <Button size="sm" onClick={onCompose}>
          <Pencil size={15} className="mr-1.5" />
          Redactar
        </Button>
      </div>
    </div>
  );
}
