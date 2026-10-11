"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { type MailEmail, type MailFolder } from "./types";

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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(240);

  const handleFrameLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.body) {
        setFrameHeight(Math.max(120, doc.body.scrollHeight + 16));
      }
    } catch {
      /* sandbox impidió medir; se usa la altura por defecto */
    }
  };

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
            <>
              <span>Para: {email.recipient}</span>
              {email.cc ? <span>CC: {email.cc}</span> : null}
            </>
          ) : (
            <>
              <span>De: {email.sender}</span>
              <span>Para: {email.recipient}</span>
              {email.cc ? <span>CC: {email.cc}</span> : null}
            </>
          )}
          <span>{new Date(email.createdAt).toLocaleString()}</span>
        </div>

        <iframe
          ref={iframeRef}
          onLoad={handleFrameLoad}
          title="Contenido del mensaje"
          className="mt-4 w-full border rounded-md bg-white"
          style={{ height: frameHeight }}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          srcDoc={buildSrcDoc(email)}
        />

        {attachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Adjuntos ({attachments.length})
            </p>
            <ul className="flex flex-wrap gap-2">
              {attachments.map((att, i) => (
                <li key={`${att.url ?? att.filename}-${i}`}>
                  {att.url ? (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs border rounded-full px-3 py-1 bg-stone-50 hover:bg-stone-100"
                    >
                      📎 {att.filename || `Adjunto ${i + 1}`}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs border rounded-full px-3 py-1 bg-stone-50">
                      📎 {att.filename || `Adjunto ${i + 1}`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
