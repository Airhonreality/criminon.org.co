<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Correo Corporativo (Email Handler)

Sistema de correo corporativo para `criminoncolombia.org` (correo: `contacto@criminoncolombia.org`), con recepción vía Cloudflare Email Worker + R2 y envío vía Resend.

## Arquitectura (flujo entrante)

1. **Cloudflare Email Routing** recibe el correo.
2. **Worker de Email** (`workers/email-handler/src/index.js`) guarda adjuntos en el bucket R2 `criminon` (binding `EMAIL_BUCKET`, ver `workers/email-handler/wrangler.toml`) y hace `POST` al webhook de Next.js con `Authorization: Bearer $WEBHOOK_SECRET`.
3. **Webhook** (`src/app/api/webhooks/incoming-email/route.ts`) valida el secreto e inserta en Neon Postgres (tabla `emails`, definida en `src/db/schema.ts`).

Saliente: `src/lib/resend.ts` expone `sendEmail()`, usa `Resend` con remitente fijo `Contacto <contacto@criminoncolombia.org>`.

## Convenciones de este repo

- App en `src/app/` (NOTA: rutas API van en `src/app/api/...`, no `app/`).
- ORM **Drizzle** con `postgres-js`: `src/db/index.ts` exporta `db`; tablas en `src/db/schema.ts` (IDs `uuid`, timestamps `createdAt`/`updatedAt`).
- Migraciones/schema con `drizzle-kit`; verificar tipos con `npx tsc --noEmit` y lint con `npm run lint`.
- El proyecto usa Next.js 16 — antes de tocar APIs/convenciones, leer `node_modules/next/dist/docs/`.

## Variables de entorno

Fuente de verdad: **Infisical**, proyecto `criminon-web` (`workspaceId` en `.infisical.json`, entorno por defecto `dev`; `prod` tiene el mismo set). `.env.local` es solo un espejo local y NO se commitea (`.gitignore: .env*`).

```bash
infisical secrets          # listar (requiere `infisical login`)
infisical run -- <cmd>     # inyectar los secretos en un comando
npm run db:push            # = infisical run -- drizzle-kit push
```

Vars: `DATABASE_URL` (Neon), `RESEND_API_KEY`, `WEBHOOK_SECRET`, `R2_PUBLIC_URL`, `CLOUDFLARE_API_TOKEN`, y las de acceso **S3 a R2** (subida de adjuntos salientes): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` (`criminon`).

Cliente S3 de R2: endpoint `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`, región `auto` (`@aws-sdk/client-s3`). Los objetos subidos quedan servidos por `R2_PUBLIC_URL`.

Nota: `drizzle-kit` NO lee `.env.local`; usa `npm run db:push` (o exporta `DATABASE_URL` a mano).

## Estado actual

- DONE: `.env.local`, `workers/email-handler/` + `wrangler.toml`, `r2-cors.json`, webhook `src/app/api/webhooks/incoming-email/route.ts`, `src/lib/resend.ts`, tabla `emails`.
- DONE: proyecto Infisical `criminon-web` con los secretos en `dev` y `prod`, enlazado vía `.infisical.json` (commiteable, sin secretos). Incluye credenciales S3 de R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`) en ambos entornos.
- DONE: schema aplicado a Neon con `drizzle-kit push` — 16 tablas, incluida `emails`. Fix en `src/db/schema.ts`: el `check()` generaba `CHECK (t.direction …)` → SQL inválido; se quitó el prefijo `t.`.
- FALTA (MVP webmail): API de listado, API de detalle, API de envío, frontend de bandeja.
- PENDIENTE Cloudflare: R2/bucket/Worker/Email Routing (ver historial: R2 sin habilitar, `code:10042`).
- Despliegue: Vercel (`origin/main`), dominio `criminoncolombia.org`; DNS en Cloudflare; Email Routing alias `contacto@`; Resend con DKIM `resend._domainkey`.
