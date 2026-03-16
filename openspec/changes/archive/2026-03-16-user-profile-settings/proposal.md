# Proposal: User Profile Settings Screen

## Intent

Migrar la configuración de usuario y perfil de un panel lateral (`ProfilePanel.jsx`) a una pantalla completa dedicada. Esto permitirá acomodar de manera más limpia futuras opciones avanzadas (ej., gestión de categorías, vinculación de nuevas cuentas bancarias, límites de presupuesto) sin sobrecargar la interfaz superpuesta ni comprometer la experiencia en dispositivos móviles.

## Scope

### In Scope
- Crear una nueva ruta/pantalla `src/screens/ProfileScreen.jsx` (o similar).
- Migrar toda la lógica de estado actual (avatar, nombre, preferencias, switch de dark mode) desde `ProfilePanel.jsx` a la nueva pantalla.
- Implementar navegación hacia esta nueva pantalla desde el avatar del usuario en el `HomeScreen`.
- Adaptar las sub-secciones actuales (Notificaciones, Seguridad, Exportar) como pestañas o vistas anidadas dentro de la nueva pantalla.

### Out of Scope
- Agregar nuevas funcionalidades de configuración (solo se migran las existentes).
- Modificar componentes ajenos al perfil y configuración (excepto el disparador en el Home).

## Approach

1. **Estructura base:** Crear `ProfileScreen.jsx` basándose en el diseño de pantallas actuales (ej. `PropsScreen.jsx`, `SubsScreen.jsx`).
2. **Migración de UI:** Copiar y adaptar el JSX y CSS de `ProfilePanel.jsx` a la nueva pantalla, ajustando el *layout* para usar todo el *viewport*.
3. **Navegación:** Modificar `App.jsx` para incluir la nueva pestaña/ruta de Perfil, o manejarlo como una vista superpuesta de pantalla completa manejada por estado (similar a los modales grandes) si no se requiere una pestaña persistente en el bottom bar.
4. **Limpieza:** Eliminar `ProfilePanel.jsx` y su importación en `HomeScreen`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/screens/ProfileScreen.jsx` | New | Nueva pantalla de configuración. |
| `src/components/ProfilePanel.jsx` | Removed | Se elimina el viejo panel lateral. |
| `src/App.jsx` | Modified | Lógica para montar la nueva pantalla. |
| `src/screens/HomeScreen.jsx` | Modified | Cambiar la acción del avatar para ir a la nueva pantalla. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ruptura de navegación actual | Med | Probar exhaustivamente el montaje/desmontaje de la pantalla frente a las pestañas base. |
| Estado global desincronizado | Low | Asegurar que `ProfileScreen` reciba y actualice el mismo objeto `state` que `App.jsx` propaga. |

## Rollback Plan

- Revertir los commits que eliminan `ProfilePanel.jsx` y modifican `HomeScreen.jsx` y `App.jsx`.
- Restaurar la importación y el renderizado condicional de `<ProfilePanel />` en el componente principal.

## Dependencies

- Ninguna nueva dependencia externa. Requiere el estado global de la app (`state`, `setState`).

## Success Criteria

- [ ] El avatar en el `HomeScreen` abre la nueva pantalla a pantalla completa.
- [ ] Todas las opciones de configuración originales (nombre, dark mode, etc.) funcionan idéntico a antes.
- [ ] La UI se adapta correctamente tanto a escritorio como a mobile sin *"overlay/panel"* bugs.
- [ ] Ya no existe `ProfilePanel.jsx` en la base de código.
