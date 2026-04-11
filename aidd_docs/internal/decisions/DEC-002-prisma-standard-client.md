---
name: DEC-002-prisma-standard-client
description: Use standard @prisma/client for server actions, not edge variant
type: decision
---

# Decision: Standard vs Edge Prisma Client

| Field   | Value                  |
| ------- | ---------------------- |
| ID      | DEC-002                |
| Date    | 2026-04-11             |
| Feature | Database / Server Actions |
| Status  | Accepted               |

## Context

Server action files were importing `PrismaClient` from `@prisma/client/edge`. The edge client targets Vercel Edge Runtime (lightweight, no Node.js APIs). Next.js server actions run in the standard Node.js runtime, making the edge client incorrect and potentially unstable.

## Decision

Use `@prisma/client` (standard) for all server actions and `auth.ts`. Reserve `@prisma/client/edge` exclusively for code targeting the Vercel Edge Runtime.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| `@prisma/client/edge` everywhere | Unified import | Wrong runtime, no Node.js API support in edge client | Server actions run in Node.js runtime |

## Consequences

- Correct runtime pairing: standard client in Node.js, edge client only in edge routes
- Non-`PrismaClient` types (e.g. `ContestActivity`) can still be imported from `@prisma/client/edge` if they originate there, but prefer `@prisma/client` for all type imports too
