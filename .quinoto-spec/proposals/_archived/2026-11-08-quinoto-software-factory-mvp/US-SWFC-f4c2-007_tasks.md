# Plan de Tareas (Quinoto Software Factory MVP — US-SWFC-f4c2-007)

**Proposal ID:** 2026-11-08-quinoto-software-factory-mvp
**Prefijo:** SWFC-f4c2
**Estado:** proposed

| ID | Tipo | Título | Descripción | Historia Relacionada | Servicio | Archivos a Modificar | Estimación | Prioridad | Dependencias | Estado |
|---|---|---|---|---|---|---|---|---|---|---|
| TSK-SWFC-f4c2-028 | Backend | Módulo de cifrado AES-256-GCM | Implementar encrypt/decrypt con envelope versionado, nonce aleatorio y detección de tampering. | US-SWFC-f4c2-007 | security | packages/core/src/crypto.ts | M | P1 | — | [x] |
| TSK-SWFC-f4c2-029 | Backend | Secret store con cifrado | Envolver el almacenamiento de tokens para cifrar al escribir y descifrar solo en memoria. | US-SWFC-f4c2-007 | security | packages/core/src/secrets.ts, packages/core/src/secrets.test.ts | M | P1 | TSK-SWFC-f4c2-028 | [x] |
| TSK-SWFC-f4c2-030 | Test | Tests de cifrado y secretos | Cubrir roundtrip, clave incorrecta, ciphertext alterado, clave inválida y no exposición en API. | US-SWFC-f4c2-007 | security | packages/core/src/crypto.test.ts | S | P1 | TSK-SWFC-f4c2-028 | [x] |
| TSK-SWFC-f4c2-031 | Config | Validar master key por entorno | Exigir `FACTORY_MASTER_KEY` válida en producción y permitirla opcional en desarrollo/test. | US-SWFC-f4c2-007 | security | packages/core/src/config.ts, packages/core/src/config.test.ts | S | P1 | TSK-SWFC-f4c2-028 | [x] |
