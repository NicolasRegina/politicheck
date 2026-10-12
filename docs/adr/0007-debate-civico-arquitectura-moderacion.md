# 0007. Debate Cívico de Historias: Arquitectura, Identidad Híbrida y Moderación

Para fomentar la deliberación ciudadana en torno a la cobertura mediática sin reproducir la toxicidad de las redes sociales convencionales, se implementa el **Debate Cívico de Historia** anclado exclusivamente en `/historia/[id]`. El sistema combina identidad híbrida (alias con huella SHA-256 sin login obligatorio y opción de verificación vía Supabase Auth), hilos de 2 niveles (Comentario Raíz y Respuestas), ordenamiento por relevancia cívica ponderada en el tiempo (Karma ▲/▼), auto-colapso comunitario para aportes con karma <= -5 o reportes, y actualización en tiempo real con WebSockets selectivos.

## Status
Accepted

## Context
Las secciones de comentarios en portales políticos suelen degenerar en granjas de troleo, insultos y ataques coordinados de brigadas partidarias. Al mismo tiempo, imponer inicio de sesión obligatorio reduce la participación ciudadana en más de un 75% en contextos electorales de alto tráfico móvil. Politicheck requería un espacio deliberativo de baja fricción, transparente, con capacidad de auto-regulación comunitaria y respaldado por roles de moderación administrativa.

## Decisiones Clave

1. **Anclaje a Historias:** Los debates no nacen en el vacío; se vinculan estrictamente al identificador de cada Historia clusterizada (`story_id`), aprovechando el contexto visual del contraste de medios y la barra de espectro editorial.
2. **Identidad Híbrida y Huella Cívica:** Los ciudadanos pueden participar de inmediato eligiendo un alias público protegido por un hash criptográfico (`ip_hash` SHA-256 con sal), pudiendo optar por iniciar sesión con Supabase Auth para recibir la insignia de *Ciudadano Verificado*.
3. **Integridad del Voto de Karma:** Cada voto (▲ o ▼) se audita en la tabla `forum_votes` por `(comment_id, voter_hash)`, asegurando el principio democrático de un voto por ciudadano conmutable (*switched*).
4. **Hilos de 2 Niveles:** Estructura jerárquica acotada a Comentario Raíz y Respuestas directas, optimizada para legibilidad en dispositivos móviles.
5. **Escudo de Moderación Triple:** Filtro sintáctico de léxico ofensivo en la API, auto-colapso comunitario cuando el karma cae por debajo de -5 o acumula 3 reportes, y botones de moderación en vivo para roles `admin`, `superadmin` y `moderator`.
6. **Optimización de Tráfico:** Carga SSR veloz de comentarios iniciales con suscripción de Supabase Realtime acotada a nuevos comentarios y respuestas, evitando saturar la cuota de WebSockets con micro-eventos de votos.
7. **Trigger Transaccional en PostgreSQL:** La actualización de contadores (`karma_score`, `upvotes`, `downvotes`) se delega a un trigger nativo en base de datos sobre la tabla `forum_votes`, asegurando atomicidad ACID y lecturas de comentarios ultra rápidas sin sobrecarga en la API.
8. **Preservación de Hilos Legítimos:** Si un Comentario Raíz es eliminado por moderación, su contenido se reemplaza por un aviso institucional pero sus Respuestas Anidadas legítimas se preservan intactas para no romper el hilo de deliberación comunitaria.
9. **Flujo de Lectura y Navegación:** El debate se ubica como bloque de cierre en `/historia/[id]`, complementado por un enlace de salto suave en la cabecera con contador en tiempo real (`💬 Debate Cívico (N)`).

## Consecuencias
- Habilita una comunidad cívica participativa sin fricciones de registro.
- Garantiza rendimiento y estabilidad de costos en Vercel y Supabase Cloud.
- Establece la base para escalar en una Fase 2 hacia un Salón Central de Debates (`/debates`).

