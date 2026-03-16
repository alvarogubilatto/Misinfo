# Proposal: Refactor Profile Screen Architecture

## Intent

Resolver la deuda técnica del componente monolítico `ProfileScreen.jsx`. Actualmente maneja demasiadas responsabilidades (UI de 6 sub-vistas, estado de edición, lógica de logout), lo que penaliza el rendimiento por re-renderizados innecesarios y dificulta la escalabilidad (ej: agregar animaciones o nuevas opciones).

## Scope

### In Scope
- Descomposición de `ProfileScreen.jsx` en sub-componentes especializados:
  - `ProfileHeader`: Navegación y acciones globales de la pantalla.
  - `ProfileSectionInfo`: Datos de usuario y edición de avatar.
  - `ProfileSectionSettings`: Menú principal de opciones.
  - `ProfileSectionSecurity`: PIN y biometría.
  - `ProfileSectionNotifs`: Configuración de alertas.
  - `ProfileSectionSupport`: Términos, exportación y legales.
- Aislamiento del estado de edición para optimizar re-renderizados.
- Limpieza de funciones de renderizado inline.

### Out of Scope
- Migración a un enrutador basado en URL (se mantiene el estado en `App.jsx`).
- Cambios estéticos profundos (se mantiene el diseño actual, solo se refactoriza la estructura).
- Implementación de animaciones complejas de transición (se deja la estructura preparada).

## Approach

Seguir el patrón **Container-Presentational**. `ProfileScreen` actuará como el contenedor que gestiona qué sección mostrar, mientras que las nuevas secciones serán componentes especializados que reciben props mínimas. Se mantendrá la coherencia con el sistema de tokens de color y tipografía de VOXU.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/screens/ProfileScreen.jsx` | Modified | Se convierte en un orquestador ligero. |
| `src/components/profile/` | New | Directorio para alojar los nuevos sub-componentes. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Regresión funcional en guardado de datos | Low | Pruebas manuales exhaustivas del flujo de guardado. |
| Pérdida de estado al navegar entre secciones | Medium | Asegurar que el estado "en edición" se mantenga o se guarde antes de cambiar. |

## Rollback Plan

Revertir a la versión anterior de `ProfileScreen.jsx` (ya que es un componente único autónomo) mediante git.

## Dependencies

- Ninguna externa.

## Success Criteria

- [ ] Funcionalidad idéntica a la versión actual.
- [ ] Reducción del tamaño de `ProfileScreen.jsx` en al menos un 50%.
- [ ] Implementación de al menos 5 sub-componentes desacoplados.
