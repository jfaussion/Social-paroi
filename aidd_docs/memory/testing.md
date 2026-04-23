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
- Test files: multiple test files covering scoring logic, server actions, and session utilities (no DB)

## Validation Approach

- **Unit tests**: `npm test` (Vitest, pure functions only — no Prisma mocking needed)
- **Lint**: `npm run lint` (ESLint via eslint-config-next)
- **Type checking**: `npx tsc --noEmit` (TypeScript strict mode)
- **Build**: `npm run build` (Prisma generate + Next.js production build)

## Test Execution Process

Run `npm test` before commit. Tests cover pure scoring logic, server action helpers, and session utilities. DB-dependent code (server actions, Prisma queries) is validated via lint + typecheck + build.

## Database Safety in Tests

- Tests must **never** connect to the database
- No Prisma calls in test files, no seed scripts that delete or truncate data
- New test coverage must target pure functions only; DB logic is validated via build/typecheck
