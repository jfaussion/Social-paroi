---
name: DEC-001-prisma-singleton-pattern
description: Use shared Prisma singleton instead of per-action instantiation
type: decision
---

# Decision: Prisma Singleton Pattern

| Field   | Value                  |
| ------- | ---------------------- |
| ID      | DEC-001                |
| Date    | 2026-04-11             |
| Feature | Database / Server Actions |
| Status  | Accepted               |

## Context

Each server action was instantiating `new PrismaClient()` locally, creating a new database connection on every call. In development with hot-reload, this causes connection exhaustion. A shared singleton with a `global.prisma` guard solves both problems.

## Decision

All server action files import `prisma` from `@/prisma` (the shared singleton). `new PrismaClient()` is never called outside `prisma.ts`.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Per-action `new PrismaClient()` | Simple, self-contained | N connections per call, connection exhaustion in dev hot-reload | Performance and stability risk |

## Consequences

- Single Prisma instance shared across all server actions
- Dev hot-reload safe via `global.prisma` guard in `prisma.ts`
- When `PrismaClient` is needed as a structural type (e.g. `Omit<PrismaClient, ...>`), use `import type { PrismaClient } from '@prisma/client'` alongside the singleton import
