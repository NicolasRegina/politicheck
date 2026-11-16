import type { StoryCluster, Article } from '../types';

export const isBrazilElectionActive = false;

export const brazilElectionMetadata = {
  title: 'Elecciones Presidenciales Brasil 2026',
  round: 'Balotaje Presidencial & Renovación del Congreso',
  date: '25 de Octubre 2026',
  electorate: '+156 millones de ciudadanos habilitados',
  system: 'Voto electrónico biométrico auditado por el Tribunal Superior Electoral (TSE)',
  description: 'Archivo y análisis del balotaje presidencial en la mayor economía de América Latina entre Lula da Silva y Flávio Bolsonaro, y su impacto comercial, diplomático y energético en la Argentina y el Mercosur.'
};

export const brazilElectionClusters: StoryCluster[] = [
  {
    id: 'brasil-2026-balotaje-presidencial',
    kicker: 'ELECCIONES BRASIL 2026 • PALACIO DEL PLANALTO',
    neutralHeadline: 'Elecciones en Brasil 2026: Lula da Silva y Flávio Bolsonaro definen la presidencia en un balotaje polarizado y con empate técnico',
    category: 'Internacional',
    summary: 'Más de 156 millones de electores definieron en octubre de 2026 la presidencia de Brasil en una segunda vuelta de máxima tensión política y judicial. En la recta final, las encuestas marcan un recorte en la ventaja previa de Flávio Bolsonaro hacia el empate técnico con Lula da Silva, mientras el oficialismo exige ante el Tribunal Superior Electoral investigar presunta interferencia algorítmica de Meta y levantar secretos bancarios.',
    updatedAt: 'Octubre 2026',
    timestamp: 1792534500000,
    imageUrl: '/images/brasil-planalto.jpg',
    imageCaption: 'El Palácio do Planalto en Brasília, sede del Poder Ejecutivo de la República Federativa de Brasil.',
    isLeadStory: true,
    spectrum: {
      oficialismoPct: 43,
      centroDatosPct: 57,
      oposicionPct: 0,
      totalOutlets: 7
    },
    aiComparisonNotice: 'La Nación y Todo Noticias (TN) enfatizan la ofensiva judicial del oficialismo ante el TSE —tanto para impugnar la candidatura rival por el caso Meta como para exponer cuentas patrimoniales—; El Cronista y El Economista priorizan el giro demoscópico tras el último debate televisivo; mientras que Perfil y Crónica detallan el ultimátum judicial a Meta y los operativos periodísticos de cobertura.',
    articles: [
      {
        id: 'art-lanacion-22265657933',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'Elecciones Brasil 2026, EN VIVO: encuestas, final de las campañas para el balotaje y el minuto a minuto',
        snippet: 'Lula da Silva y Flávio Bolsonaro, se enfrentán en las urnas este domingo 25 de octubre; qué dicen las encuestas',
        url: 'https://www.lanacion.com.ar/el-mundo/elecciones-brasil-2026-en-vivo-encuestas-final-de-las-campanas-para-el-balotaje-y-el-minuto-a-minuto-nid20102026/',
        publishedAt: 'Hace 11 min',
        timestamp: 1792534500000,
        specificFocus: 'Cobertura minuto a minuto, encuestas y cierre de campaña',
        framingSummary: 'Seguimiento en directo de la agenda electoral rumbo al domingo 25 de octubre'
      },
      {
        id: 'art-lanacion-22668555986',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'Lula desafía a Bolsonaro a revelar sus cuentas y prepara una ofensiva judicial para impugnar su candidatura',
        snippet: 'A cinco días del balotaje y con las encuestas al límite del empate técnico, el presidente pidió levantar el secreto bancario, fiscal y telefónico de ambas familias',
        url: 'https://www.lanacion.com.ar/el-mundo/lula-desafia-a-bolsonaro-a-revelar-sus-cuentas-y-prepara-una-ofensiva-judicial-para-impugnar-su-nid20102026/',
        publishedAt: '17:03 hs',
        timestamp: 1792526609000,
        specificFocus: 'Estrategia judicial y pedido de apertura de secreto fiscal',
        framingSummary: 'Foco en la ofensiva legal del oficialismo en la semana decisiva'
      },
      {
        id: 'art-tn-781259651',
        outletId: 'tn',
        outletName: 'Todo Noticias (TN)',
        title: 'A días del balotaje en Brasil, Lula pedirá que anulen la candidatura de Flávio Bolsonaro por una supuesta “interferencia” de Meta',
        snippet: 'El recurso será presentado ante el Tribunal Superior Electoral. Según fuentes de la campaña del presidente brasileño, se detectó una presunta “manipulación algorítmica” del gigante tecnológico.',
        url: 'https://tn.com.ar/internacional/2026/10/20/a-dias-del-balotaje-en-brasil-lula-pedira-anular-la-candidatura-de-flavio-bolsonaro-por-una-supuesta-interferencia-de-meta/',
        publishedAt: '15:10 hs',
        timestamp: 1792519808000,
        specificFocus: 'Recurso ante el TSE por supuesta manipulación algorítmica',
        framingSummary: 'Cobertura de la denuncia de campaña contra plataformas digitales'
      },
      {
        id: 'art-perfil-10384032300',
        outletId: 'perfil',
        outletName: 'Perfil',
        title: 'Brasil: ultimátum a Meta para que explique si favoreció a Flávio Bolsonaro y elevó la multa a US$ 200.000 diarios',
        snippet: 'La campaña de Lula da Silva denunció que la empresa restringió la difusión de sus contenidos y favoreció a su rival, al advertir que la sucesión de fallas técnicas “levanta fuertes sospechas” de un in',
        url: 'https://www.perfil.com/noticias/internacional/la-justicia-de-brasil-le-dio-un-ultimatum-a-meta-para-explicar-si-favorecio-a-flavio-bolsonaro-y-elevo-la-multa-a-us-200000-diarios.phtml',
        publishedAt: '16:06 hs',
        timestamp: 1792523160000,
        specificFocus: 'Sanción pecuniaria y resolución de la Justicia electoral sobre Meta',
        framingSummary: 'Encuadre institucional sobre la intimación judicial y las multas diarias'
      },
      {
        id: 'art-cronista-2802754191',
        outletId: 'cronista',
        outletName: 'El Cronista',
        title: 'Lula le recorta más de 3 puntos de ventaja a Bolsonaro: qué variables cambiaron y pronostican un resultado cerrado para la segunda vuelta',
        snippet: 'Después de la victoria en primera vuelta, Bolsonaro parecía encaminarse a un triunfo seguro, pero el último sondeo de una importante encuestadora muestra al actual presidente recortando la ventaja y p',
        url: 'https://www.cronista.com/economia-politica/lula-le-recorta-mas-de-3-puntos-de-ventaja-a-bolsonaro-que-variables-cambiaron-y-pronostican-un-resultado-cerrado-para-la-segunda-vuelta/',
        publishedAt: '19/10',
        timestamp: 1792428742000,
        specificFocus: 'Tendencia de encuestas y recorte de brecha electoral',
        framingSummary: 'Lectura cuantitativa sobre la evolución de los sondeos hacia un final cerrado'
      },
      {
        id: 'art-eleconomista-2706032653',
        outletId: 'eleconomista',
        outletName: 'El Economista',
        title: 'Tras el debate presidencial, Lula le pisa los talones a Bolsonaro',
        snippet: 'El balotaje presidencial se celebrará en Brasil el próximo 25 de octubre',
        url: 'https://eleconomista.com.ar/internacional/tras-debate-presidencial-lula-le-pisa-talones-bolsonaro-n98996',
        publishedAt: '19/10',
        timestamp: 1792432800000,
        specificFocus: 'Impacto del debate presidencial en la intención de voto',
        framingSummary: 'Análisis sintético sobre la paridad posterior al debate televisivo'
      },
      {
        id: 'art-cronica-3395310875',
        outletId: 'cronica',
        outletName: 'Crónica',
        title: 'Lula o Bolsonaro: Crónica tendrá una cobertura especial de 72 horas de las elecciones en Brasil con Melina Fleiderman',
        snippet: 'La conductora estará al frente de un despliegue especial por la segunda vuelta del domingo 25 de octubre, en la que Lula da Silva y Flávio Bolsonaro definen quién gobernará el principal socio comercia',
        url: 'https://www.cronica.com.ar/cronicahd/lula-o-bolsonaro-cronica-tendra-una-cobertura-especial-de-72-horas-de-las-elecciones-en-brasil-con-melina-fleiderman/',
        publishedAt: '17:19 hs',
        timestamp: 1792527569000,
        specificFocus: 'Relevancia bilateral para Argentina y despliegue de cobertura',
        framingSummary: 'Enfoque periodístico local centrado en el impacto del socio comercial argentino'
      }
    ]
  },
  {
    id: 'brasil-2026-tension-diplomatica-milei-lula',
    kicker: 'RELACIÓN BILATERAL • ITAMARATY & CASA ROSADA',
    neutralHeadline: 'Tensión diplomática entre Argentina y Brasil: cruce entre Javier Milei e Itamaraty a días del balotaje presidencial',
    category: 'Política',
    summary: 'El Ministerio de Relaciones Exteriores de Brasil emitió un contundente comunicado calificando de "injerencia extranjera inaceptable" y "manifestación antidemocrática" las expresiones de Javier Milei, quien insultó a Lula da Silva en redes sociales y puso en duda la transparencia de los comicios mientras respaldaba públicamente a Flávio Bolsonaro.',
    updatedAt: 'Octubre 2026',
    timestamp: 1792531140000,
    imageUrl: 'https://fotos.perfil.com/2025/12/20/trim/800/450/lula-y-milei-posando-en-la-foto-protocolar-de-saludo-en-el-mercosur-2156928.jpg',
    imageCaption: 'Cruce diplomático entre Buenos Aires y Brasilia en la previa de la segunda vuelta presidencial.',
    spectrum: {
      oficialismoPct: 17,
      centroDatosPct: 50,
      oposicionPct: 33,
      totalOutlets: 6
    },
    aiComparisonNotice: 'BAE Negocios y Ámbito Financiero ponen el acento en la acusación de injerencia y el alineamiento explícito del presidente argentino con Flávio Bolsonaro; La Nación y Clarín contextualizan la respuesta oficial de la Cancillería brasileña defendiendo la limpieza del voto electrónico; mientras que Perfil y El Cronista subrayan la escalada retórica previa al domingo electoral.',
    articles: [
      {
        id: 'art-baenegocios-2982953662',
        outletId: 'baenegocios',
        outletName: 'BAE Negocios',
        title: 'Brasil acusó a Milei de injerencia electoral tras sus insultos a Lula',
        snippet: 'La Cancillería brasileña calificó de "antidemocráticas" las declaraciones del Presidente argentino, quien acusó a Lula de "zurdo ladrón".',
        url: 'https://www.baenegocios.com/politica/brasil-acuso-a-milei-de-injerencia-electoral-tras-sus-insultos-a-lula/',
        publishedAt: '18:19 hs',
        timestamp: 1792531140000,
        specificFocus: 'Reacción de Itamaraty frente a las acusaciones presidenciales',
        framingSummary: 'Titular directo enfocado en el cargo formal de injerencia electoral'
      },
      {
        id: 'art-perfil-8797906850',
        outletId: 'perfil',
        outletName: 'Perfil',
        title: 'El Gobierno de Brasil rechazó el "intento de injerencia extranjera" de Javier Milei tras sus insultos a Lula',
        snippet: 'En un comunicado, la Cancillería brasileña calificó las declaraciones del mandatario argentino de “inaceptables” y defendió la transparencia de su sistema electoral. Leer más',
        url: 'https://www.perfil.com/noticias/internacional/el-ministerio-de-asuntos-exteriores-de-brasil-rechazo-el-intento-de-injerencia-extranjera-de-javier-milei-tras-sus-insultos-a-lula.phtml',
        publishedAt: '17:41 hs',
        timestamp: 1792528860000,
        specificFocus: 'Defensa institucional del sistema electoral brasileño',
        framingSummary: 'Cita textual del rechazo diplomático y respaldo al TSE'
      },
      {
        id: 'art-lanacion-15852441037',
        outletId: 'lanacion',
        outletName: 'La Nación',
        title: 'La Cancillería brasileña emitió un duro comunicado contra Milei por el ataque a Lula da Silva',
        snippet: 'El Presidente lo tildó de “zurdo ladrón” e insinuó que podría manipular los resultados electorales; el Ministerio de Relaciones Exteriores se refirió a la ofensiva como una “manifestación antidemocrát',
        url: 'https://www.lanacion.com.ar/politica/la-cancilleria-brasilena-emitio-un-duro-comunicado-contra-milei-por-el-ataque-a-lula-da-silva-nid20102026/',
        publishedAt: '17:39 hs',
        timestamp: 1792528756000,
        specificFocus: 'Alcance del comunicado de Relaciones Exteriores de Brasil',
        framingSummary: 'Relato de los dichos sobre posible manipulación de resultados y réplica oficial'
      },
      {
        id: 'art-clarin-1689737033',
        outletId: 'clarin',
        outletName: 'Clarín',
        title: 'El gobierno de Brasil le contestó a Milei por los nuevos insultos contra Lula y lo acusó de "reiterar mentiras"',
        snippet: 'Fue a través de un comunicado y en respuesta al libertario, que este martes escribió que esperaba que "el zurdo ladrón", y "machirulo" -en referencia a Lula- "no se robe la elección".',
        url: 'https://www.clarin.com/politica/gobierno-brasil-contesto-milei-nuevos-insultos-lula-acuso-reiterar-mentiras_0_SwbjgTLvIr.html',
        publishedAt: '16:58 hs',
        timestamp: 1792526321000,
        specificFocus: 'Cruce por redes sociales y respuesta de Brasilia',
        framingSummary: 'Recorte sobre la secuencia de publicaciones en X y la acusación de reiterar falsedades'
      },
      {
        id: 'art-cronista-4160789996',
        outletId: 'cronista',
        outletName: 'El Cronista',
        title: '“Injerencia inaceptable”: la dura respuesta de Brasil a Milei tras acusar a Lula de “ladrón” y agitar un fraude',
        snippet: 'A pocos días del balotaje que definirá al próximo presidente de Brasil, el mandatario argentino volvió a respaldar a Flávio Bolsonaro y lanzó fuertes críticas contra Lula da Silva.',
        url: 'https://www.cronista.com/economia-politica/zurdo-ladron-milei-apunto-contra-lula-y-advirtio-por-un-posible-fraude-en-las-elecciones-de-brasil/',
        publishedAt: '11:46 hs',
        timestamp: 1792507598000,
        specificFocus: 'Alineamiento político con Flávio Bolsonaro y riesgo de fricción bilateral',
        framingSummary: 'Análisis de la advertencia de fraude y el impacto en la relación diplomática'
      },
      {
        id: 'art-ambito-9324442721',
        outletId: 'ambito',
        outletName: 'Ámbito Financiero',
        title: 'Javier Milei advirtió sobre un posible fraude de Lula da Silva en el balotaje de Brasil',
        snippet: 'El Presidente acusó a su par brasileño de impulsar una campaña sucia y deslizó que podría intentar robarse la elección. Lo hizo a través de X, en respaldo a Flávio Bolsonaro, quien enfrentará al actua',
        url: 'https://www.ambito.com/politica/javier-milei-advirtio-un-posible-fraude-lula-da-silva-el-balotaje-brasil-n6335725',
        publishedAt: '11:02 hs',
        timestamp: 1792504920000,
        specificFocus: 'Declaraciones presidenciales y respaldo al bloque opositor brasileño',
        framingSummary: 'Cobertura de la denuncia de campaña sucia previa a la respuesta de Itamaraty'
      }
    ]
  },
  {
    id: 'brasil-2026-impacto-mercosur-argentina',
    kicker: 'ECONOMÍA & SOCIEDAD • MODELOS EN PUGNA',
    neutralHeadline: 'Modelos económicos en pugna en Brasil: ajuste fiscal, subsidios, empleo en apps y el impacto comercial en la región',
    category: 'Economía',
    summary: 'Más allá de la polarización discursiva, la elección brasileña enfrenta propuestas económicas y alianzas sociales contrastantes: desde el sostenimiento de subsidios sociales y el debate sobre la precarización en plataformas digitales (Uber y apps) hasta el peso del electorado evangélico, las redes de consultoría regional y la presión comercial sobre el Mercosur.',
    updatedAt: 'Octubre 2026',
    timestamp: 1792532907000,
    imageUrl: '/images/mercados.jpg',
    imageCaption: 'El rumbo económico y comercial de Brasil condiciona los flujos industriales y del Mercosur.',
    spectrum: {
      oficialismoPct: 0,
      centroDatosPct: 60,
      oposicionPct: 40,
      totalOutlets: 5
    },
    aiComparisonNotice: 'El Cronista (vía Financial Times) profundiza en la paradoja del récord de empleo combinado con dos millones de trabajadores informales en aplicaciones; elDiarioAR compara las trayectorias fiscales y el peso del bloque pentecostal a favor de Flávio Bolsonaro; Infobae destaca el cruce por los subsidios sociales; y France 24 aporta la dimensión regional de los consultores políticos.',
    articles: [
      {
        id: 'art-infobae-5057117408',
        outletId: 'infobae',
        outletName: 'Infobae',
        title: 'Lula acusa a Bolsonaro de querer eliminar histórico subsidio a cinco días de los comicios',
        snippet: '',
        url: 'https://www.infobae.com/america/agencias/2026/10/20/lula-acusa-a-bolsonaro-de-querer-eliminar-historico-subsidio-a-cinco-dias-de-los-comicios/',
        publishedAt: 'Hace 38 min',
        timestamp: 1792532907000,
        specificFocus: 'Disputa por la continuidad de programas y subsidios sociales',
        framingSummary: 'Cable de agencia centrado en el eje de protección social durante la campaña'
      },
      {
        id: 'art-cronista-15117691007',
        outletId: 'cronista',
        outletName: 'El Cronista',
        title: 'Brasil tiene empleo récord, pero 2 millones de trabajadores viven de Uber y otras apps: el desafío de Lula',
        snippet: 'La economía de plataformas se convirtió en una red de contención informal, mientras las sólidas cifras generales del país esconden un fuerte descontento',
        url: 'https://www.cronista.com/financial-times/brasil-tiene-empleo-record-pero-2-millones-de-trabajadores-viven-de-uber-y-otras-apps-el-desafio-de-lula/',
        publishedAt: '15:38 hs',
        timestamp: 1792521526000,
        specificFocus: 'Mercado laboral, economía de plataformas y malestar salarial',
        framingSummary: 'Análisis socioeconómico de Financial Times sobre el descontento pese al bajo desempleo'
      },
      {
        id: 'art-eldiarioar-2970715702',
        outletId: 'eldiarioar',
        outletName: 'elDiarioAR',
        title: 'Ajuste fiscal frente a gasto público: los modelos económicos de Lula y Bolsonaro se enfrentan en las urnas',
        snippet: 'Las propuestas económicas no están protagonizando el debate de la campaña electoral de Brasil. El ajuste fiscal del gobierno de Jair Bolsonaro y políticas públicas expansivas de gasto público del gobi',
        url: 'https://www.eldiarioar.com/latinoamerica/ajuste-fiscal-frente-gasto-publico-modelos-economicos-lula-bolsonaro-enfrentan-urnas_1_13598566.html',
        publishedAt: '06:24 hs',
        timestamp: 1792488287000,
        specificFocus: 'Comparativa macroeconómica entre ajuste fiscal y expansión del gasto',
        framingSummary: 'Contrastación estructural de los dos programas económicos en competencia'
      },
      {
        id: 'art-eldiarioar-10456960640',
        outletId: 'eldiarioar',
        outletName: 'elDiarioAR',
        title: 'Padre, hijo y el voto del Espíritu Santo: la alianza entre ultraderecha y evangélicos para tumbar a la izquierda en Brasil',
        snippet: 'Aunque con menos entusiasmo que el que llevó a Jair Bolsonaro a la presidencia en 2018, líderes de las iglesias pentecostales se alinean con su hijo Flávio en una segunda vuelta que puede completar el',
        url: 'https://www.eldiarioar.com/mundo/padre-hijo-voto-espiritu-santo-alianza-ultraderecha-evangelicos-tumbar-izquierda-brasil_1_13578011.html',
        publishedAt: '13/10',
        timestamp: 1791888558000,
        specificFocus: 'Base electoral evangélica y dinámica territorial conservadora',
        framingSummary: 'Crónica sociopolítica sobre el alineamiento de liderazgos religiosos en el balotaje'
      },
      {
        id: 'art-france24-12331774553',
        outletId: 'france24',
        outletName: 'France 24',
        title: 'La caída de Fernando Cerimedo, el controvertido consultor detrás de las derechas latinoamericanas',
        snippet: 'Conocido por haber asesorado a políticos como Javier Milei y Jair Bolsonaro, el argentino Fernando Cerimedo es investigado en Bolivia por "tentativa de feminicidio" contra su expareja, Nadia Beller. E',
        url: 'https://www.france24.com/es/am%C3%A9rica-latina/20261018-la-ca%C3%ADda-de-fernando-cerimedo-el-controvertido-consultor-detr%C3%A1s-de-las-derechas-latinoamericanas',
        publishedAt: '18/10',
        timestamp: 1792357410000,
        specificFocus: 'Redes de consultoría política entre Argentina y Brasil',
        framingSummary: 'Perfil internacional sobre estrategias digitales compartidas en la región'
      }
    ]
  }
];

export const brazilElectionDispatches: Article[] = [
  {
    id: 'art-perfil-14731327004',
    outletId: 'perfil',
    outletName: 'Perfil',
    title: 'RDC: qué deben corregir Lula da Silva y Flávio Bolsonaro antes del debate del viernes',
    snippet: 'Según indicó la analista, Eleonora Gosman, en Ronda de Corresponsales (RDC), a Lula se lo vio “muy cansado y con pocas propuestas”, mientras que a Flávio Bolsonaro “llamó la atención muy negativamente',
    url: 'https://www.perfil.com/noticias/masperfil/rdc-como-se-vio-a-lula-da-silva-y-flavio-bolsonaro-en-el-ultimo-debate-presidencial.phtml',
    publishedAt: '17:05 hs',
    timestamp: 1792526717000,
    imageUrl: 'https://fotos.perfil.com/2026/10/20/trim/800/450/lula-y-bolsonaro-2352703.jpg'
  },
  {
    id: 'art-lanacion-10778311457',
    outletId: 'lanacion',
    outletName: 'La Nación',
    title: 'Elecciones en Brasil 2026, segunda vuelta en Miami y de cuánto es la multa que debo pagar si no voto en Estados Unidos',
    snippet: 'Conocé dónde y a qué hora votar en Miami en la segunda vuelta de las elecciones de Brasil 2026, cuánto cuesta la multa por no votar y cómo justificar la ausencia',
    url: 'https://www.lanacion.com.ar/estados-unidos/florida/elecciones-en-brasil-2026-segunda-vuelta-en-miami-y-de-cuanto-es-la-multa-que-debo-pagar-si-no-voto-nid20102026/',
    publishedAt: '16:53 hs',
    timestamp: 1792526016000
  },
  {
    id: 'art-perfil-18660008841',
    outletId: 'perfil',
    outletName: 'Perfil',
    title: 'Elecciones en Brasil: en RDC se alertó por cambios en los lugares de votación antes de la segunda vuelta',
    snippet: 'Con respecto a las alteraciones en los lugares de votación, la analista, Eleonora Gosman, comentó en Ronda de Corresponsales (RDC) que, “esto es muy, muy peligroso”. Leer más',
    url: 'https://www.perfil.com/noticias/masperfil/elecciones-en-brasil-en-rdc-se-alerto-por-cambios-en-los-lugares-de-votacion-antes-de-la-segunda-vuelta.phtml',
    publishedAt: '16:11 hs',
    timestamp: 1792523490000
  },
  {
    id: 'art-baenegocios-14970751524',
    outletId: 'baenegocios',
    outletName: 'BAE Negocios',
    title: 'Milei advirtió sobre un posible fraude electoral en Brasil e insultó a Lula: "Zurdo ladrón"',
    snippet: 'El Presidente puso en duda la transparencia de la elección del domingo en Brasil.',
    url: 'https://www.baenegocios.com/politica/milei-advirtio-sobre-un-posible-fraude-electoral-en-brasil-e-insulto-a-lula-zurdo-ladron/',
    publishedAt: '13:14 hs',
    timestamp: 1792512840000
  },
  {
    id: 'art-cronica-3516564617',
    outletId: 'cronica',
    outletName: 'Crónica',
    title: 'La frase de Lula sobre las mujeres que Milei criticó: "En su día libre tienen que limpiar la casa"',
    snippet: 'El mandatario de Brasil habló del trabajo doméstico de las mujeres y el jefe de Estado argentino lo tildó de "machirulo".',
    url: 'https://www.cronica.com.ar/politica/la-frase-de-lula-sobre-las-mujeres-que-milei-critico-en-su-dia-libre-tienen-que-limpiar-la-casa/',
    publishedAt: '12:40 hs',
    timestamp: 1792510800000
  },
  {
    id: 'art-ambito-16884811773',
    outletId: 'ambito',
    outletName: 'Ámbito Financiero',
    title: 'Javier Milei busca respaldar a la derecha española en un viaje con mal timing político',
    snippet: 'Isabel Díaz Ayuso dijo que el encuentro todavía no estaba cerrado y el líder de Vox, Santiago Abascal, seguirá con sus actos de campaña. El Presidente volvió a cargar contra Lula da Silva y agitó la p',
    url: 'https://www.ambito.com/politica/javier-milei-llego-madrid-respaldar-la-derecha-espanola-pero-su-agenda-esta-duda-n6335777',
    publishedAt: '12:16 hs',
    timestamp: 1792509360000
  },
  {
    id: 'art-eleconomista-7219668303',
    outletId: 'eleconomista',
    outletName: 'El Economista',
    title: '¿Mano negra de Meta en Brasil?: la plataforma estaría perjudicando a Lula y favoreciendo la campaña de Bolsonaro',
    snippet: 'La empresa de Mark Zuckerberg estaría interviniendo de manera deliberada en las elecciones de Brasil',
    url: 'https://eleconomista.com.ar/internacional/mano-negra-meta-brasil-plataforma-estaria-perjudicando-lula-favoreciendo-campana-bolsonaro-n98925',
    publishedAt: '16/10',
    timestamp: 1792168080000
  },
  {
    id: 'art-derechadiario-1068892756',
    outletId: 'derechadiario',
    outletName: 'La Derecha Diario',
    title: 'El Ejército argentino realizó maniobras y ejercicios de tiro con tanques junto al Ejército brasileño',
    snippet: 'Unos 2.000 efectivos de Argentina y Brasil participan en Arandú 2026, un ejercicio combinado en Rio Grande do Sul que incluye maniobras y prácticas de tiro con tanques TAM 2C-A2 y otros vehículos mili',
    url: 'https://derechadiario.com.ar/politica/ejercito-argentino-realizo-maniobras-ejercicios-tiro-tanques-junto-ejercito-brasileno',
    publishedAt: '16/10',
    timestamp: 1792158505000
  },
  {
    id: 'art-cronista-4391288415',
    outletId: 'cronista',
    outletName: 'El Cronista',
    title: 'La carne argentina cambia de destino: quién gana mientras cae el consumo',
    snippet: 'Con una oferta global que cierra años de expansión y Brasil bajo presión comercial, Argentina encuentra oportunidades afuera, pero la venta local se desploma',
    url: 'https://www.cronista.com/economia-politica/la-carne-argentina-cambia-de-destino-quien-gana-mientras-cae-el-consumo/',
    publishedAt: '13:04 hs',
    timestamp: 1792512241000
  }
];

const BRAZIL_INCLUDE_REGEX = /\b(brasil|brasileñ[oa]s?|lula|bolsonaro|balotaje|itamaraty|planalto)\b/i;
const BRAZIL_EXCLUDE_REGEX = /futbol|vasco|boca|copa|libertadores|caribe|samba|netflix|pavos|granja|rosatti|cadillac|dani-alves|botellas/i;

export function getLiveBrazilDispatches(liveArticles: Article[] = []): Article[] {
  const filteredLive = liveArticles.filter((article) => {
    const text = `${article.title || ''} ${article.snippet || ''} ${article.url || ''}`;
    return BRAZIL_INCLUDE_REGEX.test(text) && !BRAZIL_EXCLUDE_REGEX.test(text);
  });

  const combined = [...filteredLive, ...brazilElectionDispatches];
  const seenUrls = new Set<string>();
  const unique: Article[] = [];

  for (const article of combined) {
    const normalizedUrl = (article.url || '').split('?')[0].toLowerCase().trim();
    if (!normalizedUrl || seenUrls.has(normalizedUrl)) continue;
    seenUrls.add(normalizedUrl);
    unique.push(article);
  }

  return unique;
}
