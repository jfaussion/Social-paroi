---
name: DEC-004-shared-dev-prod-database
description: Superseded — replaced by 3-environment / 2-Neon-branch architecture (2026-04-13)
type: decision
---

# Decision: Shared Development/Production Database

| Field          | Value                                         |
| -------------- | --------------------------------------------- |
| ID             | DEC-004                                       |
| Date           | 2026-04-12                                    |
| Feature        | Infrastructure                                |
| Status         | Superseded                                    |
| Superseded by  | 3-environment / 2-Neon-branch architecture (2026-04-13) |

## Context

The project originally ran a single Vercel Postgres database shared between development and production. As of 2026-04-13 the infrastructure was migrated to Neon with a 3-environment, 2-branch model providing full isolation between development and production workloads.

## Decision

Adopt a 3-environment / 2-Neon-branch architecture with Prisma Accelerate for deployed environments:

| Environment | Neon branch | Accelerate | DATABASE_URL |
| ----------- | ----------- | ---------- | ------------ |
| Production (Vercel) | `main` | yes — prod key | `prisma://accelerate...?api_key=PROD` |
| Dev deployed (Vercel) | `dev` | yes — dev key | `prisma://accelerate...?api_key=DEV` |
| Local (`.env.local`) | `dev` | no — direct | `postgresql://...` (dev branch) |

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Separate dev DB | Full isolation, safe experiments | Setup cost, data sync burden | Not feasible given original infra setup |
| Shadow DB for migrations | Prisma native support | Requires second DB instance | Same infra constraint (original) |
| Keep shared DB | No migration effort | No isolation, risky for development | Isolation is now achievable at low cost |

## Consequences

- Prisma migrations must be run manually (`npx prisma migrate deploy`) and reviewed carefully before execution
- Seed scripts must be additive only — never truncate, never delete existing rows
- Unit tests must not connect to the database (pure functions only, validated via lint + typecheck + build for DB-dependent code)
- Any destructive DB operation in development requires explicit confirmation
- Local and Vercel dev environments are now isolated from production — experiments on the `dev` branch do not affect real user data
- `DATABASE_URL` must be set correctly per environment; verify the active URL before running any migration
