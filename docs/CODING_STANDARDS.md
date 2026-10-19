# Nexora OS — Coding and UI Rules

1. **Modularity:** Break pages (`client/src/pages/<module>/`) into small subcomponents under `client/src/components/<module>/`. No file should exceed ~150–200 lines.
2. **Shared reusable components:** Always use primitives from `@/components/ui` (`Button`, `Card`, `Modal`, `Drawer`, `Input`, `Select`, `StatusBadge`, `Dropdown`, `IconButton`).
3. **`rounded-md` only:** Use `rounded-md` on all UI elements. Never use `rounded-lg`, `rounded-xl` or `rounded-2xl` (`rounded-full` only for avatars and dots).
4. **No shadows:** Never use `shadow-*`. Use flat borders (`border border-slate-200`) and subtle background contrast.
5. **UUID only:** Use UUID v4 strings for all entity IDs and references. Never use MongoDB `ObjectId`.
6. **Common backend helpers:** Use `@/common` utilities (`createApiResponse`, `PaginationDto`, `createPaginationMeta`, `IdUtil`, `StringUtil`, `DateUtil`, `HashUtil`, `setupSwagger`).
7. **Tenant scoping:** Every tenant-owned schema, query and job is scoped by `organizationId`.
8. **Latest packages:** Install every package at its latest stable version (`npm view <pkg> version`, `npm install <pkg>@latest`). No deprecated packages, no pre-release tags without approval.

Full guidance: [`.agents/skills/nexora-development-standards/SKILL.md`](../.agents/skills/nexora-development-standards/SKILL.md)
