import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { sendEmail } from "@/lib/resend";
import { renderEmail } from "@/lib/email-template";
import { mailboxFrom } from "@/lib/mailbox";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseAddresses(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

interface IncomingAttachment {
  filename: string;
  url: string;
  mimeType?: string;
  size?: number;
}

function parseAttachments(value: unknown): IncomingAttachment[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (a): a is IncomingAttachment =>
        !!a &&
        typeof a === "object" &&
        typeof (a as IncomingAttachment).filename === "string" &&
        typeof (a as IncomingAttachment).url === "string"
    )
    .map((a) => ({
      filename: a.filename,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
    }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const to = parseAddresses(body.to);
    const cc = parseAddresses(body.cc);
    const bcc = parseAddresses(body.bcc);
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const rawBody: string = body.body ?? "";
    const attachments = parseAttachments(body.attachments);

    const hasContent = !!body.html || !!rawBody || !!body.text;
    if (to.length === 0 || !subject || !hasContent) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: destinatario, asunto y contenido" },
        { status: 400 }
      );
    }

    const bodyHtml =
      typeof body.html === "string" && body.html.trim()
        ? body.html
        : escapeHtml(rawBody || body.text || "").replace(/\n/g, "<br/>");

    const { html, text } = await renderEmail({
      subject,
      bodyHtml,
    });

    const inReplyTo =
      typeof body.inReplyTo === "string" ? body.inReplyTo.trim() : "";
    const references =
      typeof body.references === "string" ? body.references.trim() : "";

    const headers: Record<string, string> = {};
    if (inReplyTo) headers["In-Reply-To"] = inReplyTo;
    if (references) headers["References"] = references;

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      cc: cc.length ? cc : undefined,
      bcc: bcc.length ? bcc : undefined,
      replyTo: typeof body.replyTo === "string" ? body.replyTo : undefined,
      headers: Object.keys(headers).length ? headers : undefined,
      attachments: attachments.length
        ? attachments.map((a) => ({
            filename: a.filename,
            path: a.url,
            contentType: a.mimeType,
          }))
        : undefined,
    });

    if (result.error) {
      console.error("Resend send error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Error al enviar el correo" },
        { status: 502 }
      );
    }

    const messageId = result.data?.id ?? null;

    try {
      await db.insert(emails).values({
        messageId,
        sender: mailboxFrom,
        recipient: to.join(", "),
        cc: cc.length ? cc.join(", ") : null,
        bcc: bcc.length ? bcc.join(", ") : null,
        subject,
        bodyText: text,
        bodyHtml: html,
        attachments,
        direction: "OUTBOUND",
        folder: "SENT",
        isRead: true,
        inReplyTo: inReplyTo || null,
        references: references || null,
      });
    } catch (dbError) {
      // El correo ya se envió; no debe reportarse como fallo.
      console.error("Error guardando correo enviado en la BD:", dbError);
    }

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Error sending email via API:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el correo" },
      { status: 500 }
    );
  }
}
