import { Paperclip, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  attachmentCount,
  displayName,
  formatListDate,
  previewText,
} from "./format";
import type { MailEmail, MailFolder } from "./types";

export default function MailRow({
  email,
  folder,
  selected,
  onOpen,
  onToggleSelect,
  onToggleStar,
}: {
  email: MailEmail;
  folder: MailFolder;
  selected: boolean;
  onOpen: () => void;
  onToggleSelect: () => void;
  onToggleStar: () => void;
}) {
  const unread = !email.isRead;
  const showRecipient = folder === "SENT" || folder === "DRAFTS";
  const who = showRecipient ? `Para: ${email.recipient}` : displayName(email.sender);
  const preview = previewText(email);
  const attachments = attachmentCount(email);
  const subject = email.subject || "(Sin asunto)";

  return (
    <li className="group">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        aria-label={`${unread ? "No leído" : "Leído"}: ${subject} — ${who}`}
        className={cn(
          "flex cursor-pointer items-start gap-2.5 px-3 py-2.5 outline-none transition-colors",
          "hover:bg-stone-50 focus-visible:bg-stone-100",
          selected && "bg-blue-50/70 hover:bg-blue-50"
        )}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Seleccionar ${subject}`}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-stone-800"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          aria-label={email.isStarred ? "Quitar destacado" : "Destacar"}
          aria-pressed={email.isStarred}
          className={cn(
            "mt-0.5 shrink-0 rounded p-0.5 text-stone-300 transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
            folder === "DRAFTS" && "invisible"
          )}
          tabIndex={folder === "DRAFTS" ? -1 : undefined}
        >
          <Star
            size={16}
            className={cn(email.isStarred && "fill-amber-400 text-amber-400")}
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "truncate text-sm",
                unread ? "font-semibold text-stone-900" : "text-stone-600"
              )}
            >
              {who}
            </span>
            {attachments > 0 && (
              <Paperclip
                size={12}
                className="shrink-0 text-stone-400"
                aria-label={`${attachments} adjunto${attachments === 1 ? "" : "s"}`}
              />
            )}
            <span className="ml-auto shrink-0 text-xs text-stone-400">
              {formatListDate(email.createdAt)}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            {unread && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "shrink-0 truncate text-sm",
                unread ? "font-medium text-stone-900" : "text-stone-700"
              )}
            >
              {subject}
            </span>
            {preview && (
              <span className="hidden min-w-0 truncate text-xs text-stone-400 sm:inline">
                — {preview}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
