# Specs — Source of Truth

Este directorio contiene la especificación canónica del sistema, organizada por dominio/servicio.

Cada subdirectorio representa un dominio (ej. `auth/`, `orchestrator/`, `ui/`) y contiene un `spec.md` con los requerimientos actuales del sistema.

## Formato

Los specs usan el formato de requerimientos con escenarios GIVEN/WHEN/THEN (opcionales):

### Requirement: Name
The system SHALL...

#### Scenario: Name (optional)
- **GIVEN** precondition
- **WHEN** action
- **THEN** expected outcome

## Actualización

Los specs se actualizan automáticamente al archivar propuestas que contienen `delta-specs/`.
Ver `@quinotospec.archive` para detalles del engine de merge.

## Inicialización

Para proyectos existentes sin specs/, ejecuta `@quinotospec.specs-init` para generar specs iniciales desde el discovery o propuestas existentes.
