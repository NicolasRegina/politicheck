# Politicheck (Dominio)

Plataforma de alta concurrencia para el seguimiento del ciclo electoral en Argentina, que compara el sesgo y encuadre mediático de las noticias y audita las promesas de campaña de los candidatos.

## Secciones Principales (Views)

**Temas del Día (Top Stories)**:
Sección principal que presenta Historias destacadas del día, agrupadas y ponderadas con barra de espectro de cobertura mediática.
_Evitar_: Noticias destacadas, portada genérica.

**Último Momento (Live Feed)**:
Flujo cronológico lineal de Noticias entrantes de todos los Medios a medida que publican en sus canales oficiales.
_Evitar_: En vivo, minuto a minuto.

**Mirada Exterior (Foreign View)**:
Noticias y análisis publicados exclusivamente por Medios internacionales sobre la política y economía de Argentina.
_Evitar_: Internacionales genéricas, noticias del mundo.

---

## Lenguaje de Dominio

### Noticias y Medios

**Medio (Outlet)**:
Empresa periodística o portal de noticias con una línea editorial y trayectoria pública identificable.
_Evitar_: Diario, periódico, blog, canal.

**Sesgo Editorial de Base (Baseline Leaning)**:
Posicionamiento político/editorial contextual en el escenario argentino (`oficialismo`, `centro_datos`, `oposicion`).
_Evitar_: Bandera partidaria absoluta.

**Ideología (Ideology)**:
Clasificación en escala internacional de 5 puntos (`izquierda`, `centro_izquierda`, `centro`, `centro_derecha`, `derecha`) sustentada en calificaciones de AllSides y Media Bias/Fact Check (MBFC).

**Calidad Factual (Factuality Rating)**:
Nivel de rigor periodístico, respaldo documental y política de rectificación de errores (`muy_alta`, `alta`, `mixta`) auditado por MBFC.

**Estructura de Propiedad (Outlet Ownership)**:
Grupo económico controlante, país matriz y tipo de financiamiento (`privado_corporativo`, `sindical_partidario`, `publico_estatal`, `independiente_suscripcion`) relevado por el Media Ownership Monitor (MOM / Reporteros Sin Fronteras).

**Auditoría Tripartita (Ground News Methodology)**:
Triangulación simultánea e independiente de Sesgo Ideológico, Calidad Factual y Propiedad Financiera para cada uno de los 31 medios monitoreados.

**Encuadre (Framing)**:
El ángulo, tono y foco específico que un Medio elige para titular y cubrir una Noticia puntual.
_Evitar_: Bajada, intención, manipulación.

**Historia (Story Cluster)**:
Agrupación de múltiples Noticias de distintos Medios que cubren exactamente el mismo acontecimiento, sintetizada con un titular neutral y un desglose del espectro de cobertura. Se presenta en dos niveles de profundidad:
- **Ficha Ejecutiva de Historia (Story Card)**: Representación sintética y ligera en Portada que resume el acontecimiento mediante titular neutral, imagen de prensa, síntesis breve y barra de espectro editorial (clickeable por polo hacia el comparador filtrado).
- **Análisis Completo de Historia (Full Story View)**: Vista monográfica detallada (`/historia/:id`) que expone el dictamen de encuadres por IA, el **Comparador Cara a Cara** de titulares enriquecido con Calidad Factual y Estructura de Propiedad, filtros por sesgo y enlaces directos a las fuentes.
_Evitar_: Tema, hilo, nota agrupada.

**Punto Ciego del Día (Daily Blindspot)**:
Historia cuya cobertura mediática se concentra en ≥75% dentro de un único polo editorial (`oficialismo` u `oposicion`) con un mínimo de 3 Medios, destacada en una franja superior de Portada para visibilizar asimetrías de agenda.
_Evitar_: Noticia censurada, noticia oculta.

**Comparador Cara a Cara (Side-by-Side Framing View)**:
Vista por defecto dentro de `/historia/:id` que enfrenta en dos columnas paralelas los titulares de Oficialismo y Oposición (con Centro / Datos como franja de referencia), mostrando Calidad Factual y Estructura de Propiedad de cada Medio, con alternancia opcional a Vista Grilla.
_Evitar_: Tabla de diarios, grilla simple.

**Noticia (Article)**:
Publicación individual proveniente del feed RSS oficial de un Medio, con titular, fecha, autor, resumen breve y enlace a la fuente original.
_Evitar_: Post, publicación, nota completa.

**Intersección Institucional (Institutional Intersection)**:
Acontecimiento originado en el ámbito deportivo, cultural o social que adquiere relevancia cívica verificable por involucrar directamente a poderes del Estado, marcos regulatorios, causas judiciales o controversias de política pública (ej. Sociedades Anónimas Deportivas en clubes, financiamiento audiovisual, resoluciones de la IGJ/ARCA). Se audita con el espectro editorial político estándar dentro de las secciones `Sociedad` o `Política`.

**Conmoción Nacional (National Impact Event)**:
Acontecimiento extraordinario de interés público masivo que, aun sin un actor político directo, alcanza consenso simultáneo de cobertura en 4 o más redacciones nacionales (ej. hitos mundiales de selecciones nacionales, catástrofes o duelo oficial decretado).

---

### Candidatos y Promesas (Fase 2)

**Candidato (Candidate)**:
Figura política postulada formalmente para un cargo electivo en la contienda electoral.
_Evitar_: Político, postulante.

**Promesa de Campaña (Promise)**:
Compromiso verificable de acción, ley o política pública enunciado por un Candidato durante la campaña o en su plataforma oficial.
_Evitar_: Discurso, propuesta vaga, declaración.

**Estado de Cumplimiento (Promise Status)**:
Clasificación objetiva del ciclo de vida de una promesa (ej. En campaña, En proceso, Cumplida, Incumplida, Trastocada).
_Evitar_: Juicio de valor, opinión.

---

### Identidad Visual y Marca

**Isotipo Oficial (P-Checkmark)**:
Símbolo compuesto por un círculo base azul oscuro (`#0B111A`), anillo perimetral marfil (`#F4F2EB`), letra **P** arquitectónica en blanco puro (`#F8F9FA`) y tilde celeste bandera argentina (`#6BA4D9`). Representa simultáneamente política periodística y verificación factual. Utilizado en el masthead editorial, favicon, iconos PWA e identidad institucional.

**Identidad Editorial Contemporánea (Modern Editorial)**:
Sistema visual definido en el [ADR-0008](./docs/adr/0008-editorial-identity-and-ux-redesign.md) sobre lienzo **Crema Editorial** (`#FAF9F6`) en modo claro y **Carbón Cálido** (`#121210`) en modo oscuro, con tipografía `Fraunces` (titulares), `DM Sans` (interfaz y cuerpo) y `JetBrains Mono` (datos tabulares), acento institucional único azul tinta marino (`#1E3A5F` / `#7FB3E0`), radios contenidos (`rounded-md` máx.) y sin *glassmorphism*.

**Espectro Mineral No-Partidario (SpectrumBar)**:
Visualización neutral de la distribución de cobertura (`#161614` / `#A8A29E` / `#475569` en claro; `#F2F0EB` / `#6B6860` / `#8FA3B8` en oscuro) que prohíbe colores partidarios argentinos (violeta, celeste saturado, amarillo, rojo) tanto en la interfaz como en el copy compartido. Los colores partidarios se reservan exclusivamente para la filiación de los Candidatos en el Promesómetro.

---

### Roles y Gobernanza (RBAC Supabase)

**Superadministrador (Superadmin)**:
Usuario supremo del sistema (`contacto@politicheck.com.ar`). Capacidad exclusiva de ABM sobre otros administradores y superadministradores, eliminación forzada de contenidos, moderación general y gestión de credenciales.

**Administrador (Admin)**:
Gestor editorial y publicitario. Puede administrar banners de patrocinio, previsualizar y sindicar contenido a X/Twitter, forzar sincronizaciones RSS y moderar reportes. No puede alterar perfiles de otros administradores.

**Moderador (Moderator)**:
Rol orientado al control y saneamiento de contenidos en la sala electoral en vivo y debates cívicos de historias.

**Ciudadano / Usuario (User)**:
Participante democrático habilitado para votar en el Promesómetro, comentar en debates y contrastar fuentes sin recolección abusiva de datos personales.

---

### Foro y Debate Cívico

**Debate Cívico de Historia (Story Forum)**:
Espacio de deliberación ciudadana anclado exclusivamente a cada Historia (`/historia/:id`), diseñado para analizar y contrastar la cobertura periodística de los medios.
_Evitar_: Sección de comentarios, muro de opiniones, caja de quejas.

**Comentario Raíz (Root Comment)**:
Aporte ciudadano principal que inicia un hilo argumental sobre el acontecimiento o la cobertura de los medios.
_Evitar_: Post, publicación suelta.

**Respuesta Anidada (Reply)**:
Intervención secundaria de segundo nivel que replica o amplía directamente un Comentario Raíz específico.
_Evitar_: Subcomentario, hilo infinito.

**Puntuación de Relevancia Cívica (Karma Score)**:
Métrica resultante de la diferencia entre votos a favor (▲) y en contra (▼) emitidos por los ciudadanos sobre cada comentario.
_Evitar_: Likes, pulgares arriba.

**Participante Cívico (Civic Participant)**:
Ciudadano que interviene en el debate identificado mediante un Alias público con huella criptográfica anónima (`ip_hash`) o cuenta autenticada con insignia verificada.
_Evitar_: Usuario anónimo sin control, troll.

**Huella Cívica de Votación (Voter Hash)**:
Identificador criptográfico anónimo (SHA-256 de IP + UserAgent + sal institucional) que garantiza el principio cívico de un voto por ciudadano sobre cada comentario sin exigir registro obligatorio.
_Evitar_: Cookie de sesión, ID rastreable.

**Comentario Colapsado (Collapsed Comment)**:
Estado visual en el que un comentario con Puntuación de Relevancia negativa inferior a -5 o múltiples reportes se repliega con advertencia comunitaria para preservar la calidad del debate.
_Evitar_: Comentario censurado, post shadowbaneado.

**Enlace de Fuente Verificable (Source Link)**:
Hipervínculo externo aportado por un participante hacia documentación oficial, boletines o redacciones auditadas, procesado con atributos de seguridad (`rel="nofollow"`).
_Evitar_: Link de spam, autopromoción.



