"use client";

import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Maximize2,
  Minimize2,
  Paperclip,
  RefreshCw,
  Save,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipientField, { isValidEmail } from "./RecipientField";
import { splitAddresses, type ComposeInit } from "./compose";
import { formatSize } from "./format";
import { mailApi } from "./api";

const BlockEditor = dynamic(() => import("./BlockEditor"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-sm text-stone-500">Cargando editor…</div>
  ),
});

interface DraftAttachment {
  id: string;
  filename: string;
  mimeType?: string;
  size?: number;
  url?: string;
  state: "uploading" | "uploaded" | "failed";
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function uploadFileToR2(file: File): Promise<string> {
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
  if (!put.ok) throw new Error(`No se pudo subir "${file.name}"`);

  return data.publicUrl as string;
}

export default function MailComposer({
  open,
  initial,
  onClose,
  onSent,
}: {
  open: boolean;
  initial?: ComposeInit | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const [to, setTo] = useState<string[]>(() => splitAddresses(initial?.to));
  const [cc, setCc] = useState<string[]>(() => splitAddresses(initial?.cc));
  const [bcc, setBcc] = useState<string[]>(() => splitAddresses(initial?.bcc));
  const [showCcBcc, setShowCcBcc] = useState(
    Boolean(initial?.cc || initial?.bcc)
  );
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [html, setHtml] = useState(initial?.html ?? "");
  const [attachments, setAttachments] = useState<DraftAttachment[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [draftId, setDraftId] = useState<string | null>(
    initial?.draftId ?? null
  );
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [closePrompt, setClosePrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<Map<string, File>>(new Map());
  const savedSnapshotRef = useRef<string | null>(null);

  const inReplyTo = initial?.inReplyTo ?? null;
  const references = initial?.references ?? null;

  const uploading = attachments.some((a) => a.state === "uploading");
  const failed = attachments.some((a) => a.state === "failed");
  const busy = sending || uploading;

  const allRecipients = [...to, ...cc, ...bcc];
  const recipientsValid =
    to.length > 0 && allRecipients.every(isValidEmail);
  const hasContent =
    allRecipients.length > 0 ||
    subject.trim().length > 0 ||
    stripTags(html).length > 0 ||
    attachments.length > 0;
  const canSend =
    recipientsValid &&
    subject.trim().length > 0 &&
    stripTags(html).length > 0 &&
    !busy &&
    !failed;

  const uploadedAttachments = attachments
    .filter((a) => a.state === "uploaded")
    .map((a) => ({
      filename: a.filename,
      url: a.url as string,
      mimeType: a.mimeType,
      size: a.size,
    }));

  const snapshot = JSON.stringify({
    to,
    cc,
    bcc,
    subject,
    html,
    uploadedAttachments,
  });

  const uploadEntry = useCallback(async (file: File, id: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, state: "uploading" } : a))
    );
    try {
      const url = await uploadFileToR2(file);
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, url, state: "uploaded" } : a))
      );
    } catch {
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, state: "failed" } : a))
      );
    }
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const entries: DraftAttachment[] = list.map((f) => ({
      id: crypto.randomUUID(),
      filename: f.name,
      mimeType: f.type || undefined,
      size: f.size,
      state: "uploading",
    }));
    entries.forEach((entry, i) => filesRef.current.set(entry.id, list[i]));
    setAttachments((prev) => [...prev, ...entries]);
    entries.forEach((entry) => {
      const file = filesRef.current.get(entry.id);
      if (file) void uploadEntry(file, entry.id);
    });
  };

  const retryAttachment = (id: string) => {
    const file = filesRef.current.get(id);
    if (file) void uploadEntry(file, id);
  };

  const removeAttachment = (id: string) => {
    filesRef.current.delete(id);
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditorUpload = async (file: File): Promise<string> => {
    return uploadFileToR2(file);
  };

  const resetForm = useCallback(() => {
    setTo([]);
    setCc([]);
    setBcc([]);
    setSubject("");
    setHtml("");
    setAttachments([]);
    setDraftId(null);
    setSaveState("idle");
    savedSnapshotRef.current = null;
    filesRef.current.clear();
    setEditorKey((k) => k + 1);
  }, []);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (!hasContent) return false;
    setSaveState("saving");
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          to: to.join(", "),
          cc: cc.join(", "),
          bcc: bcc.join(", "),
          subject,
          html,
          attachments: uploadedAttachments,
          inReplyTo,
          references,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      setDraftId(data.id as string);
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [
    hasContent,
    draftId,
    to,
    cc,
    bcc,
    subject,
    html,
    uploadedAttachments,
    inReplyTo,
    references,
  ]);

  // Autosave: se reprograma en cada cambio (debounce). El setState ocurre sólo
  // dentro del timeout/callback, no de forma síncrona en el efecto.
  useEffect(() => {
    if (!open || sending || saveState === "saving" || !hasContent) return;
    if (snapshot === savedSnapshotRef.current) return;
    const timer = setTimeout(async () => {
      const ok = await saveDraft();
      if (ok) savedSnapshotRef.current = snapshot;
    }, 2500);
    return () => clearTimeout(timer);
  }, [open, sending, saveState, hasContent, snapshot, saveDraft]);

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.join(", "),
          cc: cc.join(", "),
          bcc: bcc.join(", "),
          subject,
          html,
          attachments: uploadedAttachments,
          inReplyTo,
          references,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo enviar el mensaje");
        setSending(false);
        return;
      }
      if (draftId) await mailApi.remove([draftId]).catch(() => {});
      savedSnapshotRef.current = snapshot;
      resetForm();
      onSent();
      onClose();
    } catch {
      setError("Error de conexión");
      setSending(false);
    }
  };

  const discardAndClose = async () => {
    if (draftId) await mailApi.remove([draftId]).catch(() => {});
    resetForm();
    onClose();
  };

  const requestClose = useCallback(() => {
    if (sending) return;
    if (!hasContent) {
      onClose();
      return;
    }
    setClosePrompt(true);
  }, [sending, hasContent, onClose]);

  const sendRef = useRef(handleSend);
  const closeRef = useRef(requestClose);
  const sendingRef = useRef(sending);
  useEffect(() => {
    sendRef.current = handleSend;
    closeRef.current = requestClose;
    sendingRef.current = sending;
  });

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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const title = initial?.draftId
    ? "Borrador"
    : inReplyTo
      ? "Responder"
      : /^fwd:/i.test(subject)
        ? "Reenviar"
        : "Nuevo mensaje";

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar redacción"
        onClick={requestClose}
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex w-full flex-col overflow-hidden border border-stone-200 bg-white shadow-2xl sm:rounded-2xl ${
          expanded
            ? "h-full sm:h-[95vh] sm:max-w-5xl"
            : "h-full sm:h-[85vh] sm:max-w-3xl"
        }`}
      >
        <header className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-sm font-medium">{title}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="hidden h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 sm:inline-flex"
              aria-label={expanded ? "Contraer" : "Expandir"}
              title={expanded ? "Contraer" : "Expandir"}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              onClick={requestClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              aria-label="Cerrar"
              title="Cerrar (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="px-5">
          <RecipientField
            label="Para"
            value={to}
            onChange={setTo}
            disabled={busy}
            placeholder="destinatario@correo.com, otro@correo.com"
          />
          <div className="flex justify-end border-b py-1.5">
            <button
              type="button"
              onClick={() => setShowCcBcc((v) => !v)}
              disabled={busy}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              CC/CCO
            </button>
          </div>

          {showCcBcc && (
            <>
              <RecipientField label="CC" value={cc} onChange={setCc} disabled={busy} />
              <RecipientField label="CCO" value={bcc} onChange={setBcc} disabled={busy} />
            </>
          )}

          <div className="flex items-center gap-3 border-b py-2">
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
            initialHtml={initial?.html}
          />
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t px-5 py-2.5">
            {attachments.map((att) => (
              <span
                key={att.id}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  att.state === "failed"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "bg-stone-50"
                }`}
              >
                {att.state === "uploading" ? (
                  <Loader2 size={12} className="animate-spin text-stone-500" />
                ) : (
                  <Paperclip size={12} className="text-stone-500" />
                )}
                <span className="max-w-56 truncate">{att.filename}</span>
                {att.size ? (
                  <span className="text-stone-500">{formatSize(att.size)}</span>
                ) : null}
                {att.state === "failed" && (
                  <button
                    type="button"
                    onClick={() => retryAttachment(att.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 text-red-700 hover:underline"
                    aria-label={`Reintentar ${att.filename}`}
                  >
                    <RefreshCw size={12} /> Reintentar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  disabled={busy}
                  className="text-stone-500 hover:text-red-600 disabled:opacity-40"
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
              onChange={(e) => addFiles(e.target.files)}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void saveDraft()}
              disabled={busy || !hasContent}
            >
              <Save size={15} className="mr-1.5" />
              Guardar borrador
            </Button>
            {saveState === "saving" && (
              <span className="text-xs text-stone-500">Guardando…</span>
            )}
            {saveState === "saved" && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <Check size={12} /> Borrador guardado
              </span>
            )}
            {saveState === "error" && (
              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                <AlertTriangle size={12} /> No se pudo guardar
              </span>
            )}
            {error && <span className="truncate text-xs text-red-600">{error}</span>}
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

      <Dialog.Root open={closePrompt} onOpenChange={setClosePrompt}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-5 shadow-2xl focus:outline-none">
            <Dialog.Title className="text-base font-semibold text-stone-900">
              ¿Guardar cambios?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-stone-600">
              El mensaje tiene cambios sin enviar.
            </Dialog.Description>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClosePrompt(false)}
              >
                Seguir editando
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => void discardAndClose()}
              >
                Descartar
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  await saveDraft();
                  onClose();
                }}
              >
                Guardar borrador
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
