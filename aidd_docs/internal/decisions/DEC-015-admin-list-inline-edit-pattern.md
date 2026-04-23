---
name: decision
description: Individual decision record template
argument-hint: admin-list-inline-edit-pattern
---

# Decision: Admin list inline edit pattern

| Field   | Value           |
| ------- | --------------- |
| ID      | DEC-015         |
| Date    | 2026-04-23      |
| Feature | Admin UI        |
| Status  | Accepted        |

## Context

Several admin list components (DifficultyLevelList, HoldColorList) had different editing behaviors. Need consistent UX for managing configurable entities.

## Decision

All admin list components follow a unified inline edit pattern:

**View mode (default):**
- Single line: indicator dot + name (clickable) + action buttons (up/down/delete)
- Click on name enters edit mode

**Edit mode:**
- Line 1: input field + color picker + hex input
- Line 2: Save + Cancel buttons
- Escape key cancels edit

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
| ----------- | ---- | ---- | ---------------- |
| OnBlur editing | No explicit save needed | No undo, sync issues | Poor UX for complex fields |
| Modal dialog | Full form support | Heavy, breaks flow | Overkill for simple edits |

## Consequences

- Consistent UX across admin interfaces
- Explicit save/cancel prevents accidental changes
- Reusable pattern for future admin components