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
        String? name
        String? email
        String? role
        String? image
    }
    Location {
        Int id PK
        String name
        String type
        String? address
        String? website
        String? mapImageUrl
        String? slug
        String status
    }
    DifficultyLevel {
        Int id PK
        Int locationId FK
        String name
        String? color
        Int points
        Int order
    }
    Zone {
        Int id PK
        Int locationId FK
        String name
        Int order
        String? miniMapUrl
    }
    HoldColor {
        Int id PK
        Int locationId FK
        String name
        String color
        Int order
    }
    Track {
        Int id PK
        String? name
        Int zone
        Int? points
        String? level
        String? imageUrl
        Int? locationId FK
        Int? difficultyLevelId FK
        Int? zoneId FK
        Int? holdColorId FK
        Boolean? removed
    }
    UserLocation {
        Int id PK
        String userId FK
        Int locationId FK
    }
    UserLocationRole {
        Int id PK
        String userId FK
        Int locationId FK
        String role
    }
    UserTrackProgress {
        Int id PK
        String? userId FK
        Int? trackId FK
        String status
        Boolean? liked
        DateTime? dateCompleted
    }
    Contest {
        Int id PK
        String name
        DateTime date
        String? coverImage
        String status
        Int locationId FK
    }
    ContestTrack {
        Int id PK
        Int contestId FK
        Int trackId FK
    }
    ContestActivity {
        Int id PK
        String name
        String? image
        String description
        Int contestId FK
    }
    ContestUser {
        Int id PK
        Int contestId FK
        String? userId FK
        String? name
        String? gender
        Boolean isTemp
    }
    ContestUserTrack {
        Int id PK
        Int contestUserId FK
        Int contestTrackId FK
        String status
    }
    ContestUserActivity {
        Int id PK
        Int contestUserId FK
        Int contestActivityId FK
        Int score
        String? notes
    }
    ContestRanking {
        Int id PK
        Int contestId FK
        String type
        String csvContent
        DateTime generatedAt
    }
    ContestRankingResult {
        Int id PK
        Int contestRankingId FK
        Int contestUserId FK
        Int rank
        Float totalScore
        Float trackScore
        Int activityScore
        Int completedTracks
        Json trackDetails
        Json activityDetails
    }
    News {
        Int id PK
        String title
        String content
        DateTime date
        Boolean deleted
        String userId FK
        Int locationId FK
    }

    User ||--o{ UserTrackProgress : "progress"
    User ||--o{ UserLocation : "memberships"
    User ||--o{ UserLocationRole : "locationRoles"
    Location ||--o{ UserLocation : "members"
    Location ||--o{ UserLocationRole : "roles"
    Location ||--o{ Track : "tracks"
    Location ||--o{ DifficultyLevel : "difficultyLevels"
    Location ||--o{ Zone : "zones"
    Location ||--o{ HoldColor : "holdColors"
    Location ||--o{ Contest : "contests"
    Location ||--o{ News : "news"
    DifficultyLevel ||--o{ Track : "tracks"
    Zone ||--o{ Track : "tracks"
    HoldColor ||--o{ Track : "tracks"
    Track ||--o{ UserTrackProgress : "progress"
    Contest ||--o{ ContestTrack : "tracks"
    Contest ||--o{ ContestUser : "participants"
    Contest ||--o{ ContestActivity : "activities"
    Contest ||--o{ ContestRanking : "rankings"
    ContestTrack ||--o{ ContestUserTrack : "results"
    ContestActivity ||--o{ ContestUserActivity : "results"
    ContestUser ||--o{ ContestUserTrack : "results"
    ContestUser ||--o{ ContestUserActivity : "results"
    ContestUser ||--o{ ContestRankingResult : "results"
    ContestRanking ||--o{ ContestRankingResult : "results"
    User ||--o{ News : "news"
```

## Prisma Client Usage

- Singleton exported from `prisma.ts` at project root — always `import prisma from '@/prisma'`
- Never use `new PrismaClient()` in action files (causes N connections per call)
- Always use `@prisma/client` (standard) — never `@prisma/client/edge` in server actions (edge client is for Vercel Edge Runtime only)
- When `PrismaClient` is needed as a structural type (e.g. `Omit<PrismaClient, ...>`), use `import type { PrismaClient } from '@prisma/client'`

## Migrations

- Dev: `npx prisma migrate dev` — standard Prisma workflow
- Prod: `npx prisma migrate deploy` — Vercel handles on deploy

## Seeding

- Init SQL: `database/social-paroi-init-db.sql`