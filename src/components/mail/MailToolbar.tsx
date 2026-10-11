import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { folderLabel, type MailFolder } from "./types";

export default function MailToolbar({
  folder,
  count,
  loading,
  onRefresh,
  onCompose,
}: {
  folder: MailFolder;
  count: number;
  loading: boolean;
  onRefresh: () => void;
  onCompose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-md border bg-card">
      <span className="text-sm text-muted-foreground">
        {folderLabel(folder)} ·{" "}
        {loading ? "Cargando..." : `${count} mensaje${count === 1 ? "" : "s"}`}
      </span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onRefresh}>
          Actualizar
        </Button>
        <Button size="sm" onClick={onCompose}>
          <Pencil size={15} className="mr-1.5" />
          Redactar
        </Button>
      </div>
    </div>
  );
}
