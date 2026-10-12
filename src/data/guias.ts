export interface GuiaFaqItem {
  question: string;
  answer: string;
}

export type GuiaCategory = 'propiedad' | 'lineas_editoriales' | 'metodologia' | 'financiamiento';

export interface GuiaArticle {
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  category: GuiaCategory;
  categoryLabel: string;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  author: string;
  excerpt: string;
  heroImageUrl?: string;
  imageCaption?: string;
  status: 'publicado' | 'proximamente';
  sources: string[];
  faq: GuiaFaqItem[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  targetSnippet: string;
  content: {
    leadHtml: string;
    sections: Array<{
      id: string;
      title: string;
      bodyHtml: string;
    }>;
  };
}

export const GUIAS_ARTICLES: GuiaArticle[] = [
  {
    slug: 'quien-es-el-dueno-de-clarin',
    title: '¿Quién es el Dueño de Clarín? Estructura del Grupo, Accionistas y Línea Editorial',
    subtitle: 'Radiografía societaria y periodística de Grupo Clarín S.A.: quiénes integran GC Dominio S.A., empresas controladas y cómo se audita su sesgo informativo.',
    kicker: 'Cuaderno 01 • Estructura de Medios',
    category: 'propiedad',
    categoryLabel: 'Propiedad & Grupos',
    publishedAt: '12 de Octubre, 2026',
    updatedAt: '12 de Octubre, 2026',
    readTimeMinutes: 7,
    author: 'Equipo de Datos de Politicheck',
    excerpt: 'El diario Clarín pertenece a Grupo Clarín S.A., con control mayoritario de Héctor Magnetto, José Aranda, Lucio Pagliaro y los herederos de Ernestina Herrera de Noble a través de GC Dominio S.A.',
    heroImageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'El holding periodístico y audiovisual concentra más de 70 años de historia editorial en Argentina.',
    status: 'publicado',
    sources: [
      'Comisión Nacional de Valores (CNV Argentina)',
      'Bolsas y Mercados Argentinos (BYMA)',
      'Media Ownership Monitor (MOM / Reporteros Sin Fronteras)',
      'AllSides & Media Bias/Fact Check (MBFC)'
    ],
    metaTitle: '¿Quién es el Dueño de Clarín? Accionistas y Grupo (2026)',
    metaDescription: 'Conocé quiénes son los dueños de Clarín: la estructura del Grupo Clarín S.A., Héctor Magnetto, accionistas, empresas controladas y su línea editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/quien-es-el-dueno-de-clarin',
    targetSnippet: 'El diario Clarín pertenece al Grupo Clarín S.A. Su control accionario mayoritario está en manos de Héctor Magnetto, José Antonio Aranda, Lucio Pagliaro y los herederos de Ernestina Herrera de Noble mediante la sociedad GC Dominio S.A. (70,99% de derechos de voto).',
    faq: [
      {
        question: '¿Quién es el dueño del diario Clarín?',
        answer: 'El diario Clarín pertenece a Grupo Clarín S.A., controlado mayoritariamente por GC Dominio S.A., sociedad cuyos titulares principales son Héctor Magnetto, José Antonio Aranda, Lucio Rafael Pagliaro y los hijos herederos de Ernestina Herrera de Noble (Marcela y Felipe Noble Herrera).'
      },
      {
        question: '¿El Estado argentino tiene acciones en Clarín?',
        answer: 'Sí. A través del Fondo de Garantía de Sustentabilidad (FGS) de la ANSES, el Estado Nacional conserva un 8,9% del capital social ordinario, participación heredada en 2008 tras la estatización de los fondos de las AFJP. Dicho paquete minoritario no otorga control de la línea editorial.'
      },
      {
        question: '¿Clarín es dueño de Telecom y de la señal TN?',
        answer: 'Sí. En el área audiovisual, Artear (Artes Radiotelevisivas Argentinas) opera Canal 13 y la señal Todo Noticias (TN). En telecomunicaciones, los mismos accionistas controlan Cablevisión Holding S.A., empresa con participación determinante en Telecom Argentina y Personal.'
      },
      {
        question: '¿Dónde puedo comparar las noticias de Clarín con otros diarios?',
        answer: 'En Politicheck (www.politicheck.com.ar), plataforma cívica donde cada noticia de portada se analiza junto a más de 30 redacciones con una barra tricolor de distribución de sesgo editorial (oficialismo, centro y oposición).'
      }
    ],
    content: {
      leadHtml: `<p class="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
        <strong>¿Quién es el dueño de Clarín?</strong> El diario Clarín pertenece al <strong>Grupo Clarín S.A.</strong>, el conglomerado de medios y telecomunicaciones más influyente de Argentina. El control accionario mayoritario y la dirección ejecutiva están en manos de un consorcio histórico liderado por <strong>Héctor Magnetto</strong>, junto a <strong>José Antonio Aranda</strong>, <strong>Lucio Rafael Pagliaro</strong> y los herederos de <strong>Ernestina Herrera de Noble</strong>. A través de la sociedad controlante GC Dominio S.A., este grupo retiene más del <strong>70% de los derechos de voto</strong> corporativos.
      </p>
      <p class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        Comprender la estructura de propiedad del diario no es un mero ejercicio societario: es la clave metodológica para analizar cómo construye su agenda de noticias, qué intereses empresariales defiende y de qué manera condiciona el debate público en el país.
      </p>`,
      sections: [
        {
          id: 'composicion-accionaria',
          title: '1. Composición Accionaria: ¿Quiénes tienen las acciones de Clarín?',
          bodyHtml: `<p>A diferencia de los portales informativos unipersonales o los diarios sostenidos exclusivamente por pauta gubernamental, Clarín es una sociedad anónima abierta que cotiza en Bolsas y Mercados Argentinos (BYMA) y en el mercado bursátil internacional.</p>
          <p>No obstante, su estructura societaria está blindada mediante un esquema de acciones con derechos de voto diferenciados. De acuerdo con los balances públicos presentados ante la <strong>Comisión Nacional de Valores (CNV)</strong> y los relevamientos del <strong>Media Ownership Monitor (MOM / Reporteros Sin Fronteras)</strong>, la propiedad se divide en tres bloques principales:</p>
          
          <div class="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-slate-100 dark:bg-slate-900/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3 sm:p-4">Accionista / Grupo</th>
                  <th class="p-3 sm:p-4 text-center">Capital Aprox.</th>
                  <th class="p-3 sm:p-4">Rol y Toma de Decisiones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">GC Dominio S.A.<br><span class="text-[10px] text-slate-500 font-normal">Magnetto, Noble Herrera, Aranda, Pagliaro</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">70,99%</td>
                  <td class="p-3 sm:p-4">Control societario absoluto, designación del directorio y conducción editorial estratégica.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">Flotante Bursátil / Inversores Privados<br><span class="text-[10px] text-slate-500 font-normal">Acciones Clase B en BYMA</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">20,11%</td>
                  <td class="p-3 sm:p-4">Inversores institucionales, fondos y accionistas individuales de mercado sin peso en la dirección.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">FGS - ANSES (Estado Nacional)<br><span class="text-[10px] text-slate-500 font-normal">Estatización AFJP 2008</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">8,90%</td>
                  <td class="p-3 sm:p-4">Participación patrimonial estatal pasiva; no ejerce injerencia editorial directa.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 class="font-editorial text-lg font-bold text-slate-950 dark:text-white mt-4 mb-2">Los cuatro nombres clave del directorio</h4>
          <ul class="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Héctor Magnetto:</strong> Histórico CEO y presidente ejecutivo del holding. Considerado por analistas como el artífice de la transformación del diario en multimedios y su posterior salto a las telecomunicaciones.</li>
            <li><strong>Familia Noble Herrera (Marcela y Felipe Noble Herrera):</strong> Hijos y herederos de Ernestina Herrera de Noble, quien asumió la conducción tras la muerte de Roberto Noble en 1969.</li>
            <li><strong>José Antonio Aranda:</strong> Vicepresidente y directivo clave enfocado en la administración interna y diversificación agropecuaria del grupo.</li>
            <li><strong>Lucio Rafael Pagliaro:</strong> Director estratégico orientado a la comercialización publicitaria, producción audiovisual y marketing.</li>
          </ul>`
        },
        {
          id: 'empresas-del-grupo',
          title: '2. El Ecosistema Corporativo: ¿Qué otras empresas integran el Grupo Clarín?',
          bodyHtml: `<p>El diario impreso y el sitio web <code>clarin.com</code> representan solo la cabecera gráfica de un conglomerado que abarca televisión abierta, televisión de cable, señales de radio, agencias de noticias e industrias gráficas.</p>
          <p>En el periodo 2016-2017, el grupo completó una división corporativa estratégica entre <strong>Grupo Clarín S.A.</strong> (medios periodísticos y contenidos) y <strong>Cablevisión Holding S.A.</strong> (telecomunicaciones y conectividad con Telecom Argentina y Personal). Ambas entidades conservan a los mismos accionistas de referencia.</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1420]">
              <div class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Prensa & Digital</div>
              <ul class="space-y-1 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <li>• Diario Clarín (y Clarín.com)</li>
                <li>• Diario Deportivo Olé</li>
                <li>• Revista Viva y Revista Ñ</li>
                <li>• Participación en Papel Prensa S.A.</li>
              </ul>
            </div>
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1420]">
              <div class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Televisión & Radio</div>
              <ul class="space-y-1 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <li>• Artear (Canal 13 y El Doce de Córdoba)</li>
                <li>• Todo Noticias (TN)</li>
                <li>• Radio Mitre (AM 790)</li>
                <li>• La 100 (FM 99.9)</li>
              </ul>
            </div>
          </div>`
        },
        {
          id: 'linea-editorial-y-sesgo',
          title: '3. ¿Qué línea editorial tiene Clarín? Auditoría de Sesgo e Ideología',
          bodyHtml: `<p>En el estándar internacional de auditoría cruzada que aplica Politicheck siguiendo a <strong>Media Bias/Fact Check (MBFC)</strong> y <strong>AllSides</strong>, el diario Clarín se posiciona en las siguientes coordenadas:</p>
          <ul class="space-y-3 my-4 text-sm text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0"></span>
              <div><strong>Sesgo Editorial de Base:</strong> Clasificado como <em>Centro-Derecha</em> con rol contextual de <em>Oposición de Contraste</em>. Manifiesta una línea institucionalista y republicana con énfasis en la libertad de mercado, históricamente enfrentado a los gobiernos peronistas/kirchneristas y manteniendo una postura analítica y de fiscalización sobre la actual gestión libertaria.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
              <div><strong>Calidad Factual:</strong> Calificada como <em>Alta</em>. Dispone de un plantel profesional consolidado y rigurosidad documental en datos duros, aunque con fuerte utilización del encuadre adjetival en títulos principales.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-slate-500 mt-2 shrink-0"></span>
              <div><strong>Modelo de Financiamiento:</strong> <em>Privado Corporativo</em>. Sustentado en suscripciones digitales pagas, publicidad privada, eventos corporativos y ventas gráficas, sin dependencia crítica de pauta estatal.</div>
            </li>
          </ul>`
        },
        {
          id: 'encuadre-y-framing',
          title: '4. ¿Cómo opera el Encuadre (Framing) en las portadas de Clarín?',
          bodyHtml: `<p>El sesgo mediático contemporáneo casi nunca se basa en la invención de noticias falsas, sino en la elección del <strong>encuadre (framing)</strong>: la decisión deliberada de qué ángulo enfatizar de un hecho y qué aristas relegar al final del texto.</p>
          <p>Por ejemplo, ante un anuncio económico oficial sobre el índice de inflación o un balance fiscal:</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A] space-y-2 text-xs sm:text-sm font-sans">
            <p><strong>Enfoque de Clarín:</strong> Suele priorizar el impacto del costo de vida en el consumo de la clase media, la advertencia de consultoras privadas o las tensiones políticas de gabinete.</p>
            <p><strong>Enfoque oficialista:</strong> Suele remarcar la desaceleración del IPC y el logro fiscal del superávit primario.</p>
            <p><strong>Enfoque de izquierda / sindical:</strong> Suele enfatizar la pérdida del poder adquisitivo de jubilaciones y salarios y las protestas gremiales.</p>
          </div>
          <p>Al contrastar Clarín con otros medios, la clave ciudadana no es dejar de leerlo, sino <strong>cruzarlo</strong> con redacciones de otros encuadres para acceder a la totalidad de los datos.</p>`
        }
      ]
    }
  },
  {
    slug: 'quien-es-el-dueno-de-la-nacion',
    title: '¿Quién es el Dueño de La Nación? Grupo Saguier, Accionistas y Tradición Centenaria',
    subtitle: 'La historia societaria de S.A. La Nación: de los descendientes de Bartolomé Mitre al control de la familia Saguier, el canal LN+ y su perfil conservador institucional.',
    kicker: 'Cuaderno 02 • Estructura de Medios',
    category: 'propiedad',
    categoryLabel: 'Propiedad & Grupos',
    publishedAt: 'Próximamente',
    updatedAt: 'Octubre 2026',
    readTimeMinutes: 6,
    author: 'Equipo de Datos de Politicheck',
    excerpt: 'Análisis societario de S.A. La Nación, controlado por la familia Saguier (MNMS Holding), su incursión televisiva con LN+ y su posicionamiento en el espectro político argentino.',
    status: 'proximamente',
    sources: ['Inspección General de Justicia (IGJ)', 'Media Ownership Monitor', 'AllSides'],
    metaTitle: '¿Quién es el Dueño de La Nación? Familia Saguier y Accionistas (2026)',
    metaDescription: 'Descubrí quién controla Diario La Nación y la señal LN+: accionistas principales, la familia Saguier y su línea editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/quien-es-el-dueno-de-la-nacion',
    targetSnippet: 'El diario La Nación pertenece a S.A. La Nación, controlada mayoritariamente por la familia Saguier a través de MNMS Holding.',
    faq: [],
    content: { leadHtml: '', sections: [] }
  },
  {
    slug: 'quien-es-el-dueno-de-infobae',
    title: '¿Quién es el Dueño de Infobae? De Daniel Hadad a su Expansión Panregional',
    subtitle: 'Cómo se financia y gestiona el portal de noticias más leído del habla hispana: modelo de negocio, redacciones internacionales y línea de centro.',
    kicker: 'Cuaderno 03 • Estructura de Medios',
    category: 'propiedad',
    categoryLabel: 'Propiedad & Grupos',
    publishedAt: 'Próximamente',
    updatedAt: 'Octubre 2026',
    readTimeMinutes: 5,
    author: 'Equipo de Datos de Politicheck',
    excerpt: 'Radiografía del portal fundado por Daniel Hadad en 2002, su expansión por México, Colombia, España y EE.UU., y su estrategia algorítmica de cobertura.',
    status: 'proximamente',
    sources: ['Comscore Global', 'Reuters Institute', 'Media Bias/Fact Check'],
    metaTitle: '¿Quién es el Dueño de Infobae? Daniel Hadad y Finanzas (2026)',
    metaDescription: 'Quién es el propietario de Infobae, cómo se financia el medio digital de Daniel Hadad y cuál es su línea editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/quien-es-el-dueno-de-infobae',
    targetSnippet: 'Infobae pertenece al empresario y periodista Daniel Hadad, quien lo fundó en 2002 y lidera su expansión por Iberoamérica.',
    faq: [],
    content: { leadHtml: '', sections: [] }
  },
  {
    slug: 'mapa-de-medios-argentina-2026',
    title: 'Mapa del Ecosistema de Medios en Argentina: Grupos Económicos y Sesgo (2026)',
    subtitle: 'Guía integral de los 31 medios monitoreados: conglomerados corporativos, medios sindicales, estatales e independientes por suscripción.',
    kicker: 'Pilar • Mapa General',
    category: 'metodologia',
    categoryLabel: 'Metodología',
    publishedAt: 'Próximamente',
    updatedAt: 'Octubre 2026',
    readTimeMinutes: 10,
    author: 'Equipo Editorial de Politicheck',
    excerpt: 'La guía definitiva para comprender cómo se financian y alinean ideológicamente las 31 principales redacciones de Argentina y el mundo.',
    status: 'proximamente',
    sources: ['AllSides', 'MBFC', 'Reporteros Sin Fronteras', 'Politicheck'],
    metaTitle: 'Mapa de Medios en Argentina 2026: Grupos, Dueños y Sesgo Editorial',
    metaDescription: 'La guía más completa sobre los grupos de medios en Argentina: Clarín, La Nación, Indalo, Octubre, medios independientes y su financiamiento.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/mapa-de-medios-argentina-2026',
    targetSnippet: 'El ecosistema de medios en Argentina se divide entre holdings corporativos privados, grupos sindical-partidarios, medios públicos estatales y nuevos medios independientes de suscripción.',
    faq: [],
    content: { leadHtml: '', sections: [] }
  }
];

export function getGuiaBySlug(slug: string): GuiaArticle | undefined {
  return GUIAS_ARTICLES.find(a => a.slug === slug);
}
