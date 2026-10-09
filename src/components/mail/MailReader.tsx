import { Button } from "@/components/ui/button";
import { type MailEmail, type MailFolder } from "./types";

export default function MailReader({
  email,
  folder,
  onBack,
  onToggleStar,
  onMove,
}: {
  email: MailEmail;
  folder: MailFolder;
  onBack: () => void;
  onToggleStar: () => void;
  onMove: (target: MailFolder) => void;
}) {
  const isTrash = folder === "TRASH";
  const isSpam = folder === "SPAM";
  const showRecipient = folder === "SENT" || folder === "DRAFTS";
  const attachments = Array.isArray(email.attachments) ? email.attachments : [];

  return (
    <div className="border rounded-md bg-card">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b">
        <Button size="sm" variant="outline" onClick={onBack}>
          Volver
        </Button>
        {isTrash ? (
          <Button size="sm" variant="outline" onClick={() => onMove("INBOX")}>
            Restaurar
          </Button>
        ) : isSpam ? (
          <Button size="sm" variant="outline" onClick={() => onMove("INBOX")}>
            No es spam
          </Button>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={onToggleStar}>
              {email.isStarred ? "Quitar estrella" : "Destacar"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onMove("ARCHIVE")}>
              Archivar
            </Button>
            <Button size="sm" variant="outline" onClick={() => onMove("SPAM")}>
              Spam
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onMove("TRASH")}>
              Papelera
            </Button>
          </>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{email.subject || "(Sin asunto)"}</h2>
        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
          {showRecipient ? (
            <span>Para: {email.recipient}</span>
          ) : (
            <>
              <span>De: {email.sender}</span>
              <span>Para: {email.recipient}</span>
            </>
          )}
          <span>{new Date(email.createdAt).toLocaleString()}</span>
        </div>

        <div className="mt-4 text-sm whitespace-pre-wrap">
          {email.bodyText || email.bodyHtml || "Sin contenido"}
        </div>

        {attachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Adjuntos:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {attachments.map((att, i) => {
                const a = att as { filename?: string };
                return <li key={i}>{a.filename || `Adjunto ${i + 1}`}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
