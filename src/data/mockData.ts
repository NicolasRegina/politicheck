import type { Outlet, StoryCluster, Article, CampaignPromise } from '../types';

export const OUTLETS: Record<string, Outlet> = {
  clarin: {
    id: 'clarin',
    name: 'Clarín',
    slug: 'clarin',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.clarin.com'
  },
  lanacion: {
    id: 'lanacion',
    name: 'La Nación',
    slug: 'lanacion',
    category: 'nacional',
    baselineLeaning: 'oficialismo',
    websiteUrl: 'https://www.lanacion.com.ar'
  },
  pagina12: {
    id: 'pagina12',
    name: 'Página 12',
    slug: 'pagina12',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.pagina12.com.ar'
  },
  infobae: {
    id: 'infobae',
    name: 'Infobae',
    slug: 'infobae',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.infobae.com'
  },
  tn: {
    id: 'tn',
    name: 'Todo Noticias (TN)',
    slug: 'tn',
    category: 'nacional',
    baselineLeaning: 'oficialismo',
    websiteUrl: 'https://tn.com.ar'
  },
  ambito: {
    id: 'ambito',
    name: 'Ámbito Financiero',
    slug: 'ambito',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.ambito.com'
  },
  cronista: {
    id: 'cronista',
    name: 'El Cronista',
    slug: 'cronista',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.cronista.com'
  },
  perfil: {
    id: 'perfil',
    name: 'Perfil',
    slug: 'perfil',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.perfil.com'
  },
  eldiarioar: {
    id: 'eldiarioar',
    name: 'elDiarioAR',
    slug: 'eldiarioar',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.eldiarioar.com'
  },
  cronica: {
    id: 'cronica',
    name: 'Crónica',
    slug: 'cronica',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.cronica.com.ar'
  },
  baenegocios: {
    id: 'baenegocios',
    name: 'BAE Negocios',
    slug: 'baenegocios',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.baenegocios.com'
  },
  izquierdadiario: {
    id: 'izquierdadiario',
    name: 'La Izquierda Diario',
    slug: 'izquierdadiario',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.laizquierdadiario.com'
  },
  cenital: {
    id: 'cenital',
    name: 'Cenital',
    slug: 'cenital',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://cenital.com'
  },
  eleconomista: {
    id: 'eleconomista',
    name: 'El Economista',
    slug: 'eleconomista',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://eleconomista.com.ar'
  },
  ft: {
    id: 'ft',
    name: 'Financial Times',
    slug: 'ft',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.ft.com'
  },
  elpais: {
    id: 'elpais',
    name: 'El País',
    slug: 'elpais',
    category: 'internacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://elpais.com'
  },
  cnn: {
    id: 'cnn',
    name: 'CNN en Español',
    slug: 'cnn',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://cnnespanol.cnn.com'
  },
  bbcmundo: {
    id: 'bbcmundo',
    name: 'BBC News Mundo',
    slug: 'bbcmundo',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.bbc.com/mundo'
  },
  derechadiario: {
    id: 'derechadiario',
    name: 'La Derecha Diario',
    slug: 'derechadiario',
    category: 'nacional',
    baselineLeaning: 'oficialismo',
    websiteUrl: 'https://derechadiario.com.ar'
  }
};

export const MOCK_STORIES: StoryCluster[] = [
  {
    id: 'story-lead-malvinas',
    isLeadStory: true,
    kicker: 'RELACIONES EXTERIORES • SOBERANÍA NACIONAL',
    neutralHeadline: 'Reino Unido ratifica su despliegue militar en Malvinas y despierta reclamos de la diplomacia argentina y bloques parlamentarios',
    category: 'Política',
    summary: 'El secretario de Defensa británico, Wes Streeting, afirmó que el Reino Unido está "listo para proteger las islas por la fuerza si fuera necesario". Las declaraciones generaron inmediatas repercusiones en el arco político nacional, citaciones en Diputados e iniciativas diplomáticas ante foros regionales.',
    updatedAt: 'Hace 14 minutos',
    imageUrl: '/images/malvinas.jpg',
    imageCaption: 'El secretario de Defensa británico Wes Streeting en Londres durante sus declaraciones. (Foto: Archivo Periodístico / Agencias Internacionales)',
    spectrum: {
      oficialismoPct: 35,
      centroDatosPct: 40,
      oposicionPct: 25,
      totalOutlets: 5
    },
    aiComparisonNotice: 'Clarín e Infobae priorizan el tono belicista y el riesgo de escalada militar en el Atlántico Sur; La Nación recalca la doctrina de disuasión y el statu quo resuelto; Ámbito destaca la contraofensiva diplomática en el Parlasur y el consenso parlamentario multipartidario.',
    articles: [
      {
        id: 'art-malv-clarin',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'El secretario de Defensa británico dijo que están listos para defender las islas Malvinas por la fuerza',
        snippet: 'En una entrevista, Wes Streeting se refirió a los conflictos que enfrenta el Reino Unido y advirtió que enfrentan "riesgo de guerra". Afirmó que cuentan con los recursos para proteger las islas.',
        url: 'https://www.clarin.com/politica/secretario-defensa-britanico-dijo-listos-defender-islas-malvinas-fuerza_0_2fDIk1HgXa.html',
        publishedAt: '18:24 hs',
        specificFocus: 'Advertencia bélica y recursos militares británicos'
      },
      {
        id: 'art-malv-ln',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'El secretario de Defensa británico aseguró que Reino Unido está armada y preparada para proteger a las islas Malvinas',
        snippet: 'Streeting sostuvo que la Argentina carece de capacidad y remarcó la postura de Londres respecto a que el diferendo de soberanía quedó zanjado en 1982.',
        url: 'https://www.lanacion.com.ar/el-mundo/el-secretario-de-defensa-britanico-aseguro-que-reino-unido-esta-armada-y-preparada-para-proteger-a-nid26092026/',
        publishedAt: '20:27 hs',
        specificFocus: 'Doctrina de disuasión y statu quo bilateral'
      },
      {
        id: 'art-malv-ambito',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'Malvinas: impulsan una reunión del Parlasur en Tierra del Fuego como gesto de respaldo regional',
        snippet: 'La iniciativa busca nuclear a legisladores de Brasil, Paraguay, Uruguay y Bolivia en Ushuaia para unificar el reclamo soberano y sumar volumen político.',
        url: 'https://www.ambito.com/ambito-nacional/malvinas-impulsan-una-reunion-del-parlasur-tierra-del-fuego-como-gesto-respaldo-regional-n6326817',
        publishedAt: 'Hace 38 min',
        specificFocus: 'Estrategia regional y respuesta diplomática en el Parlasur'
      },
      {
        id: 'art-malv-infobae',
        outletId: 'infobae',
        outletName: 'Infobae',
        title: 'Tensión diplomática: Cancillería y bloques del Congreso coordinan agenda ante las declaraciones británicas',
        snippet: 'Diputados de la Comisión de Relaciones Exteriores convocaron a sesión extraordinaria para ratificar la cláusula constitucional transitoria sobre las Islas Malvinas.',
        url: 'https://www.infobae.com',
        publishedAt: 'Hace 25 min',
        specificFocus: 'Articulación en Cancillería y Comisión de Diputados'
      }
    ]
  },
  {
    id: 'story-regalias',
    kicker: 'FEDERALISMO • ENERGÍA & RECURSOS',
    neutralHeadline: 'Cruce entre gobernadores y el Ejecutivo nacional por el decreto de regalías de represas hidroeléctricas',
    category: 'Economía',
    summary: 'El decreto presidencial que revisa la asignación del 50% de las regalías hidroeléctricas de la represa Los Nihuiles abrió un conflicto abierto entre Mendoza y La Pampa. Los gobernadores Cornejo y Ziliotto fijaron posiciones antagónicas.',
    updatedAt: 'Hace 32 minutos',
    imageUrl: '/images/regalias.jpg',
    imageCaption: 'El gobernador pampeano Sergio Ziliotto en conferencia de prensa sobre recursos hídricos. (Foto: Prensa Oficial / Gob. de La Pampa)',
    spectrum: {
      oficialismoPct: 35,
      centroDatosPct: 35,
      oposicionPct: 30,
      totalOutlets: 4
    },
    aiComparisonNotice: 'Los medios regionales y opositores denuncian el avasallamiento del federalismo y acuerdos de 1992; los sectores afines a Mendoza y al oficialismo sostienen la legitimidad territorial de la explotación energética.',
    articles: [
      {
        id: 'art-reg-ziliotto',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'Entrevista a Sergio Ziliotto tras el decreto de Milei: "La causa de los ríos nos une, no hay grieta"',
        snippet: 'El mandatario de La Pampa insiste con el acuerdo de 1992 que fijó la coparticipación del 50% de las regalías y anticipa presentaciones ante la Corte Suprema.',
        url: 'https://www.clarin.com/politica/entrevista-sergio-ziliotto-decreto-milei-saca-regalias-pampa-causa-rios-une-grieta_0_sEWkpnziE1.html',
        publishedAt: '18:58 hs',
        specificFocus: 'Defensa del federalismo y vía judicial ante la Corte'
      },
      {
        id: 'art-reg-cornejo',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'Entrevista a Alfredo Cornejo: "La Pampa quiere tener una malvinización del conflicto con Mendoza"',
        snippet: 'El gobernador mendocino respalda la decisión de la Casa Rosada y sostiene que la generación eléctrica pertenece a la jurisdicción de su provincia.',
        url: 'https://www.clarin.com/politica/entrevista-alfredo-cornejo-decreto-milei-regalias-conflicto-atuel-pampa-quiere-tener-malvinizacion-conflicto-mendoza_0_qUuYrwt8FQ.html',
        publishedAt: '18:57 hs',
        specificFocus: 'Jurisdicción mendocina y crítica a la postura pampeana'
      },
      {
        id: 'art-reg-ambito',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'Ingresos provinciales en pugna: el conflicto por represas reaviva la discusión fiscal con el interior',
        snippet: 'Gobernadores alertan que el recorte de regalías impacta de lleno en las cuentas públicas provinciales en medio del ajuste de transferencias discrecionales.',
        url: 'https://www.ambito.com',
        publishedAt: 'Hace 45 min',
        specificFocus: 'Impacto fiscal en las cuentas de las provincias'
      }
    ]
  },
  {
    id: 'story-universidad',
    kicker: 'EDUCACIÓN PÚBLICA • CONFLICTO SALARIAL',
    neutralHeadline: 'Gremios universitarios convocan a paro de 72 horas y ratifican nueva Marcha Federal educativa',
    category: 'Sociedad',
    summary: 'Las federaciones docentes y no docentes agrupadas en el Frente Sindical Universitario acordaron una huelga nacional a partir del miércoles 30 de septiembre, exigiendo la inmediata aplicación de la Ley de Financiamiento Universitario.',
    updatedAt: 'Hace 48 minutos',
    imageUrl: '/images/universidad.jpg',
    imageCaption: 'Movilización universitaria en defensa del presupuesto de la educación pública. (Foto: Cobertura Periodística)',
    spectrum: {
      oficialismoPct: 25,
      centroDatosPct: 35,
      oposicionPct: 40,
      totalOutlets: 4
    },
    aiComparisonNotice: 'Enfoques fuertemente contrastados: medios opositores remarcan la pérdida del poder adquisitivo del 30% en salarios docentes; medios afines al Gobierno cuestionan la politización gremial y exigen auditorías de gastos en las casas de altos estudios.',
    articles: [
      {
        id: 'art-uni-clarin',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'Paro docente universitario: será a partir del 30 de septiembre y podría durar entre 48 y 72 horas',
        snippet: 'La medida de CONADU responde a la falta de acuerdo salarial. Esta semana la Justicia intimó al Poder Ejecutivo a dar precisiones sobre partidas presupuestarias.',
        url: 'https://www.clarin.com/politica/paro-docente-universitario-partir-miercoles-30-septiembre-junto-marcha-federal-podria-durar-48-72-horas_0_oYMgrqvNR6.html',
        publishedAt: '15:24 hs',
        specificFocus: 'Cronograma del paro y resolución judicial'
      },
      {
        id: 'art-uni-ambito',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'Docentes universitarios convocaron a un paro de hasta 72 horas y condicionan la medida a una suba salarial',
        snippet: 'Los gremios anunciaron que la huelga se suspenderá únicamente si el Ministerio de Capital Humano presenta una propuesta de recomposición que cubra la inflación.',
        url: 'https://www.ambito.com/politica/docentes-universitarios-convocaron-un-paro-72-horas-y-condicionaron-la-medida-una-suba-salarial-n6327027',
        publishedAt: '15:28 hs',
        specificFocus: 'Condiciones de negociación y reclamo a Capital Humano'
      },
      {
        id: 'art-uni-p12',
        outletId: 'pagina12',
        outletName: 'Página 12',
        title: 'Las universidades van a la huelga: marcha federal contra el congelamiento presupuestario',
        snippet: 'Rectores y centros de estudiantes alertan sobre la imposibilidad de sostener investigaciones científicas y servicios básicos hacia fin de año.',
        url: 'https://www.pagina12.com.ar',
        publishedAt: '16:00 hs',
        specificFocus: 'Sostenibilidad del sistema científico y movilización estudiantil'
      }
    ]
  },
  {
    id: 'story-mercados',
    kicker: 'MERCADOS & MACROECONOMÍA',
    neutralHeadline: 'Volatilidad en bonos soberanos y tensión en los mercados por el nivel de actividad industrial',
    category: 'Economía',
    summary: 'La turbulencia de los bonos del Tesoro de EE.UU. impactó en la renta fija argentina, elevando el riesgo país a 1.180 puntos básicos. Paralelamente, datos sectoriales de la UIA alertan sobre la necesidad de incentivos para amortiguar la caída de la producción.',
    updatedAt: 'Hace 1 hora',
    imageUrl: '/images/mercados.jpg',
    imageCaption: 'Operaciones financieras y cotización de títulos soberanos en el recinto bursátil. (Foto: Medios Financieros / Ámbito)',
    spectrum: {
      oficialismoPct: 30,
      centroDatosPct: 45,
      oposicionPct: 25,
      totalOutlets: 4
    },
    aiComparisonNotice: 'El Cronista destaca la disciplina fiscal como reaseguro para evitar una crisis de deuda; Ámbito pone la lupa en la fragilidad externa y el peligro de recesión técnica en el segundo semestre.',
    articles: [
      {
        id: 'art-merc-ambito',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'La turbulencia de los bonos de EEUU también golpea a la deuda local y empuja al alza el riesgo país',
        snippet: 'El panorama de la deuda global echó más leña al fuego a la cotización de los bonos soberanos argentinos, que operan con tendencia dispar en Nueva York.',
        url: 'https://www.ambito.com/finanzas/la-turbulencia-los-bonos-eeuu-tambien-golpea-la-deuda-local-y-empuja-al-alza-el-riesgo-pais-n6326763',
        publishedAt: 'Hace 1 h',
        specificFocus: 'Contagio externo y cotización de bonos en Wall Street'
      },
      {
        id: 'art-merc-cronista',
        outletId: 'cronista',
        outletName: 'El Cronista',
        title: 'Cuánto le cuesta el FMI a América Latina: el peso de los intereses que paga la Argentina',
        snippet: 'Informe especial sobre el costo financiero del programa de refinanciación y los compromisos de vencimiento que enfrenta el Tesoro en 2027.',
        url: 'https://www.cronista.com/economia-politica/cuanto-le-cuesta-el-fmi-a-america-latina-el-peso-de-argentina-en-los-intereses-que-paga-la-region/',
        publishedAt: 'Hace 1 h',
        specificFocus: 'Estructura de vencimientos y sobretasas del Fondo Monetario'
      }
    ]
  }
];

export const MOCK_LIVE_FEED: Article[] = [
  {
    id: 'live-1',
    outletId: 'clarin',
    outletName: 'Clarín',
    title: 'Mauricio Macri viajó a Jujuy y mandó un mensaje de gobernabilidad: "Apoyamos a este Gobierno como nadie lo hizo"',
    snippet: 'El expresidente analizó el tablero electoral junto al gobernador Sadir y ratificó la necesidad de reformas estructurales sin cogobierno formal.',
    url: 'https://www.clarin.com/politica/mauricio-macri-viajo-jujuy-mando-mensaje-milei-apoyamos-gobierno-nadie-hizo_0_WZ2CPJZEQm.html',
    publishedAt: '21:25 hs',
    imageUrl: '/images/macri-milei.jpg'
  },
  {
    id: 'live-2',
    outletId: 'ambito',
    outletName: 'Ámbito Financiero',
    title: 'Catamarca elimina el impuesto a los Ingresos Brutos industriales y reaviva la competencia fiscal provincial',
    snippet: 'La medida busca atraer radicaciones fabriles y desmarca a la provincia del esquema tributario bonaerense.',
    url: 'https://www.ambito.com/economia/ingresos-brutos-catamarca-elimina-el-impuesto-la-industria-y-reaviva-el-debate-fiscal-las-provincias-n6326748',
    publishedAt: '20:45 hs',
    imageUrl: '/images/economia.jpg'
  },
  {
    id: 'live-3',
    outletId: 'lanacion',
    outletName: 'La Nación',
    title: 'Supercopa Internacional: doblete estelar y victoria de Rosario Central ante Estudiantes en Santiago del Estero',
    snippet: 'El equipo rosarino se consagró en un partido con polémica por el VAR y festejo masivo en el estadio Madre de Ciudades.',
    url: 'https://www.lanacion.com.ar',
    publishedAt: '20:33 hs'
  },
  {
    id: 'live-4',
    outletId: 'clarin',
    outletName: 'Clarín',
    title: 'Crisis en la obra social de las Fuerzas Armadas: la deuda acumulada superó los $ 500.000 millones',
    snippet: 'Presentan pedidos de informe en Defensa por el déficit operativo y la suspensión de prestaciones médicas a efectivos.',
    url: 'https://www.clarin.com',
    publishedAt: '16:38 hs'
  },
  {
    id: 'live-5',
    outletId: 'cronista',
    outletName: 'El Cronista',
    title: 'Exención de ABL por 6 meses: los tres sectores comerciales de la Ciudad que accederán al beneficio impositivo',
    snippet: 'La Legislatura porteña dio dictamen a la iniciativa enviada por la Jefatura de Gobierno para dinamizar el consumo barrial.',
    url: 'https://www.cronista.com',
    publishedAt: '19:37 hs'
  },
  {
    id: 'live-6',
    outletId: 'infobae',
    outletName: 'Infobae',
    title: 'Seguridad vial: imprudente cruce en rojo en la Ruta 197 culminó en colisión captada por cámaras del COT',
    snippet: 'El conductor fue asistido de urgencia por los servicios médicos tras ser despedido de la motocicleta en Troncos del Talar.',
    url: 'https://www.infobae.com',
    publishedAt: '20:32 hs'
  }
];

export const MOCK_FOREIGN_STORIES: StoryCluster[] = [
  {
    id: 'foreign-1',
    kicker: 'MIRADA EXTERIOR • PRENSA INTERNACIONAL',
    neutralHeadline: 'Corresponsales extranjeros evalúan la sostenibilidad del programa macroeconómico y el equilibrio político argentino',
    category: 'Internacional',
    summary: 'Publicaciones de referencia como el Financial Times y El País analizan la combinación de superávit financiero sostenido, recomposición de reservas y las crecientes tensiones de gobernabilidad parlamentaria camino a 2027.',
    updatedAt: 'Hace 28 minutos',
    imageUrl: '/images/macri-milei.jpg',
    imageCaption: 'El equilibrio de fuerzas parlamentarias y la relación entre fuerzas aliadas bajo la lupa internacional. (Foto: Archivo Periodístico)',
    spectrum: {
      oficialismoPct: 35,
      centroDatosPct: 40,
      oposicionPct: 25,
      totalOutlets: 3
    },
    aiComparisonNotice: 'El Financial Times destaca la credibilidad fiscal conquistada ante inversores de Wall Street; El País subraya el costo social sobre los sectores vulnerables y la fragilidad del apoyo en el Congreso.',
    articles: [
      {
        id: 'for-1-ft',
        outletId: 'ft',
        outletName: 'Financial Times',
        title: "Argentina's fiscal turnaround catches Wall Street's eye despite political headwinds",
        snippet: 'Investors praise Milei’s budget discipline, though questions linger over the long-term sustainability of deep spending cuts and congressional backing.',
        url: 'https://www.ft.com',
        publishedAt: 'Hace 45 min',
        specificFocus: 'Disciplina presupuestaria y apetito de inversores internacionales'
      },
      {
        id: 'for-1-elpais',
        outletId: 'elpais',
        outletName: 'El País',
        title: 'El experimento argentino bajo la lupa: avances macroeconómicos y fragilidad social en la cuenta regresiva electoral',
        snippet: 'El Gobierno exhibe una desaceleración inflacionaria contundente mientras los sectores vulnerables resienten el ajuste en comedores y medicamentos.',
        url: 'https://elpais.com',
        publishedAt: 'Hace 1 hora',
        specificFocus: 'Tensión social y desafíos de sustentabilidad política'
      },
      {
        id: 'for-1-cnn',
        outletId: 'cnn',
        outletName: 'CNN en Español',
        title: 'Diplomacia y comercio: qué significa el giro de la política exterior argentina en el escenario regional',
        snippet: 'El distanciamiento del Mercosur tradicional y los puentes con Washington redibujan el mapa diplomático sudamericano.',
        url: 'https://cnnespanol.cnn.com',
        publishedAt: 'Hace 2 horas',
        specificFocus: 'Reordenamiento diplomático y alianzas con Occidente'
      }
    ]
  }
];

export const MOCK_PROMISES: CampaignPromise[] = [
  {
    id: 'prom-1',
    candidate: 'Javier Milei',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    category: 'Presupuesto y Finanzas',
    promiseText: '"El déficit fiscal cero no se negocia bajo ninguna circunstancia: no gastaremos un solo peso más de lo que ingresa."',
    status: 'cumplida',
    statusLabel: 'Cumplida (en vigencia)',
    statedAt: 'Discurso de Asunción y Apertura de Sesiones Ordinarias',
    sourceUrl: 'https://www.boletinoficial.gob.ar',
    officialProof: 'Secretaría de Hacienda de la Nación: Superávit primario y financiero consecutivo en los ejercicios 2024-2026.',
    auditNotes: 'El Ministerio de Economía registró superávit financiero consecutivo sostenido por recorte en gastos de capital (obra pública), transferencias corrientes a provincias y saneamiento de cuentas públicas.'
  },
  {
    id: 'prom-2',
    candidate: 'Javier Milei',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    category: 'Economía y Moneda',
    promiseText: '"Vamos a cerrar el Banco Central y permitir la libre competencia de monedas para terminar definitivamente con la inflación."',
    status: 'en_pausa',
    statusLabel: 'En pausa / Fase intermedia',
    statedAt: 'Campaña Presidencial 2023 / Plataforma Electoral LLA',
    sourceUrl: 'https://www.bcra.gob.ar',
    officialProof: 'Comunicación BCRA \'A\' 7925 y decretos de saneamiento de pasivos remunerados (LEFI).',
    auditNotes: 'El Banco Central sigue operativo bajo la conducción de Santiago Bausili, abocado al saneamiento de pasivos remunerados. La dolarización formal se encuentra pospuesta en favor de un esquema de bimonetarismo transaccional.'
  },
  {
    id: 'prom-3',
    candidate: 'Javier Milei',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    category: 'Reforma Institucional',
    promiseText: '"Implementaremos la Boleta Única de Papel para terminar con el fraude de las boletas sábanas y el negocio de la impresión partidaria."',
    status: 'cumplida',
    statusLabel: 'Cumplida (Sancionada)',
    statedAt: 'Plataforma de Gobierno y mensaje al Congreso de la Nación',
    sourceUrl: 'https://www.boletinoficial.gob.ar',
    officialProof: 'Ley 27.781 sancionada por el Congreso y promulgada en el Boletín Oficial de la República Argentina.',
    auditNotes: 'El Congreso de la Nación aprobó el proyecto de Boleta Única de Papel (BUP) estilo cordobés para todas las elecciones nacionales a cargos legislativos y presidenciales.'
  },
  {
    id: 'prom-4',
    candidate: 'Javier Milei',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    category: 'Sector Agropecuario',
    promiseText: '"Nuestro horizonte ineludible es la eliminación absoluta de los derechos de exportación (retenciones) al campo."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Reducción gradual',
    statedAt: 'Exposición Rural de Palermo / Mensaje al sector agropecuario',
    sourceUrl: 'https://www.argentina.gob.ar/agricultura',
    officialProof: 'Decreto 697/2024 y resoluciones de Secretaría de Bioeconomía eliminando retenciones a economías regionales y carnes blancas.',
    auditNotes: 'Se eliminaron retenciones a lácteos y economías regionales, pero los principales complejos exportadores (soja, maíz y trigo) mantienen alícuotas vigentes sujetas al equilibrio fiscal.'
  },
  {
    id: 'prom-5',
    candidate: 'Victoria Villarruel',
    coalition: 'La Libertad Avanza',
    role: 'Vicepresidenta de la Nación',
    category: 'Defensa y Soberanía',
    promiseText: '"Reequiparemos nuestras Fuerzas Armadas y jerarquizaremos el haber militar para recuperar la custodia efectiva de nuestro espacio aéreo y el Atlántico Sur."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Compra F-16 e incrementos',
    statedAt: 'Acto por el Día de la Bandera y campaña electoral nacional',
    sourceUrl: 'https://www.boletinoficial.gob.ar',
    officialProof: 'Decreto 314/2024 (adquisición de cazas F-16 Fighting Falcon) y Resolución Conjunta MD-ME de equiparación salarial militar.',
    auditNotes: 'Se concretó el acuerdo de adquisición de 24 aviones caza supersónicos F-16 a Dinamarca con respaldo estadounidense y se dispusieron recomposiciones salariales periódicas para el personal castrense, si bien persisten demoras en modernización de corbetas navales.'
  },
  {
    id: 'prom-6',
    candidate: 'Victoria Villarruel',
    coalition: 'La Libertad Avanza',
    role: 'Vicepresidenta de la Nación',
    category: 'Institucional y Malvinas',
    promiseText: '"La causa de Malvinas volverá a ser una política de Estado innegociable en todos los foros internacionales de descolonización."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Reclamo en ONU',
    statedAt: 'Conmemoración del 2 de Abril en el Senado de la Nación',
    sourceUrl: 'https://www.cancilleria.gob.ar',
    officialProof: 'Documento oficial de reclamo de soberanía presentado ante el Comité Especial de Descolonización (C-24) de la ONU.',
    auditNotes: 'La Vicepresidenta sostuvo el reclamo soberano en el Senado de la Nación y foros interparlamentarios, contrastando en ocasiones con iniciativas de acercamiento comercial ensayadas por Cancillería con el Reino Unido.'
  },
  {
    id: 'prom-7',
    candidate: 'Patricia Bullrich',
    coalition: 'La Libertad Avanza / PRO',
    role: 'Ministra de Seguridad Nacional',
    category: 'Seguridad y Orden Público',
    promiseText: '"El que las hace, las paga: no permitiremos cortes de calles, puentes ni accesos que impidan circular a los que trabajan."',
    status: 'cumplida',
    statusLabel: 'Cumplida / Protocolo en vigor',
    statedAt: 'Conferencia inaugural en el Ministerio de Seguridad de la Nación',
    sourceUrl: 'https://www.boletinoficial.gob.ar',
    officialProof: 'Resolución 943/2023 del Ministerio de Seguridad (Protocolo Antipiquetes) y causas judiciales de cobro de costas a organizaciones convocantes.',
    auditNotes: 'El Protocolo para el Mantenimiento del Orden Público se aplicó de manera sistemática en accesos a la Capital Federal (Puente Pueyrredón, Panamericana, Av. 9 de Julio) con despliegue de Fuerzas Federales e imputación civil de costos a los convocantes.'
  },
  {
    id: 'prom-8',
    candidate: 'Patricia Bullrich',
    coalition: 'La Libertad Avanza / PRO',
    role: 'Ministra de Seguridad Nacional',
    category: 'Lucha contra el Narcotráfico',
    promiseText: '"Plan Bandera en Rosario: presencia implacable de fuerzas federales y régimen estricto de aislamiento para líderes narco en cárceles federales."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Caída de homicidios',
    statedAt: 'Lanzamiento del Plan Bandera en Rosario (Santa Fe)',
    sourceUrl: 'https://www.argentina.gob.ar/seguridad',
    officialProof: 'Informes del Observatorio de Seguridad Pública de Santa Fe y del Sistema Nacional de Información Criminal (SNIC).',
    auditNotes: 'El despliegue coordinado de Gendarmería, Prefectura y Policía Federal junto al aislamiento de jefes narco en pabellones de alto perfil logró una reducción de más del 50% en la tasa de homicidios dolosos en Rosario.'
  },
  {
    id: 'prom-9',
    candidate: 'Jorge Macri',
    coalition: 'Juntos por el Cambio / PRO',
    role: 'Jefe de Gobierno CABA',
    category: 'Orden Urbano y Espacio Público',
    promiseText: '"Vamos a recuperar el orden del espacio público en la Ciudad, terminando con acampes, piquetes y usurpaciones en veredas y plazas."',
    status: 'cumplida',
    statusLabel: 'Cumplida / Desalojos ejecutados',
    statedAt: 'Discurso de asunción en la Legislatura Porteña',
    sourceUrl: 'https://buenosaires.gob.ar/espaciopublico',
    officialProof: 'Actas de operativos de la Policía de la Ciudad e informes del Ministerio de Seguridad CABA sobre despeje de Plaza de Mayo, Congreso, Retiro y Aeroparque.',
    auditNotes: 'El Gobierno de la Ciudad concretó el desalojo de acampes crónicos en Plaza de Mayo, Plaza de los Dos Congresos, Plaza Lavalle y sectores comerciales de Retiro, intensificando los operativos de higiene y asistencia social.'
  },
  {
    id: 'prom-10',
    candidate: 'Jorge Macri',
    coalition: 'Juntos por el Cambio / PRO',
    role: 'Jefe de Gobierno CABA',
    category: 'Infraestructura y Conectividad',
    promiseText: '"Avanzaremos en la eliminación de barreras del ferrocarril Sarmiento mediante obras de viaducto y pasos bajo nivel para conectar la Ciudad."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Proyecto licitatorio',
    statedAt: 'Apertura de Sesiones de la Legislatura Porteña 2024',
    sourceUrl: 'https://buenosaires.gob.ar/infraestructura',
    officialProof: 'Llamado a consulta pública y partidas presupuestarias plurianuales asignadas por la Legislatura de la Ciudad para pasos bajo nivel y obras del Sarmiento.',
    auditNotes: 'La Ciudad definió la traza de trinchera y viaducto entre Villa Luro y Caballito, iniciando las obras de pasos bajo nivel prioritarios en cruces neurálgicos mientras gestiona financiamiento internacional con la CAF.'
  },
  {
    id: 'prom-11',
    candidate: 'Juan Schiaretti',
    coalition: 'Hacemos por Nuestro País',
    role: 'Referente Federal',
    category: 'Producción y Federalismo',
    promiseText: '"Defendemos a ultranza el equilibrio fiscal, pero sin asfixiar la producción del interior: exigimos la quita gradual de retenciones y coparticipación equitativa."',
    status: 'en_progreso',
    statusLabel: 'En debate / Bloque Encuentro Federal',
    statedAt: 'Debate Presidencial Nacional y encuentros de la Región Centro',
    sourceUrl: 'https://www.diputados.gov.ar',
    officialProof: 'Proyectos de ley de coparticipación del impuesto a los combustibles y prórroga del corte de biocombustibles presentados por Encuentro Federal.',
    auditNotes: 'A través del bloque parlamentario Encuentro Federal, el schiarettismo condicionó su apoyo a leyes fiscales a cambio del reparto equitativo del impuesto a los combustibles líquidos y la reactivación de cajas previsionales provinciales.'
  },
  {
    id: 'prom-12',
    candidate: 'Axel Kicillof',
    coalition: 'Unión por la Patria',
    role: 'Gobernador de Buenos Aires',
    category: 'Educación e Infraestructura Escolar',
    promiseText: '"Inauguraremos más de 200 nuevos edificios escolares y sostendremos el Fondo de Incentivo Docente con fondos propios de la Provincia."',
    status: 'cumplida',
    statusLabel: 'Cumplida / Edificio 230 inaugurado',
    statedAt: 'Mensaje ante la Asamblea Legislativa Bonaerense',
    sourceUrl: 'https://www.gba.gob.ar/educacion',
    officialProof: 'Registro público de la Dirección General de Cultura y Educación (DGCyE) sobre el Plan Escuelas a la Obra.',
    auditNotes: 'El gobierno provincial superó la meta al inaugurar el edificio escolar número 230 y mantuvo la compensación salarial a docentes ante la quita del FONID nacional, a pesar de las restricciones fiscales generales.'
  },
  {
    id: 'prom-13',
    candidate: 'Axel Kicillof',
    coalition: 'Unión por la Patria',
    role: 'Gobernador de Buenos Aires',
    category: 'Consumo e Inclusión',
    promiseText: '"Sostendremos el poder adquisitivo de las familias bonaerenses mediante los reintegros masivos de Cuenta DNI."',
    status: 'cumplida',
    statusLabel: 'Cumplida (en vigencia)',
    statedAt: 'Conferencia de Gestión del Banco de la Provincia de Buenos Aires',
    sourceUrl: 'https://www.bancoprovincia.com.ar',
    officialProof: 'Boletín de gestión de Banco Provincia: Más de 9 millones de usuarios con reintegros en comercios de cercanía y carnicerías.',
    auditNotes: 'La billetera virtual del Banco Provincia opera de forma ininterrumpida con promociones semanales en alimentos básicos, sosteniendo el volumen de transacciones en almacenes barriales y carnicerías de los 135 municipios.'
  },
  {
    id: 'prom-14',
    candidate: 'Mauricio Macri',
    coalition: 'Propuesta Republicana (PRO)',
    role: 'Presidente del PRO',
    category: 'Institucional y Gobernabilidad',
    promiseText: '"El PRO garantizará las herramientas institucionales para que el gobierno avance, pero marcando con firmeza los límites en calidad institucional y educación."',
    status: 'cumplida',
    statusLabel: 'Cumplida con observaciones',
    statedAt: 'Documento Político de la Asamblea Nacional del PRO',
    sourceUrl: 'https://pro.com.ar',
    officialProof: 'Actas de votación nominal de la Cámara de Diputados en Ley de Bases, DNU 70/2023 y veto al financiamiento universitario.',
    auditNotes: 'Los bloques parlamentarios del PRO actuaron como sostén legislativo para la Ley de Bases y el veto jubilatorio, al tiempo que rechazaron el DNU de fondos reservados para la SIDE y reclamaron una gestión eficiente en la administración nacional.'
  },
  {
    id: 'prom-15',
    candidate: 'Horacio Rodríguez Larreta',
    coalition: 'Movimiento al Desarrollo (MAD)',
    role: 'Referente de Centro',
    category: 'Consenso y Desarrollo',
    promiseText: '"Proponemos un shock de desarrollo basado en un pacto del 70% de las fuerzas democráticas y un plan de 190 días obligatorios de clase en todo el país."',
    status: 'en_progreso',
    statusLabel: 'En difusión / Movimiento al Desarrollo',
    statedAt: 'Lanzamiento nacional del Movimiento al Desarrollo (MAD)',
    sourceUrl: 'https://www.argentina.gob.ar/educacion',
    officialProof: 'Acta constitutiva y propuestas técnicas del MAD sobre reforma educativa y federalismo productivo.',
    auditNotes: 'Larreta formalizó el espacio MAD recorriendo provincias para articular con sectores productivos y académicos. El objetivo de consensos amplios enfrenta la fuerte polarización política entre LLA y el kirchnerismo.'
  },
  {
    id: 'prom-16',
    candidate: 'Leandro Santoro',
    coalition: 'Unión por la Patria',
    role: 'Diputado Nacional',
    category: 'Acceso a la Vivienda',
    promiseText: '"Impulsaremos una Ley de Alquileres de la Ciudad con incentivos impositivos al propietario para alquiler permanente y subsidio al depósito para inquilinos."',
    status: 'en_pausa',
    statusLabel: 'En pausa / Bloqueado en Legislatura',
    statedAt: 'Campaña electoral y debates parlamentarios CABA',
    sourceUrl: 'https://www.legislatura.gob.ar',
    officialProof: 'Proyecto de Ley radicado en la Comisión de Vivienda de la Legislatura Porteña (Expte. 1422-D-2024).',
    auditNotes: 'El proyecto fue presentado formalmente por el bloque de Unión por la Patria en la Legislatura Porteña, pero no logró dictamen favorable en la comisión de Vivienda frente a la mayoría parlamentaria oficialista porteña.'
  }
];
