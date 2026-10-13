import { format, isThisYear, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { MailEmail } from "./types";

export function formatListDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (isToday(date)) return format(date, "HH:mm", { locale: es });
  if (isThisYear(date)) return format(date, "d MMM", { locale: es });
  return format(date, "d MMM yyyy", { locale: es });
}

export function formatFullDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "d MMM yyyy, HH:mm", { locale: es });
}

export function formatSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Nombre legible de una dirección tipo `Nombre <correo@dominio>`. */
export function displayName(value: string | null | undefined): string {
  if (!value) return "(Desconocido)";
  const match = value.match(/^([^<]+)</);
  if (match) return match[1].trim().replace(/^"|"$/g, "") || value;
  return value;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Texto de vista previa para la fila de la lista. */
export function previewText(email: MailEmail, max = 120): string {
  const raw = email.bodyText?.trim() || (email.bodyHtml ? stripHtml(email.bodyHtml) : "");
  if (!raw) return "";
  return raw.length > max ? `${raw.slice(0, max)}…` : raw;
}

export function attachmentCount(email: MailEmail): number {
  return Array.isArray(email.attachments) ? email.attachments.length : 0;
}
