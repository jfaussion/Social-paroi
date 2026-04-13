---
name: api-docs
description: API documentation and specifications
scope: backend
---

# API Documentation

Next.js API Routes (minimal — most data access uses Server Actions):

- `app/api/auth/[...nextauth]/` — Auth.js handler (GET + POST)
- `app/api/uploads/cloudinary-signature/` — Returns signed Cloudinary upload params

## Authentication & Authorization

- **Authentication**: Auth.js v5 (next-auth beta) — JWT strategy
- **Authorization**: Role-based via JWT token (`role` field: `user`, `opener`, `admin`)
- **Session Management**: JWT stored in cookie, role injected via `jwt` + `session` callbacks

## Endpoints

- **Base URL**: `/api`
- **Format**: REST
- **Protocol**: HTTPS (Vercel) / HTTP (local dev)
- Most data operations use **Server Actions** (not REST API routes)

## Request/Response Formats

- Request format: JSON
- Response format: JSON
