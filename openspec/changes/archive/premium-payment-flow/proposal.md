# Proposal: Premium Payment Flow Redesign

## Intent

Rediseñar el flujo de confirmación de pagos y carga de fondos para que se vea "premium", siguiendo la referencia visual provista. Esto implica cambiar de un layout de "bottom sheet" genérico a un diseño de tarjeta centrada con tipografía audaz y componentes visuales refinados.

## Scope

### In Scope
- Rediseño visual de `PayModal.tsx`.
- Rediseño visual de `AddFundsModal.tsx` para mantener consistencia.
- Actualización de estilos en `index.css` para soportar el nuevo diseño de "tarjeta premium".
- Asegurar responsividad (centrado en desktop, adaptado en mobile).

### Out of Scope
- Cambios en la lógica de procesamiento de pagos (`financeService`).
- Cambios en otros modales (`AddSubModal`, `AddPropModal`).

## Approach

1. **Nuevos Tokens CSS**: Definir variables para los nuevos colores y espaciados si es necesario (ej. fondos de tarjeta más claros).
2. **Refactor de `modal-sheet`**: Modificar las clases base para que parezcan tarjetas modernas.
3. **Componentización de "Receipt Card"**: Crear o ajustar las clases para el detalle del pago (Concepto, Fecha, etc.) dentro del modal.
4. **Botones Premium**: Estilizar los botones de acción con el nuevo look oscuro y bordes redondeados.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/PayModal.tsx` | High | Rediseño total del layout interno. |
| `src/components/AddFundsModal.tsx` | High | Adaptación visual para consistencia. |
| `src/index.css` | High | Nuevas clases `.premium-modal`, `.receipt-card`, etc. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ruptura de otros modales | Medium | Usar clases específicas (ej. `.premium-modal`) en lugar de modificar globalmente `.modal-sheet` si es necesario. |
| Problemas de scroll en mobile | Low | Mantener el `max-height` y `overflow-y` adecuado. |

## Success Criteria

- [ ] Confirmación de pago idéntica a la referencia de Figma.
- [ ] Carga de fondos con la misma estética premium.
- [ ] Transiciones suaves al abrir/cerrar.
- [ ] Build exitoso.
