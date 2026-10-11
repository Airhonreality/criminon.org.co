import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OutgoingAttachment {
  filename: string;
  /** URL pública del archivo (Resend lo descarga al enviar). */
  path: string;
  contentType?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  cc,
  bcc,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: OutgoingAttachment[];
}) {
  return await resend.emails.send({
    from: "Contacto <contacto@criminoncolombia.org>",
    to,
    subject,
    html,
    text,
    ...(cc ? { cc } : {}),
    ...(bcc ? { bcc } : {}),
    ...(replyTo ? { replyTo } : {}),
    ...(attachments && attachments.length > 0 ? { attachments } : {}),
  });
}
