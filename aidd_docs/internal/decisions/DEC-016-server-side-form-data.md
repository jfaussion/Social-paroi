# Decision: Server-side form data fetching

| Field   | Value          |
| ------- | -------------- |
| ID      | DEC-016        |
| Date    | 2026-04-23     |
| Feature | TrackForm component |
| Status  | Accepted       |

## Context

TrackForm was mixing two approaches: zones fetched server-side from page, holdColors/difficultyLevels fetched client-side via hooks. This caused inconsistency, loading states, and unnecessary complexity.

## Decision

Form lookup data (zones, holdColors, difficultyLevels) must be fetched server-side in page components and passed as props. Client-side fetching is only justified for dynamic/refetched data.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Client-side hooks | Component is self-contained | Loading states, inconsistency, extra requests | Multiple round-trips, flash of empty content |
| Mixed approach | Flexible | Complex, error-prone | TypeScript errors, maintenance burden |

## Consequences

- Forms render instantly with all data available
- Page components handle all DB fetches via `Promise.all`
- Components become simpler, more testable
- Hooks only for true client-side dynamic needs (e.g., filters)