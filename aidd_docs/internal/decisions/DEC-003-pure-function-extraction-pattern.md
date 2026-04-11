---
name: DEC-003-pure-function-extraction-pattern
description: Extract I/O fetch helpers from server actions to enable pure, testable compute functions
type: decision
---

# Decision: Pure Function Extraction Pattern for Server Actions

| Field   | Value                        |
| ------- | ---------------------------- |
| ID      | DEC-003                      |
| Date    | 2026-04-11                   |
| Feature | Contest scoring / Testability |
| Status  | Accepted                     |

## Context

Server action files mixed Prisma queries directly inside business logic functions, making it impossible to unit test the compute logic without a database. TypeScript also required duplicating Prisma return types manually when splitting functions.

## Decision

Split server action functions into two layers: private async `fetch*` helpers that own all Prisma queries, and exported synchronous `calculate*` functions that receive the raw data and return a result. Use `Awaited<ReturnType<typeof fetchFn>>` as parameter types to keep signatures auto-synced with Prisma without manual duplication.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Mock Prisma in tests | No refactor needed | Complex setup, tests implementation not behavior | Violates golden principle "do not mock business logic" |
| Move fetch helpers to a repository layer | Cleaner separation | Overhead for simple cases | Deferred — co-location acceptable for internal helpers |

## Consequences

- Compute functions are pure, synchronous, and unit-testable without a DB connection
- `Awaited<ReturnType<typeof fetchFn>>` pattern prevents param/return type drift
- Fetch helpers remain private (unexported) in the same file — no new files needed for simple cases
- Orchestrator calls `Promise.all([fetch1, fetch2])` then passes results to pure functions
