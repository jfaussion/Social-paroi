---
name: architecture
description: Module architecture and structure
scope: all
---

# Architecture

## Language/Framework

```json
@package.json
```

```mermaid
---
title: Social Paroi - Tech Stack
---
flowchart LR
    Frontend["Frontend"] --> NextJS["Next.js (App Router)"]
    Frontend --> React["React"]
    Frontend --> Tailwind["Tailwind CSS"]
    Frontend --> ReactSelect["react-select"]
    Frontend --> Sonner["sonner (toasts)"]
    NextJS --> ServerActions["Server Actions"]
    NextJS --> APIRoutes["API Routes"]
    ServerActions --> Prisma["Prisma ORM"]
    APIRoutes --> Cloudinary["Cloudinary"]
    Prisma --> PostgreSQL["PostgreSQL (Vercel)"]
    Auth["Auth.js (next-auth)"] --> GitHub["GitHub OAuth"]
    Auth --> Google["Google OAuth"]
    Auth --> Prisma
    Validation["Zod"] --> ServerActions
    Validation --> Frontend
```

### Naming Conventions

- **Files**: kebab-case for pages/routes, PascalCase for components and schema files
- **Components**: PascalCase (`TrackCard.tsx`)
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_CASE for enums
- **Types/Interfaces**: PascalCase, Zod schemas suffixed `.schema.ts`, enums suffixed `.enum.ts`

## Services communication

### Client → Server flow

```mermaid
---
title: Services Communication
---
C4Context
    Person(user, "User", "Authenticated climber or opener")
    System(nextjs, "Next.js App", "App Router + Server Actions")
    SystemDb(postgres, "PostgreSQL", "Vercel Postgres")
    System(cloudinary, "Cloudinary", "Image storage")
    Rel(user, nextjs, "HTTPS requests")
    Rel(nextjs, postgres, "Prisma queries")
    Rel(nextjs, cloudinary, "Signed upload / delete")
```

### External Services

#### Cloudinary

```mermaid
---
title: Cloudinary Upload Flow
---
flowchart LR
    Client["Browser"] -- "1. Request signature" --> APIRoute["app/api/uploads/cloudinary-signature"]
    APIRoute -- "2. Return signed params" --> Client
    Client -- "3. Direct upload" --> Cloudinary["Cloudinary CDN"]
    Cloudinary -- "4. Return imageUrl" --> Client
    Client -- "5. Save imageUrl" --> ServerAction["Server Action"]
```

#### Auth.js

```mermaid
---
title: Auth Flow
---
flowchart LR
    User["User"] -- "OAuth login" --> AuthJS["Auth.js"]
    AuthJS -- "Adapter" --> Prisma["PrismaAdapter"]
    AuthJS -- "JWT callback" --> Token["JWT (id + role)"]
    Token -- "Session callback" --> Session["Session object"]
    Middleware["middleware.ts"] -- "Protect routes" --> AuthJS
```
