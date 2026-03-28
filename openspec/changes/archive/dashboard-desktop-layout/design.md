# Design: Dashboard Desktop Layout

## Technical Approach

Uso de CSS Grid vanilla integrado en `index.css` dentro de un media query `@media (min-width: 1024px)`. Se reestructuró `HomeScreen.tsx` para envolver los componentes existentes en filas de grid semánticas (`home-hero-row`, `home-insights-row`, `home-bottom-row`).

## Architecture Decisions

### Decision: Vanilla CSS Grid over Tailwind
**Choice**: CSS Grid manual en `index.css`.
**Alternatives considered**: Tailwind CSS.
**Rationale**: El proyecto ya utiliza CSS vanilla y migrar a Tailwind solo para este layout añadiría una dependencia innecesaria y rompería la consistencia actual.

### Decision: Grid Wrappers en HomeScreen
**Choice**: Añadir componentes `div` como wrappers en el JSX de `HomeScreen.tsx`.
**Rationale**: Permite controlar el layout desktop sin modificar la implementación interna de cada componente hijo (`BalanceCard`, `WeeklyDigest`, etc.).

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/screens/HomeScreen.tsx` | Modify | Reestructura JSX con nuevos wrappers de grid. |
| `src/index.css` | Modify | Define las clases de grid y media queries desktop. |
| `src/components/home/UpcomingPayments.tsx` | Modify | Corrección de tipos (lint fix) para `handlePay`. |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Breakpoints | Manual resize del browser (Chrome DevTools). |
| Integration | Build | `npm run build` para asegurar integridad TS/Vite. |
