import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { sendEmail } from "@/lib/resend";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { to, subject, body: rawBody, html, text } = body;

    if (!to || !subject || (!rawBody && !html && !text)) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: to, subject y contenido" },
        { status: 400 }
      );
    }

    const textContent = text ?? rawBody ?? "";
    const htmlContent =
      html ?? (textContent ? escapeHtml(textContent).replace(/\n/g, "<br/>") : "");

    const result = await sendEmail({
      to,
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      console.error("Resend send error:", result.error);
      return NextResponse.json(
        { error: result.error.message || "Error al enviar el correo" },
        { status: 502 }
      );
    }

    const messageId = result.data?.id ?? null;

    await db.insert(emails).values({
      messageId,
      sender: "Contacto <contacto@criminoncolombia.org>",
      recipient: to,
      subject,
      bodyText: textContent,
      bodyHtml: htmlContent,
      direction: "OUTBOUND",
      folder: "SENT",
      isRead: false,
    });

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Error sending email via API:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el correo" },
      { status: 500 }
    );
  }
}