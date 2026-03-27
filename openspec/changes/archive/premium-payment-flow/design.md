# Design: Premium Payment Flow Redesign

## Technical Approach

Se implementará una nueva estructura CSS bajo el prefijo `.premium-modal` en `index.css`. Esto evitará romper otros modales que aún usen `.modal-sheet` tradicional. Se actualizarán `PayModal.tsx` y `AddFundsModal.tsx` para usar esta nueva estructura de componentes internos (Header con icono, Receipt Card, etc.).

## Architecture Decisions

### Decision: Dedicated Premium Modal Classes
**Choice**: Crear clases específicas como `.premium-modal-header`, `.premium-details-card`, y `.btn-premium-action`.
**Rationale**: Mantener la compatibilidad con el sistema actual de modales mientras se implementa el diseño premium "encapsulado".

### Decision: Layout centering
**Choice**: `modal-sheet` en desktop ya está centrado. Se ajustarán las reglas de mobile para que el diseño premium no se sienta como un "bottom sheet" de pantalla completa, sino como una tarjeta flotante estructurada.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/PayModal.tsx` | Modify | Reestructura JSX para coincidir con el diseño de la imagen. |
| `src/components/AddFundsModal.tsx` | Modify | Adapta el layout para que coincida con la estética de confirmación de pago. |
| `src/index.css` | Modify | Agrega estilos para `.premium-modal`, `.receipt-card`, `.btn-premium-action`, y tipografía mejorada. |

## UI Components structure (Proposed)

```tsx
<div className="premium-modal">
    <div className="premium-header">
        <div className="premium-icon-box"><Icon name={...} /></div>
        <div className="premium-title">Confirmar Pago</div>
        <div className="premium-subtitle">{pendingPay.name}</div>
    </div>
    <div className="premium-amount-section">
        <div className="premium-label">TOTAL A PAGAR</div>
        <div className="premium-amount">$ {pendingPay.amount}</div>
    </div>
    <div className="premium-details-card">
        <div className="detail-row"><span>Concepto</span> <strong>{...}</strong></div>
        <div className="detail-row"><span>Fecha</span> <strong>19 Mar 2026</strong></div>
        <div className="detail-row"><span>Comisión</span> <strong className="text-green">Bonificada</strong></div>
    </div>
    <div className="premium-pay-method">
        {/* Selector de cuenta/tarjeta */}
    </div>
    <button className="btn-premium-action">
        <Icon name="shield" /> Autorizar Pago
    </button>
</div>
```
