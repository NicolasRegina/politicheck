# Politicheck — Comprehensive Security, SEO & Performance Audit (2026)

**Audit Date:** 2026-11-25  
**Scope:** Read-only code & configuration inspection (`vercel.json`, `astro.config.mjs`, `package.json`, `src/pages/api/**`, `src/services/**`, `src/components/**`, `src/layouts/**`, `src/pages/**`, `public/**`, `supabase/migrations/**`).  
**Target Stack:** Astro 5 (`output: 'static'` + `@astrojs/vercel` SSR endpoints), Supabase (Postgres + Auth + RLS), Tailwind CSS v4, Vercel Hosting & Crons.

---

## Executive Summary

Politicheck has a strong foundational architecture (lean client-side JS bundles, `wsrv.nl` external image optimization, `HttpOnly` cookie intent, and initial security headers in `vercel.json`). However, the audit identified **4 Critical**, **5 High**, **4 Medium**, and **3 Low** findings that expose the platform to unauthorized social-media posting, Stored XSS leading to admin session takeover, AI/RSS quota exhaustion, direct Supabase database manipulation, and severe SEO de-indexing of core hub pages.

| Severity | Count | Key Risk Themes |
| --- | :---: | --- |
| **Critical** | 4 | Unauthenticated X/Twitter posting, Stored XSS in Forum, Unauthenticated RSS/Gemini trigger, Permissive Supabase RLS |
| **High** | 5 | Missing CSP, `localStorage` admin token + non-`Secure` cookie, Admin DOM XSS & URL validation, Unthrottled forum reporting & serverless rate limits, Broken canonical URLs & stale sitemap |
| **Medium** | 4 | Service Worker caching `/admin`, Soft-404 on missing stories, Unoptimized local JPGs (up to 804 KB), Verbose error leakage & `SECURITY DEFINER` search paths |
| **Low** | 3 | Unused `lucide-react` dependency, `www` vs apex URL mismatch, Missing `NewsArticle` JSON-LD on `/historia/:id` |

---

## Critical Findings

### C-1. Unauthenticated Publishing to Official X/Twitter Account (`@politicheck_ok`)
- **Location:** `src/pages/api/social/tweet-latest.ts` (lines 7–79)
- **Risk:** The `ALL` route handler performs **zero authentication or authorization**. Any unauthenticated internet user can send `POST /api/social/tweet-latest` with `{ "customText": "..." }` to publish arbitrary tweets directly to `@politicheck_ok`, or `GET /api/social/tweet-latest?force=true` to force automated tweeting.
- **Remediation:** Require authenticated admin/superadmin privileges (via `authenticateRequest`) or a valid `CRON_SECRET` Bearer token, and restrict allowed HTTP methods.

```ts
// src/pages/api/social/tweet-latest.ts
import { authenticateRequest } from '../../../services/auth';

export const POST: APIRoute = async ({ request }) => {
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'No autorizado.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // ... validate customText length <= 280 and proceed
};
```

---

### C-2. Stored XSS in Story Civic Forum (`set:html` without HTML Escaping)
- **Location:**
  - `src/components/StoryCivicForum.astro` (lines 31–36, 251, 256, 372 — SSR)
  - `src/components/StoryCivicForum.astro` (lines 735–746 — client-side `linkify`)
- **Risk:**
  1. **Server-side (SSR):** `linkifyText(text)` replaces URLs with `<a>` tags without HTML-escaping `text`, and the template injects the result via `<Fragment set:html={linkifyText(comment.content)} />`. Any HTML or script markup submitted via `POST /api/forum/comments` is rendered raw to every visitor of `/historia/:id`.
  2. **Client-side:** `escape()` uses `d.textContent = str; return d.innerHTML`, which does **not** escape double quotes (`"`). When `linkify()` interpolates `url` into `<a href="${url}">`, a URL containing `"` can break out of the `href` attribute.
  3. **Chained Impact:** Combined with missing CSP (H-1) and the admin JWT stored in `localStorage` (H-2), an attacker can hijack an administrator's or superadmin's session when they view a story page.
- **Remediation:** Escape all five HTML metacharacters (`&`, `<`, `>`, `"`, `'`) before linkifying on both server and client, and strictly validate URL protocols with `new URL()`.

```ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkifyText(text: string): string {
  const escaped = escapeHtml(text);
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
  return escaped.replace(urlRegex, (rawUrl) => {
    try {
      const parsed = new URL(rawUrl.replace(/&amp;/g, '&'));
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return rawUrl;
      const safeHref = escapeHtml(parsed.href);
      return `<a href="${safeHref}" target="_blank" rel="nofollow noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:underline break-all">${rawUrl}</a>`;
    } catch {
      return rawUrl;
    }
  });
}
```

---

### C-3. Unauthenticated RSS Sync & Gemini AI Quota Exhaustion (Denial of Wallet)
- **Location:**
  - `src/pages/api/rss/sync.ts` (lines 37–51, 73)
  - `src/pages/index.astro` (lines 55–59)
- **Risk:**
  - `isAuthorizedAdmin` is set to `true` if `?cron=true` is present in the URL query string or `x-vercel-cron: 1` is sent in headers (both trivially client-controlled), and falls back to the hardcoded secret `'politicheck_cron_dev_secret'` whenever `CRON_SECRET` is unset.
  - Line 73 (`const shouldCluster = forceRefresh || isAuthorizedAdmin || ...`) allows any unauthenticated user requesting `GET /api/rss/sync?refresh=true` to bypass the 25-minute cooldown, trigger full RSS fetching across 31+ outlets, invoke Gemini AI clustering repeatedly, and call `autoTweetLatestStory()`.
  - `src/pages/index.astro:57` passes the secret in a query string (`?key=...`), which leaks it into server/CDN access logs.
- **Remediation:** Require `Authorization: Bearer <CRON_SECRET>` using `crypto.timingSafeEqual`, fail closed if `CRON_SECRET` is not configured in production, remove `?cron=true` and `?key=` auth bypasses, and pass the secret via the `Authorization` header (Vercel Cron automatically sends `Authorization: Bearer $CRON_SECRET` when configured).

```ts
import crypto from 'node:crypto';

function isValidCronBearer(authHeader: string): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // Fail closed
  const expected = `Bearer ${secret}`;
  if (authHeader.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));
}

// Reject unauthenticated sync triggers (allow ?status=true read-only fast-path)
if (!isValidCronBearer(authHeader)) {
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

---

### C-4. Permissive Supabase RLS Policies Enabling Direct DB Tampering & Staff Impersonation
- **Location:**
  - `supabase/migrations/20261012_story_civic_debates.sql` (lines 111–147)
  - `supabase/migrations/20261012_live_electoral_chat.sql` (lines 67–82)
  - `src/services/supabase.ts` (lines 5–12, 178–224)
- **Risk:** Because `src/services/supabase.ts` uses the public `anon` key (`SUPABASE_ANON_KEY` / `PUBLIC_SUPABASE_ANON_KEY`), the database relies entirely on RLS for protection:
  1. **`public.forum_votes` (lines 144–147):** `FOR ALL USING (true) WITH CHECK (true)` allows any anonymous client calling Supabase REST directly to insert, modify, or delete all votes with arbitrary `voter_hash` values, manipulating karma scores and force-collapsing comments (`karma_score <= -5`).
  2. **`public.forum_comments` (lines 116–128) & `public.chat_messages` (lines 75–82):** `INSERT` policies do not restrict `author_role` / `sender_role` or `user_id`. An anonymous client can insert rows directly with `author_role = 'superadmin'` or `sender_role = 'admin'`, impersonating Politicheck staff.
  3. **PII / Soft-Delete Leakage:** `Public Read Forum Comments` (`USING (true)`) exposes `ip_hash` and the original `content` of soft-deleted comments (`is_deleted = true`) to direct Supabase queries. `Public Read Active Messages` also exposes `ip_hash`.
  4. **Unmigrated Tables (`news_clusters`, `citizen_votes`):** Both tables are written to using the `anon` client in `src/services/supabase.ts`, indicating overly broad `anon` write permissions if RLS is disabled or permissive.
- **Remediation:**
  - Use a server-only `SUPABASE_SERVICE_ROLE_KEY` client inside Astro API routes for trusted writes (`news_clusters`, `forum_votes`, `citizen_votes`, `forum_comments`, `chat_messages`), and lock down `anon` RLS policies to `SELECT` only (or strictly enforce `author_role = 'user' AND user_id IS NULL`).
  - Expose public views (or column-level `GRANT SELECT (id, story_id, ...)`) that exclude `ip_hash` and mask `content` when `is_deleted = true`.

```sql
-- Restrict anonymous inserts to 'user' role only
DROP POLICY IF EXISTS "Public Insert Forum Comments" ON public.forum_comments;
CREATE POLICY "Public Insert Forum Comments"
  ON public.forum_comments FOR INSERT
  WITH CHECK (
    author_role = 'user'
    AND user_id IS NULL
    AND char_length(content) > 0
    AND ((parent_id IS NULL AND char_length(content) <= 600) OR (parent_id IS NOT NULL AND char_length(content) <= 350))
    AND is_deleted = false AND is_pinned = false AND report_count = 0 AND karma_score = 0
  );

DROP POLICY IF EXISTS "Public Insert Messages" ON public.chat_messages;
CREATE POLICY "Public Insert Messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    sender_role = 'user'
    AND user_id IS NULL
    AND char_length(content) > 0 AND char_length(content) <= 300
    AND is_deleted = false AND is_pinned = false
  );

-- Lock down forum_votes to server-side service_role (remove public write policy)
DROP POLICY IF EXISTS "Public Manage Forum Votes" ON public.forum_votes;
```

---

## High Findings

### H-1. Missing `Content-Security-Policy` (CSP) & Admin/API Cache Headers in `vercel.json`
- **Location:** `vercel.json` (lines 9–39)
- **Risk:** `vercel.json` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, and the deprecated `X-XSS-Protection: 1; mode=block`, but omits `Content-Security-Policy` (CSP), `Cross-Origin-Opener-Policy`, and `no-store`/`noindex` headers for `/admin/*` and `/api/*`. Without CSP, any XSS (such as C-2 or H-3) can execute arbitrary inline scripts and exfiltrate tokens to external origins.
- **Remediation:** Replace the `headers` block in `vercel.json` with the hardened configuration below. *(Note: Start with `Content-Security-Policy-Report-Only` for 48 hours to verify no third-party news image or inline script breaks, then switch the key to `Content-Security-Policy`.)*

```json
{
  "framework": "astro",
  "crons": [
    {
      "path": "/api/rss/sync?refresh=true",
      "schedule": "0 0 * * *"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    },
    {
      "source": "/admin/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, max-age=0"
        },
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow, noarchive"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

### H-2. Admin JWT Exposed in `localStorage`, Cookie Missing `Secure`, & Client-Only `/admin` Gate
- **Location:**
  - `src/pages/api/admin/auth.ts` (lines 102–121)
  - `src/pages/admin/login.astro` (lines 154–162)
  - `src/pages/admin/index.astro` (lines 1–14)
  - `src/pages/api/admin/banners.ts` (line 29), `src/pages/api/admin/users.ts` (line 28)
- **Risk:**
  1. `auth.ts` returns `access_token` and `refresh_token` in the JSON body and sets `sb-access-token` without the `Secure` attribute.
  2. `login.astro` stores `access_token` in `localStorage` (`politicheck_admin_token`) and overwrites `sb-access-token` via `document.cookie`, stripping `HttpOnly`. Any XSS can immediately steal the token.
  3. `src/pages/admin/index.astro` has no server-side auth check — unauthenticated requests receive the full admin HTML and SSR cluster/article counts.
  4. `banners.ts` and `users.ts` extract the JWT for `createScopedClient` only from the `Authorization` header (ignoring the cookie via `extractAuthToken(request)`), which breaks cookie-only auth.
- **Remediation:**
  - Set `Set-Cookie: sb-access-token=...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800` in `auth.ts` (omit `Secure` only when `import.meta.env.DEV`), stop returning raw tokens in JSON, and remove `localStorage`/`document.cookie` writes in `login.astro`.
  - Add an SSR guard at the top of `src/pages/admin/index.astro`:
    ```ts
    const auth = await authenticateRequest(Astro.request);
    if (!auth.isAuthenticated || !auth.isAdmin) {
      return Astro.redirect('/admin/login');
    }
    ```
  - Use `extractAuthToken(request)` in `banners.ts` and `users.ts`.

---

### H-3. Admin Dashboard DOM XSS & Unvalidated Banner URLs (`javascript:` URI Risk)
- **Location:**
  - `src/pages/admin/index.astro` (lines 733–777, 1114–1150)
  - `src/pages/api/admin/banners.ts` (lines 47–65)
  - `src/components/AdBanner.astro` (line 31)
- **Risk:**
  - `renderBannersList()` and `loadUsers()` inject `b.title`, `b.image_url`, `b.destination_url`, `p.email`, `p.id`, and `p.role` directly into `innerHTML` without HTML escaping.
  - `/api/admin/banners` does not validate URL schemes for `destination_url` or `image_url`, allowing `javascript:` URIs to be persisted and rendered on the public homepage via `AdBanner.astro`.
- **Remediation:** Validate protocols server-side before `upsertCivicBanner()`:

```ts
function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function isSafeImageUrl(value: string): boolean {
  return isSafeHttpUrl(value) || value.startsWith('/') || /^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value);
}
```
And escape all interpolated fields (or build elements with `document.createElement` + `textContent`) in `src/pages/admin/index.astro`.

---

### H-4. Unthrottled Comment Reporting & Serverless-Ineffective Rate Limiting
- **Location:**
  - `src/pages/api/forum/moderate.ts` (lines 35–53)
  - `src/pages/api/chat/messages.ts` (lines 8, 71–97)
  - `src/pages/api/forum/comments.ts` (lines 9, 127–153)
  - `src/pages/api/forum/vote.ts`, `src/pages/api/promises/vote.ts`, `src/pages/api/admin/auth.ts`
- **Risk:**
  1. `POST /api/forum/moderate` with `action: "report"` has **no rate limit and no deduplication** — 3 rapid requests from one client auto-collapse any comment (`report_count >= 3`).
  2. In-memory `Map` cooldowns (`ipCooldowns`) do not persist across Vercel Serverless cold starts or concurrent lambda instances.
  3. `/api/admin/auth` has no brute-force rate limiting; `/api/forum/vote` and `/api/promises/vote` rely on client-spoofable `X-Forwarded-For` / `User-Agent` headers and hardcoded fallback salts (`politicheck-*-salt-2027`) when `VOTE_SALT` is unset.
- **Remediation:**
  - Create a `forum_reports(comment_id UUID, reporter_hash TEXT, UNIQUE(comment_id, reporter_hash))` table to enforce 1 report per citizen per comment.
  - Use distributed rate limiting (Upstash Redis / Vercel KV or Postgres sliding-window RPC) on `/api/admin/auth`, `/api/chat/messages`, `/api/forum/comments`, `/api/forum/moderate`, and `/api/promises/vote`.
  - Prefer `request.headers.get('x-vercel-forwarded-for')` (or Astro's `clientAddress`) over raw `x-forwarded-for`, and require `VOTE_SALT` in production environment variables.

---

### H-5. Broken Canonical URLs, Indexable Admin Routes & Stale Static Sitemap (SEO)
- **Location:**
  - `src/layouts/Layout.astro` (lines 25, 105–109)
  - `src/pages/elecciones-brasil.astro`, `src/pages/metodologia.astro`, `src/pages/guias/index.astro`, `src/pages/terminos.astro`
  - `public/robots.txt`
  - `src/pages/sitemap.xml.ts` (line 7: `export const prerender = true`)
- **Risk:**
  1. **Self-Destructive Canonicals:** `Layout.astro` defaults `canonicalUrl` to `"https://www.politicheck.com.ar"`. Pages that omit `canonicalUrl` (`/elecciones-brasil`, `/metodologia`, `/guias`, `/terminos`) tell Google they are duplicates of the homepage, preventing them from ranking.
  2. **Admin Pages Indexable:** `public/robots.txt` has `Allow: /` with no `Disallow: /admin/` or `Disallow: /api/`, and `Layout.astro` hardcodes `index, follow` on `/admin` and `/admin/login`.
  3. **Stale Sitemap:** `sitemap.xml.ts` is statically prerendered at build time from `src/data/clustered_stories.json`. Newly clustered daily stories in Supabase (`/historia/:id`) and candidate pages (`/candidato/:slug`) are missing from `sitemap.xml` until the next deployment.
- **Remediation:**
  - In `src/layouts/Layout.astro`, compute the default canonical URL dynamically and support a `noindex` prop:
    ```ts
    const defaultCanonical = new URL(Astro.url.pathname, 'https://www.politicheck.com.ar').toString().replace(/\/$/, '') || 'https://www.politicheck.com.ar';
    const { canonicalUrl = defaultCanonical, noindex = false, ... } = Astro.props;
    ```
  - Update `public/robots.txt`:
    ```txt
    User-agent: *
    Allow: /
    Disallow: /admin/
    Disallow: /api/

    Sitemap: https://www.politicheck.com.ar/sitemap.xml
    ```
  - Change `src/pages/sitemap.xml.ts` to `export const prerender = false`, query `getNewsClustersFromSupabase({ maxAgeDays: 14, limit: 200 })`, include `/candidato/:slug` routes, and keep `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.

---

## Medium Findings

### M-1. Service Worker Caches Authenticated `/admin` HTML Navigations
- **Location:** `public/sw.js` (lines 46–62)
- **Risk:** The fetch handler comments *"Ignore non-GET, API sync or auth endpoints"*, but only skips `/api/rss/sync`. Any `GET` navigation to `/admin` returning `200` is written into `CacheStorage` (`politicheck-v1.0`), persisting administrative HTML on shared devices after logout.
- **Remediation:** Skip caching for `/admin` and `/api/` paths:
  ```js
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;
  ```

### M-2. Soft-404 (`200 OK`) on Non-Existent Story URLs
- **Location:** `src/pages/historia/[id].astro` (lines 13–17)
- **Risk:** When `story` is `undefined`, the page responds with HTTP `200 OK` and `<meta name="robots" content="index, follow">`, creating soft-404s in Google Search Console and wasting crawl budget.
- **Remediation:** Set `Astro.response.status = 404` and pass `noindex={true}` to `<Layout>` when `!story`.

### M-3. Unoptimized Local Static Images in `public/images/` (LCP & Bandwidth)
- **Location:** `public/images/**`, `src/utils/image.ts` (lines 16–19)
- **Risk:** `getOptimizedImageUrl()` bypasses relative `/` paths. Several local assets served directly from `public/images/` are heavy uncompressed JPEGs/PNGs:
  - `public/images/brasil-planalto.jpg` — **804.1 KB**
  - `public/images/social/twitter_banner.jpg` — **709.4 KB**
  - `public/images/guias/quien-es-el-dueno-de-infobae.jpg` — **494.8 KB**
  - `public/images/universidad.jpg` — **342.8 KB**
  - `public/images/guias/quien-es-el-dueno-de-la-nacion.jpg` — **335.2 KB**
  - `public/images/guias/mapa-de-medios-argentina.jpg` — **303.0 KB**
- **Remediation:** Convert static JPEGs to WebP/AVIF (target ≤100 KB) or move them to `src/assets/` and render with Astro's `<Image />` component with explicit `width` and `height` attributes to prevent CLS and improve mobile LCP.

### M-4. Verbose Error Leakage & `SECURITY DEFINER` Functions Missing `search_path`
- **Location:**
  - API routes: `src/pages/api/admin/auth.ts:124`, `banners.ts:141`, `users.ts:102`, `chat/messages.ts:120`, `forum/comments.ts:201`, `rss/sync.ts:129`
  - Migrations: `get_my_role()` & `handle_new_user()` (`20260928_admin_roles_and_banners.sql`), `recalculate_comment_karma()` (`20261012_story_civic_debates.sql`)
- **Risk:** Returning raw `err.message` leaks internal PostgREST/Postgres schema details to callers. `SECURITY DEFINER` functions without `SET search_path = ''` are vulnerable to Postgres `search_path` hijacking.
- **Remediation:** Log `err` server-side and return generic Spanish error strings; add `SET search_path = ''` to all `SECURITY DEFINER` functions and schema-qualify all table references (`public.*`).

---

## Low Findings

### L-1. Unused Dependency & Global CSS/Widget Footprint
- **Location:** `package.json` (line 19), `src/layouts/Layout.astro` (line 166)
- **Observation:**
  - `lucide-react` (`^0.475.0`) is listed in `dependencies` with zero imports across `src/` (Astro uses inline SVGs). Removing it cleans up the dependency tree.
  - Client JS bundles in `dist/client/_astro/` are commendably small (largest chunks: `19.5 KB`, `16.6 KB`, `16.4 KB`; CSS bundle: `131.5 KB` uncompressed). `LiveChat.astro` (`5.6 KB` JS) is mounted globally in `Layout.astro`; consider lazy-loading its polling/script only when the user opens the chat drawer.

### L-2. Domain Consistency (`www` vs Apex)
- **Location:** `src/pages/admin/index.astro` (line 990)
- **Observation:** The X/Twitter draft composer generates `https://politicheck.com.ar/historia/${id}` whereas `astro.config.mjs`, `Layout.astro`, and `sitemap.xml.ts` standardize on `https://www.politicheck.com.ar`. Align to `https://www.politicheck.com.ar` to avoid unnecessary 301 redirect hops on social traffic.

### L-3. Missing `NewsArticle` JSON-LD on `/historia/[id]`
- **Location:** `src/pages/historia/[id].astro`
- **Observation:** `Layout.astro` emits `NewsMediaOrganization` + `WebSite` schema, and `guias/[slug].astro` emits `Article` + `FAQPage` schema, but `/historia/[id]` does not emit `NewsArticle` JSON-LD (`headline`, `datePublished`, `dateModified`, `image`, `publisher`). Adding it improves eligibility for Google News and Top Stories rich results.

---

## Prioritized Remediation Roadmap

1. **Immediate (P0 — Blockers before high traffic):**
   - Lock down `/api/social/tweet-latest` (C-1) and `/api/rss/sync` (C-3).
   - Patch Stored XSS in `StoryCivicForum.astro` (C-2).
   - Deploy Supabase RLS migration tightening `forum_votes`, `forum_comments`, and `chat_messages` (C-4).
2. **Short-Term (P1 — Same Week):**
   - Deploy hardened `vercel.json` headers with CSP and `/admin` `X-Robots-Tag` (H-1).
   - Remove `localStorage` admin token, add `Secure` cookie flag, and add SSR auth guard to `/admin` (H-2, H-3).
   - Fix `Layout.astro` dynamic `canonicalUrl`, `robots.txt`, and dynamic `sitemap.xml.ts` (H-5).
   - Add deduplicated `forum_reports` table and distributed rate limiting (H-4).
3. **Follow-Up (P2 — Next Sprint):**
   - Exclude `/admin` and `/api/` from `public/sw.js` (M-1), return `404` on missing stories (M-2), optimize `public/images/` to WebP/AVIF (M-3), harden `SECURITY DEFINER` search paths (M-4), and clean up `lucide-react` / `NewsArticle` JSON-LD (L-1–L-3).
