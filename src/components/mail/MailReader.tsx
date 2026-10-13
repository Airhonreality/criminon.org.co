"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Archive,
  CheckCheck,
  ChevronLeft,
  Download,
  FileText,
  Forward,
  Inbox,
  Mail,
  MoreVertical,
  Pencil,
  Reply,
  ReplyAll,
  RotateCcw,
  ShieldAlert,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IconButton from "./IconButton";
import { formatFullDate, formatSize } from "./format";
import type { MailEmail, MailFolder } from "./types";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const iframeStyles = `
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #1c1917; word-break: break-word; }
  img { max-width: 100%; height: auto; }
  a { color: #1d4ed8; }
  blockquote { border-left: 3px solid #e7e5e4; margin: 0; padding-left: 12px; color: #57534e; }
  table { border-collapse: collapse; max-width: 100%; }
  pre { white-space: pre-wrap; }
`;

function buildSrcDoc(email: MailEmail): string {
  const body = email.bodyHtml
    ? email.bodyHtml
    : `<div style="white-space:pre-wrap">${escapeHtml(
        email.bodyText || "Sin contenido"
      )}</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><base target="_blank" /><style>${iframeStyles}</style></head><body>${body}</body></html>`;
}

function MenuItem({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.Item
      onSelect={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100"
    >
      {children}
    </DropdownMenu.Item>
  );
}

export default function MailReader({
  email,
  folder,
  onBack,
  onReply,
  onReplyAll,
  onForward,
  onToggleStar,
  onMove,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: {
  email: MailEmail;
  folder: MailFolder;
  onBack: () => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
  onToggleStar: () => void;
  onMove: (target: MailFolder) => void;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
}) {
  const attachments = Array.isArray(email.attachments) ? email.attachments : [];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [frameHeight, setFrameHeight] = useState(140);

  const measure = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.documentElement) {
        const height = Math.max(
          doc.documentElement.scrollHeight,
          doc.body?.scrollHeight ?? 0
        );
        setFrameHeight(Math.max(140, height + 24));
      }
    } catch {
      /* sandbox impidió medir; se usa la altura por defecto */
    }
  }, []);

  // Tras cargar el iframe, medimos y observamos cambios (imágenes, fuentes,
  // tablas) para que el cuerpo fluya en la UI en vez de quedar recortado.
  const handleFrameLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    measure();
    observerRef.current?.disconnect();
    if (typeof ResizeObserver !== "undefined" && doc.body) {
      const observer = new ResizeObserver(() => measure());
      observer.observe(doc.body);
      observerRef.current = observer;
    }
    doc.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });
  };

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const isDrafts = folder === "DRAFTS";
  const isSpam = folder === "SPAM";
  const isTrash = folder === "TRASH";
  const isArchive = folder === "ARCHIVE";

  return (
    <div className="rounded-md border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <IconButton label="Volver a la lista" onClick={onBack}>
          <ChevronLeft size={18} />
        </IconButton>

        {isDrafts ? (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
          >
            <Pencil size={15} /> Editar
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onReply}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
            >
              <Reply size={15} /> Responder
            </button>
            <button
              type="button"
              onClick={onReplyAll}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
            >
              <ReplyAll size={15} /> Responder a todos
            </button>
            <button
              type="button"
              onClick={onForward}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
            >
              <Forward size={15} /> Reenviar
            </button>
          </>
        )}

        <div className="ml-auto flex items-center gap-0.5">
          {!isDrafts && (
            <IconButton
              label={email.isStarred ? "Quitar destacado" : "Destacar"}
              active={email.isStarred}
              onClick={onToggleStar}
            >
              <Star size={16} className={cn(email.isStarred && "fill-current")} />
            </IconButton>
          )}

          {isTrash ? (
            <>
              <IconButton
                label="Restaurar (mover a Recibidos)"
                onClick={() => onMove("INBOX")}
              >
                <RotateCcw size={16} />
              </IconButton>
              <IconButton label="Eliminar permanentemente" destructive onClick={onDelete}>
                <Trash2 size={16} />
              </IconButton>
            </>
          ) : isSpam ? (
            <>
              <IconButton label="No es spam" onClick={() => onMove("INBOX")}>
                <ShieldAlert size={16} />
              </IconButton>
              <IconButton label="Eliminar permanentemente" destructive onClick={onDelete}>
                <Trash2 size={16} />
              </IconButton>
            </>
          ) : isDrafts ? (
            <IconButton label="Descartar borrador" destructive onClick={onDelete}>
              <Trash2 size={16} />
            </IconButton>
          ) : (
            <>
              {isArchive ? (
                <IconButton label="Mover a Recibidos" onClick={() => onMove("INBOX")}>
                  <Inbox size={16} />
                </IconButton>
              ) : (
                <IconButton label="Archivar" onClick={() => onMove("ARCHIVE")}>
                  <Archive size={16} />
                </IconButton>
              )}
              <IconButton label="Marcar como spam" onClick={() => onMove("SPAM")}>
                <ShieldAlert size={16} />
              </IconButton>
              <IconButton label="Mover a papelera" onClick={() => onMove("TRASH")}>
                <Trash2 size={16} />
              </IconButton>
            </>
          )}

          {!isDrafts && !isSpam && !isTrash && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  aria-label="Más acciones"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                >
                  <MoreVertical size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={6}
                  className="z-[55] min-w-48 rounded-md border bg-white p-1 shadow-lg"
                >
                  {email.isRead ? (
                    <MenuItem onSelect={onMarkUnread}>
                      <Mail size={15} className="text-stone-500" /> Marcar como no leído
                    </MenuItem>
                  ) : (
                    <MenuItem onSelect={onMarkRead}>
                      <CheckCheck size={15} className="text-stone-500" /> Marcar como leído
                    </MenuItem>
                  )}
                  {isArchive && (
                    <MenuItem onSelect={() => onMove("INBOX")}>
                      <Inbox size={15} className="text-stone-500" /> Mover a Recibidos
                    </MenuItem>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {email.subject || "(Sin asunto)"}
        </h2>
        <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
          <div>
            <span className="text-stone-400">De:</span>{" "}
            <span className="text-stone-700">{email.sender}</span>
          </div>
          <div>
            <span className="text-stone-400">Para:</span>{" "}
            <span className="text-stone-700">{email.recipient}</span>
          </div>
          {email.cc && (
            <div>
              <span className="text-stone-400">CC:</span>{" "}
              <span className="text-stone-700">{email.cc}</span>
            </div>
          )}
          {email.bcc && (
            <div>
              <span className="text-stone-400">CCO:</span>{" "}
              <span className="text-stone-700">{email.bcc}</span>
            </div>
          )}
          <div className="text-xs text-stone-400">
            {formatFullDate(email.createdAt)}
          </div>
        </div>

        <iframe
          ref={iframeRef}
          onLoad={handleFrameLoad}
          title="Contenido del mensaje"
          className="mt-4 w-full rounded-md border bg-white"
          style={{ height: frameHeight }}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          srcDoc={buildSrcDoc(email)}
        />

        {attachments.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              Adjuntos ({attachments.length})
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {attachments.map((att, i) => {
                const label = att.filename || `Adjunto ${i + 1}`;
                const meta = [att.mimeType, formatSize(att.size)]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li
                    key={`${att.url ?? label}-${i}`}
                    className="flex items-center gap-2 rounded-md border bg-stone-50 px-3 py-2"
                  >
                    <FileText size={16} className="shrink-0 text-stone-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-stone-800">{label}</p>
                      {meta && (
                        <p className="truncate text-xs text-stone-500">{meta}</p>
                      )}
                    </div>
                    {att.url ? (
                      <a
                        href={att.url}
                        download={att.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Descargar ${label}`}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
                      >
                        <Download size={16} />
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
