"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BlockEditor = dynamic(() => import("./BlockEditor"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-sm text-muted-foreground">Cargando editor…</div>
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

async function uploadToR2(file: File) {
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
  if (!prep.ok) {
    throw new Error(data.error || "No se pudo preparar la subida");
  }

  const put = await fetch(data.uploadUrl as string, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`No se pudo subir "${file.name}" a R2`);
  }

  return {
    filename: file.name,
    url: data.publicUrl as string,
    mimeType: file.type || undefined,
    size: file.size,
  };
}

export default function MailComposer({ onSent }: { onSent: () => void }) {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editorKey, setEditorKey] = useState(0);
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
      } else {
        setSuccess(true);
        setTo("");
        setCc("");
        setBcc("");
        setSubject("");
        setHtml("");
        setAttachments([]);
        setEditorKey((k) => k + 1);
        onSent();
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Redactar</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowCcBcc((v) => !v)}
            disabled={busy}
          >
            CC/CCO
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
          >
            {uploading ? "Subiendo…" : "Adjuntar"}
          </Button>
          <Button size="sm" onClick={handleSend} disabled={!canSend}>
            {sending ? "Enviando…" : "Enviar"}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleAttach(e.target.files)}
      />

      <div className="grid grid-cols-1 gap-3 mb-3">
        <Input
          placeholder="Para (separa varios con coma)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={busy}
        />
        {showCcBcc && (
          <>
            <Input
              placeholder="CC"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              disabled={busy}
            />
            <Input
              placeholder="CCO"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              disabled={busy}
            />
          </>
        )}
        <Input
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={busy}
        />
      </div>

      <BlockEditor key={editorKey} onChange={setHtml} uploadFile={handleEditorUpload} />

      {attachments.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <li
              key={att.url}
              className="flex items-center gap-2 text-xs border rounded-full px-3 py-1 bg-stone-50"
            >
              <span className="truncate max-w-48">{att.filename}</span>
              {att.size ? (
                <span className="text-muted-foreground">
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
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {success && (
        <p className="text-sm text-green-600 mt-3">
          Mensaje enviado correctamente.
        </p>
      )}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
