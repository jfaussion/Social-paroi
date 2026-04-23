# Decision: LocationRoleEnum for typed location role parameters

| Field   | Value                    |
| ------- | ------------------------ |
| ID      | DEC-006                  |
| Date    | 2026-04-17               |
| Feature | multi-location           |
| Status  | Accepted                 |

## Context

`checkUserLocationRole` accepts a `minRole` parameter that can only be `'opener'` or `'admin'`. Using a string union type allows invalid values at call sites and is inconsistent with the project convention of defining all domain string sets as Zod enums.

## Decision

Create `domain/LocationRole.enum.ts` with `z.enum(['opener', 'admin'])` and use `LocationRole` (the inferred type) as the parameter type for `checkUserLocationRole` and all callers.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| String union `'opener' \| 'admin'` | No extra file | No runtime validation, inconsistent with project | Breaks Zod-enum convention |
| Reuse `UserRoleEnum` | Fewer files | Allows `'user'` and `'super_admin'` as valid inputs | Wrong domain — location roles are a subset |

## Consequences

- All call sites must import `LocationRoleEnum` and use `LocationRoleEnum.Enum.opener` / `LocationRoleEnum.Enum.admin`
- Runtime-safe: Zod can parse/validate role strings from the DB against this enum
- Consistent with `UserRoleEnum`, `DifficultyEnum`, etc.
