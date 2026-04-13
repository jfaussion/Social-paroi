---
name: forms
description: Frontend form handling guidelines
scope: frontend
---

# Forms

```mermaid
---
title: Form Libraries
---
flowchart LR
    ReactState["React useState"] --> FormComponent["Form Component"]
    ReactSelect["react-select"] --> FormComponent
    Zod["Zod (domain/)"] --> ServerAction["Server Action"]
    FormComponent --> ServerAction
```

## State Management

- Local React state (`useState`) for all form fields
- No global form state management
- react-select for enhanced dropdown/multi-select inputs

## Validation

- Zod schemas in `/domain/` — validated server-side in Server Actions
- No client-side pre-validation library

## Error handling

- Server Action returns error → sonner toast with error message
- Success → sonner toast with success message

## Form Flow

```mermaid
---
title: Form Submission Flow
---
flowchart LR
    User["User input"] --> LocalState["useState"]
    LocalState --> OnSubmit["onSubmit handler"]
    OnSubmit --> ServerAction["Server Action (lib/*/actions)"]
    ServerAction --> ZodValidate["Zod validate"]
    ZodValidate --> Prisma["Prisma query"]
    Prisma --> Response["Response"]
    Response --> Toast["sonner toast (success/error)"]
```
