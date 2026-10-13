"use client";

import { useCallback, useEffect, useState } from "react";
import MailHeader from "./MailHeader";
import MailSidebar from "./MailSidebar";
import MailToolbar from "./MailToolbar";
import MailList from "./MailList";
import MailReader from "./MailReader";
import MailComposer from "./MailComposer";
import { fetchMailList, mailApi } from "./api";
import type { MailEmail, MailFolder } from "./types";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMailList({ folder });
      setEmails(result.data);
    } catch {
      setError("No se pudieron cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMailList({ folder });
        if (!cancelled) setEmails(result.data);
      } catch {
        if (!cancelled) setError("No se pudieron cargar los mensajes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [folder]);

  const selected = emails.find((e) => e.id === selectedId) ?? null;

  const selectFolder = (f: MailFolder) => {
    setFolder(f);
    setSelectedId(null);
    setLoading(true);
    setError(null);
  };

  const openEmail = (email: MailEmail) => {
    setSelectedId(email.id);
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      );
      mailApi.markRead([email.id]).catch(() => {});
    }
  };

  const moveEmail = (id: string, target: MailFolder) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
    mailApi.move([id], target).catch(() => {});
  };

  const toggleStar = (email: MailEmail) => {
    const next = !email.isStarred;
    if (folder === "STARRED" && !next) {
      setEmails((prev) => prev.filter((e) => e.id !== email.id));
      setSelectedId(null);
    } else {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isStarred: next } : e))
      );
    }
    (next ? mailApi.star([email.id]) : mailApi.unstar([email.id])).catch(() => {});
  };

  const handleSent = () => {
    setSelectedId(null);
    setError(null);
    if (folder === "SENT") {
      void load();
    } else {
      setFolder("SENT");
      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <MailHeader folder={folder} name={mailboxName} address={mailboxAddress} />
      <div className="flex flex-col md:flex-row gap-4">
        <MailSidebar folder={folder} onSelectFolder={selectFolder} />
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <MailToolbar
            folder={folder}
            count={emails.length}
            loading={loading}
            onRefresh={load}
            onCompose={() => setComposerOpen(true)}
          />
          {selected ? (
            <MailReader
              email={selected}
              folder={folder}
              onBack={() => setSelectedId(null)}
              onToggleStar={() => toggleStar(selected)}
              onMove={(target) => moveEmail(selected.id, target)}
            />
          ) : (
            <MailList
              emails={emails}
              loading={loading}
              error={error}
              folder={folder}
              onSelect={openEmail}
              onRetry={load}
            />
          )}
          <MailComposer
            open={composerOpen}
            onClose={() => setComposerOpen(false)}
            onSent={handleSent}
          />
        </div>
      </div>
    </div>
  );
}
