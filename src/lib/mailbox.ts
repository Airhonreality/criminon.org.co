/**
 * Identidad del buzón corporativo.
 *
 * Nota: todavía no existe autenticación ni multi-tenant; el webmail es un
 * buzón único compartido. Mientras tanto la identidad se resuelve con un
 * valor por defecto (configurable vía `MAILBOX_ADDRESS` / `MAILBOX_NAME`).
 * Cuando se implemente la fase de auth, esto se reemplazará por el usuario
 * de la sesión sin cambiar la UI.
 */

export const DEFAULT_MAILBOX_ADDRESS = "contacto@criminoncolombia.org";
export const DEFAULT_MAILBOX_NAME = "Contacto";

export const mailboxAddress = (
  process.env.MAILBOX_ADDRESS?.trim() || DEFAULT_MAILBOX_ADDRESS
).toLowerCase();

export const mailboxName = process.env.MAILBOX_NAME?.trim() || DEFAULT_MAILBOX_NAME;

/** Valor listo para el header `From` de Resend. */
export const mailboxFrom = `${mailboxName} <${mailboxAddress}>`;

/** Extrae la dirección de un valor tipo `Nombre <correo@dominio>` o `correo@dominio`. */
export function parseAddress(value: string | null | undefined): string {
  if (!value) return "";
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
}

/** ¿La dirección corresponde al propio buzón? */
export function isOwnAddress(value: string | null | undefined): boolean {
  return parseAddress(value) === mailboxAddress;
}
