import { Button } from "@/components/ui/button";
import { folderLabel, type MailEmail, type MailFolder } from "./types";

export default function MailList({
  emails,
  loading,
  error,
  folder,
  onSelect,
  onRetry,
}: {
  emails: MailEmail[];
  loading: boolean;
  error: string | null;
  folder: MailFolder;
  onSelect: (email: MailEmail) => void;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="border rounded-md p-4 bg-card">
        <p className="text-sm text-muted-foreground">Cargando mensajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-4 bg-card">
        <p className="text-sm text-red-600 mb-2">{error}</p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="border rounded-md p-4 bg-card">
        <p className="text-sm text-muted-foreground">
          No hay mensajes en {folderLabel(folder)}.
        </p>
      </div>
    );
  }

  const showRecipient = folder === "SENT" || folder === "DRAFTS";

  return (
    <div className="border rounded-md bg-card divide-y">
      {emails.map((email) => (
        <button
          key={email.id}
          onClick={() => onSelect(email)}
          className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm truncate ${
                email.isRead ? "text-stone-500" : "font-semibold text-stone-900"
              }`}
            >
              {email.subject || "(Sin asunto)"}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(email.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {showRecipient ? `Para: ${email.recipient}` : email.sender}
          </div>
        </button>
      ))}
    </div>
  );
}
