---
name: decision
description: Individual decision record template
argument-hint: manual-migration-for-production
---

# Decision: Manual migration file creation for production DBs

| Field   | Value                                        |
| ------- | -------------------------------------------- |
| ID      | DEC-017                                      |
| Date    | 2026-04-23                                   |
| Feature | Track Legacy Fields Cleanup                  |
| Status  | Accepted                                     |

## Context

When DATABASE_URL points to a production database (e.g., Neon with Vercel pooling), running `prisma migrate dev` is dangerous as it would apply changes directly to production. The track legacy cleanup required removing columns that would break production if applied incorrectly.

## Decision

For production databases, always generate migration files manually and apply them via `prisma migrate deploy` only after explicit confirmation. Create the migration directory and SQL file directly in `prisma/migrations/<timestamp>_<name>/migration.sql`.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Use `prisma migrate dev` | Auto-generates files | **Applies to wrong DB** | DATABASE_URL may point to production |
| Use `prisma migrate dev --create-only` | Creates file without applying | Still requires env switch | Extra step, manual file creation is straightforward |

## Consequences

- Migration files are always reviewed before application
- User must explicitly confirm target environment
- Production changes are intentional, not accidental