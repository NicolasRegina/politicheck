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
    category: 'Economía y Moneda',
    promiseText: '"Vamos a cerrar el Banco Central y permitir la libre competencia de monedas para terminar definitivamente con la inflación."',
    status: 'en_pausa',
    statusLabel: 'En pausa / Fase intermedia',
    statedAt: 'Campaña Electoral 2023 / Reafirmado en 2024',
    sourceUrl: 'https://www.casarosada.gob.ar',
    auditNotes: 'El Banco Central sigue operativo bajo un esquema de saneamiento de pasivos remunerados y no emisión para financiar al Tesoro. La libre competencia se canalizó en medidas de bimonetarismo de hecho, posponiendo la dolarización integral.'
  },
  {
    id: 'prom-2',
    candidate: 'Javier Milei',
    coalition: 'La Libertad Avanza',
    role: 'Presidente de la Nación',
    category: 'Presupuesto y Finanzas',
    promiseText: '"El déficit fiscal cero no se negocia bajo ninguna circunstancia: no gastaremos un solo peso más de lo que ingresa."',
    status: 'cumplida',
    statusLabel: 'Cumplida (en vigencia)',
    statedAt: 'Discurso de Asunción y Apertura de Sesiones',
    sourceUrl: 'https://www.economia.gob.ar',
    auditNotes: 'El Ministerio de Economía registró superávit financiero consecutivo en los primeros 8 meses del ejercicio fiscal, sostenido principalmente por recorte de obra pública, transferencias provinciales y licuación de partidas.'
  },
  {
    id: 'prom-3',
    candidate: 'Axel Kicillof',
    coalition: 'Unión por la Patria',
    role: 'Gobernador de Buenos Aires',
    category: 'Desarrollo Productivo',
    promiseText: '"La provincia de Buenos Aires sostendrá la inversión pública y el crédito a pymes con recursos propios del Banco Provincia."',
    status: 'en_progreso',
    statusLabel: 'En progreso / Verificable',
    statedAt: 'Mensaje ante la Legislatura Bonaerense',
    sourceUrl: 'https://www.gba.gob.ar',
    auditNotes: 'El Banco Provincia mantiene líneas crediticias subsidiadas para parques industriales bonaerenses, aunque la desaceleración de la recaudación tributaria provincial recortó el ritmo de licitaciones de infraestructura.'
  },
  {
    id: 'prom-4',
    candidate: 'Mauricio Macri',
    coalition: 'Propuesta Republicana (PRO)',
    role: 'Presidente del PRO',
    category: 'Institucional y Congreso',
    promiseText: '"Garantizaremos la gobernabilidad en el Congreso aprobando las leyes esenciales para no empujar al país al vacío."',
    status: 'cumplida',
    statusLabel: 'Cumplida con observaciones',
    statedAt: 'Documento Nacional del Consejo Directivo del PRO',
    sourceUrl: 'https://pro.com.ar',
    auditNotes: 'El bloque PRO votó a favor de la Ley de Bases y el paquete fiscal. Sin embargo, en votaciones puntuales (fondos reservados de la SIDE, financiamiento universitario) adoptó posturas críticas o de abstención.'
  }
];
