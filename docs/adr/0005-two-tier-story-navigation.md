# 0005: Arquitectura de Navegación en Dos Niveles para Historias (Portada Ejecutiva y Análisis Monográfico)

## Contexto
Originalmente, la portada de Politicheck (`/`) presentaba en cada tarjeta de Historia (`StoryCard`) el desglose completo de artículos RSS individuales mediante el componente `HeadlineComparison` (titulares entrecomillados de cada medio, filtros de sesgo interactivos y enlaces externos). 

Esto generaba tres problemas críticos de usabilidad y rendimiento:
1. **Sobrecarga de información y fatiga visual**: Las tarjetas en la cuadrícula de 3 columnas alcanzaban alturas excesivas y dispares, entorpeciendo el escaneo rápido de las noticias del día.
2. **Impacto severo en DOM y rendimiento móvil**: La duplicación de tarjetas de artículos dentro de cada historia multiplicaba por cientos los nodos del DOM en portada, perjudicando los Core Web Vitals en conexiones celulares.
3. **Redundancia funcional**: Ya existía una ruta dedicada `/historia/[id]` que replicaba exactamente estos datos pero sin ser el punto de destino primario de los lectores.

## Decisión
Se adopta una **Arquitectura en Dos Niveles (Two-Tier Architecture)** estricta para la representación de las Historias:

1. **Nivel 1 — Portada (`index.astro`): Ficha Ejecutiva de Historia**
   - La tarjeta de Historia (`StoryCard`) se reduce a un resumen de alto nivel optimizado para escaneo inmediato:
     - Volanta / Categoría y marca temporal.
     - Badge de medios analizados.
     - Imagen periodística y titular neutral generado por IA (ambos enlazados a la historia).
     - Síntesis neutral en un máximo uniforme de 3 líneas.
     - Barra tricolor de Distribución del Espectro Editorial (`SpectrumBar`).
     - Botón de acción principal destacado: `Ver análisis completo →` enlazando a `/historia/[id]`.
     - Botón compacto de difusión y compartir en redes sociales.
   - Se purga por completo el componente `HeadlineComparison`, el selector de pestañas móviles y el dictamen de IA de la tarjeta de portada.

2. **Nivel 2 — Vista Monográfica (`/historia/[id].astro`): Análisis Completo y Cotejo**
   - Concentra la totalidad de la auditoría profunda:
     - Dictamen editorial de encuadres mediáticos por IA.
     - Cobertura comparada por diario (`HeadlineComparison`) con filtros activos por sesgo (`oficialismo`, `centro_datos`, `oposicion`) y enlaces directos a los medios.
     - Barra de difusión viral optimizada con metadatos Open Graph enriquecidos.

## Consecuencias
- **Positivas:**
  - Reducción drástica del tamaño del HTML y del árbol DOM en la portada (>60% menos nodos).
  - Experiencia editorial limpia, armónica y equilibrada en la cuadrícula de 3 columnas (Bento Grid).
  - Mayor retención y tráfico directo con URLs canónicas compartibles para debatir en redes sociales.
- **Negativas / Mitigaciones:**
  - El lector requiere 1 clic adicional para ver las citas textuales de cada diario. Se mitiga manteniendo en portada la barra de espectro editorial porcentual, que brinda el dato analítico clave de un solo vistazo.
