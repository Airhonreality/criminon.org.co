const DEFAULT_PUBLIC_BASE =
  "https://pub-e0a6864a5934423c931999890326b2e2.r2.dev";

/**
 * Construye la URL pública de un objeto de R2.
 * Usa R2_PUBLIC_URL cuando está disponible (build/servidor) y cae al
 * dominio público conocido para no romper el renderizado estático.
 */
export function mediaUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL ?? DEFAULT_PUBLIC_BASE)
    .trim()
    .replace(/\/+$/, "");
  const encoded = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${base}/${encoded}`;
}
