# Master Plan: Configurable Hold Colors

## Overview

- **Goal**: Replace hardcoded HoldColor enum/string with a per-location DB model, add admin CRUD, and wire all consumer screens
- **Risk Score**: 11/10
- **Branch**: `feature/configurable-hold-colors/`

## Child Plans

| #   | Plan                         | File                                          | Status   | Validated |
| --- | ---------------------------- | --------------------------------------------- | -------- | --------- |
| 1   | Data Model & Migration       | `./2026_04_23-configurable-hold-colors-part-1.md` | pending  | [ ]       |
| 2   | Admin CRUD                   | `./2026_04_23-configurable-hold-colors-part-2.md` | blocked  | [ ]       |
| 3   | Wired Screens & Cleanup      | `./2026_04_23-configurable-hold-colors-part-3.md` | blocked  | [ ]       |

## Validation Protocol

1. Complete Part 1, verify HoldColor table created and seed backfill applied
2. [ ] Checkpoint 1: User confirms DB state correct
3. Complete Part 2, verify admin CRUD works
4. [ ] Checkpoint 2: User confirms admin page functional
5. Complete Part 3, verify all consumer screens use holdColorId
6. [ ] Final: Integration test — create track, filter, view detail end-to-end

## Estimations

- **Confidence**: 9/10
- **Duration**: ~3h total (1h + 1h + 1h)
