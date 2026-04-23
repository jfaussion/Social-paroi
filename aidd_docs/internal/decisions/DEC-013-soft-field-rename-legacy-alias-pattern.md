---
name: decision
description: Soft rename of Prisma field with preserved @map to avoid destructive DB migration
type: decision
---

# Decision: Soft Field Rename / Legacy Alias Pattern

| Field   | Value                              |
| ------- | ---------------------------------- |
| ID      | DEC-013                            |
| Date    | 2026-04-23                         |
| Feature | Configurable Hold Colors           |
| Status  | Accepted                           |

## Context

When migrating `Track.holdColor` (string) to `Track.holdColorId` (FK), the DB column `holdColor` could not be dropped or renamed because it contained existing data and production/dev share the same database.

## Decision

Rename the Prisma field alias only (`holdColor` → `holdColorLegacy`) while preserving `@map(name: "holdColor")` so the DB column is unchanged. Add the new FK field alongside the old one. Remove the legacy alias only after all consumers are fully migrated.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Drop old column immediately | Clean schema | Destroys existing data, requires backfill first in same migration | Too risky on shared prod DB |
| Keep same Prisma field name | No rename needed | Naming collision with the new relation field (`holdColor HoldColor?`) | Prisma disallows two fields with same name |

## Consequences

- Prisma schema has a `holdColorLegacy` field until full cleanup
- No data loss; backfill runs in a separate data migration
- All new code reads from `holdColorId` / `holdColor` (relation); legacy string is ignored by new consumers
