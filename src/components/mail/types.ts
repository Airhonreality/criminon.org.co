export interface MailEmail {
  id: string;
  messageId: string | null;
  sender: string;
  recipient: string;
  subject: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  attachments: unknown[];
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
