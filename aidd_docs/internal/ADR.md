# Architecture Decision Record (ADR)

This file contains the key architectural decisions made during the project, along with their context and consequences.

## Decision Log

| Date       | ID      | Title                                                                         | Consequences                                    |
| ---------- | ------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| 2026-04-11 | DEC-001 | [Prisma singleton pattern](./decisions/DEC-001-prisma-singleton-pattern.md)   | One shared Prisma instance, dev hot-reload safe |
| 2026-04-11 | DEC-002 | [Standard vs edge Prisma client](./decisions/DEC-002-prisma-standard-client.md) | Standard client for server actions, edge only for Edge Runtime |
| 2026-04-11 | DEC-003 | [Pure function extraction pattern](./decisions/DEC-003-pure-function-extraction-pattern.md) | I/O in fetch helpers, compute in pure exported functions |
| 2026-04-12 | DEC-004 | [Shared dev/prod database](./decisions/DEC-004-shared-dev-prod-database.md) | Additive migrations only, no destructive seeds, no DB in tests |
| 2026-04-17 | DEC-005 | [Prisma column @map convention](./decisions/DEC-005-prisma-timestamp-map-convention.md) | All camelCase fields use @map to snake_case; raw SQL must match |
| 2026-04-17 | DEC-006 | [LocationRoleEnum for role parameters](./decisions/DEC-006-location-role-enum.md) | Zod enum over string union; callers use `LocationRoleEnum.Enum.*` |
| 2026-04-17 | DEC-007 | [checkUserLocationRole as centralized auth](./decisions/DEC-007-check-user-location-role.md) | DB-backed location auth replaces session-only `isOpener()` in mutations |
| 2026-04-18 | DEC-008 | [LocationStatus Zod enum](./decisions/DEC-008-location-status-enum.md) | Lowercase Zod enum in `domain/`; no raw status strings in app code |
| 2026-04-18 | DEC-009 | [last-location cookie for post-login redirect](./decisions/DEC-009-last-location-cookie.md) | ~~Superseded by DEC-012~~ |
| 2026-04-19 | DEC-010 | [react-select styling convention](./decisions/DEC-010-react-select-styling-convention.md) | All selects use `unstyled={true}` + `customSelectClassName`; no inline classNames |
| 2026-04-19 | DEC-011 | [Membership required for all location routes](./decisions/DEC-011-location-membership-guard.md) | Layout redirects non-members to `/locations` for all location statuses |
| 2026-04-19 | DEC-012 | [User-scoped last-location cookie](./decisions/DEC-012-user-scoped-last-location-cookie.md) | Cookie key `last-location-{userId}`; new users no longer inherit prior session's location |
