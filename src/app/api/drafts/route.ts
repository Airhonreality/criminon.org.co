import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const id = typeof body.id === "string" ? body.id : null;
    const to = asString(body.to);
    const cc = asString(body.cc);
    const bcc = asString(body.bcc);
    const subject = asString(body.subject);
    const html = asString(body.html);
    const attachments = Array.isArray(body.attachments) ? body.attachments : [];
    const inReplyTo = asString(body.inReplyTo) || null;
    const references = asString(body.references) || null;

    const hasContent =
      to.trim() || subject.trim() || stripHtml(html) || attachments.length > 0;

    if (!hasContent) {
      return NextResponse.json(
        { error: "El borrador está vacío" },
        { status: 400 }
      );
    }

    const values = {
      recipient: to,
      cc: cc || null,
      bcc: bcc || null,
      subject: subject || null,
      bodyHtml: html || null,
      bodyText: stripHtml(html) || null,
      attachments,
      inReplyTo,
      references,
      direction: "OUTBOUND" as const,
      folder: "DRAFTS" as const,
      isRead: true,
      updatedAt: sql`now()`,
    };

    if (id) {
      const [updated] = await db
        .update(emails)
        .set(values)
        .where(and(eq(emails.id, id), eq(emails.folder, "DRAFTS")))
        .returning({ id: emails.id });

      if (!updated) {
        return NextResponse.json(
          { error: "Borrador no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json({ id: updated.id });
    }

    const [created] = await db
      .insert(emails)
      .values({ ...values, sender: "borrador" })
      .returning({ id: emails.id });

    return NextResponse.json({ id: created.id });
  } catch (error) {
    console.error("Error guardando borrador:", error);
    return NextResponse.json(
      { error: "Error interno al guardar el borrador" },
      { status: 500 }
    );
  }
}
