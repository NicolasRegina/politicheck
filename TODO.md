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

### ⏳ Tarea 8: Modo Administrador / Superadmin & Centro de Control Editorial (Supabase RBAC) — [PENDIENTE]
- [ ] **Arquitectura de Autenticación y Roles con Supabase (`profiles` + RLS):**
  - Tabla de perfiles (`profiles`) vinculada a `auth.users` con roles: `'superadmin'`, `'admin'`, `'moderator'`, `'user'`.
  - Políticas de seguridad a nivel de fila (Row Level Security - RLS).
  - **Permisos del Superadmin:**
    - Panel de gestión ABM de usuarios: crear, editar, asignar roles o revocar permisos de otros administradores y superadmins.
    - Borrado o edición forzada de cualquier historia, cluster o banner.
    - Acceso a métricas globales de tráfico, llaves API y configuraciones críticas.
    - Moderación suprema de futuros canales de comunidad (Chat y Foro).
  - **Permisos del Administrador (Admin):**
    - Gestión del Gestor de Banners (activar/desactivar, subir imagen a Supabase Storage, link de destino).
    - Centro de RRSS (previsualizar copies, editar texto, botón de 1 clic para copiar a X y publicación directa).
    - Disparo de sincronización forzada de los 31 feeds RSS y re-clustering.
    - Moderación de reportes de noticias.
    - *Restricción de seguridad:* Un admin NO puede crear, editar ni modificar roles de otros admins ni superadmins.
- [ ] **Ruta Protegida `/admin` con UI Moderna:**
  - Login formal con Supabase Auth (email y contraseña).
  - Dashboard editorial con métricas de salud de los 31 feeds RSS y botones de acción rápida.
- [ ] **Gestor de Banners Publicitarios / Patrocinios Cívicos:**
  - Toggle de estado (Activo / Oculto).
  - Subida de banner a Supabase Storage (500 MB libres) o enlace directo a imagen.
  - Enlace de destino (`href`) y texto alternativo.
  - Bloque `<AdBanner />` en la portada del usuario que solo se renderiza si el banner está en `ON`.
- [ ] **Centro de Redacción y Copiado RRSS para X / Redes:**
  - Tarjetas de previsualización para cada noticia de portada del día.
  - Campo de texto editable para retocar el copy al instante.
  - Botón de **Copiado al Portapapeles con 1 Clic** (para pegar manualmente en X.com en 2 segundos sin costo de API).
  - Botón de **Publicar Directo en X** (vía `/api/social/tweet-latest`) para cuando se activen créditos.

---

### ✅ Tarea 9: Gran Apertura Dinámica por Sección, Orden Cronológico y Timestamps Transparentes — [COMPLETADA]
- [x] **Generación Multi-Historia en Clustering de Gemini (`clustering.ts`):**
  - Prompt actualizado exigiendo de 4 a 6 historias independientes cubriendo las secciones troncales (Política, Economía, Sociedad, Justicia, Internacional).
  - Algoritmo de rescate para complementar con rule-based en caso de que Gemini devuelva menos de 3 clusters.
- [x] **Ordenamiento Cronológico Universal de Noticias (`sync.ts` y `parser.ts`):**
  - Incorporación de `timestamp` epoch en cada artículo.
  - Ordenamiento estricto descendente de los 878 artículos cruzados: la pestaña "Minuto a Minuto" ahora mezcla dinámicamente Clarín, Infobae, La Nación, TN, Página 12, Ámbito, El Cronista, Crónica y Perfil por orden de publicación en vivo, eliminando el monopolio de un solo medio.
  - Ampliación de la vista completa de Minuto a Minuto a 60 notas en vivo (en vez de 20).
- [x] **Apertura de Tapa Reactiva a Filtros de Categoría (`index.astro`):**
  - Encabezados dinámicos que informan la sección filtrada (`Cobertura en Sección: POLÍTICA (X historias)`).
  - Desplazamiento suave directo a las historias que coinciden con la sección seleccionada.
- [x] **Transparencia de Horarios y Retiro del Botón Público:**
  - Reemplazo del texto ambiguo "Hace +1 hora" por el horario exacto del servidor: `Hoy 21:15 hs (hace 4 min)`.
  - Retiro del botón público de "Actualizar Noticias" y reemplazo por un badge institucional no intrusivo `🟢 EN VIVO • Sincronizado hoy`. El botón de sync manual queda reservado exclusivamente para el `/admin`.
  - Cron de Vercel acelerado a **cada 15 minutos** (`*/15 * * * *` en `vercel.json`).

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


