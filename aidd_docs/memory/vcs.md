---
name: vcs
description: VCS branch naming and commit conventions
scope: all
---

# Versioning Control System (VCS) Guidelines

- Main Branch: `main`
- Platform: GitHub
- CLI: `gh`
- Ticketing Tool: GitHub Issues

## Branch Naming Convention

- Pattern: `feature/add-logs` (uses `feature/` prefix, kebab-case)
- PRs merged from feature branches into `dev`
- `dev` periodically merged into `main` for releases

## Commit Convention

- Conventional Commits format (`fix:`, `feat:`, `chore:`, etc.)