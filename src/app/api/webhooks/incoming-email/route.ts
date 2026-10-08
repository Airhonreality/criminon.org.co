import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";

function toAddress(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "address" in value) {
    const address = (value as { address?: string }).address;
    if (address) return address;
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const secret = authHeader?.replace("Bearer ", "");

    if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    await db.insert(emails).values({
      messageId: body.messageId ?? null,
      sender: toAddress(body.from),
      recipient: toAddress(body.to),
      subject: body.subject ?? null,
      bodyText: body.bodyText ?? null,
      bodyHtml: body.bodyHtml ?? null,
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      direction: body.direction === "OUTBOUND" ? "OUTBOUND" : "INBOUND",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error procesando webhook de correo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
