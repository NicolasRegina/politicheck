# 0001: Stack Tecnológico, Ingesta RSS y Despliegue para Alto Tráfico

## Contexto
El proyecto requiere una plataforma de noticias políticas y promesas electorales con picos masivos de tráfico concurrente durante el año electoral en Argentina, sin incurrir en altos costos de infraestructura y garantizando estricta seguridad legal y técnica en la obtención de noticias.

## Decisión
1. **Frontend y Renderizado**: Se utilizará **Astro** con componentes interactivos aislados (Islands Architecture con React/Tailwind CSS). Astro pre-renderiza páginas estáticas con revalidación periódica (ISR) servidas directamente desde edge CDN (Cloudflare Pages o Vercel), reduciendo el costo de servidor y garantizando latencias <100ms ante miles de usuarios simultáneos.
2. **Base de Datos**: Se utilizará **Supabase (PostgreSQL Serverless)** para almacenar las Historias, Noticias, Medios y perfiles de Candidatos.
3. **Ingesta de Noticias**: Se implementará mediante **feeds RSS públicos y oficiales** de los principales portales (Clarín, La Nación, Infobae, Página 12, Ámbito, CNN, etc.). No se realizará web scraping de cuerpo completo para evitar violaciones de derechos de autor y bloqueos técnicos. Se almacenará titular, fecha, bajada corta y enlace a la fuente original.
4. **Agrupación y Análisis de Sesgo**: Un cron job automatizado ejecutará un pipeline con LLM (ej. Gemini 1.5 Flash) para agrupar noticias en torno a una **Historia** común y extraer el **Encuadre** comparativo.
