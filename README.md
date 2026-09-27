# Politicheck 🇦🇷

> **Plataforma cívica de auditoría mediática y seguimiento de promesas electorales en Argentina.**

Politicheck agrega en tiempo real las noticias de los principales medios nacionales e internacionales (a través de sus canales y feeds oficiales RSS), analiza con inteligencia artificial (**Google Gemini**) el sesgo y encuadre editorial de cada cobertura, y permite a la ciudadanía auditar de forma comunitaria las promesas de campaña de los dirigentes políticos.

---

## 🚀 Características Principales

* **📊 Auditoría y Espectro Mediático:**
  * Algoritmo de clustering que agrupa coberturas de una misma noticia publicadas por distintos medios (Clarín, La Nación, Infobae, Página 12, Ámbito, El Cronista, Télam/Somos Télam, etc.).
  * Barra de espectro ideológico-editorial y contraste de encuadres (titular neutral vs. ángulo de cada medio).
  * Citas textuales directas para cada medio.

* **🎯 Monitor de Promesas de Campaña:**
  * Seguimiento exhaustivo de compromisos electorales clasificados por estado (*Cumplida*, *En progreso*, *Incumplida*).
  * **Semáforo y Voto Ciudadano:** Sistema de votación comunitaria en tiempo real con protección criptográfica contra spam (hash SHA-256 de votante) y posibilidad de rectificación de voto.

* **⚡ Flujo en Vivo (Minuto a Minuto):**
  * Sincronización en tiempo real de noticias con preservación de scroll en pantalla.
  * Ticker financiero con cotizaciones del Dólar (Oficial y Blue en tiempo real) y clima metropolitano.

* **🎨 Diseño Editorial de Alta Gama:**
  * Tipografías periodísticas premium (*Cinzel*, *Newsreader*, *Playfair Display* e *Inter*).
  * Modo Oscuro y Modo Claro de alto contraste con persistencia en `localStorage`.

---

## 🛠️ Stack Tecnológico

* **Framework:** [Astro 5](https://astro.build/) (Arquitectura de islas, híbrido SSR/SSG con `@astrojs/node`).
* **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) con diseño editorial responsivo.
* **Inteligencia Artificial:** [Google Gemini 2.5 Flash](https://aistudio.google.com/) para clustering semántico y análisis de encuadres mediáticos.
* **Datos y Feeds:** Parsing RSS oficial en tiempo real, APIs financieras argentinas y almacenamiento persistente.

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/politicheck.git
cd politicheck
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copiá el archivo de ejemplo y completá tu clave de API:
```bash
cp .env.example .env
```
Editá `.env` y agregá tu clave de Google Gemini:
```env
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=4321
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:4321`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
