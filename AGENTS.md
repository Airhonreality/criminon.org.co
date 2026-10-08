<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Correo Corporativo (Email Handler)

Sistema de correo corporativo para `criminon.org.co` (correo: `contacto@criminon.org.co`), con recepción vía Cloudflare Email Worker + R2 y envío vía Resend.

## Arquitectura (flujo entrante)

1. **Cloudflare Email Routing** recibe el correo.
2. **Worker de Email** (`workers/email-handler/src/index.js`) guarda adjuntos en el bucket R2 `criminonorgco-email-assets` y hace `POST` al webhook de Next.js con `Authorization: Bearer $WEBHOOK_SECRET`.
3. **Webhook** (`src/app/api/webhooks/incoming-email/route.ts`) valida el secreto e inserta en Neon Postgres (tabla `emails`, definida en `src/db/schema.ts`).

Saliente: `src/lib/resend.ts` expone `sendEmail()`, usa `Resend` con remitente fijo `Contacto <contacto@criminon.org.co>`.

## Convenciones de este repo

- App en `src/app/` (NOTA: rutas API van en `src/app/api/...`, no `app/`).
- ORM **Drizzle** con `postgres-js`: `src/db/index.ts` exporta `db`; tablas en `src/db/schema.ts` (IDs `uuid`, timestamps `createdAt`/`updatedAt`).
- Migraciones/schema con `drizzle-kit`; verificar tipos con `npx tsc --noEmit` y lint con `npm run lint`.
- El proyecto usa Next.js 16 — antes de tocar APIs/convenciones, leer `node_modules/next/dist/docs/`.

## Variables de entorno (.env.local, NO commitear)

`DATABASE_URL` (Neon), `RESEND_API_KEY`, `WEBHOOK_SECRET` (generado: ver `.env.local`), `R2_PUBLIC_URL`.

## Estado actual

- DONE en local: `.env.local`, `workers/email-handler/` (código + `wrangler.toml`), `r2-cors.json`, webhook `src/app/api/webhooks/incoming-email/route.ts`, `src/lib/resend.ts`, tabla `emails` en Drizzle. `tsc` y `eslint` limpios.
- BLOQUEADO en Cloudflare: **R2 sin habilitar** en la cuenta (`code: 10042`, Dashboard → R2 → Enable, requiere método de pago). Hasta habilitarlo no se puede crear el bucket ni desplegar el Worker (el binding R2 en `wrangler.toml` lo impide).
- PENDIENTE tras R2: `npx wrangler r2 bucket create criminonorgco-email-assets`, aplicar CORS (`r2-cors.json`), `npx wrangler deploy` (dentro de `workers/email-handler`), `npx wrangler secret put WEBHOOK_SECRET` y `R2_PUBLIC_URL`, activar Email Routing hacia el Worker en Dashboard.
- PENDIENTE credenciales: `DATABASE_URL` y `RESEND_API_KEY` reales las rellena el usuario en `.env.local`.
- Blocker Cloudflare: `npx wrangler login` (OAuth) ya hecho por el usuario — cuenta `46e1acdc8ec581550c5a55167566bcfd`.
- Despliegue: Vercel (repo `origin/main`), dominio `criminon.org.co` registrado en Spaceship; DNS en Cloudflare; Email Routing alias `contacto@`; Resend con DKIM `resend._domainkey`.
