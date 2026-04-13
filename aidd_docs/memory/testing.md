---
name: testing
description: Testing strategy and guidelines
scope: all
---

# Testing Guidelines

## Current State

- **Vitest** installed (`vitest ^4.1.4`, `@vitest/coverage-v8 ^4.1.4`)
- Test script: `npm test` → `vitest run --passWithNoTests`
- Config: `vitest.config.ts` at project root (`environment: 'node'`, `@` alias to project root)
- Test files: `lib/contests/actions/generateContestRankings.test.ts` (8 unit tests, no DB)

## Validation Approach

- **Unit tests**: `npm test` (Vitest, pure functions only — no Prisma mocking needed)
- **Lint**: `npm run lint` (ESLint via eslint-config-next)
- **Type checking**: `npx tsc --noEmit` (TypeScript strict mode)
- **Build**: `npm run build` (Prisma generate + Next.js production build)

## Test Execution Process

Run `npm test` before commit. Tests cover pure scoring logic in `generateContestRankings.ts`. DB-dependent code (server actions, Prisma queries) is validated via lint + typecheck + build.

## Database Safety in Tests

- Tests must **never** connect to the database — dev and prod share the same DB
- No Prisma calls in test files, no seed scripts that delete or truncate data
- New test coverage must target pure functions only; DB logic is validated via build/typecheck
