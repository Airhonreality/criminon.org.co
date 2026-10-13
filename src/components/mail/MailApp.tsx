"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import MailHeader from "./MailHeader";
import MailSidebar from "./MailSidebar";
import MailToolbar from "./MailToolbar";
import MailList from "./MailList";
import MailReader from "./MailReader";
import MailComposer from "./MailComposer";
import ConfirmDialog from "./ConfirmDialog";
import { fetchMailList, mailApi } from "./api";
import {
  buildDraftInit,
  buildForward,
  buildReply,
  buildReplyAll,
  type ComposeInit,
} from "./compose";
import {
  bulkTargetFolder,
  type BulkAction,
  type MailEmail,
  type MailFolder,
} from "./types";

interface Toast {
  id: number;
  kind: "success" | "error";
  message: string;
}

interface ConfirmState {
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export default function MailApp({
  mailboxAddress,
  mailboxName,
}: {
  mailboxAddress: string;
  mailboxName: string;
}) {
  const [folder, setFolder] = useState<MailFolder>("INBOX");
  const [emails, setEmails] = useState<MailEmail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState<{
    open: boolean;
    init: ComposeInit | null;
    nonce: number;
  }>({ open: false, init: null, nonce: 0 });
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const emailsRef = useRef(emails);
  useEffect(() => {
    emailsRef.current = emails;
  }, [emails]);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback(
    (message: string, kind: "success" | "error" = "success") => {
      setToast({ id: Date.now(), kind, message });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [toast]);

  const openCompose = useCallback(
    (init: ComposeInit | null = null) =>
      setComposer((c) => ({ open: true, init, nonce: c.nonce + 1 })),
    []
  );

  const load = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (silent) setRefreshing(true);
      else {
        setLoading(true);
        setError(null);
      }
      try {
        const result = await fetchMailList(
          query ? { q: query, all: true } : { folder }
        );
        setEmails(result.data);
        setError(null);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "No se pudieron cargar los mensajes.";
        if (silent) notify(message, "error");
        else setError(message);
      } finally {
        if (silent) setRefreshing(false);
        else setLoading(false);
      }
    },
    [folder, query, notify]
  );

  const closeCompose = useCallback(() => {
    setComposer((c) => ({ ...c, open: false }));
    if (folder === "DRAFTS") void load({ silent: true });
  }, [folder, load]);

  // Carga al montar y al cambiar de carpeta o de búsqueda. El setState ocurre
  // sólo tras el await (no de forma síncrona en el cuerpo del efecto).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchMailList(
          query ? { q: query, all: true } : { folder }
        );
        if (!cancelled) {
          setEmails(result.data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "No se pudieron cargar los mensajes."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [folder, query]);

  const runOptimistic = useCallback(
    async (
      mutate: (prev: MailEmail[]) => MailEmail[],
      request: () => Promise<void>,
      success?: string
    ) => {
      const snapshot = emailsRef.current;
      setEmails(mutate);
      try {
        await request();
        if (success) notify(success, "success");
      } catch (e) {
        setEmails(snapshot);
        notify(
          e instanceof Error ? e.message : "No se pudo completar la acción",
          "error"
        );
      }
    },
    [notify]
  );

  const selected = emails.find((e) => e.id === selectedId) ?? null;

  const selectFolder = (f: MailFolder) => {
    setSelectedId(null);
    setSelectedIds(new Set());
    setQueryInput("");
    if (f === folder) {
      if (query) {
        setLoading(true);
        setQuery("");
      } else {
        void load({ silent: true });
      }
      return;
    }
    setLoading(true);
    setError(null);
    setQuery("");
    setFolder(f);
  };

  const openEmail = (email: MailEmail) => {
    if (folder === "DRAFTS") {
      openCompose(buildDraftInit(email));
      return;
    }
    setSelectedId(email.id);
    if (!email.isRead) {
      void runOptimistic(
        (prev) => prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e)),
        () => mailApi.markRead([email.id])
      );
    }
  };

  const submitSearch = () => {
    const term = queryInput.trim();
    setSelectedId(null);
    setSelectedIds(new Set());
    setQuery(term);
    if (term) setLoading(true);
  };

  const clearSearch = () => {
    setQueryInput("");
    if (query) {
      setQuery("");
      setLoading(true);
    }
  };

  const toggleStar = (email: MailEmail) => {
    const next = !email.isStarred;
    void runOptimistic(
      (prev) =>
        folder === "STARRED" && !next
          ? prev.filter((e) => e.id !== email.id)
          : prev.map((e) => (e.id === email.id ? { ...e, isStarred: next } : e)),
      () => (next ? mailApi.star([email.id]) : mailApi.unstar([email.id])),
      next ? "Marcado como destacado" : "Destacado eliminado"
    );
  };

  const moveEmails = useCallback(
    (ids: string[], target: MailFolder) => {
      if (ids.length === 0) return;
      const snapshot = emailsRef.current;
      if (folder !== "STARRED") {
        setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
      }
      if (selectedId && ids.includes(selectedId)) setSelectedId(null);
      mailApi
        .move(ids, target)
        .then(async () => {
          notify(
            ids.length === 1
              ? "Mensaje movido"
              : `${ids.length} mensajes movidos`,
            "success"
          );
          if (folder === "STARRED") await load({ silent: true });
        })
        .catch((e) => {
          setEmails(snapshot);
          notify(
            e instanceof Error ? e.message : "No se pudo mover el mensaje",
            "error"
          );
        });
    },
    [folder, selectedId, load, notify]
  );

  const deleteEmails = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const snapshot = emailsRef.current;
      setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
      if (selectedId && ids.includes(selectedId)) setSelectedId(null);
      mailApi
        .remove(ids)
        .then((n) =>
          notify(
            n === 1 ? "Mensaje eliminado" : `${n} mensajes eliminados`,
            "success"
          )
        )
        .catch((e) => {
          setEmails(snapshot);
          notify(
            e instanceof Error ? e.message : "No se pudieron eliminar",
            "error"
          );
        });
    },
    [selectedId, notify]
  );

  const requestDelete = useCallback(
    (ids: string[], opts: { discard?: boolean } = {}) => {
      if (ids.length === 0) return;
      setConfirm({
        title: opts.discard
          ? "¿Descartar borrador(es)?"
          : "¿Eliminar permanentemente?",
        description: opts.discard
          ? "Se eliminarán los borradores seleccionados. Esta acción no se puede deshacer."
          : "Se eliminarán los mensajes seleccionados de forma permanente. Esta acción no se puede deshacer.",
        confirmLabel: opts.discard ? "Descartar" : "Eliminar",
        destructive: true,
        onConfirm: () => deleteEmails(ids),
      });
    },
    [deleteEmails]
  );

  const handleBulk = (action: BulkAction) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setSelectedIds(new Set());

    if (action === "delete" || action === "discard") {
      requestDelete(ids, { discard: action === "discard" });
      return;
    }

    const target = bulkTargetFolder(action);
    if (target) {
      moveEmails(ids, target);
      return;
    }

    switch (action) {
      case "markRead":
        void runOptimistic(
          (prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, isRead: true } : e)),
          () => mailApi.markRead(ids),
          "Marcados como leídos"
        );
        break;
      case "markUnread":
        void runOptimistic(
          (prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, isRead: false } : e)),
          () => mailApi.markUnread(ids),
          "Marcados como no leídos"
        );
        break;
      case "star":
        void runOptimistic(
          (prev) =>
            prev.map((e) => (ids.includes(e.id) ? { ...e, isStarred: true } : e)),
          () => mailApi.star(ids),
          "Marcados como destacados"
        );
        break;
      case "unstar":
        void runOptimistic(
          (prev) =>
            folder === "STARRED"
              ? prev.filter((e) => !ids.includes(e.id))
              : prev.map((e) =>
                  ids.includes(e.id) ? { ...e, isStarred: false } : e
                ),
          () => mailApi.unstar(ids),
          "Destacados eliminados"
        );
        break;
    }
  };

  const confirmEmptyTrash = () => {
    setConfirm({
      title: "¿Vaciar la papelera?",
      description:
        "Se eliminarán permanentemente todos los mensajes de la papelera. Esta acción no se puede deshacer.",
      confirmLabel: "Vaciar papelera",
      destructive: true,
      onConfirm: () => {
        const snapshot = emailsRef.current;
        setEmails([]);
        setSelectedId(null);
        mailApi
          .emptyTrash()
          .then((n) => notify(`${n} mensajes eliminados`, "success"))
          .catch((e) => {
            setEmails(snapshot);
            notify(
              e instanceof Error ? e.message : "No se pudo vaciar la papelera",
              "error"
            );
          });
      },
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === emails.length && emails.length > 0
        ? new Set()
        : new Set(emails.map((e) => e.id))
    );
  };

  const handleSent = () => {
    setSelectedId(null);
    setSelectedIds(new Set());
    setError(null);
    setQueryInput("");
    setQuery("");
    if (folder === "SENT") void load({ silent: true });
    else {
      setLoading(true);
      setFolder("SENT");
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <MailHeader folder={folder} name={mailboxName} address={mailboxAddress} />
      <div className="flex flex-col gap-4 md:flex-row">
        <MailSidebar folder={folder} onSelectFolder={selectFolder} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <MailToolbar
            folder={folder}
            count={emails.length}
            loading={loading}
            refreshing={refreshing}
            selectedCount={selectedIds.size}
            onRefresh={() => load({ silent: true })}
            onCompose={() => openCompose(null)}
            onClearSelection={() => setSelectedIds(new Set())}
            onBulk={handleBulk}
            onEmptyTrash={confirmEmptyTrash}
            query={queryInput}
            searching={Boolean(query)}
            onQueryChange={setQueryInput}
            onSearchSubmit={submitSearch}
            onClearSearch={clearSearch}
          />

          {selected ? (
            <MailReader
              email={selected}
              folder={folder}
              onBack={() => setSelectedId(null)}
              onReply={() => openCompose(buildReply(selected))}
              onReplyAll={() =>
                openCompose(buildReplyAll(selected, mailboxAddress))
              }
              onForward={() => openCompose(buildForward(selected))}
              onToggleStar={() => toggleStar(selected)}
              onMove={(target) => moveEmails([selected.id], target)}
              onMarkRead={() =>
                void runOptimistic(
                  (prev) =>
                    prev.map((e) =>
                      e.id === selected.id ? { ...e, isRead: true } : e
                    ),
                  () => mailApi.markRead([selected.id])
                )
              }
              onMarkUnread={() =>
                void runOptimistic(
                  (prev) =>
                    prev.map((e) =>
                      e.id === selected.id ? { ...e, isRead: false } : e
                    ),
                  () => mailApi.markUnread([selected.id])
                )
              }
              onDelete={() => requestDelete([selected.id])}
            />
          ) : (
            <MailList
              emails={emails}
              loading={loading}
              refreshing={refreshing}
              error={error}
              folder={folder}
              searching={Boolean(query)}
              selectedIds={selectedIds}
              onOpen={openEmail}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onToggleStar={toggleStar}
              onRetry={() => load()}
            />
          )}

          <MailComposer
            key={composer.nonce}
            open={composer.open}
            initial={composer.init}
            onClose={closeCompose}
            onSent={handleSent}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        title={confirm?.title ?? ""}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
        destructive={confirm?.destructive}
        onConfirm={() => confirm?.onConfirm()}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 z-[70] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-lg ${
            toast.kind === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-stone-200 bg-white text-stone-800"
          }`}
        >
          {toast.kind === "error" ? (
            <AlertTriangle size={16} className="shrink-0" />
          ) : (
            <Check size={16} className="shrink-0 text-green-600" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar aviso"
            className="ml-1 text-stone-400 hover:text-stone-700"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
