import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { eq, sql, and, or, desc, inArray } from "drizzle-orm";

const VALID_FOLDERS = [
  "INBOX",
  "SENT",
  "DRAFTS",
  "ARCHIVE",
  "SPAM",
  "TRASH",
] as const;
type MailFolder = (typeof VALID_FOLDERS)[number];

const VALID_OPS = ["markRead", "markUnread", "star", "unstar", "move"] as const;
type MailOp = (typeof VALID_OPS)[number];

function isFolder(value: unknown): value is MailFolder {
  return (
    typeof value === "string" &&
    (VALID_FOLDERS as readonly string[]).includes(value)
  );
}

function isOp(value: unknown): value is MailOp {
  return (
    typeof value === "string" && (VALID_OPS as readonly string[]).includes(value)
  );
}

function parseIds(body: unknown): string[] {
  const source = body as { ids?: unknown; id?: unknown } | null;
  if (!source) return [];
  const raw = Array.isArray(source.ids)
    ? source.ids
    : typeof source.id === "string"
      ? [source.id]
      : [];
  return raw.filter((id): id is string => typeof id === "string" && id.length > 0);
}

const emailColumns = {
  id: emails.id,
  messageId: emails.messageId,
  sender: emails.sender,
  recipient: emails.recipient,
  cc: emails.cc,
  bcc: emails.bcc,
  subject: emails.subject,
  bodyText: emails.bodyText,
  bodyHtml: emails.bodyHtml,
  attachments: emails.attachments,
  direction: emails.direction,
  folder: emails.folder,
  isRead: emails.isRead,
  isStarred: emails.isStarred,
  createdAt: emails.createdAt,
  inReplyTo: emails.inReplyTo,
  references: emails.references,
  updatedAt: emails.updatedAt,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawFolder = searchParams.get("folder") || "INBOX";
    const folder: MailFolder = isFolder(rawFolder) ? rawFolder : "INBOX";
    const q = searchParams.get("q")?.trim() || "";
    const unread = searchParams.get("unread");
    const starred = searchParams.get("starred");
    const all = searchParams.get("all") === "true";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 20)
    );
    const offset = (page - 1) * limit;

    const whereConditions = [];

    // La vista Starred ignora la carpeta y muestra destacados de cualquier carpeta.
    // `all=true` (búsqueda global) tampoco filtra por carpeta.
    if (!all && starred !== "true") {
      whereConditions.push(sql`folder = ${folder}`);
    }

    if (q) {
      whereConditions.push(
        or(
          sql`sender ILIKE ${`%${q}%`}`,
          sql`recipient ILIKE ${`%${q}%`}`,
          sql`subject ILIKE ${`%${q}%`}`,
          sql`body_text ILIKE ${`%${q}%`}`
        )
      );
    }

    if (unread === "true") {
      whereConditions.push(sql`is_read = false`);
    } else if (unread === "false") {
      whereConditions.push(sql`is_read = true`);
    }

    if (starred === "true") {
      whereConditions.push(sql`is_starred = true`);
    } else if (starred === "false") {
      whereConditions.push(sql`is_starred = false`);
    }

    const id = searchParams.get("id");

    if (id) {
      const [singleEmail] = await db
        .select(emailColumns)
        .from(emails)
        .where(eq(emails.id, id));

      if (singleEmail) {
        return NextResponse.json({ email: singleEmail });
      }
      return NextResponse.json({ error: "Email no encontrado" }, { status: 404 });
    }

    const whereClause = and(...whereConditions);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(emails)
      .where(whereClause);

    const data = await db
      .select(emailColumns)
      .from(emails)
      .where(whereClause)
      .orderBy(desc(emails.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data,
      page,
      pages: Math.max(1, Math.ceil(Number(count) / limit)),
      total: Number(count),
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const op = (body as { op?: unknown }).op;

    if (!isOp(op)) {
      return NextResponse.json(
        { error: "Operación no válida" },
        { status: 400 }
      );
    }

    const ids = parseIds(body);
    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Faltan los identificadores de los mensajes" },
        { status: 400 }
      );
    }

    let values: Partial<typeof emails.$inferInsert> = {};
    switch (op) {
      case "markRead":
        values = { isRead: true };
        break;
      case "markUnread":
        values = { isRead: false };
        break;
      case "star":
        values = { isStarred: true };
        break;
      case "unstar":
        values = { isStarred: false };
        break;
      case "move": {
        const folder = (body as { folder?: unknown }).folder;
        if (!isFolder(folder)) {
          return NextResponse.json(
            { error: "Carpeta de destino no válida" },
            { status: 400 }
          );
        }
        values = { folder };
        break;
      }
    }

    const updated = await db
      .update(emails)
      .set({ ...values, updatedAt: sql`now()` })
      .where(inArray(emails.id, ids))
      .returning({ id: emails.id });

    return NextResponse.json({ ok: true, updated: updated.length });
  } catch (error) {
    console.error("Error in email POST:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const empty = searchParams.get("empty");

    // Vaciar una carpeta completa (papelera). Acción irreversible con confirmación en UI.
    if (empty) {
      if (empty !== "TRASH" && empty !== "SPAM") {
        return NextResponse.json(
          { error: "Carpeta no válida para vaciar" },
          { status: 400 }
        );
      }
      const deleted = await db
        .delete(emails)
        .where(eq(emails.folder, empty))
        .returning({ id: emails.id });
      return NextResponse.json({ ok: true, deleted: deleted.length });
    }

    const id = searchParams.get("id");
    let ids: string[] = id ? [id] : [];
    if (ids.length === 0) {
      const body = await request.json().catch(() => null);
      ids = parseIds(body);
    }
    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Faltan los identificadores de los mensajes" },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(emails)
      .where(inArray(emails.id, ids))
      .returning({ id: emails.id });

    return NextResponse.json({ ok: true, deleted: deleted.length });
  } catch (error) {
    console.error("Error in email DELETE:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
