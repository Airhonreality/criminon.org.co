import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { to, subject, html, text } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: to, subject, html" },
        { status: 400 }
      );
    }

    // Enviar email usando la lib Resend
    const result = await sendEmail({
      to,
      subject,
      html,
      text,
    });

    // Resend return type es { data, error }
    // El ID viene en data.id o result.data.id
    const messageId = (result.data as any)?.id ?? null;

    // Opcional: guardar en la BD el email enviado
    await db.insert(emails).values({
      messageId,
      sender: "Contacto <contacto@criminon.org.co>",
      recipient: to,
      subject,
      bodyText: text,
      bodyHtml: html,
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