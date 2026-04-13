---
name: browsing
description: Browser setup for AI navigation of the project
scope: frontend
---

# Browser Setup

- **Browsing Tool**: `claude-in-chrome` MCP (Chrome extension)
- **Starting URL**: http://localhost:3000/dashboard (after login)
- **Dev server**: `npm run dev` → http://localhost:3000
- **Authentication**: OAuth via GitHub or Google — must complete OAuth flow manually before automated browsing
- **Public entry**: http://localhost:3000/login
- **Protected routes**: /dashboard, /news, /opener, /stats, /ranking, /contests
