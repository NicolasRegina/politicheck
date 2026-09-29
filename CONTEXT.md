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
Posicionamiento político/ideológico histórico de un Medio en el espectro (oficialismo, oposición, centro-derecha, centro-izquierda, etc.).
_Evitar_: Ideología, partido, bandera.

**Encuadre (Framing)**:
El ángulo, tono y foco específico que un Medio elige para titular y cubrir una Noticia puntual.
_Evitar_: Bajada, intención, manipulación.

**Historia (Story Cluster)**:
Agrupación de múltiples Noticias de distintos Medios que cubren exactamente el mismo acontecimiento, sintetizada con un titular neutral y un desglose del espectro de cobertura.
_Evitar_: Tema, hilo, nota agrupada.

**Noticia (Article)**:
Publicación individual proveniente del feed RSS oficial de un Medio, con titular, fecha, autor, resumen breve y enlace a la fuente original.
_Evitar_: Post, publicación, nota completa.

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
Símbolo compuesto por un círculo base azul oscuro (`#0B111A`), anillo perimetral marfil (`#F4F2EB`), letra **P** arquitectónica en blanco puro (`#F8F9FA`) y tilde celeste bandera argentina (`#6BA4D9`). Representa simultáneamente política periodística y verificación factual. Utilizado en favicon, iconos PWA e identidad institucional.

**Lienzo Monocromático**:
Paleta técnica neutral (Zinc / Carbon / Slate) para todo el sitio, reservando colores partidarios única y estrictamente para la pertenencia política de los candidatos.

---

### Roles y Gobernanza (RBAC Supabase)

**Superadministrador (Superadmin)**:
Usuario supremo del sistema (`contacto@politicheck.com.ar`). Capacidad exclusiva de ABM sobre otros administradores y superadministradores, eliminación forzada de contenidos, moderación general y gestión de credenciales.

**Administrador (Admin)**:
Gestor editorial y publicitario. Puede administrar banners de patrocinio, previsualizar y sindicar contenido a X/Twitter, forzar sincronizaciones RSS y moderar reportes. No puede alterar perfiles de otros administradores.

**Moderador (Moderator)**:
Rol futuro orientado al control de mensajes en el chat electoral en vivo y foro cívico.

**Ciudadano / Usuario (User)**:
Participante democrático habilitado para votar en el Promesómetro, comentar en debates y contrastar fuentes sin recolección abusiva de datos personales.

