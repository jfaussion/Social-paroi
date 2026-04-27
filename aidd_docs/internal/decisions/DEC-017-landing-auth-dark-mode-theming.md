---
name: DEC-017-landing-auth-dark-mode-theming
description: Dark/light mode theming convention for landing and auth pages
type: decision
---

# Decision: Landing & Auth Dark Mode Theming Convention

| Field   | Value                        |
| ------- | ---------------------------- |
| ID      | DEC-017                      |
| Date    | 2026-04-27                   |
| Feature | Landing page, Login page     |
| Status  | Accepted                     |

## Context

The landing page and login page were initially dark-only (`bg-landing-bg`, `text-white`). Adding light mode support required a consistent mapping of all color tokens to their light counterparts.

## Decision

Use Tailwind `dark:` prefix variants throughout landing and auth components. Base class = light mode, `dark:` = dark mode.

**Color mapping:**

| Element | Light | Dark |
|---|---|---|
| Page background | `bg-white` | `dark:bg-landing-bg` |
| Card inner | `bg-white/40 backdrop-blur-xl` | `dark:bg-[#0c0c14]/60 backdrop-blur-xl` |
| Heading text | `text-gray-900` | `dark:text-white` |
| Secondary text | `text-gray-500` | `dark:text-white/60` |
| Subtle text | `text-gray-600` | `dark:text-white/70` |
| Border | `border-black/10` | `dark:border-white/10` |
| Surface | `bg-black/5` | `dark:bg-white/5` |
| Surface hover | `hover:bg-black/10` | `dark:hover:bg-white/10` |
| Border hover | `hover:border-black/20` | `dark:hover:border-white/20` |

**Icon swap (provider buttons):**
```tsx
<img src={providerImageLight} className="w-5 h-5 dark:hidden" />
<img src={providerImageDark} className="w-5 h-5 hidden dark:block" />
```

**Glassmorphism auth card:**
```tsx
// Outer wrapper (border effect)
<div className="rounded-2xl p-px bg-feature-card-border shadow-2xl">
// Inner card
<div className="rounded-2xl bg-white/40 dark:bg-[#0c0c14]/60 backdrop-blur-xl p-8">
```

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
|---|---|---|---|
| JS-based theme detection (useEffect) | Works without CSS dark mode | Hydration flicker, extra JS | CSS `dark:` is zero-JS and flicker-free |
| Separate light/dark page files | No class clutter | Duplication | Unmaintainable — any change needs two edits |

## Consequences

- All landing/auth components consistently readable on both modes
- No JS overhead for theme switching
- `dark:` prefix required on every color class in landing/auth scope
