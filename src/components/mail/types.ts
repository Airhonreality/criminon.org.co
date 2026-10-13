export interface MailAttachment {
  filename: string;
  url?: string;
  mimeType?: string;
  size?: number;
}

export interface MailEmail {
  id: string;
  messageId: string | null;
  sender: string;
  recipient: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  attachments: MailAttachment[];
  direction: string;
  folder: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  inReplyTo: string | null;
  references: string | null;
  updatedAt: string;
}

export type MailFolder =
  | "INBOX"
  | "STARRED"
  | "SENT"
  | "DRAFTS"
  | "ARCHIVE"
  | "SPAM"
  | "TRASH";

export const FOLDERS: { key: MailFolder; label: string }[] = [
  { key: "INBOX", label: "Inbox" },
  { key: "STARRED", label: "Starred" },
  { key: "SENT", label: "Sent" },
  { key: "DRAFTS", label: "Drafts" },
  { key: "ARCHIVE", label: "Archive" },
  { key: "SPAM", label: "Spam" },
  { key: "TRASH", label: "Trash" },
];

export function folderLabel(folder: MailFolder): string {
  const found = FOLDERS.find((f) => f.key === folder);
  return found ? found.label : folder;
}

export type BulkAction =
  | "markRead"
  | "markUnread"
  | "star"
  | "unstar"
  | "archive"
  | "spam"
  | "notSpam"
  | "trash"
  | "restore"
  | "delete"
  | "discard";

/** Carpeta destino de una acción de movimiento, o null si no aplica. */
export function bulkTargetFolder(action: BulkAction): MailFolder | null {
  switch (action) {
    case "archive":
      return "ARCHIVE";
    case "spam":
      return "SPAM";
    case "trash":
      return "TRASH";
    case "restore":
    case "notSpam":
      return "INBOX";
    default:
      return null;
  }
}

/** Etiquetas vacías por carpeta (no es un error). */
export function emptyMessage(folder: MailFolder): string {
  switch (folder) {
    case "INBOX":
      return "No hay mensajes en la bandeja de entrada.";
    case "STARRED":
      return "No hay mensajes destacados.";
    case "SENT":
      return "No hay mensajes enviados.";
    case "DRAFTS":
      return "No hay borradores.";
    case "ARCHIVE":
      return "No hay mensajes archivados.";
    case "SPAM":
      return "No hay mensajes en spam.";
    case "TRASH":
      return "La papelera está vacía.";
    default:
      return "No hay mensajes.";
  }
}
