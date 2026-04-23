---
name: coding-assertions
description: Code quality verification checklist
scope: all
---

# Coding Guidelines

> Those rules must be minimal because they MUST be checked after EVERY CODE GENERATION.

## Requirements to complete a feature

**A feature is really completed if ALL of the above are satisfied: if not, iterate to fix all until all are green.**

## Commands to run

- `Before commit`: minimal check to build a feature
- `Before push`: heavier check ran before push

### Before commit

| Order | Command | Description |
| ----- | ------- | ----------- |
| 1 | `npm run lint` | ESLint via next lint |
| 2 | `npx tsc --noEmit` | TypeScript type check |

### Before push

| Order | Command | Description |
| ----- | ------- | ----------- |
| 1 | `npm run build` | Prisma generate + Next.js production build |
