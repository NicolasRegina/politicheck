# 📋 POLITICHECK — Plan de Acción & Hoja de Ruta

> **Observatorio de Cobertura Periodística & Auditoría Electoral (Argentina)**  
> Plataforma cívica e informativa de alto tráfico que compara el sesgo y encuadre mediático de 31 redacciones en simultáneo y audita las promesas de campaña de los candidatos camino a las elecciones legislativas 2025 y presidenciales 2027.

---

## 🎯 Estado Actual del Proyecto

* **31 Medios Monitoreados:** 19 nacionales (Clarín, La Nación, Infobae, TN, Página 12, Ámbito, Perfil, La Derecha Diario, elDiarioAR, Crónica, BAE, etc.) y 12 internacionales (El País, BBC Mundo, France 24, The Guardian, Expansión, Le Monde, Nikkei Asia, etc.).
* **Gran Apertura de Tapa:** Clustering por IA (Gemini 2.5) con contraste simultáneo de hasta 8 redacciones cruzadas sobre el hecho central del día.
* **Espectro de Sesgo Interactivo:** Distribución porcentual fáctica (`🟣 Oficialismo` / `🟢 Centro - Datos` / `🟠 Oposición`) con filtros de redacciones y paginación ágil de 4 tarjetas para evitar fatiga de scroll.
* **La Mirada Exterior Dinámica:** Extracción y clusterización en tiempo real de lo que publica la prensa mundial sobre Argentina (economía, política exterior, Malvinas, reformas).
* **Navegación Unificada:** Cabecera editorial limpia con buscador en tiempo real, selector de vistas y sin desbordamientos de scroll.

---

## 🚀 Plan de Acción Priorizado

### ✅ Tarea 1: Automatización 24/7 en Vercel (Cron Job) — [COMPLETADA]
- [x] Configuración de Vercel Cron Jobs en `vercel.json` (`schedule: "0 * * * *"` — cada 1 hora, 24 veces al día).
- [x] Integración de cabeceras de autorización de Vercel Cron (`x-vercel-cron`, `Authorization: Bearer <CRON_SECRET>`) en `/api/rss/sync`.
- [x] Sincronización automática de feeds nacionales, internacionales y re-clustering de historias.

---

### ✅ Tarea 2: Ampliación del Monitor de Promesas 2027 — [COMPLETADA]
- [x] **Incorporar nuevas figuras y promesas verificables:**
  - *Victoria Villarruel* (Defensa, Malvinas y recomposición salarial militar).
  - *Patricia Bullrich* (Seguridad Interior, protocolo antipiquetes y Plan Bandera en Rosario).
  - *Jorge Macri* (Orden del espacio público e infraestructura del Ferrocarril Sarmiento).
  - *Juan Schiaretti* (Federalismo, producción del interior y coparticipación de combustibles).
  - *Horacio Rodríguez Larreta* (Consenso institucional y reforma de 190 días de clase).
  - *Leandro Santoro* (Alquileres accesibles e incentivos a la vivienda permanente).
  - *Javier Milei / Axel Kicillof / Mauricio Macri* (Compromisos troncales ampliados a 16 promesas totales).
- [x] **Fotografías y ficha editorial:** Retratos oficiales en alta calidad de todos los dirigentes y enlaces directos al Boletín Oficial, INDEC, DGCyE y proyectos legislativos.
- [x] **Fichas individuales compartibles:** Nuevas rutas `/promesa/[id]` con meta-tags OpenGraph para viralización, termómetro de cumplimiento interactivo, prueba documental oficial y compromisos relacionados del dirigente.
- [x] **Filtros dinámicos en tiempo real:** Selector automático de dirigentes con conteo de promesas auditadas y paleta de color partidario.

---

### ✅ Tarea 3: Botones y Fichas Virales para Redes Sociales (X / WhatsApp / Telegram) — [COMPLETADA]
- [x] **Botones de Compartir con 1 Clic:**
  - Botones rápidos directos para **WhatsApp**, **X (Twitter)**, **Telegram** y copiar enlace en cada tarjeta de historia (`StoryCard`), tarjeta de promesa (`PromiseCard`), y páginas individuales (`/historia/[id]` y `/promesa/[id]`).
  - Modal nativo interactivo `ShareModal.astro` con vista previa del copy, atajos directos y compatibilidad con Web Share API para celulares.
- [x] **Copy persuasivo prediseñado:**
  - *"Mirá cómo Clarín, La Nación, Página 12 y TN cubrieron esta misma noticia en simultáneo: [...] Comparativa sin sesgo en Politicheck 👉 https://politicheck.com.ar/historia/..."*
  - *"🗳️ ¿Cumplió [Dirigente]? [...] — Veredicto: [Estado]. Votá en vivo y mirá la auditoría ciudadana en Politicheck 👉 https://politicheck.com.ar/promesa/..."*
- [x] **OpenGraph y Twitter Cards dinámicos:**
  - Meta tags específicos en `/historia/[id]` detallando la distribución porcentual fáctica del espectro editorial (`🟣 Oficialismo | 🟢 Centro | 🟠 Oposición`) y los medios contrastados.
  - Meta tags en `/promesa/[id]` con prueba documental del Boletín Oficial e invitación a la votación ciudadana.
  - Integración de identificadores oficiales `@politicheck_ar`.

---

### ✅ Tarea 4: Detección y Banner de "Alerta / Último Momento" (Breaking News) — [COMPLETADA]
- [x] **Algoritmo de Breaking News (`src/services/breaking.ts`):**
  - Detección de coincidencia temática urgente cuando 3 o más diarios publiquen sobre un mismo hecho en simultáneo o ventana reciente (score ponderado de términos urgentes, volumen de redacciones y статус de apertura).
- [x] **Cinta visual de alerta en cabecera (`BreakingBanner.astro`):**
  - Banner dinámico pulsante en la parte superior con badge `🚨 ÚLTIMO MOMENTO`, mención de redacciones involucradas, enlace directo al contraste en vivo y botón de descarte por sesión (`sessionStorage`).
- [x] **Auto-actualización reactiva en tiempo real:**
  - Endpoint `/api/news/latest` con detección de breaking news y cliente web que actualiza dinámicamente el banner cada 60s sin recargar la página.

---

### ✅ Tarea 5: Página Institucional de Metodología y Transparencia (`/metodologia`) — [COMPLETADA]
- [x] **Creación de `src/pages/metodologia.astro`:**
  - Nueva ruta institucional completa accesible desde la cabecera y pie de página en todo el sitio.
  - **Manifiesto de Independencia Cívica:** Ausencia estricta de pauta oficial ($0), apego al Art. 10 de la Ley 11.723 de Propiedad Intelectual y neutralidad algorítmica.
  - **Fórmula Matemática del Espectro Editorial:** Desglose formal de la ecuación de distribución $P_k$ con normalización base 100, factor de prominencia editorial $\alpha_i$ (1.5 portada, 1.2 sección, 1.0 cable) y vector de encuadre $w_{i,k}$.
  - **Catálogo Interactivo de los 31 Medios Monitoreados:** Buscador en vivo y filtros por categoría (Nacionales vs Mirada Exterior) detallando los 15 medios nacionales y 16 internacionales con perfil editorial, sesgo de referencia y enlaces directos a sus feeds RSS oficiales públicos.
  - **Metodología del Monitor de Promesas 2027:** Escala cuádruple PolitiFact (Cumplida, En progreso, En pausa, Incumplida) con exigencia inviolable de prueba documental primaria (Boletín Oficial, INDEC, BCRA).
  - **Protocolo Cívico Anti-Fraude en el Voto:** Firma criptográfica SHA-256 HMAC unidireccional de IP + UserAgent con unicidad idempotente, garantizando 1 voto por ciudadano sin recopilar datos personales.

---

### ✅ Tarea 6: Optimización de Rendimiento y Experiencia PWA — [COMPLETADA]
- [x] **Service Worker y Caché Offline (`public/sw.js`):**
  - Versión de caché `politicheck-v1.0` con pre-cacheado de shell básica (`/`, `/metodologia`, `/terminos`, `/manifest.json`, `/favicon.svg`).
  - Estrategia *Network-First* con fallback offline para documentos HTML y *Stale-While-Revalidate* para assets estáticos (fuentes, imágenes, CSS, JS).
  - Banner reactivo en tiempo real que notifica al usuario cuando se encuentra en "Modo Sin Conexión".
- [x] **Web App Manifest (`public/manifest.json`):**
  - Configuración PWA completa (`standalone`, `portrait-primary`, colores institucionales `#090D16`, categorías de noticias y educación).
  - Shortcuts de acceso rápido a "Gran Apertura de Tapa", "Monitor de Promesas" y "Metodología y Fuentes".
- [x] **Componente `PwaBanner.astro` e Instalación de App:**
  - Captura del evento `beforeinstallprompt` para mostrar banner no intrusivo de instalación en teléfonos y computadoras.
  - Soporte de suscripción voluntaria al **Resumen Matutino (8:00 AM)** en el pie de página con integración nativa a la Web Notification API.

---

### ✅ Tarea 7: Automatización y Sindicación de Noticias a X / Twitter (@politicheck_ok) — [COMPLETADA]
- [x] **Bot Oficial para X API v2 (`src/services/twitter.ts`):**
  - Formato viral de alta tracción para 280 caracteres con apertura de portada, distribución de espectro (`🟣 % | 🟢 % | 🟠 %`), medios contrastados y enlace directo a la historia.
  - Priorización inteligente de alertas de último momento (*breaking news*) sobre historias regulares.
  - Sistema de deduplicación y anti-spam (`src/data/last_tweeted.json`) para nunca repetir un titular ya publicado.
- [x] **Integración con el Cron de Sincronización (`/api/rss/sync`):**
  - Publicación automatizada periódica coordinada con Vercel Cron.
- [x] **Endpoint de Control y Previsualización (`/api/social/tweet-latest`):**
  - Parámetro `?preview=true` para auditar el copy generado antes de tuitear.
  - Modo simulación en caso de que falten credenciales de entorno.

---

### ✅ Tarea 8: Modo Administrador / Superadmin & Centro de Control Editorial (Supabase RBAC) — [COMPLETADA]
- [x] **Arquitectura de Autenticación y Roles con Supabase (`profiles` + RLS):**
  - Tabla de perfiles (`profiles`) vinculada a `auth.users` con roles: `'superadmin'`, `'admin'`, `'moderator'`, `'user'`.
  - Migración SQL `supabase/migrations/20260928_admin_roles_and_banners.sql` con RLS, triggers y auto-asignación configurable de `'superadmin'`.
  - **Permisos del Superadmin:**
    - Panel de gestión de usuarios en `/admin`: auditar nómina, asignar roles (`admin`, `moderator`, `user`) y protección permanente de inmutabilidad para el superadmin institucional.
    - Eliminación, edición y control forzado de banners y contenidos.
    - Acceso a métricas de salud de los 31 medios monitoreados y consola de sincronización forzada.
  - **Permisos del Administrador (Admin):**
    - Gestión de banners de patrocinio cívico (activar/pausar, compresión WebP, URL de destino).
    - Centro de Sindicación RRSS (previsualizar tarjetas X, editor de copy en vivo, 1-Click Copy al portapapeles y publicación directa).
    - Disparo de sincronización forzada de los 31 feeds RSS y re-clustering de Gemini.
    - *Restricción de seguridad inviolable:* Un admin NO puede visualizar ni modificar la pestaña de Gobernanza ni alterar roles de otros usuarios.
- [x] **Ruta Protegida `/admin` con UI Moderna:**
  - Login formal en `/admin/login` con Supabase Auth (email y contraseña), validación de RBAC en servidor y almacenamiento seguro de token.
  - Dashboard editorial `/admin` modular con 4 pestañas: Salud & Sync, Gestor de Banners Cívicos, Sindicación RRSS y Gobernanza & Roles.
  - Enlace discreto de acceso en el pie de página institucional (`Footer.astro`).
- [x] **Gestor de Banners Publicitarios / Patrocinios Cívicos:**
  - Switch de activación inmediata (Activo / En pausa).
  - Selector de imagen con **compresión automática a WebP en el navegador** (`src/utils/imageCompressor.ts`) vía Canvas API, reduciendo el peso de archivos hasta un 85% para proteger la cuota gratuita de 500 MB de Supabase Storage.
  - Soporte para pegado de URL de imagen externa y previsualización en vivo.
  - Componente `<AdBanner />` integrado en la portada (`index.astro`) entre la Gran Apertura y el Bento Grid secundario; se oculta sin dejar espacios vacíos si no hay banner activo.
- [x] **Centro de Redacción y Copiado RRSS para X / Redes:**
  - Selector lateral de historias del día clusterizadas con desglose fáctico (`🟣 % | 🟢 % | 🟠 %`).
  - Generador automático de copy persuasivo de 280 caracteres con contador en tiempo real y alerta de desbordamiento.
  - Botón de **Copiado al Portapapeles con 1 Clic** con confirmación visual interactiva (ideal para publicar en X sin costo de API).
  - Botón de **Publicar Directo en X** (vía `/api/social/tweet-latest`) con soporte para textos personalizados (`customText`).
- [x] **Consola de Sincronización Forzada:**
  - Disparador manual para administradores que saltea cooldowns, re-raspa los 31 feeds y fuerza el re-clustering de Gemini 2.5 con logs en vivo y métricas de tiempo.

---

### ✅ Tarea 9: Gran Apertura Dinámica por Sección, Orden Cronológico y Timestamps Transparentes — [COMPLETADA]
- [x] **Generación Multi-Historia en Clustering de Gemini (`clustering.ts`):**
  - Prompt actualizado exigiendo de 4 a 6 historias independientes cubriendo las secciones troncales (Política, Economía, Sociedad, Justicia, Internacional).
  - Algoritmo de rescate para complementar con rule-based en caso de que Gemini devuelva menos de 3 clusters.
- [x] **Ordenamiento Cronológico Universal de Noticias (`sync.ts` y `parser.ts`):**
  - Incorporación de `timestamp` epoch en cada artículo.
  - Ordenamiento estricto descendente de los artículos: la pestaña "Minuto a Minuto" ahora mezcla dinámicamente Clarín, Infobae, La Nación, TN, Página 12, Ámbito, El Cronista, Crónica y Perfil por orden de publicación en vivo, eliminando el monopolio de un solo medio.
  - Ampliación de la vista completa de Minuto a Minuto a 60 notas en vivo (en vez de 20).
- [x] **Apertura de Tapa Reactiva a Filtros de Categoría (`index.astro`):**
  - Encabezados dinámicos que informan la sección filtrada (`Cobertura en Sección: POLÍTICA (X historias)`).
  - Desplazamiento suave directo a las historias que coinciden con la sección seleccionada.
- [x] **Transparencia de Horarios, Fallback de Auto-Sync y Botón EN VIVO:**
  - `Header.astro` lee dinámicamente la marca de sincronización en la nube desde Supabase (`getLastSyncTimestampAsync()`).
  - Cápsula interactiva `🟢 EN VIVO` en el encabezado con feedback y disparador manual de sincronización para lectores.
  - **Auto-Sync Fallback bajo demanda**: si los feeds tienen más de 15 minutos, tanto el servidor en SSR como el navegador en segundo plano disparan la sincronización de feeds y el clúster de IA.
  - **Auto-refresco reactivo sin F5**: polling cada 45 segundos que recarga la portada si el usuario está arriba, o muestra una pastilla no intrusiva si está scrolleado abajo.

---

### ✅ Tarea 11: Identidad Visual Oficial y Optimización de Activos — [COMPLETADA]
- [x] **Isotipo Vectorial Oficial (`twitter_profile_logo`):**
  - Vectorización matemática 1:1 en `public/favicon.svg` y `public/images/logo.svg` (círculo azul oscuro `#0B111A`, anillo marfil `#F4F2EB`, letra P arquitectónica blanca y tilde celeste argentino `#6BA4D9`).
  - Creación del componente reutilizable `src/components/BrandLogo.astro`.
  - Reemplazo de todos los marcadores simulados (`<div ...>P</div>`) en el popup de instalación PWA (`PwaBanner.astro`) y en el pie de página (`Footer.astro`).
- [x] **Iconografía PWA Nativa:**
  - Generación de `public/images/icon-192.png` y `public/images/icon-512.png` vinculados a `manifest.json` y cacheados en `sw.js`.
- [x] **Estandarización de Imágenes de Dirigentes:**
  - Redimensión y recorte de `mauricio-macri.jpg` de 844x1245px (806 KB) a 250x369px (17.8 KB), igualando la escala de Milei, Kicillof, Massa y Villarruel.
- [x] **Auditoría Integral de Calidad (`code-tester`):**
  - Corrección de 39 errores de TypeScript/Astro hasta alcanzar **0 errores y 0 advertencias** en los 44 archivos.
  - Instalación de `@types/node` en devDependencies.
  - Persistencia de historias internacionales en Supabase Postgres.

---

### ✅ Tarea 12: Mobile UX Compactness & Motor Viral de Placas Gráficas — [COMPLETADA]
- [x] **Densificación Móvil en `StoryCard.astro`:**
  - Reducción de padding de contenedor a `p-4 sm:p-6 md:p-8` en móviles para optimizar espacio vertical.
  - Altura máxima de imágenes secundarias fijada en `160px` (`max-h-[160px] aspect-video object-cover`) con carga perezosa (`loading="lazy"`).
  - Selector segmentado móvil tipo acordeón/tabs (`[📑 Síntesis y Espectro]` vs `[⚖️ Redacciones (N)]`) para evitar fatiga de scroll en pantallas `< lg`, manteniendo cuadrícula unificada en escritorio (`lg:!block`).
- [x] **Micro-Copy Explicativo de Encuadre en `SpectrumBar.astro`:**
  - Micro-copy técnico neutral debajo de la barra de porcentajes: *"Distribución calculada sobre el encuadre editorial de las notas publicadas en las últimas 24 horas."*.
  - Optimización de estados de foco (`focus:ring-1`) y envoltura flexible para pantallas de 320px sin desbordamiento.
- [x] **Decluttering Superior en `Header.astro`:**
  - Unificación de indicadores financieros (Dólar Blue, Oficial, MEP, CCL, Riesgo País, IPC) y estado de sincronización en una sola fila compacta con scroll horizontal (`h-7 sm:h-8`, `overflow-x-auto no-scrollbar whitespace-nowrap`).
  - Reducción del alto a 28px en móviles y 32px en escritorio para otorgar foco inmediato al titular de portada.
- [x] **Generador de Placas Gráficas 1080x1080 y Exportación en 1 Clic (`ShareModal.astro`):**
  - Motor Canvas 2D nativo en cliente (sin librerías pesadas) que genera placa cuadrada en alta definición (1080x1080px): fondo `#0A0E17`, isotipo vectorial oficial de Politicheck, titular contrastado, barra gráfica del espectro y marca de agua institucional.
  - Botón primario de copiado directo de imagen al portapapeles (`ClipboardItem({'image/png': blob})`) con descarga automática de respaldo en navegadores móviles restrictivos.

---

### ✅ Tarea 13: Algoritmo de Prioridad Editorial para la Gran Apertura de Tapa — [COMPLETADA]
- [x] **Diagnóstico y Corrección de Parsing de Fechas en Clústeres:**
  - Corrección del bug donde cadenas de texto de presentación (ej. `"2/10"`) eran evaluadas por `new Date()` como 10 de febrero de 2001 (`981774000000 ms`), provocando que historias viejas superaran a noticias frescas con timestamps relativos (`"Hace 5 min"` -> `NaN`).
  - Incorporación de campo `timestamp: number` numérico exacto en milisegundos en `StoryCluster` y metadatos de Supabase.
- [x] **Motor de Scoring Editorial Multiredacción (`computeClusterEditorialScore`):**
  - Prioridad absoluta para hechos cubiertos en simultáneo por múltiples medios en las últimas 24 horas: `Score = (redacciones_distintas * 60) + puntaje_frescura`.
  - Bonificación de frescura (+300 pts si < 6h, +200 pts si < 12h) y penalización progresiva para notas viejas (> 24h: -150 pts/día).
  - La historia con mayor consenso editorial del ciclo actual (ej. 8 redacciones en simultáneo) asume de forma garantizada el rol de *Gran Apertura de Tapa*.
- [x] **Auto-Clustering Fallback en SSR y Sincronización Ininterrumpida:**
  - Si los clústeres en la nube superan las 12 horas de antigüedad pero existen artículos RSS del día, SSR ejecuta automáticamente la clusterización con Gemini para regenerar la portada sin esperar un cron externo.
  - Corrección del parámetro de consulta de clústeres recientes en `/api/rss/sync` (`{ maxAgeMinutes: 60 }`), eliminando la confusión entre minutos y días en la comprobación de frescura.

---

### ✅ Tarea 14: Optimización Extrema de Performance Móvil (Core Web Vitals — FCP, LCP y TTFB) — [COMPLETADA]
- [x] **Eliminación del Bloqueo de Renderizado por Tipografías Google Fonts:**
  - Carga asíncrona no bloqueante de Google Fonts (`preload` + cambio dinámico a `stylesheet` y fallback `noscript`).
  - Depuración de pesos y variantes redundantes (reducción del CSS de fuentes de 26.5 KB a 6.5 KB).
  - El navegador pinta el texto de inmediato con fuentes del sistema, abatiendo el FCP a 3.4s y Speed Index a 3.4s (score 90%).
- [x] **Proxy Global de Optimización de Imágenes WebP (`src/utils/image.ts`):**
  - Transcodificación automática de imágenes remotas pesadas (Clarín, Infobae, La Nación de hasta 3.8 MB y 3879px) a formato moderno WebP comprimido (reducción de tamaño de ~90-98%, pesando entre 15 KB y 35 KB).
  - Preconexión HTTP/2 anticipada a `https://wsrv.nl` en el `<head>` para eliminar la latencia de DNS y TLS.
  - Preload prioritario de la imagen de portada ya optimizada en WebP con fallback de reintento automático si falla el proxy.
  - Dimensiones explícitas de ancho y alto en todas las etiquetas de imágenes (CLS: 0).
- [x] **Paralelización de Consultas SSR y Caché de Borde Vercel:**
  - Todas las consultas iniciales a la base de datos se ejecutan concurrentemente con `Promise.all`.
  - Pasaje directo de clústeres y timestamp a `<Header />` a través de props, eliminando consultas duplicadas.
  - Caché de borde en Vercel Edge (`s-maxage=120, stale-while-revalidate=600`) para entregas instantáneas (<100ms TTFB).
- [x] **Caché en Memoria para Cotizaciones y Clima (`src/services/finance.ts`):**
  - Implementación de TTL de 15 minutos en memoria para cotizaciones del dólar, riesgo país, inflación y clima de Buenos Aires con timeouts estrictos (2-3s).



---

### ✅ Tarea 15: Integración de Metodología Ground News (Sesgo, Propiedad y Factualidad) — [COMPLETADA]
- [x] **Evolución del Esquema de Dominio (`src/types/index.ts`):**
  - Tipado de Ideología (`Ideology`): escala de 5 puntos (`izquierda`, `centro_izquierda`, `centro`, `centro_derecha`, `derecha`).
  - Calificación de Factualidad (`FactualityRating`): `muy_alta`, `alta`, `mixta` basada en rigor documental y políticas de rectificación.
  - Estructura Corporativa (`OutletOwnership` y `FundingType`): `privado_corporativo`, `sindical_partidario`, `publico_estatal`, `independiente_suscripcion`.
  - Preservación estricta de compatibilidad de `baselineLeaning` (`oficialismo`, `centro_datos`, `oposicion`) sin regresiones en clusterización o barras de espectro.
- [x] **Enriquecimiento del Registro de 31 Medios (`src/utils/outlets.ts`):**
  - Mapeo fáctico exhaustivo de los 15 medios nacionales (Clarín, La Nación, Infobae, TN, Página 12, Ámbito, El Cronista, Perfil, elDiarioAR, Crónica, BAE, La Izquierda Diario, Cenital, El Economista, La Derecha Diario) y los 16 internacionales (Financial Times, El País, CNN, BBC Mundo, France 24, Le Monde, Le Figaro, El Mundo, La Vanguardia, Expansión, The Guardian, NY Times, DW, Nikkei Asia, Japan Times, Xinhua).
  - Fuentes de auditoría externa citadas explícitamente: AllSides, Media Bias/Fact Check (MBFC) y Media Ownership Monitor (MOM / Reporteros Sin Fronteras).
- [x] **Refactorización de la Página de Metodología (`src/pages/metodologia.astro`):**
  - Eliminación de 435 líneas de catálogo duplicado; importación directa de `OUTLETS_REGISTRY` (`DRY`).
  - Nueva tarjeta visual de medios con badges de ideología y factualidad, bloque de estructura corporativa (grupo y tipo de propiedad), perfil editorial, cita de auditoría independiente y enlaces directos al feed RSS y web.
  - Barra de herramientas con filtros combinados en tiempo real (categoría: nacional/internacional, factualidad: muy alta/alta/mixta, ideología: 5 polos) y búsqueda dinámica de texto completo.

---

### ⏳ Tarea 10: Foro Cívico de Debate & Sala de Chat Electoral en Vivo (Backlog) — [PENDIENTE]
- [ ] **Sala de Chat Electoral en Vivo (Live Stream Chat):**
  - Chat en tiempo real durante debates presidenciales, discursos de apertura de sesiones y noches de conteo electoral.
  - Implementación con Supabase Realtime (WebSockets) y control de spam (rate-limiting de mensajes por minuto).
  - Herramientas de moderación en vivo para administradores y moderadores (silenciar, banear por IP/cuenta, borrado de mensajes de odio o bots).
- [ ] **Foro Cívico de Contraste Ciudadano:**
  - Hilos de debate asociados a cada historia clusterizada de portada.
  - Sistema de reputación ciudadana y argumentos fundamentados (con cita de fuentes obligatoria para combatir fake news).
  - Roles de usuario: solo usuarios registrados pueden comentar y votar positivamente argumentos de valor cívico.


