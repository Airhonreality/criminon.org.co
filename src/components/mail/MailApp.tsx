"use client";

import { useEffect, useState } from "react";
import MailHeader from "./MailHeader";
import MailSidebar from "./MailSidebar";
import MailToolbar from "./MailToolbar";
import MailList from "./MailList";
import MailReader from "./MailReader";
import MailComposer from "./MailComposer";
import type { MailEmail, MailFolder } from "./types";

async function fetchEmails(folder: MailFolder): Promise<MailEmail[]> {
  const params = new URLSearchParams();
  if (folder === "STARRED") params.set("starred", "true");
  else params.set("folder", folder);
  const res = await fetch(`/api/emails?${params.toString()}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cargar");
  return (data.data as MailEmail[]) || [];
}

export default function MailApp() {
  const [folder, setFolder] = useState<MailFolder>("INBOX");
  const [emails, setEmails] = useState<MailEmail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchEmails(folder);
        if (!cancelled) setEmails(data);
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

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      setEmails(await fetchEmails(folder));
    } catch {
      setError("No se pudieron cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  };

  const openEmail = (email: MailEmail) => {
    setSelectedId(email.id);
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      );
      fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, isRead: true }),
      }).catch(() => {});
    }
  };

  const moveEmail = (id: string, target: MailFolder) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
    fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, folder: target }),
    }).catch(() => {});
  };

  const toggleStar = (email: MailEmail) => {
    const next = !email.isStarred;
    fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: email.id, isStarred: next }),
    }).catch(() => {});
    if (folder === "STARRED" && !next) {
      setEmails((prev) => prev.filter((e) => e.id !== email.id));
      setSelectedId(null);
    } else {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isStarred: next } : e))
      );
    }
  };

  const handleSent = () => {
    setFolder("SENT");
    setSelectedId(null);
    setLoading(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <MailHeader folder={folder} />
      <div className="flex flex-col md:flex-row gap-4">
        <MailSidebar folder={folder} onSelectFolder={selectFolder} />
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <MailToolbar
            folder={folder}
            count={emails.length}
            loading={loading}
            onRefresh={handleRefresh}
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
              onRetry={handleRefresh}
            />
          )}
          <MailComposer onSent={handleSent} />
        </div>
      </div>
    </div>
  );
}
