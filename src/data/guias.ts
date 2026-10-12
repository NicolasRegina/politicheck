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
    slug: 'mapa-de-medios-argentina',
    title: 'Mapa del Ecosistema de Medios en Argentina: Grupos Económicos, Propiedad y Sesgo',
    subtitle: 'Radiografía completa de los 31 medios monitoreados: conglomerados corporativos, medios sindicales, estatales e independientes por suscripción.',
    kicker: 'Pilar Central • Observatorio de Medios',
    category: 'metodologia',
    categoryLabel: 'Ecosistema de Medios',
    publishedAt: '12 de Octubre, 2026',
    updatedAt: '12 de Octubre, 2026',
    isoPublishedAt: '2026-10-12T00:00:00Z',
    isoUpdatedAt: '2026-10-12T00:00:00Z',
    readTimeMinutes: 12,
    author: 'Equipo de Datos de Politicheck',
    outletName: 'Observatorio Politicheck',
    faqTitle: 'Preguntas Frecuentes sobre el Mapa de Medios en Argentina',
    excerpt: 'La guía integral sobre la estructura de propiedad, financiamiento y sesgo editorial de los principales conglomerados periodísticos y medios independientes de Argentina.',
    heroImageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Redacciones, estudios audiovisuales y grupos de comunicación que configuran la agenda pública nacional.',
    status: 'publicado',
    sources: [
      'Media Ownership Monitor (MOM / Reporteros Sin Fronteras)',
      'AllSides & Media Bias/Fact Check (MBFC)',
      'Boletín Oficial de la República Argentina',
      'Comscore MMX',
      'Comisión Nacional de Valores (CNV)'
    ],
    metaTitle: 'Mapa de Medios en Argentina: Grupos Económicos, Dueños y Sesgo',
    metaDescription: 'Radiografía completa del ecosistema de medios en Argentina: Grupo Clarín, La Nación, Infobae, Indalo, Octubre, medios independientes, financiamiento y sesgo editorial.',
    canonicalUrl: 'https://www.politicheck.com.ar/guias/mapa-de-medios-argentina',
    targetSnippet: 'El ecosistema de medios en Argentina se articula en torno a conglomerados privados concentrados (Clarín, La Nación, Infobae, Indalo, América), el sector sindical-partidario (Octubre), los medios públicos estatales y una creciente red de nativos digitales independientes financiados por membresías y suscripciones (Cenital, elDiarioAR).',
    faq: [
      {
        question: '¿Cuáles son los principales grupos de medios en Argentina?',
        answer: 'Los principales conglomerados privados son Grupo Clarín (Clarín, TN, Mitre), Grupo La Nación (La Nación, LN+), TXH Medios (Infobae), Grupo Indalo (C5N, Ámbito), Grupo América (América TV, A24, La Red) y Editorial Perfil (Perfil, Noticias, Net TV). En el sector sindical destaca Grupo Octubre (Página 12, Canal 9).'
      },
      {
        question: '¿Cómo impactó la eliminación de la pauta publicitaria oficial en 2024?',
        answer: 'La reducción a $0 del presupuesto publicitario del Estado Nacional forzó a los medios a acelerar muros de pago digitales (Clarín y La Nación), apostar al volumen global de publicidad programática (Infobae) o desarrollar comunidades de socios por membresía (Cenital y elDiarioAR).'
      },
      {
        question: '¿Qué medios en Argentina son propiedad de sindicatos u organizaciones gremiales?',
        answer: 'El caso más relevante es Grupo Octubre, presidido por Víctor Santa María (secretario general de SUTERH), que gestiona el diario Página 12, Canal 9, la señal de noticias IP, la radio AM 750 y la revista Caras y Caretas.'
      },
      {
        question: '¿Cómo clasifica Politicheck el sesgo de las redacciones?',
        answer: 'Politicheck triangula la auditoría internacional de AllSides y Media Bias/Fact Check con un algoritmo matemático continuo que mide la prominencia de portada, adjetivación y omisiones temáticas sobre los hechos del día, calculando porcentajes objetivos de Oficialismo, Centro-Datos y Oposición.'
      },
      {
        question: '¿Qué diferencia a los nuevos medios independientes por suscripción?',
        answer: 'Proyectos como Cenital y elDiarioAR prescinden de estructuras corporativas masivas y financiamiento estatal, sosteniéndose mediante suscripciones directas de sus lectores y newsletters de análisis especializado.'
      }
    ],
    content: {
      leadHtml: `<p class="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
        Comprender <strong>quiénes son los dueños de los medios de comunicación</strong> y cómo se financian es un requisito indispensable para interpretar la cobertura de cualquier acontecimiento público. En Argentina, la agenda periodística no surge en el vacío: está moldeada por intereses corporativos, disputas regulatorias y modelos de negocio en plena transformación. Esta investigación analiza la arquitectura de propiedad, los accionistas clave y el posicionamiento editorial de las <strong>31 redacciones nacionales e internacionales</strong> monitoreadas por el observatorio de Politicheck.
      </p>`,
      sections: [
        {
          id: 'de-la-convergencia-al-fin-de-la-pauta',
          title: '1. De la Convergencia Infocomunicacional al Fin de la Pauta Oficial',
          bodyHtml: `<p>El sistema mediático argentino se distingue por uno de los niveles más altos de concentración de propiedad de América Latina, según reportes sistemáticos del <strong>Media Ownership Monitor</strong> (Reporteros Sin Fronteras). Esta estructura atravesó dos etapas decisivas:</p>
          <div class="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A]">
              <div class="font-bold text-slate-900 dark:text-white mb-1">📡 La Convergencia (1990–2018)</div>
              <p class="text-slate-600 dark:text-slate-400">Los diarios tradicionales se integraron horizontal y verticalmente con canales de televisión abierta, señales de noticias de cable, emisoras de radio y redes de telecomunicaciones (banda ancha y telefonía móvil), conformando holdings multiplataforma con capacidad de fijación de agenda total.</p>
            </div>
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A]">
              <div class="font-bold text-slate-900 dark:text-white mb-1">📉 El Shock de Pauta Cero (2024–2026)</div>
              <p class="text-slate-600 dark:text-slate-400">La suspensión de la pauta publicitaria del Estado Nacional impulsada por la administración de Javier Milei extinguió un subsidio indirecto vital para decenas de empresas periodísticas, forzando un viraje drástico hacia suscripciones digitales, eventos corporativos y subastas programáticas globales.</p>
            </div>
          </div>`
        },
        {
          id: 'conglomerados-corporativos-privados',
          title: '2. Los Conglomerados Corporativos Privados: El Núcleo de la Concentración',
          bodyHtml: `<p>Seis grandes grupos privados controlan la mayor porción del encendido televisivo, la audiencia radial y el tráfico web de noticias en el país:</p>
          <div class="space-y-4 my-4 text-xs sm:text-sm font-sans">
            <!-- Grupo Clarín -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">1. Grupo Clarín S.A.</span>
                <a href="/guias/quien-es-el-dueno-de-clarin" class="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline">Ver investigación monográfica →</a>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Controlantes:</strong> Héctor Magnetto, José Antonio Aranda, Lucio Pagliaro y herederos de Ernestina Herrera de Noble (GC Dominio S.A.). El Estado retiene 8,9% (FGS/ANSES).</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> Diario Clarín, Olé, Todo Noticias (TN), Canal 13 (Artear), Radio Mitre, La 100 y participación estratégica en Telecom/Flow.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Centro-Derecha institucional y pro-mercado.</p>
            </div>

            <!-- Grupo La Nación -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">2. Grupo La Nación (S.A. La Nación)</span>
                <a href="/guias/quien-es-el-dueno-de-la-nacion" class="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline">Ver investigación monográfica →</a>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Controlantes:</strong> Familia Saguier (MNMS Holding / Fernán Saguier).</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> Diario La Nación, canal de noticias LN+, revistas temáticas y división de agronegocios (Expoagro).</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Derecha liberal-conservadora republicana.</p>
            </div>

            <!-- Infobae -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">3. TXH Medios / Infobae</span>
                <a href="/guias/quien-es-el-dueno-de-infobae" class="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 hover:underline">Ver investigación monográfica →</a>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Controlante:</strong> Daniel Hadad.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> Infobae Argentina y corresponsalías panregionales autónomas en México, Colombia, España, Perú y Miami. Acceso 100% abierto sin muro de pago.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Centro / Centro-Derecha institucional y atlántico.</p>
            </div>

            <!-- Grupo Indalo -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">4. Grupo Indalo</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Investigación en curso</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Controlantes:</strong> Cristóbal López y Fabián De Sousa.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> Señal de noticias C5N, diario económico Ámbito Financiero, Radio 10 (AM 710) y emisoras FM (Mega 98.3, Vale 97.5, Pop Radio).</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Centro-Izquierda / Oposición peronista y productivista.</p>
            </div>

            <!-- Grupo América -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">5. Grupo América</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Investigación en curso</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Controlantes:</strong> Daniel Vila, José Luis Manzano y Claudio Belocopitt.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> América TV, canal de noticias A24, Radio La Red (AM 910) y El Cronista Comercial.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Centro pragmático y coyuntural.</p>
            </div>

            <!-- Editorial Perfil -->
            <div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-slate-900 dark:text-white">6. Editorial Perfil</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Investigación en curso</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400"><strong>Fundador y Director:</strong> Jorge Fontevecchia.</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Activos centrales:</strong> Diario Perfil, Revista Noticias, Caras, señal Net TV y Radio Perfil (FM 101.9).</p>
              <p class="text-slate-600 dark:text-slate-400"><strong>Encuadre Politicheck:</strong> Centro analítico y periodismo de autor.</p>
            </div>
          </div>`
        },
        {
          id: 'medios-sindicales-y-partidarios',
          title: '3. Medios Sindicales, Cooperativos y Nuevas Expresiones Partidarias',
          bodyHtml: `<p>Junto a los conglomerados corporativos, conviven empresas periodísticas gestionadas por sindicatos y plataformas partidarias directas:</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A] space-y-3 text-xs sm:text-sm font-sans">
            <div>
              <div class="font-bold text-slate-900 dark:text-white mb-0.5">Grupo Octubre (Víctor Santa María / SUTERH)</div>
              <p class="text-slate-600 dark:text-slate-400">Es el mayor conglomerado mediático de base sindical en la historia argentina. Opera el diario <em>Página 12</em>, <em>Canal 9</em> (Telearte), la señal informativa <em>IP Noticias</em>, <em>AM 750</em>, <em>Revista Caras y Caretas</em> y centros universitarios (UMET). Su línea editorial se inscribe en la Centro-Izquierda progresista, con fuerte foco en derechos laborales, derechos humanos y defensa del Estado.</p>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-800 pt-3">
              <div class="font-bold text-slate-900 dark:text-white mb-0.5">La Prensa Partidaria Digital</div>
              <p class="text-slate-600 dark:text-slate-400">En los extremos del arco político, plataformas como <em>La Izquierda Diario</em> (Partido de los Trabajadores Socialistas / FIT-U) y <em>La Derecha Diario</em> (plataforma digital identificada con el movimiento libertario de Javier Milei) producen coberturas de fuerte combate ideológico con gran repercusión en redes sociales.</p>
            </div>
          </div>`
        },
        {
          id: 'medios-digitales-independientes',
          title: '4. Nativos Digitales por Suscripción y Periodismo de Autor',
          bodyHtml: `<p>Para contrarrestar la polarización y la precarización informativa, emergieron redacciones sostenidas directamente por comunidades de lectores:</p>
          <ul class="list-disc pl-5 space-y-2 my-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li><strong>Cenital (Iván Schargrodsky):</strong> Modelo financiado por membresías voluntarias ("Me Cenital"). Desarrolla newsletters temáticas de alta densidad analítica sobre economía, geopolítica, energía y política doméstica.</li>
            <li><strong>elDiarioAR:</strong> Filial argentina asociada a <em>elDiario.es</em> de España. Se financia mediante socios que pagan una cuota mensual para mantener la información abierta y sin compromisos empresariales.</li>
            <li><strong>El Economista:</strong> Publicación especializada con más de 70 años de trayectoria que analiza coyuntura financiera, inflación, reservas del BCRA y políticas macroeconómicas.</li>
          </ul>`
        },
        {
          id: 'medios-publicos-estatales',
          title: '5. Los Medios Públicos y Estatales: Reestructuración y Redefinición',
          bodyHtml: `<p>El sector público experimentó transformaciones radicales a partir de 2024:</p>
          <div class="my-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm font-sans">
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A]">
              <div class="font-bold text-slate-900 dark:text-white mb-1">📺 TV Pública (Canal 7)</div>
              <p class="text-slate-600 dark:text-slate-400 text-xs">Señal abierta pionera. Reorganización de programación orientada a eventos deportivos de interés nacional y reducción de emisiones informativas en vivo.</p>
            </div>
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A]">
              <div class="font-bold text-slate-900 dark:text-white mb-1">📻 Radio Nacional</div>
              <p class="text-slate-600 dark:text-slate-400 text-xs">Red federal con 49 repetidoras que garantiza cobertura y comunicación institucional en parajes remotos de frontera y zonas rurales.</p>
            </div>
            <div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A]">
              <div class="font-bold text-slate-900 dark:text-white mb-1">🏛️ Agencia Télam / APes</div>
              <p class="text-slate-600 dark:text-slate-400 text-xs">La agencia fundada en 1945 fue clausurada en 2024 y reconvertida en una estructura reducida de publicidad y servicios de prensa oficiales.</p>
            </div>
          </div>`
        },
        {
          id: 'la-mirada-exterior',
          title: '6. La Mirada Exterior: La Prensa Internacional sobre Argentina',
          bodyHtml: `<p>Para evitar el aislamiento del debate doméstico, Politicheck monitorea 16 redacciones globales de primer nivel:</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C101A] space-y-2 text-xs sm:text-sm font-sans">
            <p><strong>El País (España):</strong> Cobertura exhaustiva de la política latinoamericana desde sus redacciones de Madrid y Buenos Aires.</p>
            <p><strong>Financial Times (Reino Unido):</strong> El pulso de los inversores de Wall Street y la City de Londres sobre las reformas de mercado, la deuda soberana y el régimen cambiario.</p>
            <p><strong>BBC Mundo & France 24:</strong> Periodismo explicativo y de contexto social libre de pasiones partidarias locales.</p>
            <p><strong>The Guardian & Le Monde:</strong> Enfoques críticos sobre derechos sociales, preservación ambiental y políticas de desregulación estatal.</p>
          </div>`
        },
        {
          id: 'tabla-comparativa-31-medios',
          title: '7. Matriz de Auditoría Tripartita (31 Medios Monitoreados)',
          bodyHtml: `<p>A continuación se resume la matriz de auditoría cruzada que Politicheck aplica de forma continua sobre los medios que integran la plataforma:</p>
          <div class="my-4 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-slate-100 dark:bg-slate-900 font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3">Medio</th>
                  <th class="p-3">Holding / Propietario</th>
                  <th class="p-3">Propiedad</th>
                  <th class="p-3">Ideología</th>
                  <th class="p-3">Factualidad</th>
                  <th class="p-3">Monografía</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Clarín</td>
                  <td class="p-3">Grupo Clarín S.A.</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">Centro-Derecha</span></td>
                  <td class="p-3">Alta</td>
                  <td class="p-3"><a href="/guias/quien-es-el-dueno-de-clarin" class="text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline">Ver Guía →</a></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">La Nación</td>
                  <td class="p-3">S.A. La Nación (Saguier)</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">Derecha</span></td>
                  <td class="p-3">Alta</td>
                  <td class="p-3"><a href="/guias/quien-es-el-dueno-de-la-nacion" class="text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline">Ver Guía →</a></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Infobae</td>
                  <td class="p-3">TXH Medios (Hadad)</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">Centro-Derecha</span></td>
                  <td class="p-3">Alta</td>
                  <td class="p-3"><a href="/guias/quien-es-el-dueno-de-infobae" class="text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline">Ver Guía →</a></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Página 12</td>
                  <td class="p-3">Grupo Octubre (SUTERH)</td>
                  <td class="p-3">Sindical</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-600 dark:text-red-400">Izquierda</span></td>
                  <td class="p-3">Mixta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Ámbito Financiero</td>
                  <td class="p-3">Grupo Indalo</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400">Centro-Izquierda</span></td>
                  <td class="p-3">Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">El Cronista</td>
                  <td class="p-3">Grupo América</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Centro</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Diario Perfil</td>
                  <td class="p-3">Editorial Perfil</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Centro</span></td>
                  <td class="p-3">Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">elDiarioAR</td>
                  <td class="p-3">elDiario.es & Periodistas</td>
                  <td class="p-3">Suscripción</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400">Centro-Izquierda</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Cenital</td>
                  <td class="p-3">Iván Schargrodsky / Socios</td>
                  <td class="p-3">Membresía</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Centro</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">El Economista</td>
                  <td class="p-3">Medios Económicos S.A.</td>
                  <td class="p-3">Corporativo</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Centro</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3 text-slate-400 font-mono text-[11px]">En curso</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">Financial Times</td>
                  <td class="p-3">Nikkei Inc. (Japón)</td>
                  <td class="p-3">Internacional</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Centro</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3"><a href="/metodologia" class="text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline">Metodología →</a></td>
                </tr>
                <tr>
                  <td class="p-3 font-bold text-slate-900 dark:text-white">El País</td>
                  <td class="p-3">Grupo PRISA (España)</td>
                  <td class="p-3">Internacional</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400">Centro-Izquierda</span></td>
                  <td class="p-3">Muy Alta</td>
                  <td class="p-3"><a href="/metodologia" class="text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline">Metodología →</a></td>
                </tr>
              </tbody>
            </table>
          </div>`
        },
        {
          id: 'metodologia-politicheck',
          title: '8. Cómo audita Politicheck el Sesgo de Cobertura en Tiempo Real',
          bodyHtml: `<p>A diferencia de los monitores tradicionales que emiten veredictos subjetivos, Politicheck procesa de manera automatizada las portadas de los 31 diarios cada 60 minutos mediante modelos avanzados de procesamiento del lenguaje natural (Google Gemini):</p>
          <div class="my-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C101A] space-y-2 text-xs sm:text-sm font-sans">
            <p><strong>1. Clustering de Hechos Centrales:</strong> Agrupa todas las notas que cubren exactamente el mismo acontecimiento, contrastando hasta 8 redacciones en simultáneo.</p>
            <p><strong>2. Barra de Espectro Editorial:</strong> Calcula determinísticamente el porcentaje de encuadre correspondiente a <em>Oficialismo</em>, <em>Centro-Datos</em> y <em>Oposición</em> ponderando la jerarquía visual de la noticia en la portada de cada diario.</p>
            <p><strong>3. Independencia Absoluta ($0 de pauta):</strong> La plataforma se financia exclusivamente de forma cívica, garantizando neutralidad algorítmica y apego estricto a las fuentes primarias.</p>
          </div>
          <p>Para conocer la fórmula matemática y las fuentes de datos, consultá nuestra <a href="/metodologia" class="text-sky-600 dark:text-sky-400 font-semibold hover:underline">Página Institucional de Metodología</a>.</p>`
        }
      ]
    }
  },
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
  }
];

export function getGuiaBySlug(slug: string): GuiaArticle | undefined {
  return GUIAS_ARTICLES.find(a => a.slug === slug);
}
