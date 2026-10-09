import { Button } from "@/components/ui/button";
import { folderLabel, type MailFolder } from "./types";

export default function MailToolbar({
  folder,
  count,
  loading,
  onRefresh,
}: {
  folder: MailFolder;
  count: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md border bg-card">
      <span className="text-sm text-muted-foreground">
        {folderLabel(folder)} ·{" "}
        {loading ? "Cargando..." : `${count} mensaje${count === 1 ? "" : "s"}`}
      </span>
      <Button size="sm" variant="outline" onClick={onRefresh}>
        Actualizar
      </Button>
    </div>
  );
}
