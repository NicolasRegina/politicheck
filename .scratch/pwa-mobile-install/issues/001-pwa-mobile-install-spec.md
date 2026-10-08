---
title: "Spec: Experiencia Móvil de Recomendación e Instalación PWA (Android e iOS)"
status: ready-for-agent
labels:
  - ready-for-agent
  - pwa
  - mobile-ux
feature: pwa-mobile-install
---

# Experiencia Móvil de Recomendación e Instalación PWA (Android e iOS)

## Problem Statement

Cuando un ciudadano accede a Politicheck desde su teléfono móvil (Android o iPhone), no recibe una invitación clara, accesible ni ergonómica para instalar la aplicación en su pantalla de inicio. 

Actualmente, el sistema depende de un banner de escritorio flotante que únicamente reacciona al evento `beforeinstallprompt` (incompatible por diseño con iOS Safari) y que, en caso de ser descartado, no ofrece un punto de acceso alternativo evidente dentro de la navegación móvil. Como resultado, a los usuarios que desean tener la aplicación instalada les resulta confuso o difícil lograrlo por sus propios medios sin instrucciones paso a paso.

## Solution

Implementar un flujo de recomendación e instalación móvil adaptativo que distinga de forma inteligente entre entornos Android (Chromium) e iOS (Safari):

1. **Recomendación no invasiva:** Tras 3 segundos de lectura en la portada, se despliega una tarjeta inferior (*Bottom Sheet*) accesible para el pulgar invitando a la instalación con beneficios claros (acceso rápido, cero consumo de datos innecesario, pantalla completa).
2. **Acción directa en Android:** En navegadores compatibles, el botón *"Instalar App"* dispara el diálogo nativo del sistema operativo en 1 solo toque.
3. **Guía interactiva para iOS (Safari):** Ante la falta de APIs de instalación programática en WebKit, la interfaz presenta una guía visual clara con los 2 pasos exactos (Tocar *"Compartir"* ⎋ y seleccionar *"Agregar a pantalla de inicio"* ➕).
4. **Detección de modo instalado (Standalone):** Si el usuario ya ejecuta la aplicación instalada, cualquier aviso o recomendación se silencia de inmediato.
5. **Persistencia y Acceso Permanente:** Si el usuario descarta la sugerencia, se respeta una ventana de descanso de 3 días; sin embargo, se provee un botón accesible *"📲 Instalar App"* en el menú móvil para que pueda instalarla cuando lo desee.

## User Stories

1. As a mobile citizen on Android, I want to see a clear bottom sheet inviting me to install the app after reading for a few seconds, so that I don't have to search through browser menus.
2. As a mobile citizen on Android, I want to tap a single "Instalar App" button, so that my operating system prompts the native home screen install without extra steps.
3. As an iPhone user on Safari, I want to see an illustrated step-by-step guide showing how to share and add to home screen, so that I can easily install the app despite iOS limitations.
4. As a mobile reader, I want the install prompt to wait 3 seconds before appearing, so that I can first scan the top headlines without feeling interrupted upon arrival.
5. As a mobile reader who dismissed the prompt, I want the system to remember my choice for 3 days, so that I am not constantly annoyed by repeated popups on every visit.
6. As a mobile reader who previously dismissed the prompt but changed my mind, I want to find a persistent "Instalar App" option inside the mobile navigation menu, so that I can install Politicheck at any time on demand.
7. As an active app user who already opened Politicheck from the home screen in standalone mode, I want the install banners to never show up, so that my full-screen app experience remains clean and native.
8. As a desktop user, I want the mobile-specific bottom sheet to adapt gracefully into a discrete corner toast, so that the desktop reading experience is not compromised.
9. As a mobile reader in dark mode, I want the install sheet and icons to blend seamlessly with the dark theme, so that my reading comfort is preserved.
10. As a reader with poor connectivity, I want to understand that installing the app allows faster offline caching of news, so that I value adding it to my device.

## Implementation Decisions

- **Módulo de Banner e Instalación PWA:**
  - Rediseñar el componente de presentación de PWA para operar como un *Bottom Sheet* ergonómico en dispositivos móviles y como tarjeta flotante en resoluciones mayores.
  - Implementar detección de plataforma móvil basada en `navigator.userAgent` / capacidades táctiles para diferenciar entre iOS (Safari) y Android/navegadores basados en Chromium.
  - Soporte condicional: renderizado dinámico de la interfaz con dos vistas internas:
    - *Vista Android/Chromium:* Botón directo de acción vinculado al evento `beforeinstallprompt`.
    - *Vista iOS/WebKit:* Contenedor explicativo visual con iconografía de los botones de Safari (*Compartir* y *Agregar a Inicio*).
  - Manejo de estado standalone: verificación activa de `window.matchMedia('(display-mode: standalone)').matches` y `navigator.standalone` para abortar la presentación si la aplicación ya se ejecuta instalada.
  - Temporizador de apertura: retraso deliberado de 3.000 milisegundos tras la carga completa del documento para invocar la animación de entrada.
  - Persistencia de descarte: almacenamiento en almacenamiento local del navegador (`localStorage`) con marca de tiempo Unix (`politicheck-pwa-dismissed-until`), garantizando 3 días naturales de enfriamiento antes de una reaparición automática.

- **Módulo de Navegación y Cabecera Móvil:**
  - Incorporar en el cajón desplegable del menú móvil un elemento de acción *"📲 Instalar App"*.
  - Al interactuar con este botón, se debe invocar una función global en el objeto ventana (`window.openPwaInstallPrompt()`) que ignore el temporizador y el estado de enfriamiento, desplegando inmediatamente el *Bottom Sheet* correspondiente a la plataforma del dispositivo.

- **Tratamiento Tipográfico y Visual:**
  - Aplicar el estilo editorial neutro de Politicheck, con soporte completo para modo claro y modo oscuro, respetando las variables de diseño y espaciados móviles.

## Testing Decisions

- **Criterio de Buena Prueba:**
  - Evaluar exclusivamente el comportamiento externo visible y los eventos del navegador (visibilidad del contenedor, interacción con el botón nativo, descarte con enfriamiento temporal y respuesta al botón del menú), sin acoplarse a detalles de implementación interna.
- **Módulos bajo Prueba:**
  - Módulo de recomendación e instalación PWA (apertura tras retardo, detección de standalone, bifurcación Android/iOS, persistencia de descarte).
  - Módulo de cabecera (disparador manual desde el menú móvil).
- **Antecedentes y Referencias en el Repositorio:**
  - Pruebas y validaciones de tipos existentes vía verificación estática de Astro (`npx astro check`) y compilación de producción (`npm run build`).
  - Verificación en navegador y herramientas de desarrollo móvil (Chrome DevTools / Device Emulation) simulando vistas móviles de iPhone (iOS) y Pixel/Galaxy (Android).

## Out of Scope

- Generación de aplicaciones nativas empaquetadas para Google Play Store o Apple App Store (TWA / Capacitor).
- Notificaciones push nativas en segundo plano para iOS fuera del estándar Web Push de Safari.
- Alteraciones al Service Worker existente más allá del registro de ciclo de vida estándar ya implementado.

## Further Notes

- Esta especificación responde directamente a la solicitud del usuario tras la sesión interactiva de refinamiento de diseño (`/grill-me`).
