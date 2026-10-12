# 0006: Criterio Editorial de Intersección Institucional para Deportes, Cultura y Conmoción Pública

## Contexto
Politicheck es una plataforma de alta concurrencia orientada al seguimiento cívico y electoral en Argentina, que compara el sesgo periodístico de 31 redacciones y audita promesas de campaña. 

La ingesta indiscriminada de feeds RSS generales introduce ocasionalmente noticias de deportes de rutina (cables de partidos extranjeros, fixtures, marcadores) y farándula, las cuales carecen de dimensión cívica y distorsionan la barra matemática de sesgo político (`🟣 Oficialismo | 🟢 Centro | 🟠 Oposición`). Por otro lado, la exclusión total y ciega de secciones deportivas y culturales impediría registrar acontecimientos de profundo impacto cívico o trascendencia colectiva masiva (tales como la controversia entre el Gobierno Nacional y la AFA por las Sociedades Anónimas Deportivas, la discusión de fondos del INCAA en festivales culturales, o hitos de conmoción popular nacional).

## Decisión
Se adopta el principio de **Intersección Institucional y Conmoción Nacional** (Opción B del proceso de diseño):

1. **Criterio de Admisión:**
   - **Intersección Institucional:** Noticias originadas en secciones deportivas o culturales son admitidas si y solo si involucran directamente a un poder del Estado (Ejecutivo, Congreso, Poder Judicial), entes reguladores (IGJ, AFIP/ARCA), controversias sobre legislación o decretos (DNU, SAD, leyes de financiamiento), o causas judiciales.
   - **Conmoción Nacional:** Se admiten hitos deportivos o culturales sin actor político directo únicamente cuando alcanzan un **consenso simultáneo de 4 o más redacciones nacionales** y refieren a hitos de impacto colectivo indiscutible (ej. títulos mundiales de selecciones nacionales, duelo nacional o luto oficial).
   - **Exclusión Estricta:** Se descartan de forma terminante resultados deportivos de rutina, fixtures (`vs`, `en vivo hoy`, `minuto a minuto del partido`), goles, tablas de posiciones, polémicas arbitrales y chimentos de espectáculos/farándula sin derivación pública.

2. **Cálculo del Espectro Editorial:**
   - Las historias admitidas se auditan bajo el **espectro editorial político estándar** (`oficialismo`, `centro_datos`, `oposicion`), dado que los medios reflejan sus posturas ideológicas de base también sobre debates societarios, modelos asociativos de clubes y cultura.

3. **Taxonomía en la Interfaz:**
   - No se crean pestañas aisladas de "Deportes" ni "Farándula". Los clústeres se absorben dentro de las secciones existentes **`Sociedad`** o **`Política`**, utilizando volantas descriptivas (ej. `INSTITUCIONES • FÚTBOL & SOCIEDAD`, `CULTURA • DEBATE PÚBLICO`).

4. **Curaduría Fotográfica:**
   - La historia adopta la fotografía periodística provista por las redacciones contrastadas para dicho acontecimiento, garantizando fidelidad documental con la noticia.

## Consecuencias
- **Positivas:**
  - Preserva la seriedad y el valor cívico de la plataforma sin aislarla de los debates masivos que movilizan a la opinión pública.
  - El filtro en el parser RSS (`parser.ts`) y el clustering (`clustering.ts`) descarta el 99% del ruido deportivo/farandulero sin perder las primicias institucionales.
- **Negativas / Mitigaciones:**
  - Requiere un mantenimiento de palabras clave de cruce institucional en el scraper y un umbral estricto de multiredacción para evitar filtraciones de coberturas deportivas ordinarias.
