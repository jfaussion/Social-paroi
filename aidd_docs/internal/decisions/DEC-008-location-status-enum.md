# Decision: LocationStatus Zod enum for location status values

| Field   | Value          |
| ------- | -------------- |
| ID      | DEC-008        |
| Date    | 2026-04-18     |
| Feature | multi-location |
| Status  | Accepted       |

## Context

Location status (`published`, `hidden`) was used as raw string literals across `app/`, `prisma/seed.ts`, and `[locationSlug]/layout.tsx`. No type safety, no single source of truth, and inconsistent with the project convention of defining domain string sets as Zod enums in `domain/`.

## Decision

Create `domain/LocationStatus.enum.ts` with `z.enum(['published', 'hidden'])`. Export `LocationStatus` (the `.enum` accessor) for call sites. Values are lowercase to match the DB strings exactly — Zod preserves casing.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| `lib/locations/locationStatus.ts` with `as const` | Simple | Not Zod, wrong folder, inconsistent | Breaks domain/Zod convention |
| Prisma enum in schema | Auto-generated | Requires migration, overkill for 2 values | Added complexity without benefit |

## Consequences

- All status comparisons import from `domain/LocationStatus.enum.ts`
- Values are lowercase (`LocationStatus.published`, `LocationStatus.hidden`) matching DB strings
- Runtime-safe: Zod can parse/validate status strings from the DB against this enum
- Consistent with `LocationRole.enum.ts`, `ContestStatus.enum.ts`, etc.
