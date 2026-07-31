# UI baseline (revert reference)

Snapshot before the **v2 polish** pass (March 2026). Same brand: deep blue primary, teal accent, Geist font, sidebar layout.

## To revert visual polish

```bash
git checkout HEAD -- src/app/globals.css src/app/(authenticated)/layout.tsx src/shared/components/layout/Sidebar.tsx src/shared/components/layout/PageHeader.tsx src/shared/components/layout/PageShell.tsx src/shared/components/dashboard/StatCard.tsx src/shared/lib/order-status.ts src/app/(authenticated)/dashboard/page.tsx src/app/(authenticated)/orders/page.tsx src/app/(authenticated)/notifications/page.tsx src/app/(authenticated)/settings/page.tsx src/app/auth/login/page.tsx
```

Or restore `globals.css` tokens only if you want colors back but keep new components.

**Landing page (v2 marketing):** revert `src/app/page.tsx` and `src/features/marketing/` to restore placeholder hero / old CTA.

## Original tokens (`:root`)

- Primary: `oklch(0.42 0.15 260)` (deep blue)
- Secondary/accent: teal `oklch(0.55 0.12 190)` / `oklch(0.6 0.14 175)`
- Background: `oklch(0.98 0 0)`
- Radius: `0.625rem`
- Authenticated shell: `bg-[#F8FAFC]`
- Sidebar: flat `bg-background`, active nav `bg-primary shadow-lg shadow-primary/20`

## Layout pattern (unchanged)

- Left sidebar 256px + scrollable main
- Pages: `p-8`, cards `border-border/50 shadow-sm`
