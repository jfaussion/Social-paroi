# Decision: Membership required for all location routes

| Field   | Value          |
| ------- | -------------- |
| ID      | DEC-011        |
| Date    | 2026-04-19     |
| Feature | multi-location |
| Status  | Accepted       |

## Context

Previously, the `[locationSlug]/layout.tsx` only enforced membership for `hidden` locations. Published locations were accessible to any authenticated user, allowing new accounts (with no membership) to land directly on a gym's tracks page via `callbackUrl` redirect after login.

## Decision

The layout now checks membership for **all** locations regardless of status. Any authenticated user who is not a member is redirected to `/locations`. Super admins bypass this check. The `LocationStatus` check is removed from the layout entirely.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Guard only in `TracksPage` | Granular | Leaves other location sub-pages (stats, ranking, contests) unprotected | Incomplete |
| Check membership in middleware | Edge-compatible | No Prisma in Edge Runtime | Not viable |
| Show "join" prompt instead of redirect | Better UX discovery | Complex state management | Scope creep |

## Consequences

- All `[locationSlug]/*` routes require membership — one guard covers stats, tracks, ranking, contests, etc.
- New users always land on `/locations` first to pick and join a gym
- `LocationStatus.hidden` distinction is no longer meaningful for access control (removed from layout)
- `isSuperAdmin` is the only bypass — openers/admins are members via `userLocation` table
