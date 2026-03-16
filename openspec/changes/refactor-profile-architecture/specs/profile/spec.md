# Delta for Profile

## ADDED Requirements

### Requirement: State Isolation

El sistema DEBE aislar el estado de edición de cada sección para evitar re-renderizados innecesarios del contenedor principal.

#### Scenario: User edits name without affecting other sections
- GIVEN el usuario está en la sección "Mi Perfil" de `ProfileScreen`
- WHEN el usuario escribe en el input de "Nombre"
- THEN el sistema SOLO DEBE re-renderizar el componente de la sección de perfil
- AND NO DEBE re-renderizar los componentes de otras secciones (Seguridad, Notificaciones, etc.) ni el header global si no es necesario.

### Requirement: Consistent Back Navigation

El sistema DEBE proporcionar un botón de "Volver" o "Atrás" consistente en el header cuando el usuario se encuentra en una sub-sección.

#### Scenario: User returns to main settings menu
- GIVEN el usuario está en la sub-sección "Seguridad"
- WHEN el usuario hace clic en el botón "Volver" (o flecha atrás) en el header
- THEN el sistema DEBE mostrar nuevamente el menú principal de "Opciones" (settings)
- AND DEBE actualizar el título y los breadcrumbs (si existen) acorde a la nueva posición.

## MODIFIED Requirements

### Requirement: Settings Sub-sections

El sistema DEBE proporcionar acceso a categorías de ajustes anidados mediante componentes especializados y desacoplados.
(Anteriormente: El sistema proporcionaba acceso mediante funciones de renderizado inline en un componente monolítico).

#### Scenario: User navigates to a sub-section
- GIVEN el usuario está en el menú de "Opciones"
- WHEN el usuario hace clic en "Notificaciones"
- THEN el sistema DEBE montar el componente `ProfileSectionNotifs`
- AND DEBE desmontar la vista anterior para liberar recursos.
