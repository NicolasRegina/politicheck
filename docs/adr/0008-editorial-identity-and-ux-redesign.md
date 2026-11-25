# 0008: Identidad Visual Editorial Contemporánea, Espectro No-Partidario y Rediseño UX (Ola 1)

> **Estado:** Aceptado (2026-11-24)  
> **Reemplaza (*Supersedes*):** [ADR-0003: Sistema de Colorimetría y Neutralidad Política](./0003-color-system-and-political-neutrality.md)  
> **Referencias:** [Auditoría UX](../../.scratch/ux-brand-audit/01-ux-audit.md) · [Propuestas de Identidad](../../.scratch/ux-brand-audit/02-brand-identity-proposals.md) · [Prototipo Comparativo](../../.scratch/ux-brand-audit/prototype/index.html)

---

## Contexto

La evolución de Politicheck evidenció dos problemas estructurales respecto al [ADR-0003](./0003-color-system-and-political-neutrality.md):

1. **Contradicción reputacional en `SpectrumBar`**: Pese a prohibir colores partidarios, la implementación terminó usando `violet-600` para Oficialismo (color de La Libertad Avanza), `emerald-500` para Centro/Datos y `amber-500` para Oposición, replicando esa codificación en el copy viral (`🟣 | 🟢 | 🟠`).
2. **Estética genérica de template SaaS y fricción UX**: El uso de `slate-50`, múltiples niveles de tarjetas `rounded-2xl` con sombras y `backdrop-blur-md` diluía la autoridad editorial, mientras una cabecera `sticky` de 4 franjas (~210–260px), pestañas ocultas en mobile y affordances rotas en Portada afectaban la lectura y el descubrimiento del Promesómetro.

Tras validar en un prototipo interactivo la dirección *Edición Papel & Archivo Cívico* frente a *Revista Política Contemporánea*, se optó por esta última para diferenciar a Politicheck tanto de los diarios argentinos tradicionales como de paneles SaaS genéricos.

---

## Decisión

### 1. Identidad Visual: Revista Política Contemporánea (*Modern Editorial*)

#### Paleta Semántica (Light + Dark)
Se abandonan `#FFFFFF`/`#000000` puros como lienzo, los grises azulados (`slate-*`) y el *glassmorphism* en el chrome editorial.

| Token semántico | Light (Crema Editorial) | Dark (Carbón Cálido) | Uso |
| :--- | :--- | :--- | :--- |
| `--color-canvas` | `#FAF9F6` | `#121210` | Fondo principal cálido sin tinte azul |
| `--color-surface` | `#FFFFFF` | `#1B1B18` | Tarjetas sutiles sin sombra pesada |
| `--color-surface-muted` | `#F1EFE9` | `#252521` | Bandas de contexto, ticker y metadatos |
| `--color-ink` | `#161614` | `#F2F0EB` | Tinta editorial principal |
| `--color-ink-muted` | `#575550` | `#A3A098` | Subtítulos, epígrafes y timestamps |
| `--color-rule` | `#E3DFD5` | `#2E2E29` | Separadores suaves `1px` |
| `--color-rule-strong` | `#161614` | `#F2F0EB` | Líneas de cabecera y cierre de sección |
| `--color-accent` *(único)* | `#1E3A5F` | `#7FB3E0` | Azul tinta marino (foco, enlaces, acciones activas) |

#### Tipografía (3 familias reales en Google Fonts)
- **Display / Titulares:** `Fraunces` (`opsz,SOFT,wght@9..144,0..50,600..800`) con `leading-[1.12]`.
- **UI / Cuerpo:** `DM Sans` (`400, 500, 600, 700`).
- **Datos / Timestamps / Porcentajes:** `JetBrains Mono` (`400, 500, 600` con `tabular-nums`).
- Se eliminan `Plus Jakarta Sans`, `Inter` y cualquier uso de `font-black` (`900`) que sintetice *faux-bold*.

#### Superficies y Masthead
- Radios contenidos: `rounded-md` (`6px`) máximo en tarjetas/controles (prohibido `rounded-2xl` y cajas anidadas dentro de cajas). Elevación por contraste tonal (`--color-surface` sobre `--color-canvas`) + borde `1px` (`--color-rule`).
- El isotipo oficial `P-Checkmark` (`BrandLogo.astro`) se integra en el masthead editorial.

---

### 2. Neutralidad Partidaria y Nuevo `SpectrumBar`

1. **Lista Negra Partidaria Argentina:** Violeta/púrpura (LLA), celeste/azul saturado en barras de sesgo (PJ/UxP), amarillo (PRO) y rojo (izquierda) quedan **prohibidos en `SpectrumBar`, `StoryCard` y chrome general**. Se reservan exclusivamente para píldoras de filiación de Candidatos en el Promesómetro y perfiles de dirigentes.
2. **Codificación del `SpectrumBar`:** Línea editorial fina (`6px`) con etiquetas tipográficas claras encima y paleta mineral neutra:
   - **Oficialismo:** `#161614` (light) / `#F2F0EB` (dark)
   - **Centro / Datos:** `#A8A29E` (light) / `#6B6860` (dark)
   - **Oposición:** `#475569` (light) / `#8FA3B8` (dark)
3. **Copy Viral Neutro:** Se reemplazan los círculos de color partidario (`🟣 | 🟢 | 🟠`) en `StoryCard.astro`, `ShareModal.astro`, meta-tags OpenGraph y bot de X por símbolos tipográficos neutros o texto limpio.
4. **Interactividad en Portada:** Los segmentos del `SpectrumBar` en Portada navegan directamente a `/historia/[id]?sesgo=<polo>#comparativa`, pre-filtrando el comparador al llegar.

---

### 3. Arquitectura UX — Alcance de la Ola 1

#### Fixes incluidos
- **Críticos (#1–#6):**
  1. Separar el header: Top Ticker y Masthead pasan a ser **estáticos**; solo queda `sticky top-0` una barra compacta (~50px) con tabs y buscador.
  2. `SpectrumBar` en Portada conectado a `/historia/[id]?sesgo=<polo>#comparativa`.
  3. Reparar enlace de retorno desde `/promesa/[id]` hacia `/?tab=promesas` (con soporte de `#monitor-promesas`).
  4. **Navegación móvil con Bottom Nav fija** (`<768px`): 4 destinos principales (`Temas`, `Último Mom.`, `Promesas`, `Guías`) + botón `Más` (*Mirada Exterior*, *Metodología*, *Chat Electoral*, *Instalar App*).
  5. Eliminar listener duplicado de `.share-story-btn` en `index.astro`.
  6. Resolver colisión de widgets flotantes en la esquina inferior derecha (`#live-news-update-pill` arriba centrado, toast separado, `LiveChat` sin superposición).
- **Medios editoriales/core (#7, #8, #9, #12):**
  - (#7) Fusionar los bloques institucionales redundantes al pie de Portada.
  - (#8) En `HeadlineComparison.astro`, eliminar el paginado prematuro de a 4 y exponer **Calidad Factual** y **Estructura de Propiedad** de `OUTLETS_REGISTRY` en cada tarjeta.
  - (#9) Reordenar `/historia/[id]` (Titular + Síntesis → Espectro/Dictamen → Comparador → Barra de compartir/debate) y mostrar el contador real `(N)` de aportes en Debate Cívico (ADR-0007).
  - (#12) Corregir bugs del Monitor de Promesas (`scrollIntoView` a `#monitor-promesas`, contraste de `.stat-filter-btn`, `getPromisesWithLiveVotes()` en `/promesa/[id]`, buscador contextual sin forzar salto a *Temas del Día*).

#### Diferido explícitamente a olas posteriores
- Refactor de `StoryCivicForum.astro` (#10) y consolidación de identidad/alias de `LiveChat.astro` (#11) → **Ola de Comunidad**.
- Separación de `Promesas 2027` (`/promesas`) y `Mirada Exterior` (`/mirada-exterior`) a rutas dedicadas reales → **Fase posterior de routing/SEO**.

---

### 4. Nuevas Funcionalidades de Producto (Ola 1)

1. **Puntos Ciegos del Día (*Daily Blindspot*):**
   - Detecta automáticamente Historias con **≥75% de cobertura de un solo polo editorial y un mínimo de 3 medios**.
   - Se muestra como una **franja destacada arriba de Portada** (oculta o discreta si ese día no existen puntos ciegos que cumplan el umbral).
2. **Comparador Cara a Cara (*Side-by-Side Framing View*):**
   - En `/historia/[id]`, **Cara a Cara (2 columnas: Oficialismo vs Oposición + franja de referencia Centro/Datos)** pasa a ser la **vista por defecto en desktop**, con un toggle a *Vista Grilla*.
   - En mobile se presenta apilado mediante pestañas por polo para mantener lectura cómoda sin scroll horizontal.

---

## Consecuencias

- **Positivas:** Diferenciación visual clara frente a portales argentinos y templates SaaS; blindaje institucional rumbo a 2027 al erradicar el violeta del `SpectrumBar`; recuperación de ~180–220px de viewport útil al scrollear; visibilidad móvil inmediata del Promesómetro y Guías; mayor valor diferencial con *Puntos Ciegos* y *Cara a Cara*.
- **Costos / Compromisos:** Requiere actualizar tokens globales (`global.css`, `Layout.astro`), componentes base (`Header`, `StoryCard`, `SpectrumBar`, `HeadlineComparison`) y copy social antes de lanzar Fase 3. Los issues de foro/chat (#10–#11) y el split de rutas quedan documentados como deuda controlada para la siguiente ola.
