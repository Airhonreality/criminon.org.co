import { Resend } from "resend";
import { mailboxFrom } from "@/lib/mailbox";

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
  headers,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: OutgoingAttachment[];
}) {
  return await resend.emails.send({
    from: mailboxFrom,
    to,
    subject,
    html,
    text,
    ...(cc ? { cc } : {}),
    ...(bcc ? { bcc } : {}),
    ...(replyTo ? { replyTo } : {}),
    ...(headers && Object.keys(headers).length > 0 ? { headers } : {}),
    ...(attachments && attachments.length > 0 ? { attachments } : {}),
  });
}
