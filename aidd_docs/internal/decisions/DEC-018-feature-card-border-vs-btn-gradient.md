---
name: DEC-018-feature-card-border-vs-btn-gradient
description: bg-feature-card-border is border-only; bg-landing-btn-gradient for filled CTAs
type: decision
---

# Decision: `bg-feature-card-border` Border-Only Rule

| Field   | Value                    |
| ------- | ------------------------ |
| ID      | DEC-018                  |
| Date    | 2026-04-27               |
| Feature | Landing page, Hero section |
| Status  | Accepted                 |

## Context

`bg-feature-card-border` is a gradient with semi-transparent colors (`#f97416` near-0 opacity). When used as a filled button background on a white page, the transparent segments disappear, making the button look faded or invisible.

## Decision

- `bg-feature-card-border` → **border wrapper only**, always used as `p-px` outer div
- `bg-landing-btn-gradient` → **filled CTA buttons** (opaque blue→violet gradient, readable on both light and dark backgrounds)

```tsx
// CORRECT — border wrapper
<div className="rounded-2xl p-px bg-feature-card-border">
  <div className="rounded-2xl bg-white/40 dark:bg-[#0c0c14]/60 ...">...</div>
</div>

// CORRECT — filled CTA button
<Link className="rounded-xl bg-landing-btn-gradient border border-violet-500/30 text-white ...">
  Sign In
</Link>

// WRONG — semi-transparent gradient as button fill
<Link className="bg-feature-card-border text-white ...">Sign In</Link>
```

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
|---|---|---|---|
| Keep `bg-feature-card-border` on buttons | Consistent gradient | Washes out on white bg | Broken in light mode |
| Solid color button | Always readable | Loses brand gradient | Less visually distinctive |

## Consequences

- CTA buttons are always readable on white and dark backgrounds
- `bg-feature-card-border` usage is unambiguous: it's a border effect, never a fill
