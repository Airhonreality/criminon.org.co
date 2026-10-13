import type { MailEmail, MailFolder } from "./types";

export type MailOp = "markRead" | "markUnread" | "star" | "unstar" | "move";

async function runOp(
  op: MailOp,
  ids: string[],
  extra?: { folder?: MailFolder }
): Promise<void> {
  const res = await fetch("/api/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op, ids, ...extra }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo actualizar el mensaje");
  }
}

export interface MailListResult {
  data: MailEmail[];
  page: number;
  pages: number;
  total: number;
}

export async function fetchMailList(params: {
  folder?: MailFolder;
  starred?: boolean;
  q?: string;
  unread?: boolean;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<MailListResult> {
  const search = new URLSearchParams();
  if (params.starred) search.set("starred", "true");
  else if (params.folder) search.set("folder", params.folder);
  if (params.q) search.set("q", params.q);
  if (params.unread !== undefined) search.set("unread", String(params.unread));
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const res = await fetch(`/api/emails?${search.toString()}`, {
    credentials: "include",
    signal: params.signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudieron cargar los mensajes");
  return {
    data: (data.data as MailEmail[]) || [],
    page: data.page ?? 1,
    pages: data.pages ?? 1,
    total: data.total ?? (data.data?.length ?? 0),
  };
}

export async function fetchMail(id: string): Promise<MailEmail> {
  const res = await fetch(`/api/emails?id=${encodeURIComponent(id)}`, {
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se encontró el mensaje");
  return data.email as MailEmail;
}

export const mailApi = {
  markRead: (ids: string[]) => runOp("markRead", ids),
  markUnread: (ids: string[]) => runOp("markUnread", ids),
  star: (ids: string[]) => runOp("star", ids),
  unstar: (ids: string[]) => runOp("unstar", ids),
  move: (ids: string[], folder: MailFolder) => runOp("move", ids, { folder }),

  async remove(ids: string[]): Promise<number> {
    const res = await fetch("/api/emails", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "No se pudieron eliminar los mensajes");
    return data.deleted ?? ids.length;
  },

  async emptyTrash(): Promise<number> {
    const res = await fetch("/api/emails?empty=TRASH", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "No se pudo vaciar la papelera");
    return data.deleted ?? 0;
  },
};
