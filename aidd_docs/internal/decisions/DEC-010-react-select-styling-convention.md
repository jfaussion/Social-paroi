---
name: decision
description: Standardize all react-select instances to use customSelectClassName + unstyled
type: decision
---

# Decision: react-select Styling Convention

| Field   | Value                        |
| ------- | ---------------------------- |
| ID      | DEC-010                      |
| Date    | 2026-04-19                   |
| Feature | UI / Filters / Forms         |
| Status  | Accepted                     |

## Context

Multiple `react-select` instances in the codebase used inconsistent styling: `ZoneFilter` used `unstyled={true}` + `customSelectClassName`, while `DifficultyFilter` and the difficulty select in `TrackForm` used `unstyled={false}` with inline `classNames`. This caused visible design drift between filters on the same page.

## Decision

All `react-select` instances must use `unstyled={true}` + `customSelectClassName` (from `components/ui/customSelectClassName.ts`). Custom `formatOptionLabel` is allowed alongside it for per-option rendering (color dots, points badges).

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| Per-component inline classNames | Flexible | Diverges from design system, hard to theme globally | Creates inconsistency across filters and forms |
| CSS modules per select | Scoped | No Tailwind, extra files | Overkill for a shared component |

## Consequences

- All selects render consistently (gray background, same border/indicator style)
- `formatOptionLabel` can add color dots or badges without touching styles
- Color dot convention: `10px × 10px`, `borderRadius: 50%`, no border, `flexShrink: 0`
- In multi-select chips, use `context === 'menu'` guard to hide badges (pts) from value chips
