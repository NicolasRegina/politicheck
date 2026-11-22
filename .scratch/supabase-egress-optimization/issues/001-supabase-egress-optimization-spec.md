---
title: "Spec: Optimización de Egress en Supabase, Caché CDN y Polling Inteligente"
status: ready-for-agent
labels:
  - ready-for-agent
  - performance
  - supabase
  - caching
  - infrastructure
feature: supabase-egress-optimization
---

# Optimización de Egress en Supabase, Caché CDN y Polling Inteligente

## Problem Statement

El consumo de ancho de banda saliente (*Egress*) en Supabase superó ampliamente la cuota del plan gratuito (11,41 GB sobre 5,5 GB disponibles), generando una advertencia de restricción de servicio con errores `402` si no se corrige el patrón de lectura.

El problema se origina en cuatro comportamientos actuales de la plataforma:
1. Cada pestaña abierta de Portada consulta cada 60 segundos el endpoint de novedades sin caché CDN ni pausa en segundo plano; cada consulta descarga hasta 150 Historias completas de los últimos 60 días (incluyendo todos los arreglos de Noticias) y lee dos veces el feed completo de Último Momento solo para devolver un conteo y el identificador de la Historia principal.
2. Las más de 3.900 páginas indexadas de Análisis Completo de Historia se renderizan del lado del servidor sin encabezados `Cache-Control`, haciendo que cada visita de buscadores, bots de IA o Ciudadanos golpee directamente a Supabase.
3. La Portada solicita un volumen sobredimensionado de Historias históricas en cada revalidación y duplica la lectura del caché de Último Momento para obtener únicamente la fecha de última sincronización.
4. La Sala de Chat Electoral en Vivo ejecuta polling cada 4 segundos sin caché intermedia ni pausa cuando la pestaña está en segundo plano.

## Solution

Implementar una estrategia de caché multinivel, proyección mínima de columnas y polling consciente de visibilidad que reduzca el Egress de Supabase en más de un 95% sin degradar la frescura informativa ni la experiencia de lectura:

1. **Caché en memoria con TTL en la capa de datos**:
   - Cachear temporalmente las lecturas frecuentes de Historias, Último Momento, Mirada Exterior y banners cívicos activos, con invalidación explícita cuando se ejecuta una sincronización RSS o una edición administrativa de banners.
2. **Consultas acotadas y proyección mínima**:
   - Reemplazar las lecturas completas usadas únicamente para verificar marcas de tiempo por consultas que proyecten exclusivamente `updated_at`.
   - Limitar la cantidad de Historias recuperadas en Portada y en el endpoint de novedades al volumen efectivamente consumido por la interfaz.
3. **Caché CDN (`Cache-Control` con `s-maxage` y `stale-while-revalidate`)**:
   - Habilitar almacenamiento en caché en el borde (CDN) para Análisis Completo de Historia, Promesas de Campaña, Portada, endpoint de novedades y lectura de mensajes del chat, absorbiendo tráfico recurrente y rastreo de bots con cero bytes de Egress hacia Supabase.
4. **Polling eficiente y consciente de visibilidad**:
   - Espaciar la verificación automática de noticias nuevas en Portada y el polling de la Sala de Chat Electoral en Vivo, pausando todas las consultas periódicas mientras la pestaña del navegador se encuentre oculta (`document.hidden`).

## User Stories

1. As a Ciudadano leyendo los Temas del Día en Portada, I want la plataforma to cargar las Historias recientes con rapidez desde caché, so that la página sea estable y nunca quede caída por límites de cuota.
2. As a Ciudadano que deja la pestaña de Portada abierta en segundo plano, I want que la aplicación pause el chequeo automático de novedades hasta que vuelva a la pestaña, so that no se desperdicie ancho de banda ni batería innecesariamente.
3. As a Ciudadano que vuelve a la pestaña de Portada tras varios minutos, I want que la plataforma verifique si existen nuevas Historias disponibles y muestre el aviso de actualización, so that pueda refrescar las noticias cuando realmente haya cambios.
4. As a Ciudadano que ingresa a un Análisis Completo de Historia desde Google o redes sociales, I want que la página se sirva desde el caché del borde (CDN), so that cargue de forma casi instantánea sin saturar la base de datos.
5. As a Ciudadano que consulta el Promesómetro y el detalle de una Promesa de Campaña, I want que la vista de lectura esté cacheada en el borde con revalidación en segundo plano, so that el acceso sea veloz incluso en picos electorales.
6. As a Ciudadano participando en la Sala de Chat Electoral en Vivo, I want seguir recibiendo mensajes nuevos de forma fluida sin que el polling sobrecargue el servidor, so that la conversación siga activa y estable en eventos de alta concurrencia.
7. As a Ciudadano con la Sala de Chat Electoral abierta en una pestaña inactiva, I want que el polling se pause automáticamente mientras no estoy mirando la pestaña y se reanude al volver, so that el consumo de red sea mínimo.
8. As a Administrador que fuerza una sincronización de feeds RSS desde el panel, I want que la caché en memoria del servidor se invalide automáticamente al guardar las nuevas Noticias e Historias, so that los lectores vean la actualización en el siguiente ciclo de revalidación.
9. As a Administrador que activa, edita o desactiva un banner de patrocinio cívico, I want que la caché de banners se invalide inmediatamente, so that el cambio se refleje sin esperar a que expire un TTL largo.
10. As a Superadministrador responsable de los costos operativos de Politicheck, I want que el Egress mensual de Supabase se reduzca drásticamente por debajo de los límites del plan, so that la plataforma opere sin interrupciones ni errores `402`.
11. As a Superadministrador monitoreando el rastreo de buscadores (Googlebot y crawlers de IA) sobre miles de Historias indexadas, I want que las visitas repetidas de bots sean atendidas por la caché CDN, so that el crecimiento SEO no dispare el consumo de base de datos.
12. As a Ciudadano navegando Último Momento y Mirada Exterior, I want que la marca de tiempo de última sincronización se obtenga sin duplicar descargas completas del feed, so that la portada sea más liviana y rápida de renderizar.

## Implementation Decisions

- **Capa de servicio de datos (Supabase)**:
  - Incorporar una caché en memoria con TTL configurable y deduplicación de lecturas para Historias, Último Momento, Mirada Exterior y banners activos.
  - Exponer una operación dedicada para obtener únicamente la marca de tiempo de última sincronización (`updated_at`), evitando descargar el arreglo completo de Noticias.
  - Exponer funciones de invalidación explícita de caché que serán invocadas al finalizar cada sincronización RSS/clustering y tras operaciones de escritura sobre banners.
  - Ajustar los límites de recuperación de Historias para que las consultas de Portada y de detección de novedades traigan solo el subconjunto reciente necesario en lugar de 150 registros históricos de 60 días.
- **Endpoint de novedades en vivo**:
  - Reemplazar `Cache-Control: no-cache, no-store, must-revalidate` por una política cacheable en CDN (`public, s-maxage=120, stale-while-revalidate=300`).
  - Reutilizar la lectura acotada de Historias recientes y la consulta liviana de timestamp, eliminando las lecturas duplicadas del feed completo.
- **Renderizado SSR de páginas públicas**:
  - Portada: elevar la ventana de caché CDN (`public, s-maxage=300, stale-while-revalidate=900`), reducir el límite de Historias consultadas a las realmente mostradas y eliminar la doble consulta al caché de Último Momento.
  - Análisis Completo de Historia: agregar encabezado `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` para absorber tráfico de lectores y rastreadores sin impactar a Supabase.
  - Detalle de Promesa de Campaña: agregar encabezado `Cache-Control` acorde a lectura pública con revalidación en segundo plano.
- **Polling del lado del cliente**:
  - Portada: aumentar el intervalo de verificación de novedades de 60 segundos a 5 minutos y condicionarlo a que la pestaña esté visible (`!document.hidden`), disparando una comprobación diferida al recuperar foco si pasó suficiente tiempo.
  - Sala de Chat Electoral en Vivo: aumentar el intervalo de polling fallback de 4 segundos a 12 segundos, pausar cuando la pestaña esté oculta y habilitar una caché corta en el endpoint de lectura de mensajes (`public, s-maxage=5, stale-while-revalidate=10`).
- **Compatibilidad y dominio**:
  - No se requieren cambios en el esquema de tablas de Supabase ni en los contratos de respuesta JSON consumidos por los componentes actuales.

## Testing Decisions

- **Qué constituye un buen test**:
  - Verificar únicamente comportamiento externo observable (cantidad de llamadas emitidas hacia el origen de datos, proyección de columnas/límites, encabezados HTTP `Cache-Control` devueltos y frescura tras invalidación), sin acoplarse a detalles internos de almacenamiento de la caché.
- **Seam principal de pruebas**:
  - **Borde del servicio de datos y contratos HTTP**: probar el módulo de servicio de Supabase (inyectando o interceptando el cliente de consulta) y los handlers `GET` de los endpoints públicos para validar:
    1. Hits de caché en memoria dentro del TTL (múltiples invocaciones consecutivas producen una sola consulta al origen).
    2. Invalidación efectiva al registrar nuevas Historias, Noticias o cambios de banner.
    3. Consulta liviana de timestamp sin descargar payloads de Noticias.
    4. Encabezados `Cache-Control` correctos (`s-maxage` y `stale-while-revalidate`) en el endpoint de novedades, lectura de chat y vistas SSR de Historias.
    5. Compilación estática y de tipos limpia (`astro check` y `astro build`).
- **Arte previo en el repositorio**:
  - El repositorio actualmente utiliza scripts de verificación livianos en Node y chequeo completo con `astro check` y `astro build`; las pruebas de comportamiento del caché y encabezados se pueden ejecutar con el test runner nativo de Node (`node --test`) sin agregar dependencias pesadas.

## Out of Scope

- Migración de base de datos fuera de Supabase o cambio de proveedor de hosting.
- Gestión comercial o administrativa del plan de facturación en el dashboard de Supabase (upgrade a Pro o contacto con soporte por el período de gracia previo al 25 de noviembre).
- Rediseño visual de Portada, Historias o Sala de Chat Electoral en Vivo.
- Reescritura del sistema de Realtime WebSocket o cambios en las reglas RBAC/RLS existentes.

## Further Notes

- Reducir el Egress en código frena el consumo inmediatamente tras el despliegue, pero el contador acumulado del ciclo actual en Supabase (11,41 GB / 5,5 GB) solo se reinicia al comenzar el próximo período de facturación.
- Verificar en el Usage Dashboard de Supabase la fecha exacta de reinicio del ciclo respecto al límite del 25 de noviembre de 2026 para decidir si hace falta solicitar extensión a soporte o activar temporalmente el plan Pro.
