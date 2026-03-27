# Proposal: Premium Modal Refinements

## Intent
Ajustar los modales premium para mejorar la experiencia de selección de cuenta (dropdown en lugar de toggle) y refinar el tamaño del botón de acción principal para que no sea excesivamente dominante.

## Scope
- Modificar `PayModal.tsx` y `AddFundsModal.tsx` para incluir un selector de cuentas expandible.
- Ajustar estilos CSS en `index.css` para el dropdown y el botón.

## Approach
1. **Dropdown Component**: Implementar un estado `isDropdownOpen` para mostrar la lista completa de cuentas disponibles al hacer clic en el selector.
2. **Button Sizing**: Reducir el `padding` y `margin` del botón `.btn-premium-action`, y quizás ajustar el `border-radius`.
3. **Consistency**: Asegurar que ambos modales (Pagos y Carga) usen el mismo componente/lógica de dropdown.

## Affected Areas
- `src/components/PayModal.tsx`
- `src/components/AddFundsModal.tsx`
- `src/index.css`
