---
name: backend-communication
description: Frontend-backend communication patterns
scope: frontend
---

# Communication between backend and frontend

## Overview

- **Services**: Server Actions in `lib/*/actions/`, API Routes in `app/api/`
- **Request Types**: Server Actions (mutations/fetches), GET/POST for API routes
- **Entities**: Zod schemas in `/domain/`
- **Data Flow**: Component → Server Action → Zod validate → Prisma → PostgreSQL
- **Error Handling**: Centralized via `utils/logger.ts`, user feedback via sonner toasts
- **Validation**: Zod schemas at Server Action boundary

### Data Flow

```mermaid
---
title: Frontend to Backend Data Flow
---
sequenceDiagram
    participant Component as React Component
    participant Hook as lib/*/hooks
    participant Action as lib/*/actions (Server Action)
    participant Zod as Zod Schema
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL

    Component->>Hook: call hook (client)
    Hook->>Action: invoke server action
    Action->>Zod: validate input
    Zod-->>Action: parsed data
    Action->>Prisma: database query
    Prisma->>DB: SQL
    DB-->>Prisma: result
    Prisma-->>Action: typed result
    Action-->>Component: return data or error
    Component->>Component: sonner toast notification
```
