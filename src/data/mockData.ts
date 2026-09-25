import type { Outlet, StoryCluster, Article } from '../types';

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
  }
};

export const MOCK_STORIES: StoryCluster[] = [
  {
    id: 'story-1',
    neutralHeadline: 'El Ministerio de Economía publica el índice de inflación mensual y anuncia nuevo recorte arancelario',
    category: 'Economía',
    summary: 'El INDEC reportó una inflación mensual del 2,4%. Paralelamente, el Palacio de Hacienda dispuso la reducción de aranceles de importación para insumos tecnológicos y bienes de capital.',
    updatedAt: 'Hace 18 minutos',
    spectrum: {
      oficialismoPct: 40,
      centroDatosPct: 35,
      oposicionPct: 25,
      totalOutlets: 6
    },
    aiComparisonNotice: 'Los medios afines al oficialismo priorizan la tendencia a la baja por sexto mes consecutivo; los medios opositores advierten sobre la caída del consumo masivo y el impacto de la apertura importadora en la industria local.',
    articles: [
      {
        id: 'art-1-ln',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'La inflación volvió a ceder y el Gobierno acelera la apertura económica con rebaja de aranceles',
        snippet: 'El IPC de febrero marcó el registro más bajo en tres años. Caputo celebró el dato en redes y confirmó beneficios para maquinaria importada.',
        url: 'https://www.lanacion.com.ar',
        publishedAt: 'Hace 22 min',
        specificFocus: 'Éxito del ancla fiscal y rebaja impositiva'
      },
      {
        id: 'art-1-p12',
        outletId: 'pagina12',
        outletName: 'Página 12',
        title: 'Inflación planchada por recesión: la apertura arancelaria amenaza a las pymes metalúrgicas',
        snippet: 'El freno en precios coincide con una retracción del 12% en ventas minoristas. Sectores industriales alertan por pérdida de empleo ante la competencia externa.',
        url: 'https://www.pagina12.com.ar',
        publishedAt: 'Hace 35 min',
        specificFocus: 'Contracción del consumo e impacto pyme'
      },
      {
        id: 'art-1-clarin',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'El IPC dio 2,4% y Economía avanza con menos impuestos a importados: el debate por la competitividad',
        snippet: 'El dato oficial consolidó la desaceleración. Empresarios divididos entre la reducción de costos y las asimetrías cambiarias.',
        url: 'https://www.clarin.com',
        publishedAt: 'Hace 40 min',
        specificFocus: 'Competitividad y reacciones empresarias'
      },
      {
        id: 'art-1-infobae',
        outletId: 'infobae',
        outletName: 'Infobae',
        title: 'Repercusiones en los mercados: suben los bonos y el riesgo país perfora nuevos mínimos tras el IPC',
        snippet: 'Wall Street reaccionó positivamente al sendero desinflacionario y la continuidad del superávit primario.',
        url: 'https://www.infobae.com',
        publishedAt: 'Hace 18 min',
        specificFocus: 'Respuesta de bonos soberanos y riesgo país'
      }
    ]
  },
  {
    id: 'story-2',
    neutralHeadline: 'Debate en el Congreso por la reforma del régimen electoral y financiamiento partidario',
    category: 'Política',
    summary: 'Las comisiones de Asuntos Constitucionales y Presupuesto comenzaron el tratamiento del proyecto de ley que elimina las PASO y modifica topes de aportes privados para campañas.',
    updatedAt: 'Hace 42 minutos',
    spectrum: {
      oficialismoPct: 33,
      centroDatosPct: 33,
      oposicionPct: 34,
      totalOutlets: 5
    },
    aiComparisonNotice: 'La discusión se polariza en torno al ahorro fiscal y saturación electoral (enfoque oficialista) versus la representatividad de partidos chicos y transparencia en aportes empresarios (enfoque opositor).',
    articles: [
      {
        id: 'art-2-ambito',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'Financiamiento de campañas: alerta opositora por la desregulación de aportes de empresas privadas',
        snippet: 'Bloques de centro y de izquierda señalan que la norma habilita la captura corporativa del proceso electoral.',
        url: 'https://www.ambito.com',
        publishedAt: 'Hace 45 min',
        specificFocus: 'Riesgo de falta de control en fondos privados'
      },
      {
        id: 'art-2-ln',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'El oficialismo busca dictamen para terminar con el gasto millonario de las primarias abiertas',
        snippet: 'El proyecto estima un ahorro de más de 60 millones de dólares para el erario público. Negociaciones con gobernadores aliados.',
        url: 'https://www.lanacion.com.ar',
        publishedAt: 'Hace 50 min',
        specificFocus: 'Ahorro fiscal y eliminación de elecciones superfluas'
      },
      {
        id: 'art-2-clarin',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'Poroteo clave en Diputados: qué piden los bloques provinciales para acompañar la reforma electoral',
        snippet: 'El Gobierno confía en tener los números pero debe conceder modificaciones en el reparto de espacios publicitarios.',
        url: 'https://www.clarin.com',
        publishedAt: 'Hace 42 min',
        specificFocus: 'Aritmética parlamentaria y negociación de votos'
      }
    ]
  },
  {
    id: 'story-3',
    neutralHeadline: 'La Corte Suprema rechaza recursos y ratifica competencia federal en causa por obras viales',
    category: 'Justicia',
    summary: 'El máximo tribunal desestimó los planteos de nulidad presentados por las defensas en un expediente de trascendencia política, habilitando la continuidad de las medidas cautelares.',
    updatedAt: 'Hace 1 hora',
    spectrum: {
      oficialismoPct: 45,
      centroDatosPct: 25,
      oposicionPct: 30,
      totalOutlets: 4
    },
    aiComparisonNotice: 'Tratamiento dispar entre la celebración institucional del fallo como avance contra la impunidad versus denuncias de lawfare y persecución política.',
    articles: [
      {
        id: 'art-3-infobae',
        outletId: 'infobae',
        outletName: 'Infobae',
        title: 'Fallo unánime: la Corte dejó firmes resoluciones clave y acelera los plazos de ejecución',
        snippet: 'Los ministros consideraron inadmisibles los recursos extraordinarios interpuestos por los imputados.',
        url: 'https://www.infobae.com',
        publishedAt: 'Hace 1 hora',
        specificFocus: 'Firmeza procesal e impacto judicial'
      },
      {
        id: 'art-3-p12',
        outletId: 'pagina12',
        outletName: 'Página 12',
        title: 'Nuevo embate judicial en año electoral: el tribunal clausura vías de defensa sin tratar el fondo',
        snippet: 'Especialistas cuestionan el doble estándar de la Corte y denuncian un calendario judicial sincronizado con la agenda electoral.',
        url: 'https://www.pagina12.com.ar',
        publishedAt: 'Hace 1 hora',
        specificFocus: 'Cuestionamiento al timing electoral del fallo'
      }
    ]
  }
];

export const MOCK_LIVE_FEED: Article[] = [
  {
    id: 'live-1',
    outletId: 'infobae',
    outletName: 'Infobae',
    title: 'El Banco Central compró otros USD 115 millones y las reservas brutas alcanzaron su nivel más alto del semestre',
    snippet: 'La autoridad monetaria acumula 14 jornadas consecutivas con saldo favorable en el mercado libre de cambios.',
    url: 'https://www.infobae.com',
    publishedAt: 'Hace 6 min'
  },
  {
    id: 'live-2',
    outletId: 'clarin',
    outletName: 'Clarín',
    title: 'Paritarias docentes: cinco provincias retomaron negociaciones con cláusulas atadas a la recaudación',
    snippet: 'Gremios advierten que la propuesta oficial no compensa la pérdida del poder adquisitivo del último año.',
    url: 'https://www.clarin.com',
    publishedAt: 'Hace 14 min'
  },
  {
    id: 'live-3',
    outletId: 'pagina12',
    outletName: 'Página 12',
    title: 'Subsidios al transporte: denuncian asimetrías tarifarias entre el AMBA y las provincias del interior',
    snippet: 'Intendentes de diversas ciudades reclaman un fondo federal compensatorio ante la escalada del boleto.',
    url: 'https://www.pagina12.com.ar',
    publishedAt: 'Hace 21 min'
  },
  {
    id: 'live-4',
    outletId: 'cronista',
    outletName: 'El Cronista',
    title: 'Energía y gasoductos: el sector privado confirma inversiones por USD 2.300 millones en Vaca Muerta',
    snippet: 'Consorcio de empresas proyecta duplicar la capacidad de evacuación de crudo hacia puertos del Atlántico.',
    url: 'https://www.cronista.com',
    publishedAt: 'Hace 28 min'
  }
];

export const MOCK_FOREIGN_STORIES: StoryCluster[] = [
  {
    id: 'foreign-1',
    neutralHeadline: 'Prensa internacional analiza el programa de estabilización económica y la reconfiguración geopolítica argentina',
    category: 'Mirada Exterior',
    summary: 'Corresponsales extranjeros y centros de estudios evalúan la solidez del superávit fiscal, el alineamiento con Estados Unidos y el costo social de las reformas de shock.',
    updatedAt: 'Hace 35 minutos',
    spectrum: {
      oficialismoPct: 35,
      centroDatosPct: 40,
      oposicionPct: 25,
      totalOutlets: 3
    },
    aiComparisonNotice: 'Los medios anglosajones de negocios destacan la disciplina macroeconómica y el interés inversor; los diarios europeos de centro-izquierda enfatizan las tensiones de gobernabilidad y el aumento de la pobreza.',
    articles: [
      {
        id: 'for-1-ft',
        outletId: 'ft',
        outletName: 'Financial Times',
        title: "Argentina's fiscal turnaround catches Wall Street's eye despite political headwinds",
        snippet: 'Investors praise Milei’s budget discipline, though questions linger over the sustainability of deep spending cuts and congressional backing.',
        url: 'https://www.ft.com',
        publishedAt: 'Hace 38 min',
        specificFocus: 'Disciplina presupuestaria y apetito de inversores'
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
        specificFocus: 'Reordenamiento diplomático y alianzas estratégicas'
      }
    ]
  }
];
