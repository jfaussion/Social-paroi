# Decision: checkUserLocationRole as centralized location authorization

| Field   | Value                    |
| ------- | ------------------------ |
| ID      | DEC-007                  |
| Date    | 2026-04-17               |
| Feature | multi-location           |
| Status  | Accepted                 |

## Context

Server actions previously used `isOpener(session)` / `isAdmin(session)` — session-level role checks that ignore location context. With multi-location support, authorization must be scoped: a user may be an opener at location A but not at location B.

## Decision

Replace all `isOpener()` / `isAdmin()` guards in mutation server actions with `checkUserLocationRole(userId, locationId, minRole)`, a DB-backed helper in `lib/locations/actions/checkUserLocationRole.ts` that queries `UserLocationRole`, enforces role hierarchy (`admin` satisfies `opener`), and short-circuits to `true` for `super_admin` global role.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Keep `isOpener(session)` | No DB call | Ignores location scope entirely | Breaks multi-location authorization model |
| Inline `UserLocationRole` query per action | No helper dependency | Duplicated logic, no hierarchy | Violates DRY, hard to change hierarchy later |

## Consequences

- Every mutation action gains one extra DB query (user global role check + location role check)
- `super_admin` bypass avoids needing explicit `UserLocationRole` rows for global admins
- `isOpener` / `isAdmin` from `session.utils.ts` are still used in client-side UI guards (show/hide buttons) — they are not removed
