"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const BlockEditor = dynamic(() => import("./BlockEditor"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-sm text-stone-500">Cargando editor…</div>
  ),
});

interface Attachment {
  filename: string;
  url: string;
  mimeType?: string;
  size?: number;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function formatSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function uploadToR2(file: File): Promise<Attachment> {
  const prep = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });
  const data = await prep.json();
  if (!prep.ok) throw new Error(data.error || "No se pudo preparar la subida");

  const put = await fetch(data.uploadUrl as string, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) throw new Error(`No se pudo subir "${file.name}" a R2`);

  return {
    filename: file.name,
    url: data.publicUrl as string,
    mimeType: file.type || undefined,
    size: file.size,
  };
}

export default function MailComposer({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = sending || uploading;

  const handleEditorUpload = async (file: File): Promise<string> => {
    const res = await uploadToR2(file);
    return res.url;
  };

  const handleAttach = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setSuccess(false);
    setUploading(true);
    try {
      const uploaded: Attachment[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadToR2(file));
      }
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir el archivo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((a) => a.url !== url));
  };

  const canSend =
    to.trim().length > 0 &&
    subject.trim().length > 0 &&
    stripTags(html).length > 0 &&
    !busy;

  const resetForm = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setHtml("");
    setAttachments([]);
    setEditorKey((k) => k + 1);
  };

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, cc, bcc, subject, html, attachments }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error desconocido");
        return;
      }
      setSuccess(true);
      resetForm();
      onSent();
      onClose();
    } catch {
      setError("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  // Refs para atajos de teclado sin re-suscribir listeners.
  const sendRef = useRef(handleSend);
  const closeRef = useRef(onClose);
  const sendingRef = useRef(sending);
  useEffect(() => {
    sendRef.current = handleSend;
    closeRef.current = onClose;
    sendingRef.current = sending;
  });

  // Atajos: Cmd/Ctrl+Enter envía, Esc cierra.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        sendRef.current();
      } else if (e.key === "Escape" && !sendingRef.current) {
        e.preventDefault();
        closeRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Bloquea el scroll de fondo mientras la superficie está abierta.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar redacción"
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Redactar mensaje"
        className={`relative flex w-full flex-col overflow-hidden bg-white shadow-2xl border border-stone-200 rounded-none sm:rounded-2xl animate-fade-in ${
          expanded ? "sm:max-w-5xl h-full sm:h-[95vh]" : "sm:max-w-3xl h-full sm:h-[85vh]"
        }`}
      >
        <header className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-sm font-medium">Nuevo mensaje</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              aria-label={expanded ? "Contraer" : "Expandir"}
              title={expanded ? "Contraer (ventana)" : "Expandir (pantalla completa)"}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              aria-label="Cerrar"
              title="Cerrar (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="px-5">
          <div className="flex items-center gap-3 border-b py-2.5">
            <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-stone-500">
              Para
            </span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={busy}
              placeholder="destinatario@correo.com, otro@correo.com"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={() => setShowCcBcc((v) => !v)}
              disabled={busy}
              className="shrink-0 text-xs text-stone-500 hover:text-stone-900"
            >
              CC/CCO
            </button>
          </div>

          {showCcBcc && (
            <>
              <div className="flex items-center gap-3 border-b py-2.5">
                <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-stone-500">
                  CC
                </span>
                <input
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-3 border-b py-2.5">
                <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-stone-500">
                  CCO
                </span>
                <input
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3 border-b py-2.5">
            <span className="w-14 shrink-0 text-xs uppercase tracking-wide text-stone-500">
              Asunto
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={busy}
              placeholder="Asunto del mensaje"
              className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-stone-400"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <BlockEditor
            key={editorKey}
            onChange={setHtml}
            uploadFile={handleEditorUpload}
          />
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t px-5 py-2.5">
            {attachments.map((att) => (
              <span
                key={att.url}
                className="inline-flex items-center gap-2 rounded-full border bg-stone-50 px-3 py-1 text-xs"
              >
                <Paperclip size={12} className="text-stone-500" />
                <span className="max-w-56 truncate">{att.filename}</span>
                {att.size ? (
                  <span className="text-stone-500">
                    {formatSize(att.size)}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeAttachment(att.url)}
                  disabled={busy}
                  className="text-stone-500 hover:text-red-600"
                  aria-label={`Quitar ${att.filename}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <footer className="flex items-center justify-between gap-3 border-t px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleAttach(e.target.files)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              <Paperclip size={15} className="mr-1.5" />
              {uploading ? "Subiendo…" : "Adjuntar"}
            </Button>
            {success && (
              <span className="truncate text-xs text-green-600">
                Mensaje enviado correctamente.
              </span>
            )}
            {error && (
              <span className="truncate text-xs text-red-600">{error}</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-stone-500 md:inline">
              ⌘/Ctrl + Enter
            </span>
            <Button onClick={handleSend} disabled={!canSend}>
              {sending ? (
                <Loader2 size={15} className="mr-1.5 animate-spin" />
              ) : (
                <Send size={15} className="mr-1.5" />
              )}
              {sending ? "Enviando…" : "Enviar"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
