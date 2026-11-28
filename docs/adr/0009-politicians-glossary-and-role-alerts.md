# 0009: Directorio de Políticos, Rutas Canónicas y Alertas de Cambio de Cargo

> **Estado:** Aceptado (2026-11-28)  
> **Referencias:** [Investigación Primaria de 22 Referentes](../research/politicians-glossary.md) · [ADR-0008: Identidad Visual Editorial](./0008-editorial-identity-and-ux-redesign.md) · [CONTEXT.md](../../CONTEXT.md)

---

## Contexto

Politicheck contaba con un registro mínimo de 10 figuras en `src/data/politicians.ts` y una vista individual en `/candidato/[slug]` orientada exclusivamente al Promesómetro. Al evolucionar hacia un **Directorio de Políticos Argentinos** de referencia (con biografía neutral, datos duros, línea de tiempo de carrera, cobertura mediática en vivo y ejes programáticos documentados), surgieron tres tensiones estructurales:

1. **Terminología y URLs**: El glosario incluye ministros, gobernadores, legisladores, ex presidentes y referentes partidarios que no son necesariamente candidatos formales en curso.
2. **Neutralidad de presentación**: Elegir quién aparece primero en un directorio político puede percibirse como sesgo editorial.
3. **Obsolescencia de cargos**: En la política argentina las renuncias, asunciones y recambios legislativos ocurren constantemente (ej. recambio de diciembre 2025 o renuncia de Manuel Adorni en junio 2026). Dejar los perfiles fijos en código exige intervención manual constante, pero permitir que un LLM sobrescriba fichas automáticamente expone al sitio a rumores o alucinaciones.

---

## Decisión

### 1. Dominio y Rutas Canónicas
- Se introduce **Político** como entidad paraguas en [CONTEXT.md](../../CONTEXT.md), manteniendo **Candidato** para los Políticos con postulación electoral formal o promesas auditadas.
- **Directorio:** `/politicos`, accesible desde un botón destacado de alto contraste en el `Header` (`bg-ink text-canvas` con micro-cinta celeste-blanco-celeste acorde a ADR-0008), en el menú móvil `Más` y en el `Footer`.
- **Ficha individual:** Se migra la ruta canónica a `/politico/[slug]` y se mantiene `/candidato/[slug]` como redirección permanente **`301`** hacia `/politico/[slug]` para preservar enlaces existentes y SEO.

### 2. Estructura Editorial y Neutralidad
- **Ordenamiento en `/politicos`:** Grilla principal ordenada **alfabéticamente (A–Z)** por defecto para blindar la neutralidad, precedida por una franja superior dinámica **"En agenda hoy"** con los 5–6 Políticos con mayor volumen de menciones en las Historias de los últimos 14 días.
- **Filtros:** Buscador instantáneo, filtros por espacio político y por ámbito institucional (Ejecutivo Nacional, Congreso/Legislatura, Gobernadores/CABA, Referentes).
- **Retratos:** Retratos editoriales rectangulares (`aspect-[4/5]` en directorio, retrato destacado `rounded-md` en ficha) con encuadre `object-cover object-top`, alojados localmente en `public/images/politicians/` a partir de fuentes oficiales / Wikimedia Commons con atribución de licencia.
- **Bloques de la ficha `/politico/[slug]`:**
  1. Resumen biográfico neutral (sin juicios de valor).
  2. Ficha técnica / Datos duros (nacimiento, formación, cargo actual, distrito, espacio actual y anteriores).
  3. Línea de tiempo cronológica de carrera política.
  4. **"Cómo lo cubren los medios hoy"**: `SpectrumBar` calculado dinámicamente sobre las Historias recientes donde aparece mencionado.
  5. Ejes programáticos / Posiciones públicas documentadas (3–4 ejes fácticos).
  6. Promesómetro y cobertura periodística reciente.

### 3. Persistencia en Supabase y Alertas *Human-in-the-Loop*
- **Fuente de verdad en vivo:** Tabla `politicians` en Supabase (inicializada con el seed tipado de `src/data/politicians.ts`, que permanece como *fallback* seguro ante indisponibilidad de red). Permite editar cargos, biografías o trayectorias desde `/admin` sin requerir redeploy.
- **Detector automático de cambios de cargo:** Durante el pipeline de sincronización RSS (`sync_all_rss` / `/api/cron/sync`), un detector liviano cruza las Historias nuevas contra los Políticos registrados buscando verbos institucionales (*renunció, dimitió, asumió, fue designado, destituido, juró, inhabilitación*).
- **Aprobación editorial (`politician_alerts`):** Ante una coincidencia, el sistema **nunca sobrescribe el perfil automáticamente**; registra una **Alerta de Actualización de Perfil** en Supabase (`pending`) con la Historia fuente y el cambio sugerido, para que un Administrador la apruebe (aplicando el cambio en 1 clic) o la descarte desde `/admin`.

---

## Consecuencias

- **Positivas:** Consistencia de marca (**Politi**check → `/politicos`), preservación total de URLs previas vía `301`, neutralidad verificable en el ordenamiento, cero riesgo de publicación de rumores por IA y mantenimiento ágil de cargos sin tocar código ni revisar portales diariamente.
- **Costos / Compromisos:** Requiere crear y asegurar mediante RLS dos tablas nuevas en Supabase (`politicians` y `politician_alerts`), descargar y curar los 12 retratos faltantes en `public/images/politicians/`, y mantener un bloque de revisión de alertas dentro de `/admin`.
