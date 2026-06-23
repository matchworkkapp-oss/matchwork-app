# MatchWork — Guía para Claude

## Proyecto
App de empleo estilo swipe (Tinder para trabajo). Stack: Next.js 16 + Tailwind v4 + Supabase + Vercel.

## Stack técnico
- **Framework:** Next.js 16, App Router, TypeScript strict, Turbopack
- **Estilos:** Tailwind v4 con `@theme inline` en `globals.css`. IMPORTANTE: usar inline styles para todo lo visual, no clases Tailwind — garantiza consistencia independiente de si Tailwind carga bien.
- **Auth:** Supabase Auth con `@supabase/ssr` (createBrowserClient / createServerClient). Google OAuth habilitado.
- **DB:** Supabase PostgreSQL con RLS en todas las tablas. Migration en `supabase/migrations/001_initial_schema.sql`.
- **Fonts:** Outfit (display/headings) + DM Sans (body). Cargados en `src/app/layout.tsx`.
- **Deploy:** Vercel + GitHub

## Paleta de colores
```
--color-void:        #0c0f28   (fondo base)
--color-navy:        #0d1525
--color-card:        #0f1728   (cards)
--color-cyan:        #38bdf8   (accent candidato)
--color-violet:      #a855f7   (accent empresa/recruiter)
--color-white:       #f1f5ff
--color-muted:       #64748b
--color-muted-light: #94a3b8
--color-success:     #4ade80
--color-warning:     #facc15
--color-danger:      #f87171
```

## Estructura de archivos clave
```
src/
  app/
    (auth)/
      layout.tsx          — Layout auth con gradiente + orbs
      login/page.tsx      — Login (Google + email/password)
      registro/page.tsx   — Registro 2 pasos (Google + formulario)
    (app)/
      feed/page.tsx       — Feed placeholder (a construir)
    auth/callback/route.ts — OAuth callback handler
    globals.css           — Tailwind v4 @theme inline
    layout.tsx            — Root layout con fonts
  components/
    Logo.tsx              — Logo wordmark (usa <img> plain, NO next/image)
  lib/supabase/
    client.ts             — createBrowserClient
    server.ts             — createServerClient con cookies
  middleware.ts           — Protección de rutas
  types/
    database.ts           — Tipos TypeScript completos del schema
supabase/
  migrations/
    001_initial_schema.sql — Schema completo ejecutado en Supabase
```

## Logo
El logo SVG (`/public/logo-wordmark.svg`) tiene viewBox offset (`95 388 850 160`). SIEMPRE usar `<img>` plain, nunca `next/image` — el procesamiento de Next rompe el viewBox.

Tamaños del componente Logo: sm=160px, md=200px, lg=260px.

## Base de datos — tablas principales
- `profiles` — usuario base (id = auth.users.id, role: candidate|recruiter)
- `candidate_profiles` — perfil candidato (headline, bio, location, work_mode, search_status)
- `company_profiles` — perfil empresa (name, description, industry, size, website)
- `skills` — catálogo de 50 skills semilla
- `candidate_skills` — skills del candidato con nivel
- `job_posts` — ofertas laborales
- `swipes` — swipes (candidato↔empresa, direction: like|pass|super)
- `matches` — matches mutuos
- `messages` — chat post-match

Trigger `handle_new_user()` crea fila en `profiles` automáticamente al registrarse, leyendo `role` y `full_name` de `raw_user_meta_data`.

## Convenciones de código
- Inline styles para todo lo visual (no clases Tailwind) — garantiza consistencia
- `'use client'` solo en componentes con estado/interactividad
- Páginas de auth en `(auth)/`, páginas protegidas en `(app)/`
- Variables de entorno en `.env.local` (nunca commitear)

## Credenciales (solo .env.local, nunca en código)
- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key pública

## Workflow preferido
- NO tomar screenshots ni controlar la PC salvo que sea estrictamente necesario
- Preguntar al usuario antes de usar computer-use
- Consultar al usuario para verificaciones visuales

## Fases de desarrollo
- **Fase 1 (actual):** Auth ✅ → Onboarding → Feed con swipe → Chat básico
- **Fase 2:** Super Match, empresas verificadas, estado de búsqueda, video presentación
- **Fase 3:** Monetización, PWA, Capacitor (Android/iOS)
