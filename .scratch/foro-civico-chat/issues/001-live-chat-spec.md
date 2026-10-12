---
title: "Spec: Sala de Chat Electoral en Vivo y Moderación Cívica en Tiempo Real"
status: ready-for-agent
labels:
  - ready-for-agent
  - realtime
  - chat
  - civic-debate
  - supabase
feature: foro-civico-chat
---

# Sala de Chat Electoral en Vivo y Moderación Cívica en Tiempo Real

## Problem Statement

Durante coberturas de alto impacto cívico (debates presidenciales, discursos oficiales de apertura de sesiones, anuncios económicos y noches de conteo electoral), los ciudadanos consumen noticias en Politicheck pero no disponen de un canal de interacción en vivo para intercambiar opiniones, contrastar fuentes y debatir en tiempo real con otros lectores.

Sin un canal estructurado de debate en vivo:
1. La retención de usuarios en momentos de alta concurrencia se traslada a redes sociales externas (X/Twitter, Twitch, YouTube).
2. Se carece de un espacio cívico moderado libre de troleo masivo, bots y desinformación.
3. Se desaprovecha la infraestructura de Supabase Realtime ya integrada en la plataforma.

## Solution

Implementar una **Sala de Chat Electoral en Vivo (Live Stream Chat)** ligera, minimalista y resiliente:

1. **Tiempo Real con Supabase Realtime:**
   - Canal WebSocket persistente (`chat_messages`) con subscripción a eventos `INSERT` y `UPDATE` (para moderación inmediata).
   - Mecanismo de fallback por polling inteligente cada 4 segundos si la conexión WebSocket se interrumpe o si el navegador bloquea sockets.

2. **Gobernanza y Moderación RBAC:**
   - Integración con los roles existentes en `public.profiles` (`superadmin`, `admin`, `moderator`, `user`).
   - Moderadores y Administradores tienen botones de acción inmediata: fijar mensaje en cabecera (*Pin*), ocultar mensaje (*Hide/Soft-delete*) y sancionar por IP/Hash (*Mute*).

3. **Prevención de Spam y Calidad Cívica:**
   - Rate limiting del lado del cliente y verificación de cooldown (máximo 1 mensaje cada 5 segundos por usuario).
   - Límite de caracteres (máx. 280 caracteres por mensaje para evitar *walls of text*).
   - Sanitización de HTML para prevenir ataques XSS.
   - Píldoras de identificación neutral (nombre cívico o usuario autenticado sin revelar datos privados).

4. **Diseño Visual Minimalista (Zinc & Carbon):**
   - Coherente con la identidad visual técnica de Politicheck (`font-sans`, detalles en `font-mono`, bordes de 1px, sin emojis estridentes, indicador pulsante de estado en vivo).
   - Modo colapsable para no interferir con la lectura de noticias en móviles.

## User Stories

1. **Como ciudadano lector**, quiero ver un indicador pulsante *"En Vivo: Chat del Debate"* en la cabecera cuando haya un acontecimiento de cobertura electoral, para sumarme a la conversación en tiempo real.
2. **Como ciudadano lector**, quiero enviar mensajes breves (hasta 280 caracteres) y verlos reflejados al instante sin recargar la página.
3. **Como ciudadano en móvil**, quiero poder minimizar o desplegar el chat con un solo toque para no tapar los titulares de portada mientras leo.
4. **Como moderador o admin**, quiero poder borrar mensajes ofensivos o spam con un solo clic y que desaparezcan en tiempo real para todos los participantes.
5. **Como moderador**, quiero poder fijar un mensaje editorial o aviso de fuente verificado en la parte superior del chat (*Pinned Announcement*).
6. **Como usuario no registrado**, quiero poder participar eligiendo un alias cívico temporal protegido por hash o iniciar sesión para preservar mi historial.
7. **Como sistema**, quiero que si Supabase no está configurado o hay corte de red, la interfaz muestre un estado amigable indicando la reconexión automática sin romper la navegación.

## Acceptance Criteria

- [ ] **Esquema de Base de Datos:** Tabla `chat_messages` y `chat_channels` en PostgreSQL con RLS activado, claves foráneas seguras e índices optimizados por `created_at` y `channel_id`.
- [ ] **Publicación Realtime:** Migración SQL que habilita `supabase_realtime` en la tabla `chat_messages`.
- [ ] **Servicio Supabase:** Métodos tipados en `src/services/supabase.ts` para enviar, listar, moderar y suscribirse en tiempo real.
- [ ] **Componente UI:** Componente `src/components/LiveChat.astro` con selector de canales (ej: `#general`, `#debate2025`, `#economia`), chat autoscroll, contador de caracteres, rate-limit y control de moderación.
- [ ] **Integración en Header:** Botón accesible en `src/components/Header.astro` con badge de conteo y estado.
- [ ] **Resiliencia & Build:** `npx astro check` y `npm run build` con 0 errores y degradación elegante si no hay credenciales de Supabase en dev.
