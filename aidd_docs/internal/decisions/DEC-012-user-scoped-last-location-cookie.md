# Decision: User-scoped last-location cookie

| Field   | Value          |
| ------- | -------------- |
| ID      | DEC-012        |
| Date    | 2026-04-19     |
| Feature | multi-location |
| Status  | Accepted       |

## Context

DEC-009 introduced a `last-location` cookie written in `Drawer.tsx`. The cookie was browser-scoped — a new user logging in on a shared browser inherited the previous user's last location and was redirected there even without membership.

## Decision

The cookie key is namespaced by user ID: `last-location-${userId}`. Written in `Drawer.tsx` only when `session?.user?.id` is available. Read in `auth.config.ts` using `auth.user.id` from the JWT. Each user has their own independent last-location entry.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Only write cookie if user is member | Prevents stale redirect | Cookie already set from prior sessions | Doesn't clean up existing cookies |
| Validate membership at redirect (middleware) | Catches all cases | No Prisma in Edge Runtime | Not viable |
| sessionStorage instead of cookie | Auto-clears on tab close | Not readable server-side | Can't use in middleware |

## Consequences

- New users (no `last-location-{id}` cookie) always land on `/locations`
- Users switching accounts on the same browser no longer inherit each other's last location
- Old `last-location` (unscoped) cookies become inert — harmless, will expire in 30 days
