# Architecture Decision Record (ADR)

This file contains the key architectural decisions made during the project, along with their context and consequences.

## Decision Log

| Date       | ID      | Title                                                                         | Consequences                                    |
| ---------- | ------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| 2026-04-11 | DEC-001 | [Prisma singleton pattern](./decisions/DEC-001-prisma-singleton-pattern.md)   | One shared Prisma instance, dev hot-reload safe |
| 2026-04-11 | DEC-002 | [Standard vs edge Prisma client](./decisions/DEC-002-prisma-standard-client.md) | Standard client for server actions, edge only for Edge Runtime |
