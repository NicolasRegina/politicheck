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
  isoPublishedAt: string;
  isoUpdatedAt: string;
  readTimeMinutes: number;
  author: string;
  outletName?: string;
  faqTitle?: string;
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
    isoPublishedAt: '2026-10-12T00:00:00Z',
    isoUpdatedAt: '2026-10-12T00:00:00Z',
    readTimeMinutes: 7,
    author: 'Equipo de Datos de Politicheck',
    outletName: 'Clarín',
    faqTitle: 'Dudas Habituales sobre la Propiedad de Clarín',
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
        answer: 'En Politicheck (www.politicheck.com.ar), plataforma cívica donde cada noticia de portada se analiza junto a más de 30 redacciones con una barra de espectro editorial tripartito (oficialismo, centro y oposición).'
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
    title: '¿Quién es el Dueño de La Nación? Familia Saguier, Accionistas y Tradición Centenaria',
    subtitle: 'La historia societaria de S.A. La Nación: de los descendientes de Bartolomé Mitre al control de la familia Saguier (MNMS Holding), el canal LN+ y su perfil conservador institucional.',
    kicker: 'Cuaderno 02 • Estructura de Medios',
    category: 'propiedad',
    categoryLabel: 'Propiedad & Grupos',
    publishedAt: '12 de Octubre, 2026',
    updatedAt: '12 de Octubre, 2026',
    isoPublishedAt: '2026-10-12T00:00:00Z',
    isoUpdatedAt: '2026-10-12T00:00:00Z',
    readTimeMinutes: 7,
    author: 'Equipo de Datos de Politicheck',
    outletName: 'La Nación',
    faqTitle: 'Dudas Habituales sobre la Propiedad de La Nación',
    excerpt: 'El diario La Nación y la señal LN+ pertenecen a S.A. La Nación, con control mayoritario de la familia Saguier a través de MNMS Holding.',
    heroImageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Fundado en 1870 por Bartolomé Mitre, La Nación es el segundo periódico más antiguo con circulación continua en el país.',
    status: 'publicado',
    sources: [
      'Inspección General de Justicia (IGJ Argentina)',
      'Media Ownership Monitor (MOM / Reporteros Sin Fronteras)',
      'AllSides & Media Bias/Fact Check (MBFC)'
    ],
    metaTitle: '¿Quién es el Dueño de La Nación? Familia Saguier y Accionistas (2026)',
    metaDescription: 'Descubrí quién controla Diario La Nación y la señal LN+: accionistas principales, la familia Saguier, historia societaria y su línea editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/quien-es-el-dueno-de-la-nacion',
    targetSnippet: 'El diario La Nación y la señal LN+ pertenecen a S.A. La Nación, controlada mayoritariamente por la familia Saguier (a través de MNMS Holding), descendientes de Josefina Mitre, junto a inversores privados del ámbito financiero.',
    faq: [
      {
        question: '¿Quién es el dueño de Diario La Nación y LN+?',
        answer: 'Pertenecen a la empresa S.A. La Nación. La mayoría accionaria está en manos de la familia Saguier a través de la sociedad MNMS Holding, presidida por Julio César Saguier, con Fernán Saguier como director periodístico.'
      },
      {
        question: '¿Mauricio Macri es dueño o accionista de La Nación?',
        answer: 'En los registros formales de accionistas presentados ante los organismos oficiales (IGJ) no figura Mauricio Macri como titular de acciones. Tanto el expresidente como el directorio de La Nación han desmentido categóricamente su participación societaria formal, aunque se ha debatido públicamente el rol de inversores privados en el crecimiento de la señal LN+.'
      },
      {
        question: '¿Clarín y La Nación son del mismo grupo económico?',
        answer: 'No. Son empresas completamente independientes y competidoras. La Nación pertenece a la familia Saguier y Clarín al Grupo Clarín S.A. Solo comparten participación societaria en empresas auxiliares como la fabricante Papel Prensa S.A. y la feria agropecuaria Expoagro.'
      },
      {
        question: '¿Dónde puedo comparar las noticias de La Nación con otros diarios?',
        answer: 'En Politicheck (www.politicheck.com.ar), donde podés comparar en tiempo real el encuadre de La Nación con Clarín, Infobae, Página 12 y más de 30 medios con una barra de espectro editorial tripartito.'
      }
    ],
    content: {
      leadHtml: `<p class="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
        <strong>¿Quién es el dueño de La Nación?</strong> El diario La Nación y la señal televisiva LN+ pertenecen a la empresa <strong>S.A. La Nación</strong>. El control accionario mayoritario y la conducción estratégica están en manos de la <strong>familia Saguier</strong> (a través de la sociedad MNMS Holding), emparentada con la familia fundadora del prócer <strong>Bartolomé Mitre</strong>. El directorio está encabezado por los hermanos <strong>Julio César</strong>, <strong>Fernán</strong> y <strong>Luis Saguier</strong>, junto a un consorcio de accionistas privados e inversores institucionales vinculados a las finanzas y el agro.
      </p>
      <p class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        Fundado en 1870, La Nación es el segundo periódico más antiguo de la Argentina con circulación continua y una de las instituciones periodísticas más influyentes en la conformación de la opinión pública nacional.
      </p>`,
      sections: [
        {
          id: 'composicion-accionaria',
          title: '1. Composición Accionaria: De los Mitre al control de la familia Saguier',
          bodyHtml: `<p>Durante más de un siglo, el control de La Nación estuvo reservado de forma casi exclusiva a los descendientes directos de Bartolomé Mitre. Sin embargo, en las últimas tres décadas, la dispersión hereditaria y la necesidad de capitalización derivaron en una reestructuración societaria profunda.</p>
          <p>De acuerdo con los registros de la <strong>Inspección General de Justicia (IGJ)</strong> y los relevamientos del <strong>Media Ownership Monitor (MOM / Reporteros Sin Fronteras)</strong>, la propiedad se divide en tres bloques principales:</p>
          
          <div class="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-slate-100 dark:bg-slate-900/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3 sm:p-4">Accionista / Sociedad</th>
                  <th class="p-3 sm:p-4 text-center">Participación Est.</th>
                  <th class="p-3 sm:p-4">Rol y Función Corporativa</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">MNMS Holding (Familia Saguier)<br><span class="text-[10px] text-slate-500 font-normal">Julio César, Fernán y Luis Saguier</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">>65%</td>
                  <td class="p-3 sm:p-4">Mayoría de control, presidencia del directorio y orientación editorial e institucional.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">Descendientes Familia Mitre<br><span class="text-[10px] text-slate-500 font-normal">Ramas familiares históricas</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">~15%</td>
                  <td class="p-3 sm:p-4">Participación accionaria minoritaria y pasiva sin intervención ejecutiva diaria.</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td class="p-3 sm:p-4 font-semibold text-slate-900 dark:text-white">Inversores Privados & Fideicomisos<br><span class="text-[10px] text-slate-500 font-normal">Aportes financieros para LN+</span></td>
                  <td class="p-3 sm:p-4 font-mono font-bold text-center text-slate-950 dark:text-slate-100">~20%</td>
                  <td class="p-3 sm:p-4">Inversores institucionales del sector agropecuario, financiero y audiovisual.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 class="font-editorial text-lg font-bold text-slate-950 dark:text-white mt-4 mb-2">Los referentes de la conducción</h4>
          <p class="text-sm text-slate-700 dark:text-slate-300 mb-2">Los hermanos Saguier son bisnietos de Bartolomé Mitre a través de su hija Josefina Mitre. Tras consolidar su posición en los años 90:</p>
          <ul class="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Julio César Saguier:</strong> Presidente del directorio de S.A. La Nación y responsable de las decisiones institucionales y estratégicas.</li>
            <li><strong>Fernán Saguier:</strong> Director periodístico de Diario La Nación, a cargo de la línea informativa gráfica, digital y proyectos de investigación.</li>
            <li><strong>Luis Saguier:</strong> Directivo enfocado en diversificación comercial, eventos corporativos y nuevos negocios.</li>
          </ul>`
        },
        {
          id: 'ecosistema-de-negocios',
          title: '2. El Ecosistema de Negocios: Más allá del papel impreso',
          bodyHtml: `<p>La Nación ha diversificado sustancialmente sus fuentes de ingresos, transformándose de una editora tradicional en una compañía integral de medios, contenidos, gastronomía y entretenimiento en vivo:</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1420]">
              <div class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Prensa & Televisión</div>
              <ul class="space-y-1 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <li>• Diario La Nación y LaNacion.com.ar</li>
                <li>• Señal de televisión y streaming LN+</li>
                <li>• Revista Rolling Stone Argentina</li>
                <li>• Revistas Lugares, Ohlalá! y Living</li>
              </ul>
            </div>
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1420]">
              <div class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Entretenimiento & Agro</div>
              <ul class="space-y-1 text-sm text-slate-800 dark:text-slate-200 font-medium">
                <li>• Concesión Movistar Arena (CABA)</li>
                <li>• Co-propiedad de Expoagro (con Clarín)</li>
                <li>• Club LA NACION (programa de fidelización)</li>
                <li>• Participación en Papel Prensa S.A.</li>
              </ul>
            </div>
          </div>`
        },
        {
          id: 'linea-editorial-y-sesgo',
          title: '3. ¿Qué línea editorial tiene La Nación? Auditoría de Sesgo e Ideología',
          bodyHtml: `<p>En la metodología de auditoría cruzada de Politicheck basada en <strong>AllSides</strong> y <strong>Media Bias/Fact Check (MBFC)</strong>, La Nación se ubica en las siguientes coordenadas:</p>
          <ul class="space-y-3 my-4 text-sm text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0"></span>
              <div><strong>Sesgo Editorial de Base:</strong> Clasificado como <em>Derecha / Centro-Derecha</em>. Línea institucionalista, republicana y conservadora en lo cultural, defensora de la libre empresa, el sector agroexportador y la integración comercial con Occidente.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
              <div><strong>Calidad Factual:</strong> Calificada como <em>Alta</em>. Sus investigaciones cuentan con acreditación documental rigurosa y un cuerpo de columnistas de referencia en economía, política exterior y análisis judicial.</div>
            </li>
            <li class="flex items-start gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-slate-500 mt-2 shrink-0"></span>
              <div><strong>Modelo de Financiamiento:</strong> <em>Privado Corporativo</em>. Apoyado en una base masiva de suscriptores digitales (Club LA NACION y muros de pago), publicidad comercial y el negocio del entretenimiento.</div>
            </li>
          </ul>`
        },
        {
          id: 'caso-macri-ln-mas',
          title: '4. ¿Mauricio Macri es dueño de La Nación o de LN+?',
          bodyHtml: `<p>Uno de los interrogantes más recurrentes en el debate político argentino es si el expresidente <strong>Mauricio Macri</strong> posee acciones en La Nación o en su señal televisiva LN+.</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A] space-y-2 text-xs sm:text-sm font-sans">
            <p><strong>Lo que indican los registros societarios:</strong> En los expedientes oficiales presentados ante la Inspección General de Justicia no figura Mauricio Macri como accionista formal de S.A. La Nación. La titularidad mayoritaria corresponde a la familia Saguier (MNMS Holding).</p>
            <p><strong>El origen de las versiones:</strong> Surgieron a partir de 2021 con la incorporación de figuras periodísticas afines al espacio de Juntos por el Cambio en horario central de LN+, lo que motivó señalamientos de sectores opositores.</p>
            <p><strong>Desmentida oficial:</strong> Tanto el directorio de La Nación presidido por Julio César Saguier como el propio expresidente han desmentido formalmente cualquier participación accionaria en la compañía.</p>
          </div>`
        }
      ]
    }
  },
  {
    slug: 'quien-es-el-dueno-de-infobae',
    title: '¿Quién es el Dueño de Infobae? De Daniel Hadad a su Expansión Panregional',
    subtitle: 'Cómo se financia y gestiona el portal de noticias más leído del habla hispana: modelo de negocio, redacciones internacionales y línea de centro.',
    kicker: 'Cuaderno 03 • Estructura de Medios',
    category: 'propiedad',
    categoryLabel: 'Propiedad & Grupos',
    publishedAt: '12 de Octubre, 2026',
    updatedAt: '12 de Octubre, 2026',
    isoPublishedAt: '2026-10-12T00:00:00Z',
    isoUpdatedAt: '2026-10-12T00:00:00Z',
    readTimeMinutes: 8,
    author: 'Equipo de Datos de Politicheck',
    outletName: 'Infobae',
    faqTitle: 'Dudas Habituales sobre la Propiedad de Infobae',
    excerpt: 'El portal Infobae pertenece al periodista y empresario Daniel Hadad, quien lo fundó en 2002 como un medio nativo digital sin edición de papel.',
    heroImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Fundado en Buenos Aires en 2002, Infobae consolidó redacciones en 6 países y lidera el tráfico digital en idioma español.',
    status: 'publicado',
    sources: [
      'Comscore Global Media Metrix Multi-Platform',
      'Reuters Institute for the Study of Journalism (Oxford)',
      'Media Ownership Monitor (MOM / Reporteros Sin Fronteras)',
      'AllSides & Media Bias/Fact Check (MBFC)'
    ],
    metaTitle: '¿Quién es el Dueño de Infobae? Daniel Hadad y Modelo (2026)',
    metaDescription: 'Descubrí quién es el dueño de Infobae: Daniel Hadad, su estructura societaria, cómo se financia sin muro de pago y cuál es su línea editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/quien-es-el-dueno-de-infobae',
    targetSnippet: 'El portal Infobae pertenece en su totalidad al periodista y empresario Daniel Hadad, quien lo fundó en 2002. Opera como un medio nativo digital sin rotativas de papel, con redacciones activas en Argentina, México, Colombia, España, Perú y Estados Unidos.',
    faq: [
      {
        question: '¿Quién es el dueño del portal Infobae?',
        answer: 'Infobae pertenece en su totalidad al periodista y empresario argentino Daniel Hadad a través de las sociedades Infobae América y TXH Medios, ejerciendo la presidencia ejecutiva y la conducción editorial.'
      },
      {
        question: '¿Infobae es un medio argentino o extranjero?',
        answer: 'Nació en Argentina en 2002 con sede fundacional en Buenos Aires, pero hoy opera como una red panregional con redacciones autónomas en Ciudad de México, Bogotá, Madrid, Lima y Miami.'
      },
      {
        question: '¿Mauricio Macri o fondos extranjeros tienen acciones en Infobae?',
        answer: 'No. No existen registros societarios de participación de Mauricio Macri ni de fondos de Wall Street. Daniel Hadad ha manifestado en reiteradas oportunidades que mantiene la compañía 100% privada para preservar la agilidad de decisión.'
      },
      {
        question: '¿Cómo se financia Infobae si todas sus notas son gratuitas?',
        answer: 'Se financia mediante subastas de publicidad programática masiva (Google Ad Manager / RTB), patrocinios corporativos y facturación diversificada en divisas (dólares y euros), sin muros de pago por suscripción.'
      },
      {
        question: '¿Dónde puedo comparar las noticias de Infobae con Clarín y La Nación?',
        answer: 'En Politicheck (www.politicheck.com.ar), donde podés auditar en tiempo real cómo titula Infobae frente a más de 30 redacciones con una barra de espectro editorial tripartito.'
      }
    ],
    content: {
      leadHtml: `<p class="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
        <strong>¿Quién es el dueño de Infobae?</strong> El portal de noticias Infobae pertenece en su totalidad al periodista y empresario argentino <strong>Daniel Hadad</strong>, quien lo fundó en el año 2002. A diferencia de conglomerados tradicionales como Grupo Clarín o S.A. La Nación, Infobae nació como un medio <strong>100% nativo digital</strong>, sin edición impresa en papel. Hadad conserva el control accionario absoluto y la presidencia ejecutiva del grupo matriz (Infobae América / TXH Medios), con redacciones periodísticas propias en <strong>Argentina, México, Colombia, España, Perú y Estados Unidos (Miami)</strong>.
      </p>
      <p class="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        Su modelo representa el caso más exitoso de internacionalización de un medio digital nacido en el Cono Sur: un portal de acceso libre que compite de igual a igual en métricas de tráfico global frente a gigantes centenarios.
      </p>`,
      sections: [
        {
          id: 'origen-sociedad',
          title: '1. El Origen de Infobae: De la venta de C5N y Radio 10 al imperio digital',
          bodyHtml: `<p>A comienzos de la década de 2000, Daniel Hadad era uno de los empresarios audiovisuales más influyentes de la Argentina. Su conglomerado incluía la histórica <strong>Radio 10</strong> (líder absoluta de audiencia en AM), las emisoras FM Mega 98.3, Pop Radio y Vale 97.5, el canal de aire Canal 9 (vendido posteriormente a Albavisión) y la señal de cable <strong>C5N</strong>, creada en 2007 para competir frente a TN.</p>
          <p>En abril de 2012, en un escenario de fuerte polarización política y presiones regulatorias, Hadad concretó un movimiento estratégico decisivo: <strong>vendió la totalidad de sus radios y el canal C5N al Grupo Indalo</strong> (Cristóbal López y Fabián De Sousa).</p>
          <p>Sin embargo, en el acuerdo de venta Hadad fijó una condición innegociable: <strong>se quedó exclusivamente con Infobae</strong>. Mientras el resto del mercado trataba a internet como un subproducto de bajo costo, Hadad reinvirtió el capital de la transacción en tecnología cloud, ingenieros de datos y periodistas digitales.</p>`
        },
        {
          id: 'estructura-y-modelo-de-negocio',
          title: '2. Estructura Societaria y Finanzas: ¿Quién financia a Infobae?',
          bodyHtml: `<p>A diferencia de Grupo Clarín (que cotiza en bolsa con acciones públicas) o La Nación (propiedad de un consorcio familiar multigeneracional), Infobae es una sociedad de control cerrado y personalista.</p>
          <p>De acuerdo con los relevamientos del <strong>Media Ownership Monitor (MOM / Reporteros Sin Fronteras)</strong> y el <strong>Reuters Institute (Universidad de Oxford)</strong>, la estructura societaria se sintetiza en el siguiente esquema:</p>
          
          <div class="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-slate-100 dark:bg-slate-900/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3">Entidad / Accionista</th>
                  <th class="p-3">Rol Societario</th>
                  <th class="p-3">Participación</th>
                  <th class="p-3">Sede Operativa</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr class="bg-white dark:bg-slate-900/40 font-medium">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Daniel Hadad</td>
                  <td class="p-3">Fundador, CEO y Presidente Ejecutivo</td>
                  <td class="p-3 font-mono font-bold text-sky-700 dark:text-sky-400">~100%</td>
                  <td class="p-3">Buenos Aires / Miami</td>
                </tr>
                <tr>
                  <td class="p-3 font-semibold">Infobae América / TXH Medios</td>
                  <td class="p-3">Holding paraguas regional</td>
                  <td class="p-3 font-mono">100% filial</td>
                  <td class="p-3">Delaware (EE.UU.) y CABA</td>
                </tr>
                <tr class="bg-slate-50/50 dark:bg-slate-900/20">
                  <td class="p-3 font-semibold">Inversores Externos / Fondos</td>
                  <td class="p-3">Sin participación registrada</td>
                  <td class="p-3 font-mono">0%</td>
                  <td class="p-3">Compañía de capital cerrado</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p><strong>¿Cómo monetiza sin cobrar suscripción?</strong> Infobae opera con un modelo de acceso 100% libre. Su financiamiento descansa sobre subastas de publicidad programática (Google Ad Manager / RTB), patrocinios corporativos y branded content en múltiples monedas (dólares, euros, pesos mexicanos y colombianos), lo que le otorga resiliencia frente a las fluctuaciones cambiarias de Argentina.</p>`
        },
        {
          id: 'expansion-panregional',
          title: '3. La Expansión Panregional: El medio en español más leído del mundo',
          bodyHtml: `<p>El rasgo que diferencia a Infobae de otros portales es su arquitectura descentralizada. En lugar de limitarse a exportar noticias argentinas, montó redacciones con periodistas locales en cada mercado:</p>
          <ul class="list-disc pl-5 space-y-1 my-3 text-xs sm:text-sm">
            <li><strong>Infobae Argentina:</strong> Sede central en el barrio porteño de Palermo, con más de 200 redactores y mesa audiovisual continua.</li>
            <li><strong>Infobae México (2019):</strong> Disputa los primeros puestos de audiencia con El Universal y Reforma.</li>
            <li><strong>Infobae Colombia:</strong> Cobertura de política, economía y orden público en Bogotá y Medellín.</li>
            <li><strong>Infobae España (2023):</strong> Desembarco en Madrid para disputar audiencia frente a El País y El Mundo.</li>
            <li><strong>Infobae América (Miami):</strong> Foco en el voto latino en EE.UU., geopolítica continental y derechos humanos en Cuba y Venezuela.</li>
          </ul>
          <p>Según auditorías de <strong>Comscore MMX</strong>, el portal promedia entre <strong>45 y 55 millones de usuarios únicos mensuales</strong> en todo el planeta.</p>`
        },
        {
          id: 'encuadre-y-framing',
          title: '4. Línea Editorial y Análisis de Encuadre (Framing) en Politicheck',
          bodyHtml: `<p>En las auditorías de encuadre de Politicheck, Infobae se sitúa habitualmente en el <strong>Centro / Centro-Derecha institucional</strong>, caracterizado por:</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A] space-y-2 text-xs sm:text-sm font-sans">
            <p><strong>Política Argentina:</strong> No responde a una bandera partidaria unívoca. Suele mantener un tono pragmático, con amplio espacio a ministros del gobierno libertario y referentes opositores, privilegiando el minuto a minuto y los entretelones de poder.</p>
            <p><strong>Economía:</strong> Cobertura favorable a la inversión privada, equilibrio fiscal y desregulación económica.</p>
            <p><strong>Geopolítica Continental:</strong> Clara alineación con la política exterior de Estados Unidos, Israel y la Unión Europea, con un encuadre severamente crítico de los regímenes de Venezuela, Nicaragua y Cuba.</p>
            <p><strong>Optimización SEO y Virales:</strong> Alto volumen de artículos de estilo de vida, salud, bienestar, policiales y tendencias para sostener su caudal de tráfico masivo.</p>
          </div>`
        }
      ]
    }
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
    isoPublishedAt: '2026-10-26T00:00:00Z',
    isoUpdatedAt: '2026-10-26T00:00:00Z',
    readTimeMinutes: 10,
    author: 'Equipo Editorial de Politicheck',
    outletName: 'Observatorio Politicheck',
    faqTitle: 'Preguntas Frecuentes sobre el Mapa de Medios',
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
