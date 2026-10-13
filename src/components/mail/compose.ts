import { displayName, formatFullDate } from "./format";
import type { MailEmail } from "./types";

export interface ComposeInit {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  html: string;
  inReplyTo: string | null;
  references: string | null;
  /** Si proviene de un borrador existente (edición). */
  draftId?: string | null;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function splitAddresses(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function bareAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
}

function isSelf(value: string, ownAddress: string): boolean {
  return bareAddress(value) === ownAddress.toLowerCase();
}

function uniqueAddresses(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = bareAddress(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function stripSubjectPrefix(subject: string | null): string {
  return (subject || "").replace(/^\s*((re|fwd|fw)\s*:\s*)+/i, "").trim();
}

/** Convierte el cuerpo del mensaje en un fragmento HTML seguro para el editor. */
function bodyFragment(email: MailEmail): string {
  if (email.bodyHtml && email.bodyHtml.trim()) {
    return email.bodyHtml
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<\/?(html|head|body)[^>]*>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "");
  }
  return `<p>${escapeHtml(email.bodyText || "(sin contenido)")
    .replace(/\n/g, "<br>")}</p>`;
}

function primaryRecipient(email: MailEmail): string {
  if (email.direction === "OUTBOUND") {
    return splitAddresses(email.recipient)[0] ?? "";
  }
  return email.sender;
}

function threadParticipants(email: MailEmail, ownAddress: string): string[] {
  return uniqueAddresses([
    email.sender,
    ...splitAddresses(email.recipient),
    ...splitAddresses(email.cc),
  ]).filter((addr) => !isSelf(addr, ownAddress));
}

export function buildReply(email: MailEmail): ComposeInit {
  const subject = stripSubjectPrefix(email.subject);
  return {
    to: primaryRecipient(email),
    cc: "",
    bcc: "",
    subject: `Re: ${subject}`.trim(),
    html: `<p></p><p>El ${formatFullDate(email.createdAt)}, ${escapeHtml(
      displayName(email.sender)
    )} &lt;${escapeHtml(bareAddress(email.sender))}&gt; escribió:</p><blockquote>${bodyFragment(
      email
    )}</blockquote>`,
    inReplyTo: email.messageId || null,
    references: [email.references, email.messageId]
      .filter(Boolean)
      .join(" ")
      .trim() || null,
  };
}

export function buildReplyAll(email: MailEmail, ownAddress: string): ComposeInit {
  const participants = threadParticipants(email, ownAddress);
  const primary = primaryRecipient(email);
  const to = primary && !isSelf(primary, ownAddress) ? primary : participants[0] ?? "";
  const cc = uniqueAddresses(
    participants.filter((addr) => bareAddress(addr) !== bareAddress(to || ""))
  );
  const subject = stripSubjectPrefix(email.subject);
  return {
    to,
    cc: cc.join(", "),
    bcc: "",
    subject: `Re: ${subject}`.trim(),
    html: `<p></p><p>El ${formatFullDate(email.createdAt)}, ${escapeHtml(
      displayName(email.sender)
    )} &lt;${escapeHtml(bareAddress(email.sender))}&gt; escribió:</p><blockquote>${bodyFragment(
      email
    )}</blockquote>`,
    inReplyTo: email.messageId || null,
    references: [email.references, email.messageId]
      .filter(Boolean)
      .join(" ")
      .trim() || null,
  };
}

/** Convierte un borrador almacenado en el estado inicial del composer. */
export function buildDraftInit(email: MailEmail): ComposeInit {
  return {
    to: email.recipient || "",
    cc: email.cc || "",
    bcc: email.bcc || "",
    subject: email.subject || "",
    html:
      email.bodyHtml ||
      (email.bodyText
        ? `<p>${escapeHtml(email.bodyText).replace(/\n/g, "<br>")}</p>`
        : ""),
    inReplyTo: email.inReplyTo ?? null,
    references: email.references ?? null,
    draftId: email.id,
  };
}

export function buildForward(email: MailEmail): ComposeInit {
  const subject = stripSubjectPrefix(email.subject);
  const ccLine = email.cc ? `<br>CC: ${escapeHtml(email.cc)}` : "";
  return {
    to: "",
    cc: "",
    bcc: "",
    subject: `Fwd: ${subject}`.trim(),
    html: `<p></p><p>---------- Mensaje reenviado ----------</p><p>De: ${escapeHtml(
      email.sender
    )}<br>Fecha: ${formatFullDate(email.createdAt)}<br>Para: ${escapeHtml(
      email.recipient
    )}${ccLine}<br>Asunto: ${escapeHtml(email.subject || "(sin asunto)")}</p>${bodyFragment(
      email
    )}`,
    inReplyTo: null,
    references: null,
  };
}
