# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**VOXU** — Personal finance management SPA. React 18 + TypeScript 5.9 + Vite 5. UI in Spanish (Rioplatense).

## Commands

```bash
bun run dev        # Dev server (hot reload)
bun run build      # Production build (Vite)
bun run preview    # Preview production build
bun run test       # Vitest in watch mode
bun run coverage   # Coverage report (v8)
```

Run a single test file:
```bash
bunx vitest run src/components/__tests__/AddFundsModal.test.tsx
```

## Architecture

### Navigation & Routing

There is no router. `App.tsx` manages 5 screens via `currentTab` (0–4: home, subs, props, reports, profile) in global state. Screen transitions use Framer Motion `AnimatePresence`.

Modals and slide-out panels are rendered at the `App.tsx` root level, opened via state callbacks passed as props down to screens.

### State Management

`src/store/store.ts` — Preact Signals (`@preact/signals-react`) as the single reactive store. State is auto-persisted to `localStorage` under key `voxu_v3` via a Signals `effect()`. The store exposes a `useSyncExternalStore`-compatible interface so components subscribe via the `useStore()` hook in `src/hooks/useStore.ts`.

**Reading state in components:**
```ts
const state = useStore()               // Full state
const balance = useStore(s => s.balance)  // Selector
```

**Mutating state (from services):**
```ts
store.setState(s => ({ ...s, balance: s.balance + amount }))
```

Never mutate the store directly from components — go through a service.

### Service Layer

`src/services/` holds all business logic:
- `auth.service.ts` — Login/logout (localStorage token)
- `finance.service.ts` — Add funds, process payments, add/remove properties
- `subs.service.ts` — Subscription CRUD
- `ui.service.ts` — Toast notifications, feedback overlay, dark mode toggle

Services call `store.setState()` directly. They do not return values to the UI — side effects (toasts, feedback) are also written into state.

### Component Structure

```
src/
├── screens/          # Full-page views (HomeScreen, SubsScreen, etc.)
├── components/
│   ├── home/         # Sub-components used only by HomeScreen
│   ├── modals/       # Overlay modals (AddFunds, Pay, AddSub, AddProp, Services)
│   ├── panels/       # Slide-out panels (Notif, Accounts, Activity)
│   └── shared/       # Icon.tsx — single reusable icon component
├── store/store.ts
├── hooks/useStore.ts
├── services/
├── types/index.ts    # AppState, Subscription, Account, Property, Activity
├── utils/animations.ts  # Framer Motion variants (shared animation configs)
└── data.ts           # Default state values, chart data, formatting utilities
```

### TypeScript Config

Strict mode is fully enabled: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`. Module resolution is `nodenext`. Always use `import type` for type-only imports.

### Testing Patterns

Tests live in `__tests__/` subdirectories next to the code they cover. Vitest globals are enabled — no need to import `describe`/`it`/`expect`. jsdom environment.

Key patterns used throughout the test suite:
- Mock entire modules with `vi.mock()`
- Pass `vi.fn()` as callback props
- Query via `getByTestId` (data-testid attributes on interactive elements)
- Use `fireEvent` (not `userEvent`) for interactions
