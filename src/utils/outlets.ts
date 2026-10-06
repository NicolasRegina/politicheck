import type { OutletMeta } from '../types';
export type { OutletMeta };

export const OUTLETS_REGISTRY: Record<string, OutletMeta> = {
  // ==========================================
  // REDACCIONES NACIONALES (15)
  // ==========================================
  
  // 1. Clarín
  clarin: {
    id: 'clarin',
    name: 'Clarín',
    code: 'CLARÍN',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro_derecha',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Clarín',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina / Reporteros Sin Fronteras',
    editorialProfile: 'Decano de la prensa gráfica argentina, de alcance masivo y perfil generalista. Cobertura centrada en economía, política e impacto tarifario con fuentes plurales de consulta.',
    rssFeedUrl: 'https://www.clarin.com/rss/politica/',
    websiteUrl: 'https://www.clarin.com',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800'
  },

  // 2. La Nación
  lanacion: {
    id: 'lanacion',
    name: 'La Nación',
    code: 'LA NACIÓN',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oficialismo',
    ideology: 'derecha',
    factuality: 'alta',
    ownership: {
      group: 'S.A. La Nación (Familia Saguier / Esmeralda)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina / Universidad Austral',
    editorialProfile: 'Diario histórico de tradición republicana y liberal clásico. Tiende a valorar favorablemente la disciplina fiscal, las reformas desregulatorias y las metas pro-mercado.',
    rssFeedUrl: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml',
    websiteUrl: 'https://www.lanacion.com.ar',
    badgeClass: 'bg-sky-100 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200 border-sky-300 dark:border-sky-800'
  },

  // 3. Infobae
  infobae: {
    id: 'infobae',
    name: 'Infobae',
    code: 'INFOBAE',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'Daniel Hadad',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina / Reuters Institute',
    editorialProfile: 'Medio digital nativo líder en el mundo hispanohablante. Dinámica informativa ágil de última hora y tribuna de opinión que integra a analistas de todo el arco político.',
    rssFeedUrl: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml',
    websiteUrl: 'https://www.infobae.com',
    badgeClass: 'bg-orange-100 text-orange-950 dark:bg-orange-950/70 dark:text-orange-200 border-orange-300 dark:border-orange-800'
  },

  // 4. Todo Noticias (TN)
  tn: {
    id: 'tn',
    name: 'Todo Noticias (TN)',
    code: 'TN',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oficialismo',
    ideology: 'centro_derecha',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Clarín (Artear)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Canal y portal continuo de noticias. Enfoque prioritario en seguridad ciudadana, actividad parlamentaria y avances del plan macroeconómico oficial.',
    rssFeedUrl: 'https://tn.com.ar/rss.xml',
    websiteUrl: 'https://tn.com.ar',
    badgeClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300 dark:border-blue-800'
  },

  // 5. Página 12
  pagina12: {
    id: 'pagina12',
    name: 'Página 12',
    code: 'PÁGINA 12',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oposicion',
    ideology: 'izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Octubre (Víctor Santa María / SUTERH)',
      fundingType: 'sindical_partidario',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina / UBA',
    editorialProfile: 'Periódico insignia de la centro-izquierda y el progresismo nacional. Enfoque crítico y exhaustivo sobre el costo social del ajuste, derechos humanos y medidas laborales.',
    rssFeedUrl: 'https://www.pagina12.com.ar/rss/portada.xml',
    websiteUrl: 'https://www.pagina12.com.ar',
    badgeClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800'
  },

  // 6. Ámbito Financiero
  ambito: {
    id: 'ambito',
    name: 'Ámbito Financiero',
    code: 'ÁMBITO',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Indalo (Cristóbal López / F. De Sousa)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Especializado en finanzas, mercados y macroeconomía. Sigue con agudeza técnica el frente cambiario, la deuda externa, la actividad productiva y los gobernadores del interior.',
    rssFeedUrl: 'https://www.ambito.com/rss/pages/home.xml',
    websiteUrl: 'https://www.ambito.com',
    badgeClass: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/70 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
  },

  // 7. El Cronista
  cronista: {
    id: 'cronista',
    name: 'El Cronista',
    code: 'EL CRONISTA',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Grupo América (Vila-Manzano)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Publicación de negocios y finanzas orientada al sector corporativo y bursátil. Riguroso seguimiento numérico de cotizaciones, balances del BCRA e indicadores de actividad.',
    rssFeedUrl: 'https://www.cronista.com/files/rss/news.xml',
    websiteUrl: 'https://www.cronista.com',
    badgeClass: 'bg-teal-100 text-teal-950 dark:bg-teal-950/70 dark:text-teal-200 border-teal-300 dark:border-teal-800'
  },

  // 8. Diario Perfil
  perfil: {
    id: 'perfil',
    name: 'Perfil',
    code: 'PERFIL',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'Editorial Perfil (Jorge Fontevecchia)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Fundado por Jorge Fontevecchia. Periodismo de autor, entrevistas de profundidad y análisis equidistante con constante cuestionamiento a las hegemonías de turno.',
    rssFeedUrl: 'https://www.perfil.com/feed',
    websiteUrl: 'https://www.perfil.com',
    badgeClass: 'bg-purple-100 text-purple-950 dark:bg-purple-950/70 dark:text-purple-200 border-purple-300 dark:border-purple-800'
  },

  // 9. elDiarioAR
  eldiarioar: {
    id: 'eldiarioar',
    name: 'elDiarioAR',
    code: 'ELDIARIO.AR',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'elDiario.es / Prensa Digital',
      fundingType: 'independiente_suscripcion',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina / FOPEA',
    editorialProfile: 'Medio digital independiente asociado a elDiario.es. Foco en investigación de fondo, justicia independiente, impacto ambiental y consecuencias sociales de las políticas públicas.',
    rssFeedUrl: 'https://www.eldiarioar.com/rss/',
    websiteUrl: 'https://www.eldiarioar.com',
    badgeClass: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
  },

  // 10. Crónica
  cronica: {
    id: 'cronica',
    name: 'Crónica',
    code: 'CRÓNICA',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Olmos',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Voz histórica del sentir popular argentino. Lenguaje llano y directo sobre precios en la calle, transporte, jubilaciones y reclamos vecinales.',
    rssFeedUrl: 'https://www.cronica.com.ar/feed/',
    websiteUrl: 'https://www.cronica.com.ar',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },

  // 11. BAE Negocios
  baenegocios: {
    id: 'baenegocios',
    name: 'BAE Negocios',
    code: 'BAE NEGOCIOS',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Olmos',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'MOM Argentina',
    editorialProfile: 'Periódico económico enfocado en la industria nacional, Pymes, comercio interior y el movimiento obrero organizado.',
    rssFeedUrl: 'https://www.baenegocios.com/feed/',
    websiteUrl: 'https://www.baenegocios.com',
    badgeClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800'
  },

  // 12. La Izquierda Diario
  izquierdadiario: {
    id: 'izquierdadiario',
    name: 'La Izquierda Diario',
    code: 'IZQUIERDA DIARIO',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oposicion',
    ideology: 'izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Partido de los Trabajadores Socialistas (PTS)',
      fundingType: 'sindical_partidario',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'Registro Editorial Público',
    editorialProfile: 'Medio de difusión de la izquierda socialista y de los trabajadores. Crítica frontal al pago de la deuda al FMI, a la flexibilización laboral y al orden capitalista.',
    rssFeedUrl: 'https://www.laizquierdadiario.com/spip.php?page=backend',
    websiteUrl: 'https://www.laizquierdadiario.com',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800'
  },

  // 13. Cenital
  cenital: {
    id: 'cenital',
    name: 'Cenital',
    code: 'CENITAL',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Cenital Media (Iván Schargrodsky)',
      fundingType: 'independiente_suscripcion',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'SembraMedia / FOPEA',
    editorialProfile: 'Medio digital con newsletters temáticos y ensayos analíticos. Aborda los debates estructurales del país con profundidad contextual y solvencia académica.',
    rssFeedUrl: 'https://cenital.com/feed/',
    websiteUrl: 'https://cenital.com',
    badgeClass: 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950/70 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800'
  },

  // 14. El Economista
  eleconomista: {
    id: 'eleconomista',
    name: 'El Economista',
    code: 'EL ECONOMISTA',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Editorial El Economista',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'Registro Editorial Especializado',
    editorialProfile: 'Periódico técnico que releva balances de coyuntura macroeconómica, comercio exterior, metas con organismos y expectativas del sector privado.',
    rssFeedUrl: 'https://eleconomista.com.ar/feed/',
    websiteUrl: 'https://eleconomista.com.ar',
    badgeClass: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-950/70 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800'
  },

  // 15. La Derecha Diario
  derechadiario: {
    id: 'derechadiario',
    name: 'La Derecha Diario',
    code: 'LA DERECHA DIARIO',
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'oficialismo',
    ideology: 'derecha',
    factuality: 'mixta',
    ownership: {
      group: 'Madero Group / Colectivo Digital',
      fundingType: 'independiente_suscripcion',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'Registro Editorial Digital',
    editorialProfile: 'Portal digital de ideario libertario afín al gobierno nacional. Promueve activamente el achicamiento estatal, las reformas de libre mercado y la desregulación total.',
    rssFeedUrl: 'https://derechadiario.com.ar/rss/cat/politica',
    websiteUrl: 'https://derechadiario.com.ar',
    badgeClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950/70 dark:text-blue-200 border-blue-400 dark:border-blue-700'
  },

  // ==========================================
  // MIRADA EXTERIOR / INTERNACIONALES (16)
  // ==========================================

  // 16. Financial Times (Reino Unido)
  ft: {
    id: 'ft',
    name: 'Financial Times',
    code: 'FINANCIAL TIMES',
    category: 'internacional',
    country: 'Reino Unido',
    flag: '🇬🇧',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Nikkei Inc.',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Reino Unido'
    },
    sourceAuditRef: 'AllSides (Center) / MBFC (Least Biased)',
    editorialProfile: 'Referente financiero internacional de la City de Londres. Analiza con precisión la solvencia de las reservas, el plan cambiario y la confianza de los bonistas externos.',
    rssFeedUrl: 'https://www.ft.com',
    websiteUrl: 'https://www.ft.com',
    badgeClass: 'bg-pink-100 text-pink-950 dark:bg-pink-950/70 dark:text-pink-200 border-pink-300 dark:border-pink-800'
  },

  // 17. El País (España)
  elpais: {
    id: 'elpais',
    name: 'El País',
    code: 'EL PAÍS',
    category: 'internacional',
    country: 'España',
    flag: '🇪🇸',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Grupo PRISA',
      fundingType: 'privado_corporativo',
      countryOrigin: 'España'
    },
    sourceAuditRef: 'MBFC (Left-Center) / Ad Fontes',
    editorialProfile: 'Diario global de centro-izquierda en español. Posee redacción en Buenos Aires y suele enfatizar los debates sobre derechos sociales y polarización política.',
    rssFeedUrl: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada',
    websiteUrl: 'https://elpais.com',
    badgeClass: 'bg-slate-200 text-slate-950 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
  },

  // 18. CNN en Español (EE.UU.)
  cnn: {
    id: 'cnn',
    name: 'CNN en Español',
    code: 'CNN',
    category: 'internacional',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    baselineLeaning: 'centro_datos',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Warner Bros. Discovery',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Estados Unidos'
    },
    sourceAuditRef: 'AllSides (Lean Left) / MBFC (Left-Center)',
    editorialProfile: 'Cadena de alcance continental. Reportes en vivo y cobertura balanceada de sucesos políticos, conferencias de prensa y resoluciones gubernamentales.',
    rssFeedUrl: 'https://cnnespanol.cnn.com',
    websiteUrl: 'https://cnnespanol.cnn.com',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },

  // 19. BBC News Mundo (Reino Unido)
  bbcmundo: {
    id: 'bbcmundo',
    name: 'BBC News Mundo',
    code: 'BBC MUNDO',
    category: 'internacional',
    country: 'Reino Unido',
    flag: '🇬🇧',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'British Broadcasting Corporation (Royal Charter)',
      fundingType: 'publico_estatal',
      countryOrigin: 'Reino Unido'
    },
    sourceAuditRef: 'AllSides (Center) / MBFC (Left-Center)',
    editorialProfile: 'Servicio público británico. Reportajes de contexto, verificación de hechos y crónicas humanas sobre la economía familiar y la realidad social en Argentina.',
    rssFeedUrl: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    websiteUrl: 'https://www.bbc.com/mundo',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },

  // 20. France 24 (Francia)
  france24: {
    id: 'france24',
    name: 'France 24',
    code: 'FRANCE 24',
    category: 'internacional',
    country: 'Francia',
    flag: '🇫🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'France Médias Monde',
      fundingType: 'publico_estatal',
      countryOrigin: 'Francia'
    },
    sourceAuditRef: 'MBFC (Least Biased)',
    editorialProfile: 'Medio público internacional de Francia. Sigue las relaciones bilaterales, el comercio del Mercosur con la Unión Europea y el impacto regional del Cono Sur.',
    rssFeedUrl: 'https://www.france24.com/es/am%C3%A9rica-latina/rss',
    websiteUrl: 'https://www.france24.com/es/',
    badgeClass: 'bg-sky-100 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200 border-sky-300 dark:border-sky-800'
  },

  // 21. Le Monde (Francia)
  lemonde: {
    id: 'lemonde',
    name: 'Le Monde',
    code: 'LE MONDE',
    category: 'internacional',
    country: 'Francia',
    flag: '🇫🇷',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Société Éditrice du Monde',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Francia'
    },
    sourceAuditRef: 'MBFC (Left-Center)',
    editorialProfile: 'Voz referente del pensamiento europeo de centro-izquierda. Cobertura crítica de los cambios sociopolíticos y la polarización institucional en Argentina.',
    rssFeedUrl: 'https://www.lemonde.fr/international/rss_full.xml',
    websiteUrl: 'https://www.lemonde.fr',
    badgeClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800'
  },

  // 22. Le Figaro (Francia)
  lefigaro: {
    id: 'lefigaro',
    name: 'Le Figaro',
    code: 'LE FIGARO',
    category: 'internacional',
    country: 'Francia',
    flag: '🇫🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro_derecha',
    factuality: 'alta',
    ownership: {
      group: 'Groupe Dassault',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Francia'
    },
    sourceAuditRef: 'MBFC (Right-Center)',
    editorialProfile: 'Diario francés de línea conservadora y liberal. Sigue de cerca las transformaciones de mercado y las inversiones energéticas en Argentina.',
    rssFeedUrl: 'https://www.lefigaro.fr/rss/figaro_international.xml',
    websiteUrl: 'https://www.lefigaro.fr',
    badgeClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300 dark:border-blue-800'
  },

  // 23. El Mundo (España)
  elmundo: {
    id: 'elmundo',
    name: 'El Mundo',
    code: 'EL MUNDO',
    category: 'internacional',
    country: 'España',
    flag: '🇪🇸',
    baselineLeaning: 'oficialismo',
    ideology: 'centro_derecha',
    factuality: 'alta',
    ownership: {
      group: 'Unidad Editorial (RCS MediaGroup)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'España'
    },
    sourceAuditRef: 'MBFC (Right-Center)',
    editorialProfile: 'Periódico español de centro-derecha liberal. Tiende a destacar con tono positivo los avances en superávit fiscal y reformas liberales del Ejecutivo argentino.',
    rssFeedUrl: 'https://e00-elmundo.uecdn.es/elmundo/rss/internacional.xml',
    websiteUrl: 'https://www.elmundo.es',
    badgeClass: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
  },

  // 24. La Vanguardia (España)
  lavanguardia: {
    id: 'lavanguardia',
    name: 'La Vanguardia',
    code: 'LA VANGUARDIA',
    category: 'internacional',
    country: 'España',
    flag: '🇪🇸',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'Grupo Godó',
      fundingType: 'privado_corporativo',
      countryOrigin: 'España'
    },
    sourceAuditRef: 'MBFC (Least Biased)',
    editorialProfile: 'Diario centrista de Barcelona. Enfoque medido y ponderado de la política iberoamericana y los lazos culturales y comerciales de España con el país.',
    rssFeedUrl: 'https://www.lavanguardia.com/rss/internacional.xml',
    websiteUrl: 'https://www.lavanguardia.com',
    badgeClass: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/70 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
  },

  // 25. Expansión (España)
  expansion: {
    id: 'expansion',
    name: 'Expansión',
    code: 'EXPANSIÓN',
    category: 'internacional',
    country: 'España',
    flag: '🇪🇸',
    baselineLeaning: 'centro_datos',
    ideology: 'centro_derecha',
    factuality: 'alta',
    ownership: {
      group: 'Unidad Editorial (RCS MediaGroup)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'España'
    },
    sourceAuditRef: 'Registro Editorial Económico (España)',
    editorialProfile: 'Diario de economía y negocios de España. Monitoreo constante del desempeño de empresas cotizantes y el clima de negocios en el Cono Sur.',
    rssFeedUrl: 'https://e00-expansion.uecdn.es/rss/latinoamerica.xml',
    websiteUrl: 'https://www.expansion.com',
    badgeClass: 'bg-orange-100 text-orange-950 dark:bg-orange-950/70 dark:text-orange-200 border-orange-300 dark:border-orange-800'
  },

  // 26. The Guardian (Reino Unido)
  theguardian: {
    id: 'theguardian',
    name: 'The Guardian',
    code: 'THE GUARDIAN',
    category: 'internacional',
    country: 'Reino Unido',
    flag: '🇬🇧',
    baselineLeaning: 'oposicion',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'Scott Trust Limited',
      fundingType: 'independiente_suscripcion',
      countryOrigin: 'Reino Unido'
    },
    sourceAuditRef: 'AllSides (Lean Left) / MBFC (Left-Center)',
    editorialProfile: 'Prensa británica de raíz progresista. Cobertura crítica de recortes en salud, ciencia, educación y reclamos de movimientos sociales en Argentina.',
    rssFeedUrl: 'https://www.theguardian.com/world/americas/rss',
    websiteUrl: 'https://www.theguardian.com',
    badgeClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950/70 dark:text-blue-200 border-blue-400 dark:border-blue-700'
  },

  // 27. The New York Times (EE.UU.)
  nyt: {
    id: 'nyt',
    name: 'The New York Times',
    code: 'NY TIMES',
    category: 'internacional',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    baselineLeaning: 'centro_datos',
    ideology: 'centro_izquierda',
    factuality: 'alta',
    ownership: {
      group: 'The New York Times Company (Sulzberger)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Estados Unidos'
    },
    sourceAuditRef: 'AllSides (Lean Left) / MBFC (Left-Center)',
    editorialProfile: 'Periódico estadounidense de alcance global. Ensayos en profundidad sobre la política exterior, el alineamiento estratégico y la situación monetaria del país.',
    rssFeedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
    websiteUrl: 'https://www.nytimes.com',
    badgeClass: 'bg-slate-200 text-slate-950 dark:bg-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700'
  },

  // 28. DW Español (Alemania)
  dw: {
    id: 'dw',
    name: 'DW Español',
    code: 'DEUTSCHE WELLE',
    category: 'internacional',
    country: 'Alemania',
    flag: '🇩🇪',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Deutsche Welle (Estado Federal Alemán)',
      fundingType: 'publico_estatal',
      countryOrigin: 'Alemania'
    },
    sourceAuditRef: 'MBFC (Least Biased) / High Factuality',
    editorialProfile: 'Radiotelevisión pública federal alemana. Fact-checking estricto, ecología, transición energética y potencial del gas y litio argentino.',
    rssFeedUrl: 'https://rss.dw.com/xml/rss-sp-all',
    websiteUrl: 'https://www.dw.com/es',
    badgeClass: 'bg-teal-100 text-teal-950 dark:bg-teal-950/70 dark:text-teal-200 border-teal-300 dark:border-teal-800'
  },

  // 29. Nikkei Asia (Japón)
  nikkeiasia: {
    id: 'nikkeiasia',
    name: 'Nikkei Asia',
    code: 'NIKKEI ASIA',
    category: 'internacional',
    country: 'Japón',
    flag: '🇯🇵',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'Nikkei Inc.',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Japón'
    },
    sourceAuditRef: 'MBFC (Least Biased)',
    editorialProfile: 'Publicación económica líder de Tokio. Monitoreo de cadenas globales de valor, demanda de commodities y comercio del Asia-Pacífico con Sudamérica.',
    rssFeedUrl: 'https://asia.nikkei.com/rss/feed/nar',
    websiteUrl: 'https://asia.nikkei.com',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },

  // 30. The Japan Times (Japón)
  japantimes: {
    id: 'japantimes',
    name: 'The Japan Times',
    code: 'JAPAN TIMES',
    category: 'internacional',
    country: 'Japón',
    flag: '🇯🇵',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'muy_alta',
    ownership: {
      group: 'The Japan Times, Ltd. (News2u Holdings)',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Japón'
    },
    sourceAuditRef: 'MBFC (Least Biased)',
    editorialProfile: 'Diario en inglés de Tokio. Análisis geopolítico del G20, relaciones bilaterales y estabilidad financiera de economías emergentes.',
    rssFeedUrl: 'https://www.japantimes.co.jp/feed/',
    websiteUrl: 'https://www.japantimes.co.jp',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800'
  },

  // 31. Xinhua News (China)
  xinhua: {
    id: 'xinhua',
    name: 'Xinhua News',
    code: 'XINHUA',
    category: 'internacional',
    country: 'China',
    flag: '🇨🇳',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'mixta',
    ownership: {
      group: 'Gobierno de la República Popular China',
      fundingType: 'publico_estatal',
      countryOrigin: 'China'
    },
    sourceAuditRef: 'MBFC (State Media)',
    editorialProfile: 'Agencia oficial de noticias de Pekín. Seguimiento continuo de la relación bilateral comercial, exportaciones de soja y carne, y swaps financieros con el BCRA.',
    rssFeedUrl: 'http://www.xinhuanet.com/english/rss/worldrss.xml',
    websiteUrl: 'http://www.xinhuanet.com',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-400 dark:border-red-700'
  }
};

export function getOutletMeta(id: string): OutletMeta {
  if (OUTLETS_REGISTRY[id]) return OUTLETS_REGISTRY[id];

  return {
    id,
    name: id.toUpperCase(),
    code: id.toUpperCase(),
    category: 'nacional',
    country: 'Argentina',
    flag: '🇦🇷',
    baselineLeaning: 'centro_datos',
    ideology: 'centro',
    factuality: 'alta',
    ownership: {
      group: 'No especificado',
      fundingType: 'privado_corporativo',
      countryOrigin: 'Argentina'
    },
    sourceAuditRef: 'Registro Editorial General',
    editorialProfile: 'Medio informativo registrado.',
    rssFeedUrl: '#',
    websiteUrl: '#',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
  };
}
