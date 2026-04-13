---
name: design
description: Design system and UI guidelines
scope: frontend
---

# DESIGN.md

## Design Implementation

- **Design System Approach**: Utility-first with Tailwind CSS, no custom design tokens
- **Styling Method**: Tailwind utility classes directly on components

## Design System Files

- **Theme Config**: `tailwind.config.ts` (minimal — only gradient backgrounds added)
- **Design Components**: `components/ui/` for generic reusable components
- **Icons**: react-icons library

```typescript
@tailwind.config.ts
```

## Component Standards

- **Toasts/Feedback**: sonner (success/error notifications)
- **Select inputs**: react-select for enhanced dropdowns
- **Markdown**: react-markdown with github-markdown-css for rendered content

## Layout System

- **Grid System**: Tailwind CSS utilities (flex, grid)
- **Responsive**: Tailwind responsive prefixes (sm, md, lg)
- **No custom breakpoints** defined
