---
name: database
description: Database schema and management
scope: backend
---

# Database

```json
@prisma/schema.prisma
```

## Main entities and relationships

```mermaid
---
title: Social Paroi - Main Entities
---
erDiagram
    User {
        String id PK
        String name
        String email
        String role
    }
    Track {
        Int id PK
        String name
        Int zone
        String level
        String holdColor
        Int locationId FK
    }
    Location {
        Int id PK
        String name
    }
    UserTrackProgress {
        Int id PK
        String userId FK
        Int trackId FK
        String status
        Boolean liked
    }
    Contest {
        Int id PK
        String name
        String status
        Int locationId FK
    }
    ContestUser {
        Int id PK
        Int contestId FK
        String userId FK
        Boolean isTemp
    }
    ContestTrack {
        Int id PK
        Int contestId FK
        Int trackId FK
    }
    ContestUserTrack {
        Int id PK
        Int contestUserId FK
        Int contestTrackId FK
        String status
    }
    ContestRanking {
        Int id PK
        Int contestId FK
        String type
    }

    User ||--o{ UserTrackProgress : "tracks"
    Track ||--o{ UserTrackProgress : "users"
    Location ||--o{ Track : "tracks"
    Location ||--o{ Contest : "contests"
    Contest ||--o{ ContestUser : "participants"
    Contest ||--o{ ContestTrack : "tracks"
    User ||--o{ ContestUser : "contests"
    ContestUser ||--o{ ContestUserTrack : "results"
    ContestTrack ||--o{ ContestUserTrack : "results"
    Contest ||--o{ ContestRanking : "rankings"
```

## Prisma Client Usage

- Singleton exported from `prisma.ts` at project root — always `import prisma from '@/prisma'`
- Never use `new PrismaClient()` in action files (causes N connections per call)
- Always use `@prisma/client` (standard) — never `@prisma/client/edge` in server actions (edge client is for Vercel Edge Runtime only)
- When `PrismaClient` is needed as a structural type (e.g. `Omit<PrismaClient, ...>`), use `import type { PrismaClient } from '@prisma/client'`
- See DEC-001 and DEC-002 in `aidd_docs/internal/ADR.md`

## Migrations

- Prisma Migrate — `npx prisma migrate dev` (local), `npx prisma migrate deploy` (prod)

## Seeding

- Init SQL: `database/social-paroi-init-db.sql`
