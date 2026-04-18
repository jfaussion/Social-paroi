# Decision: Cookie `last-location` for post-login auto-redirect

| Field   | Value          |
| ------- | -------------- |
| ID      | DEC-009        |
| Date    | 2026-04-18     |
| Feature | multi-location |
| Status  | Accepted       |

## Context

After login, users with existing memberships were always redirected to `/locations` picker, adding a mandatory click before reaching their gym. A frictionless daily workflow requires landing directly on the last visited location. The middleware (`auth.config.ts`) runs in Edge Runtime — no Prisma available — so DB-based last-visited lookup is not possible there.

## Decision

Store the last visited location slug in a client-side cookie `last-location` (30-day TTL, `SameSite=Lax`), set via `useEffect` in `Drawer.tsx` whenever `locationSlug` changes. `auth.config.ts` reads `request.cookies.get('last-location')` on login redirect: if present → `/${slug}/tracks`, otherwise → `/locations`.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| DB `lastVisitedLocationId` field | Persistent across devices | Requires Prisma in middleware (Edge-incompatible) | Not viable in Edge Runtime |
| localStorage | No server round-trip | Not readable server-side | Can't use in middleware redirect |
| Always redirect to `/locations` | Simple | Extra click every login | Poor UX for daily users |

## Consequences

- Zero DB query on login redirect
- Cookie set client-side in `Drawer.tsx` (only client component present on all `[locationSlug]/*` pages)
- `/locations` picker remains always accessible via Drawer "Change location" link
- First-time users (no cookie) land on `/locations` as expected
