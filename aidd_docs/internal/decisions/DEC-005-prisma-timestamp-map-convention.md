---
name: DEC-005-prisma-column-map-convention
description: All camelCase field names on new Prisma models must use @map to snake_case DB columns
type: decision
---

# Decision: Prisma Column @map Convention

| Field   | Value                        |
| ------- | ---------------------------- |
| ID      | DEC-005                      |
| Date    | 2026-04-17                   |
| Feature | Schema / Data Layer          |
| Status  | Accepted                     |

## Context

New models added during the multi-location feature (`DifficultyLevel`, `Zone`, `ContestUserTrack`, `ContestUserActivity`) were created without `@map` on timestamp fields, resulting in camelCase DB columns (`createdAt`, `updatedAt`) inconsistent with the snake_case convention already established by `Location` and `UserTrackProgress`. A follow-up standardization pass was needed, requiring a rename migration.

## Decision

All camelCase field names on new Prisma models must use `@map(name: "snake_case")` so PostgreSQL column names are consistently snake_case. This applies to every multi-word field — FKs, timestamps, any camelCase name.

```prisma
userId    String   @map(name: "user_id")
createdAt DateTime @default(now()) @map(name: "created_at")
updatedAt DateTime @updatedAt       @map(name: "updated_at")
```

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Keep camelCase DB columns | No migration needed | Inconsistent with existing models, harder to query raw SQL | Consistency and raw SQL readability matter |
| Use `@@map` only at table level | Cleaner schema | Does not affect column names | `@@map` only renames the table |

## Consequences

- Any raw SQL in migration files or plan docs must use the snake_case column name (e.g. `"created_at"`, not `"createdAt"`)
- New models must include `@map` on timestamps before running `prisma migrate dev` — adding it after requires a rename migration
- `UserTrackProgress` is the reference model for timestamp field conventions
