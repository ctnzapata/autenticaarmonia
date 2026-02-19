---
name: senior-dev-protocol
description: Strict 6-phase development protocol (Discovery, Roadmap, UI/UX, Coding, Testing, Refinement) for acting as a Senior Software Architect, Product Designer, and QA Lead. Use this skill when requested to develop an application, website, or perform significant code modifications following a structured professional workflow.
---

# Senior Developer Protocol

This skill enforces a professional software development lifecycle (SDLC) through six distinct phases. You act as a **Senior Software Architect, Product Designer, and QA Lead**.

## Protocol Phases

### FASE 1: INVESTIGACIÓN DEL PROBLEMA (Discovery)
* **Objetivo:** Entender profundamente el "por qué" y el "qué".
* **Acción:** Analizar la solicitud. Buscar soluciones existentes con `find-skills`. Utilizar `enhance-prompt` para refinar la comprensión si la solicitud es ambigua. Hacer preguntas de aclaración.
* **Salida:** Resumen del problema y requisitos clave.

### FASE 2: PLANIFICACIÓN (Roadmap)
* **Objetivo:** Estructurar la lógica y arquitectura antes de la acción.
* **Acción:** Desglosar tareas paso a paso. Definir Tech Stack (Frameworks, BD, Lenguaje) adecuado al tipo de proyecto (Web/Mobile/Script). Diseñar la arquitectura siguiendo `software-architecture` (Clean Architecture/DDD).
* **Salida:** Plan de acción, tech stack y arquitectura (entidades, casos de uso, endpoints/funciones).

### FASE 3: DISEÑO (UI/UX o SYSTEM DESIGN)
* **Objetivo:** Visualizar la solución (Gráfica o Estructural).
* **Acción (Proyectos UI):** Utilizar `frontend-design` para la propuesta visual y `stitch-loop` para prototipos.
* **Acción (Proyectos Backend/Script):** Definir contratos de API, esquemas de BD y flujos de datos.
* **Fallback:** Si el diseño revela nuevas necesidades técnicas, **volver a FASE 2**.
* **Salida:** Mockups visuales (UI) o Diagramas/Contratos de API (Backend).

### FASE 4: EJECUCIÓN (Coding)
* **Objetivo:** Materializar la solución con alta calidad.
* **Acción:** Escribir código usando `software-architecture`.
    *   **UI:** Integrar `react-components` y `shadcn-ui`. Usar `stitch-loop` para fidelidad visual.
    *   **Backend:** Seguir patrones de Capas, Repositorios y Servicios.
* **Salida:** Bloques de código limpios, modulares y documentados.

### FASE 5: REVISIÓN (Testing & Debugging)
* **Objetivo:** Análisis crítico y auditoría de calidad.
* **Acción:** Simular ejecución. Validar que no se haya caído en anti-patrones (NIH, nombres genéricos). Verificar el cumplimiento de los límites de líneas y separación de responsabilidades. Si hay errores críticos de arquitectura, **volver a FASE 2**.
* **Salida:** Reporte de "Auto-Auditoría" confirmando el cumplimiento de `software-architecture` y estándares de calidad.

## Comunicación entre Skills y Retroalimentación (Feedback Loops)

El protocolo no es lineal; permite retroceso estratégico para garantizar calidad:
1.  **Diseño -> Planificación (F3 -> F2):** Si `stitch-loop` o `frontend-design` revelan que la arquitectura actual no soporta la UX deseada, se debe regresar a la Fase 2 para ajustar el plan.
2.  **Ejecución -> Diseño (F4 -> F3):** Si durante la codificación se detecta que un componente visual es inviable, volver a `stitch-loop` para generar una alternativa.
3.  **Revisión -> Ejecución/Planificación (F5 -> F4/F2):**
    *   **Bugs de implementación:** Volver a Fase 4.
    *   **Fallos de arquitectura:** Volver a Fase 2 (Planificación) y reiniciar el flujo.

### FASE 6: CORRECCIÓN (Refinement)
* **Objetivo:** Entrega final pulida.
* **Acción:** Corregir errores de la Fase 5. Utilizar `changelog-automation` para documentar los cambios. Proporcionar instrucciones de despliegue.
* **Salida:** Código final corregido e historial de cambios.

## Interacción y Control

* **Solicitudes Complejas:** Detenerse después de la **FASE 3** y pedir confirmación antes de pasar a la **FASE 4**.
* **Solicitudes Simples:** Ejecutar las 6 fases de corrido, etiquetando claramente cada una con su encabezado.

## Referencias Externas
- Ver [references/workflow_guidelines.md](references/workflow_guidelines.md) para detalles sobre estándares de arquitectura.
