# Design: User Profile Settings Screen

## Technical Approach

Migrar el componente `ProfilePanel.jsx`, el cual actualmente actúa como un *side panel*, a un nuevo componente `ProfileScreen.jsx`. Este nuevo componente se renderizará como una "pantalla completa" dentro de `App.jsx`. Ya que la aplicación no usa un enrutador basado en URLs (como `react-router`), el enfoque será renderizar `ProfileScreen` condicionalmente tomando todo el *viewport* por encima del contenido basado en pestañas (tabs) y la barra de navegación inferior, o bien manejarlo como un estado de pantalla de nivel superior en `App.jsx`.

Se optará por el enfoque de **"Pantalla Superpuesta a Nivel de Aplicación"**, el cual se alinea con la estrategia existente para otros modales (ej. `ServicesModal`, `PayModal`) pero estructurado como una pantalla sin `overlay` clickeable.

## Architecture Decisions

### Decision: Routing Mechanics for the new Screen

**Choice**: Usar un nuevo estado global en `App.jsx` (`const [fullScreen, setFullScreen] = useState(null)`) para renderizar pantallas enteras, o bien reutilizar la semántica actual de paneles (`openPanel === 'profile'`). Se decide renderizar condicionalmente `ProfileScreen` sobre toda la app cuando `openPanel === 'profile'`.
**Alternatives considered**: Mover la aplicación entera a `react-router-dom` para usar URLs reales.
**Rationale**: Incorporar `react-router` en esta etapa requiere refactorizar cómo `App.jsx` maneja la persistencia de estado, `tabs` y modales. Reutilizar el estado `openPanel` pero cambiando el diseño (de *side-panel* a *full-screen*) es muchísimo más rápido, menos riesgoso, y respeta la arquitectura existente.

### Decision: Code Structure of ProfileScreen

**Choice**: Consolidar en `src/screens/ProfileScreen.jsx`. El componente mantendrá su estado de sub-vistas (e.g., `'profile'`, `'notifications'`, `'security'`, `'export'`, `'terms'`) internamente, como lo hacía `ProfilePanel`.
**Alternatives considered**: Romper cada panel de configuración en su propia sub-pantalla o componente separado.
**Rationale**: Mantenerlo agrupado por ahora facilita la migración inicial "1 a 1" desde `ProfilePanel`, reduciendo el riesgo. Refactorizar a componentes de menor nivel puede hacerse en una etapa posterior.

## Data Flow

    App (State Owner) ──[state]──→ ProfileScreen
         │                              │ (Actualiza nombre, avatar, modo oscuro)
         └───────[setState]─────────────┘

Al hacer clic en el Avatar en el `HomeScreen`, `HomeScreen` ejecuta `openPanel('profile')`. `App` monta `ProfileScreen`.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/screens/ProfileScreen.jsx` | Create | Nueva pantalla completa. Contendrá todo el JSX/lógica actual de `ProfilePanel.jsx` pero usando clases CSS que ocupen todo el viewport. |
| `src/components/ProfilePanel.jsx` | Delete | Se elimina en favor de la nueva pantalla. |
| `src/App.jsx` | Modify | Reemplazar `<ProfilePanel>` por `<ProfileScreen>`. Asegurar que se superponga al nav inferior y ocupe el 100% de la altura/anchura. |
| `src/index.css` | Modify | Agregar clases CSS para `.profile-screen` base, eliminando dependencias con clases legacy como `.side-panel`. |
| `src/screens/HomeScreen.jsx` | Modify | Ningún cambio estricto a menos que se renombren props, ya que sigue despachando `openPanel('profile')`. Por control, solo verificar imports. |

## Interfaces / Contracts

El contrato de props de `ProfileScreen` será prácticamente idéntico al del panel viejo:
```javascript
<ProfileScreen 
    open={openPanel === 'profile'} 
    onClose={() => setOpenPanel(null)} 
    state={state} 
    setState={setState} 
    showToast={showToast} 
    showSuccess={showSuccess} 
    onLogout={handleLogout} 
/>
```

Las clases CSS principales a crear:
```css
/* src/index.css */
.profile-screen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--bg);
  z-index: 1000; /* Asegurar que quede por sobre nav-bar */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.profile-screen:not(.open) {
  transform: translateY(100%); /* u otra animación de entrada */
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Formateadores de fecha o validaciones | No aplican cambios de lógica, solo de UI. |
| Integration | Sub-vistas y estado de tema | Manual: Verificar que al cambiar de "Security" a "Terms" los breadcrumbs respondan. |
| E2E | Flujo Apertura y Cierre | Manual: Abrir desde Home, probar guardar nombre, cerrar pantalla. Validar que Bottom Nav no esté visible arriba de la pantalla. |

## Migration / Rollout

No migration required. El cambio es estrictamente a nivel de la capa de presentación (presentational layer) sin mutación de las cargas o persistencia de datos de usuario.

## Open Questions

- [ ] ¿Queremos mantener la animación tipo "Side Panel" (deslizamiento lateral) para la nueva pantalla, o la cambiamos por `Slide-Up` (de abajo hacia arriba) como los modales?
- [ ] ¿Hay algún icono del header que deba modificarse o agregar un botón simple "Atrás/Cerrar" estándar en la parte superior izquierda de la nueva pantalla?
