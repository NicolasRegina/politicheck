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

### ⏳ Tarea 2: Ampliación del Monitor de Promesas 2027 — [SIGUIENTE TAREA]
- [ ] **Incorporar nuevas figuras y promesas verificables:**
  - *Victoria Villarruel* (Seguridad, Defensa y Malvinas).
  - *Patricia Bullrich* (Seguridad Interior, protocolo antipiquetes y control del narcotráfico).
  - *Jorge Macri* (Ciudad de Buenos Aires, infraestructura y orden público).
  - *Juan Schiaretti* (Federalismo, producción del interior y equilibrio fiscal).
  - *Leandro Santoro / Horacio Rodríguez Larreta* (Alternativas de centro / oposición).
- [ ] **Fotografías y ficha editorial:** Fotos de archivo de alta calidad y enlaces directos al Boletín Oficial, INDEC o documentos de campaña.
- [ ] **Fichas individuales compartibles:** Rutas `/promesa/[id]` para permitir enlazar y viralizar promesas individuales con su termómetro de cumplimiento.

---

### ⏳ Tarea 3: Botones y Fichas Virales para Redes Sociales (X / WhatsApp)
- [ ] **Botones de Compartir con 1 Clic:**
  - Integrar en cada historia de tapa y tarjeta de promesa botones rápidos para compartir en **X (Twitter)**, **WhatsApp**, **Telegram** y copiar enlace al portapapeles.
- [ ] **Copy persuasivo prediseñado:**
  - *"Mirá cómo Clarín, La Nación, Página 12 y France 24 cubrieron esta misma noticia en simultáneo 👉 politicheck.com.ar/historia/..."*
- [ ] **OpenGraph dinámico:**
  - Generar meta tags específicos con vista previa en tarjetas de Twitter/WhatsApp mostrando los porcentajes del espectro.

---

### ⏳ Tarea 4: Detección y Banner de "Alerta / Último Momento" (Breaking News)
- [ ] **Algoritmo de Breaking News:**
  - Detección de coincidencia temática urgente cuando 3 o más diarios publiquen sobre un mismo hecho en los últimos 20 minutos.
- [ ] **Cinta visual de alerta en cabecera:**
  - Banner dinámico pulsante en la parte superior con enlace directo al contraste de redacciones en vivo.

---

### ⏳ Tarea 5: Página Institucional de Metodología y Transparencia (`/metodologia`)
- [ ] **Creación de `src/pages/metodologia.astro`:**
  - Transformar el enlace de cabecera en una página institucional completa.
  - Explicación de la fórmula matemática del espectro de sesgo.
  - Catálogo público de los 31 medios monitoreados con su orientación de base y enlaces a sus feeds oficiales.
  - Declaración de neutralidad algorítmica y código abierto cívico.

---

### ⏳ Tarea 6: Optimización de Rendimiento y Experiencia PWA
- [ ] Cacheado service worker para carga instantánea en conexiones móviles.
- [ ] Notificaciones opcionales de resumen matutino para lectores recurrentes.
