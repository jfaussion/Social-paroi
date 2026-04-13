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

@aidd_docs/templates/vcs/branch.md

### Observed pattern

- `feature/add-logs` (uses `feature/` prefix, kebab-case)
- PRs merged from feature branches into `dev`
- `dev` periodically merged into `main` for releases

## Commit Convention

@aidd_docs/templates/vcs/commit.md
