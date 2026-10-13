import {
  Archive,
  CheckCheck,
  Mail,
  Pencil,
  RotateCcw,
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
    <div className="flex items-center justify-between gap-3 rounded-md border bg-card p-3">
      <span className="text-sm text-muted-foreground">
        {folderLabel(folder)} ·{" "}
        {loading && count === 0
          ? "Cargando…"
          : `${count} mensaje${count === 1 ? "" : "s"}`}
      </span>
      <div className="flex items-center gap-2">
        {folder === "TRASH" && count > 0 && (
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
