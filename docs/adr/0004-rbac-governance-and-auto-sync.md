# 0004: Modelo de Gobernanza RBAC y Resiliencia de Sincronización en Vivo

## Contexto
Politicheck requiere una arquitectura administrativa y editorial segura para gestionar patrocinios, sindicación en redes y moderación sin comprometer la neutralidad ni la estabilidad del sistema bajo tráfico masivo. Adicionalmente, al operar en un entorno Serverless (Vercel Hobby + Supabase Free Tier), los cron jobs pueden presentar retrasos, requiriendo un esquema de sincronización resiliente que garantice que el lector siempre reciba noticias actualizadas en tiempo real (< 15 min).

## Decisión

### 1. Gobernanza y RBAC (Supabase Auth + RLS)
Se adopta un modelo estricto de control de acceso basado en roles implementado en la tabla `profiles` vinculada a `auth.users`:
- **Superadmin (`contacto@politicheck.com.ar`)**:
  - Máxima autoridad técnica y editorial.
  - Capacidad exclusiva de ABM sobre otros administradores y superadministradores.
  - Acceso total a configuración, borrado de registros, métricas y llaves.
- **Admin**:
  - Gestión editorial: activar/desactivar y configurar banners publicitarios (con compresión WebP automática para cuidar los 500 MB libres de Supabase Storage).
  - Centro de Redacción RRSS: previsualización de tarjetas X, copiado rápido al portapapeles y publicación directa.
  - Sincronización manual forzada de los 31 feeds RSS y re-clustering de IA.
  - *Restricción inviolable:* Un Admin no puede ver, crear, modificar ni eliminar otros administradores o superadministradores.
- **Moderador & Ciudadano**:
  - Roles proyectados para el futuro chat en vivo y foro cívico con reputación y filtros anti-odio.

### 2. Resiliencia de Sincronización Multi-Capa (Zero Stale Feeds)
Para eliminar la dependencia exclusiva de cron jobs externos y garantizar frescura constante:
1. **Cron Automatizado**: Vercel Cron cada 15 minutos (`*/15 * * * *`).
2. **Fallback Reactivo bajo Demanda (SSR)**: Durante el renderizado en servidor de `index.astro`, si la última sincronización en Supabase (`getLastSyncTimestampAsync()`) tiene más de 15 minutos, se dispara una sincronización asíncrona de fondo sin bloquear la carga inicial.
3. **Polling en Cliente (Auto-Refresh Silencioso)**: El navegador consulta cada 45 segundos el estado del feed. Si detecta nuevos clusters y el lector está al inicio de la página, refresca suavemente; si está scrolleando, muestra una notificación flotante no intrusiva.
4. **Disparador Manual**: Botón `🟢 EN VIVO` interactivo en la cabecera que permite al usuario o administrador forzar la verificación inmediata.
