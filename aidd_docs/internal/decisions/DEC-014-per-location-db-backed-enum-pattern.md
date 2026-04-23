---
name: decision
description: Replace static Zod enums with per-location DB-backed model for configurable domain values
type: decision
---

# Decision: Per-location DB-backed Enum Pattern

| Field   | Value                              |
| ------- | ---------------------------------- |
| ID      | DEC-014                            |
| Date    | 2026-04-23                         |
| Feature | Configurable Hold Colors           |
| Status  | Accepted                           |

## Context

Hold colors were hardcoded as a Zod enum (`HoldColor.enum.ts`) and a utility mapping (`color.utils.ts`). Different gyms need different sets of hold colors, making static enums unworkable for a multi-location product.

## Decision

Replace static enums with a `HoldColor` Prisma model scoped by `locationId`, following the same pattern as `DifficultyLevel`. Admin CRUD manages the set per location. UI components receive options as props fetched from `getHoldColors(locationId)`.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Keep global enum, add location override | Simple | Still hardcoded defaults, complex merge logic | Does not scale to N locations |
| JSON config per location | Flexible | No relational integrity, harder to query/filter | FK-based filter is simpler and type-safe |

## Consequences

- `domain/HoldColor.enum.ts` deleted; no static color mappings remain
- All color-to-hex logic removed from `utils/`; hex is stored directly in DB
- Any new location must seed its own hold colors (admin UI available)
- Track filter and form always fetch live options — no stale enum mismatch possible
- Pattern is reusable: any other per-location configurable value follows the same model + admin CRUD + DB-fed select approach
