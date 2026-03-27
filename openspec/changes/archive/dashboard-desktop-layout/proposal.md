# Proposal: Dashboard Desktop Layout

## Intent

El Home Screen se ve como una app mobile estirada en desktop. Se convierte en un dashboard real de 3 columnas usando CSS Grid, sin alterar la lógica de negocio.

## Scope

### In Scope
- Reestructurar JSX de `HomeScreen.tsx` con wrappers de grid semánticos
- Agregar estilos CSS Grid con `@media (min-width: 1024px)` en `index.css`
- Quitar la constraint de "phone frame" en desktop para `app-container`

### Out of Scope
- Cambios a lógica, estados o funciones de datos
- Sidebar lateral (según ref visual no hay sidebar, el nav sigue abajo)
- Cambios en otras pantallas (Subs, Props, Reports)

## Approach

CSS Grid vanilla con breakpoint `1024px`. Las filas del Home se convierten en grids de 3 columnas (`2fr 1fr` o `1fr 2fr`). Mobile: todo apilado en 1 columna (sin cambios). Los componentes internos no se modifican.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/screens/HomeScreen.tsx` | Modified | Agrega wrappers `.home-hero-row`, `.home-insights-row`, `.home-bottom-row`, `.home-quick-actions` |
| `src/index.css` | Modified | Agrega clases grid + `@media (min-width: 1024px)` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Overflow horizontal en desktop | Low | Testear con `overflow: hidden` en el contenedor raíz |
| Regresión mobile | Low | Todo el CSS nuevo va dentro del media query desktop |

## Rollback Plan

`git revert` sobre los 2 archivos modificados. No hay dependencias externas.

## Success Criteria

- [ ] BalanceCard + QuickActions side-by-side en desktop
- [ ] WeeklyDigest + Chart side-by-side en desktop
- [ ] UpcomingPayments + ActivityList side-by-side en desktop
- [ ] Mobile sin regresión (1 columna, mismo comportamiento)
- [ ] Build pasa sin errores
