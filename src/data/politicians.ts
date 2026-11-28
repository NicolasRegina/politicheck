export type PoliticianSpaceGroup =
  | 'La Libertad Avanza'
  | 'Unión por la Patria / PJ'
  | 'PRO'
  | 'UCR'
  | 'Peronismo Federal'
  | 'Izquierda'
  | 'Otros';

export type PoliticianScopeGroup =
  | 'Ejecutivo Nacional'
  | 'Congreso y Legislatura'
  | 'Gobernadores y CABA'
  | 'Referentes';

export interface CareerEntry {
  period: string;
  role: string;
  district: string;
  coalition: string;
}

export interface PolicyAxis {
  topic: string;
  position: string;
}

export interface PoliticianPartyColor {
  badgeBg: string;
  border: string;
  accentBar: string;
  lightRing: string;
}

export interface PoliticianConfig {
  slug: string;
  name: string;
  fullName: string;
  avatar: string;
  avatarCredit: string;
  coalition: string;
  spaceGroup: PoliticianSpaceGroup;
  scopeGroup: PoliticianScopeGroup;
  role: string;
  district: string;
  birthDate: string;
  birthPlace: string;
  education: string;
  summary: string;
  pastAffiliations: string[];
  careerTimeline: CareerEntry[];
  policyAxes: PolicyAxis[];
  sources: string[];
  partyColor: PoliticianPartyColor;
  /** Disambiguated search aliases for media mention matching */
  matchAliases?: string[];
  updatedAt?: string;
}

export function normalizePoliticianText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function slugifyPolitician(name: string): string {
  return normalizePoliticianText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const COLORS = {
  lla: {
    badgeBg: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/80 dark:text-violet-200 dark:border-violet-800',
    border: 'border-violet-500',
    accentBar: 'border-l-violet-600',
    lightRing: 'ring-violet-400',
  },
  llaAlt: {
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-800',
    border: 'border-indigo-500',
    accentBar: 'border-l-indigo-600',
    lightRing: 'ring-indigo-400',
  },
  up: {
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800',
    border: 'border-sky-500',
    accentBar: 'border-l-sky-600',
    lightRing: 'ring-sky-400',
  },
  upAlt: {
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-800',
    border: 'border-cyan-500',
    accentBar: 'border-l-cyan-600',
    lightRing: 'ring-cyan-400',
  },
  pro: {
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800',
    border: 'border-amber-500',
    accentBar: 'border-l-amber-500',
    lightRing: 'ring-amber-400',
  },
  ucr: {
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800',
    border: 'border-rose-500',
    accentBar: 'border-l-rose-600',
    lightRing: 'ring-rose-400',
  },
  federal: {
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-800',
    border: 'border-teal-500',
    accentBar: 'border-l-teal-600',
    lightRing: 'ring-teal-400',
  },
  centro: {
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800',
    border: 'border-emerald-500',
    accentBar: 'border-l-emerald-600',
    lightRing: 'ring-emerald-400',
  },
  izquierda: {
    badgeBg: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800',
    border: 'border-red-500',
    accentBar: 'border-l-red-600',
    lightRing: 'ring-red-400',
  },
  otros: {
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    border: 'border-slate-400',
    accentBar: 'border-l-slate-500',
    lightRing: 'ring-slate-300',
  },
} as const;

export const POLITICIANS_LIST: PoliticianConfig[] = [
  {
    slug: 'axel-kicillof',
    name: 'Axel Kicillof',
    fullName: 'Axel Kicillof',
    avatar: '/images/politicians/axel-kicillof.jpg',
    avatarCredit: 'Archivo oficial GBA',
    coalition: 'Unión por la Patria / PJ',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Gobernadores y CABA',
    role: 'Gobernador de la Provincia de Buenos Aires',
    district: 'Provincia de Buenos Aires',
    birthDate: '25/09/1971',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado y Doctor en Economía (UBA). Investigador del CONICET (en licencia).',
    summary:
      'Doctor en Economía por la Universidad de Buenos Aires e investigador del CONICET, se desempeñó como viceministro y ministro de Economía de la Nación entre 2011 y 2015, y luego como diputado nacional por la Ciudad de Buenos Aires hasta 2019. Ese año fue electo gobernador de la provincia de Buenos Aires, cargo para el que resultó reelecto en 2023, y en marzo de 2026 asumió la presidencia del Partido Justicialista bonaerense.',
    pastAffiliations: [
      'Frente para la Victoria (2011–2017)',
      'Unidad Ciudadana (2017–2019)',
      'Frente de Todos (2019–2023)',
      'Unión por la Patria / PJ (2023–presente)',
    ],
    careerTimeline: [
      { period: '2011–2013', role: 'Secretario de Política Económica de la Nación', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2013–2015', role: 'Ministro de Economía y Finanzas Públicas', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2015–2019', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Frente para la Victoria / Unidad Ciudadana' },
      { period: '2019–2023', role: 'Gobernador de la Provincia de Buenos Aires (1.º mandato)', district: 'Provincia de Buenos Aires', coalition: 'Frente de Todos' },
      { period: '2023–presente', role: 'Gobernador de la Provincia de Buenos Aires (2.º mandato)', district: 'Provincia de Buenos Aires', coalition: 'Unión por la Patria' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Defiende la intervención estatal para fomentar la industria nacional, el consumo interno, el crédito productivo a través de la banca pública y la regulación de tarifas.' },
      { topic: 'Rol del Estado', position: 'Sostiene la gestión pública directa de infraestructura, educación, salud y empresas estratégicas como YPF y Aerolíneas Argentinas.' },
      { topic: 'Federalismo', position: 'Reclama la restitución de fondos coparticipables y transferencias nacionales a las provincias y se opuso a la Ley Bases y al RIGI.' },
      { topic: 'Política Social', position: 'Prioriza programas provinciales de asistencia alimentaria, boleto estudiantil y financiamiento universitario público gratuito.' },
    ],
    sources: ['gba.gob.ar', 'hcdn.gob.ar'],
    partyColor: COLORS.up,
    matchAliases: ['axel kicillof', 'kicillof'],
  },
  {
    slug: 'cristina-fernandez-de-kirchner',
    name: 'Cristina Fernández de Kirchner',
    fullName: 'Cristina Elisabet Fernández de Kirchner',
    avatar: '/images/politicians/cristina-fernandez-de-kirchner.jpg',
    avatarCredit: 'Presidencia de la Nación (CC BY 2.0)',
    coalition: 'Partido Justicialista / Unión por la Patria',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Referentes',
    role: 'Presidenta del Partido Justicialista Nacional (sin cargo estatal)',
    district: 'Nación Argentina',
    birthDate: '19/02/1953',
    birthPlace: 'La Plata, Provincia de Buenos Aires',
    education: 'Abogada por la Universidad Nacional de La Plata (UNLP).',
    summary:
      'Abogada egresada de la Universidad Nacional de La Plata, ocupó bancas como legisladora provincial en Santa Cruz, diputada nacional y senadora nacional antes de ser electa presidenta de la Nación por dos mandatos consecutivos (2007–2015) y vicepresidenta entre 2019 y 2023. Asumió la presidencia del Partido Justicialista nacional en diciembre de 2024 y desde junio de 2025 cuenta con inhabilitación perpetua para ejercer cargos públicos tras el fallo firme de la Corte Suprema en la causa Vialidad.',
    pastAffiliations: [
      'Partido Justicialista (desde década de 1970)',
      'Frente para la Victoria (2003–2017)',
      'Unidad Ciudadana (2017–2019)',
      'Frente de Todos (2019–2023)',
      'Unión por la Patria (2023–presente)',
    ],
    careerTimeline: [
      { period: '1989–1995', role: 'Diputada Provincial de Santa Cruz (2 mandatos)', district: 'Santa Cruz', coalition: 'Partido Justicialista' },
      { period: '1995–1997', role: 'Senadora de la Nación Argentina', district: 'Santa Cruz', coalition: 'Partido Justicialista' },
      { period: '1997–2001', role: 'Diputada de la Nación Argentina', district: 'Santa Cruz', coalition: 'Partido Justicialista' },
      { period: '2001–2007', role: 'Senadora de la Nación Argentina', district: 'Santa Cruz / PBA', coalition: 'PJ / Frente para la Victoria' },
      { period: '2007–2015', role: 'Presidenta de la Nación Argentina (2 mandatos)', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2017–2019', role: 'Senadora de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'Unidad Ciudadana' },
      { period: '2019–2023', role: 'Vicepresidenta de la Nación Argentina', district: 'Nación Argentina', coalition: 'Frente de Todos' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Defiende el rol rector del Estado en el desarrollo industrial, la administración del comercio exterior, los controles cambiarios y la recomposición del mercado interno.' },
      { topic: 'Deuda y FMI', position: 'Cuestiona las condicionalidades del Fondo Monetario Internacional y propone subordinar los pagos de deuda externa al crecimiento económico y la balanza comercial.' },
      { topic: 'Rol del Estado', position: 'Respalda la propiedad estatal de sectores estratégicos (YPF, Aerolíneas Argentinas, sistema previsional público) y las paritarias libres con intervención estatal.' },
      { topic: 'Justicia e Instituciones', position: 'Promueve una reforma del Poder Judicial y de la composición de la Corte Suprema.' },
    ],
    sources: ['casarosada.gob.ar', 'senado.gob.ar'],
    partyColor: COLORS.up,
    matchAliases: ['cristina kirchner', 'cristina fernandez', 'cristina fernandez de kirchner', 'cfk'],
  },
  {
    slug: 'guillermo-moreno',
    name: 'Guillermo Moreno',
    fullName: 'Mario Guillermo Moreno',
    avatar: '/images/politicians/guillermo-moreno.jpg',
    avatarCredit: 'Presidencia de la Nación (CC BY 2.0)',
    coalition: 'Principios y Valores',
    spaceGroup: 'Otros',
    scopeGroup: 'Referentes',
    role: 'Presidente de Principios y Valores (sin cargo estatal)',
    district: 'CABA / Nación Argentina',
    birthDate: '15/10/1955',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Economía por la Universidad Argentina de la Empresa (UADE).',
    summary:
      'Licenciado en Economía por la UADE con militancia en el Partido Justicialista desde la década de 1970, ejerció como secretario de Comunicaciones (2003–2006) y secretario de Comercio Interior de la Nación (2006–2013), además de agregado económico en la embajada argentina en Italia hasta 2015. Fundó el partido Principios y Valores en 2020 y desde octubre de 2025 registra inhabilitación absoluta y perpetua para cargos públicos por sentencias firmes de la Corte Suprema.',
    pastAffiliations: [
      'Partido Justicialista (desde década de 1970)',
      'Frente para la Victoria (2003–2015)',
      'Principios y Valores (2020–presente)',
    ],
    careerTimeline: [
      { period: '1990–1993', role: 'Subsecretario de Producción de la MCBA', district: 'Ciudad de Buenos Aires', coalition: 'Partido Justicialista' },
      { period: '2003–2006', role: 'Secretario de Comunicaciones de la Nación', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2006–2013', role: 'Secretario de Comercio Interior de la Nación', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2013–2015', role: 'Agregado Económico en la Embajada en Italia', district: 'Exterior (Roma)', coalition: 'Frente para la Victoria' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Propone un modelo industrialista basado en la administración estatal del comercio exterior, aranceles de protección a la industria nacional y tipo de cambio competitivo.' },
      { topic: 'Rol del Estado', position: 'Defiende la planificación económica centralizada con acuerdos de precios, energía regulada como insumo industrial y fortalecimiento de empresas públicas.' },
      { topic: 'Trabajo y Doctrina', position: 'Sostiene la doctrina peronista tradicional orientada al pleno empleo formal, el fortalecimiento sindical y la sustitución de importaciones.' },
      { topic: 'Política Exterior', position: 'Promueve el nacionalismo económico y acuerdos bilaterales pragmáticos subordinados al desarrollo de la manufactura local.' },
    ],
    sources: ['casarosada.gob.ar', 'chequeado.com'],
    partyColor: COLORS.otros,
    matchAliases: ['guillermo moreno'],
  },
  {
    slug: 'horacio-rodriguez-larreta',
    name: 'Horacio Rodríguez Larreta',
    fullName: 'Horacio Antonio Rodríguez Larreta',
    avatar: '/images/politicians/horacio-rodriguez-larreta.jpg',
    avatarCredit: 'Archivo oficial GCBA',
    coalition: 'Movimiento al Desarrollo / Volvamos Buenos Aires',
    spaceGroup: 'Otros',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Legislador de la Ciudad Autónoma de Buenos Aires',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '29/10/1965',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Economía (UBA) y MBA por Harvard Business School.',
    summary:
      'Economista egresado de la Universidad de Buenos Aires con una maestría en Administración de Empresas por la Universidad de Harvard, ocupó cargos técnicos en la ANSES, el PAMI y la DGI antes de cofundar Propuesta Republicana. Fue jefe de Gabinete porteño durante ocho años y jefe de Gobierno de la Ciudad Autónoma de Buenos Aires entre 2015 y 2023, y desde diciembre de 2025 ocupa una banca en la Legislatura porteña.',
    pastAffiliations: [
      'Partido Justicialista (década de 1990)',
      'Propuesta Republicana / PRO (cofundador, 2003–2024)',
      'Cambiemos / Juntos por el Cambio (2015–2023)',
      'Movimiento al Desarrollo / Volvamos Buenos Aires (2024–presente)',
    ],
    careerTimeline: [
      { period: '1995–1998', role: 'Gerente General de la ANSES', district: 'Nación Argentina', coalition: 'Partido Justicialista' },
      { period: '1999–2000', role: 'Interventor del PAMI (INSSJP)', district: 'Nación Argentina', coalition: 'Alianza' },
      { period: '2001–2002', role: 'Director General Impositivo (DGI / AFIP)', district: 'Nación Argentina', coalition: 'Alianza / Transición' },
      { period: '2007–2015', role: 'Jefe de Gabinete de Ministros de la CABA', district: 'CABA', coalition: 'Propuesta Republicana (PRO)' },
      { period: '2015–2023', role: 'Jefe de Gobierno de la CABA (2 mandatos)', district: 'CABA', coalition: 'PRO / Juntos por el Cambio' },
      { period: '2025–presente', role: 'Legislador de la Ciudad Autónoma de Buenos Aires', district: 'CABA', coalition: 'Volvamos Buenos Aires' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Propone estabilidad macroeconómica con déficit cero, simplificación tributaria y promoción de exportaciones de energía, agroindustria y economía del conocimiento.' },
      { topic: 'Rol del Estado', position: 'Defiende la gestión estatal basada en planificación, metas mensurables, infraestructura urbana y educación pública con evaluaciones periódicas.' },
      { topic: 'Instituciones', position: 'Sostiene la necesidad de acuerdos legislativos amplios y rechaza la polarización política y los cambios institucionales sin consenso parlamentario.' },
      { topic: 'Seguridad', position: 'Impulsa el fortalecimiento de policías locales con tecnología de videovigilancia, mapas del delito y coordinación entre jurisdicciones.' },
    ],
    sources: ['legislatura.gob.ar', 'chequeado.com'],
    partyColor: COLORS.centro,
    matchAliases: ['rodriguez larreta', 'horacio rodriguez larreta', 'larreta'],
  },
  {
    slug: 'javier-milei',
    name: 'Javier Milei',
    fullName: 'Javier Gerardo Milei',
    avatar: '/images/politicians/javier-milei.jpg',
    avatarCredit: 'Presidencia de la Nación',
    coalition: 'La Libertad Avanza',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Ejecutivo Nacional',
    role: 'Presidente de la Nación Argentina',
    district: 'Nación Argentina',
    birthDate: '22/10/1970',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Economía (UB). Posgrados en Economía en el IDES y la Universidad Torcuato Di Tella (UTDT).',
    summary:
      'Economista graduado en la Universidad de Belgrano con posgrados en el IDES y la Universidad Torcuato Di Tella, que ejerció la docencia universitaria y la consultoría en el sector privado antes de ingresar a la función pública. Fue electo diputado nacional por la Ciudad Autónoma de Buenos Aires en 2021 por La Libertad Avanza y asumió como presidente de la Nación el 10 de diciembre de 2023.',
    pastAffiliations: [
      'Partido Libertario (2019–2021)',
      'La Libertad Avanza (2021–presente)',
    ],
    careerTimeline: [
      { period: '2021–2023', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'La Libertad Avanza' },
      { period: '2023–presente', role: 'Presidente de la Nación Argentina', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Impulsa el equilibrio fiscal estricto, la eliminación de la emisión monetaria para financiar al Tesoro, la libre competencia de monedas y la apertura comercial.' },
      { topic: 'Rol del Estado', position: 'Promueve la reducción de la estructura ministerial, la desregulación económica mediante el DNU 70/2023 y la Ley Bases, y la privatización de empresas públicas.' },
      { topic: 'Seguridad y Justicia', position: 'Respalda el protocolo federal contra cortes de vía pública, el endurecimiento de penas y la ampliación de facultades operativas de fuerzas federales.' },
      { topic: 'Política Exterior', position: 'Sostiene el alineamiento estratégico con Estados Unidos e Israel y rechazó la incorporación de Argentina al bloque BRICS.' },
    ],
    sources: ['casarosada.gob.ar', 'chequeado.com'],
    partyColor: COLORS.lla,
    matchAliases: ['javier milei', 'presidente milei'],
  },
  {
    slug: 'jorge-macri',
    name: 'Jorge Macri',
    fullName: 'Jorge Macri',
    avatar: '/images/politicians/jorge-macri.jpg',
    avatarCredit: 'Gobierno de la Ciudad de Buenos Aires',
    coalition: 'Propuesta Republicana (PRO)',
    spaceGroup: 'PRO',
    scopeGroup: 'Gobernadores y CABA',
    role: 'Jefe de Gobierno de la Ciudad Autónoma de Buenos Aires',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '05/03/1965',
    birthPlace: 'Tandil, Provincia de Buenos Aires',
    education: 'Estudios en Arquitectura y Urbanismo (sin título de grado) y programas ejecutivos en Finanzas y Dirección de PyMEs (IAE).',
    summary:
      'Dirigente de Propuesta Republicana con trayectoria previa en la actividad empresaria, fue diputado de la provincia de Buenos Aires entre 2005 y 2011 e intendente del partido de Vicente López durante tres mandatos consecutivos. Tras desempeñarse como ministro de Gobierno porteño entre 2021 y 2023, asumió en diciembre de 2023 como jefe de Gobierno de la Ciudad Autónoma de Buenos Aires.',
    pastAffiliations: [
      'Compromiso para el Cambio / PRO (desde 2005)',
      'Cambiemos (2015–2019)',
      'Juntos por el Cambio (2019–2023)',
      'PRO / Buenos Aires Primero (2023–presente)',
    ],
    careerTimeline: [
      { period: '2005–2011', role: 'Diputado de la Provincia de Buenos Aires (2 mandatos)', district: 'Provincia de Buenos Aires', coalition: 'Propuesta Republicana (PRO)' },
      { period: '2011–2023', role: 'Intendente de Vicente López (en licencia 2021–2023)', district: 'Vicente López, PBA', coalition: 'PRO / Cambiemos / JxC' },
      { period: '2021–2023', role: 'Ministro de Gobierno de la CABA', district: 'CABA', coalition: 'Juntos por el Cambio (PRO)' },
      { period: '2023–presente', role: 'Jefe de Gobierno de la CABA', district: 'CABA', coalition: 'PRO / Juntos por el Cambio' },
    ],
    policyAxes: [
      { topic: 'Economía Urbana', position: 'Promueve el equilibrio fiscal en la Ciudad de Buenos Aires, la reducción de alícuotas locales y la inversión privada en desarrollo inmobiliario.' },
      { topic: 'Seguridad', position: 'Impulsa el refuerzo de la Policía de la Ciudad, el uso de pistolas Taser y el desalojo de ocupaciones del espacio público y acampes.' },
      { topic: 'Federalismo', position: 'Reclama ante la Corte Suprema el cumplimiento integral de los pagos de coparticipación federal correspondientes a la CABA.' },
      { topic: 'Servicios Públicos', position: 'Prioriza la gestión local del transporte metropolitano, la salud pública porteña con reciprocidad para no residentes y la digitalización de trámites.' },
    ],
    sources: ['buenosaires.gob.ar', 'lanoticia1.com'],
    partyColor: COLORS.pro,
    matchAliases: ['jorge macri'],
  },
  {
    slug: 'juan-grabois',
    name: 'Juan Grabois',
    fullName: 'Juan Grabois',
    avatar: '/images/politicians/juan-grabois.jpg',
    avatarCredit: 'Wikimedia Commons (CC BY-SA 4.0)',
    coalition: 'Frente Patria Grande / Unión por la Patria',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputado de la Nación Argentina',
    district: 'Provincia de Buenos Aires',
    birthDate: '23/05/1983',
    birthPlace: 'San Isidro, Provincia de Buenos Aires',
    education: 'Abogado (UBA) y Licenciado en Ciencias Sociales y Humanidades (UNQ). Docente universitario.',
    summary:
      'Abogado graduado en la UBA y licenciado en Ciencias Sociales por la Universidad Nacional de Quilmes, fundó el Movimiento de Trabajadores Excluidos (MTE), la UTEP y el partido Frente Patria Grande, además de integrar el Dicasterio para el Servicio del Desarrollo Humano Integral del Vaticano. Luego de competir como precandidato presidencial en las primarias de 2023, asumió el 10 de diciembre de 2025 su primer cargo electivo como diputado nacional por la provincia de Buenos Aires.',
    pastAffiliations: [
      'MTE / UTEP (fundador)',
      'Frente Patria Grande (fundador en 2018)',
      'Frente de Todos (2019–2023)',
      'Unión por la Patria / Fuerza Patria (2023–presente)',
    ],
    careerTimeline: [
      { period: '2025–presente', role: 'Diputado de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'Fuerza Patria / Frente Patria Grande' },
    ],
    policyAxes: [
      { topic: 'Economía y Tierra', position: 'Propone una reforma agraria y urbana orientada al acceso a la tierra y la vivienda ("Tierra, Techo y Trabajo"), además de impuestos progresivos a la riqueza.' },
      { topic: 'Economía Popular', position: 'Impulsa el reconocimiento salarial, previsional y sindical de los trabajadores de la economía popular mediante un salario básico universal.' },
      { topic: 'Recursos Naturales', position: 'Defiende la nacionalización o control estatal estricto del litio, los hidrocarburos y las vías navegables, rechazando el RIGI.' },
      { topic: 'Política Exterior', position: 'Promueve la integración latinoamericana, la soberanía monetaria regional y el rechazo al endeudamiento con el FMI.' },
    ],
    sources: ['hcdn.gob.ar', 'chequeado.com'],
    partyColor: COLORS.upAlt,
    matchAliases: ['juan grabois', 'grabois'],
  },
  {
    slug: 'juan-schiaretti',
    name: 'Juan Schiaretti',
    fullName: 'Juan Schiaretti',
    avatar: '/images/politicians/juan-schiaretti.jpg',
    avatarCredit: 'Archivo oficial Córdoba',
    coalition: 'Hacemos / Provincias Unidas',
    spaceGroup: 'Peronismo Federal',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputado de la Nación Argentina',
    district: 'Provincia de Córdoba',
    birthDate: '19/06/1949',
    birthPlace: 'Ciudad de Córdoba, Provincia de Córdoba',
    education: 'Contador Público Nacional por la Universidad Nacional de Córdoba (UNC).',
    summary:
      'Contador público nacional egresado de la Universidad Nacional de Córdoba, ejerció cargos ejecutivos nacionales en los años noventa, fue interventor federal de Santiago del Estero y gobernó la provincia de Córdoba en tres períodos (2007–2011 y 2015–2023). Luego de postularse a la Presidencia de la Nación en 2023, encabezó la lista de Provincias Unidas en las elecciones legislativas de 2025 y asumió una banca como diputado nacional por Córdoba.',
    pastAffiliations: [
      'Partido Justicialista (desde década de 1970)',
      'Unión por Córdoba (1998–2018)',
      'Hacemos por Córdoba / Hacemos por Nuestro País (2019–2024)',
      'Provincias Unidas (2025–presente)',
    ],
    careerTimeline: [
      { period: '1991–1993', role: 'Secretario de Industria y Comercio de la Nación', district: 'Nación Argentina', coalition: 'Partido Justicialista' },
      { period: '1993–1995', role: 'Interventor Federal de Santiago del Estero', district: 'Santiago del Estero', coalition: 'Partido Justicialista' },
      { period: '1995–1997', role: 'Diputado de la Nación Argentina', district: 'Córdoba', coalition: 'Partido Justicialista' },
      { period: '2003–2007', role: 'Vicegobernador de la Provincia de Córdoba', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2007–2011', role: 'Gobernador de la Provincia de Córdoba (1.º mandato)', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2013–2015', role: 'Diputado de la Nación Argentina', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2015–2023', role: 'Gobernador de la Provincia de Córdoba (2.º y 3.º mandato)', district: 'Córdoba', coalition: 'Hacemos por Córdoba' },
      { period: '2026–presente', role: 'Diputado de la Nación Argentina', district: 'Córdoba', coalition: 'Provincias Unidas' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Defiende el equilibrio fiscal sostenido en el superávit corriente, la eliminación gradual de retenciones a las exportaciones agroindustriales y el incentivo a la producción privada.' },
      { topic: 'Rol del Estado', position: 'Sostiene un esquema mixto que combina disciplina fiscal con inversión pública provincial en obras viales, gasoductos y conectividad.' },
      { topic: 'Federalismo', position: 'Impulsa la redistribución de subsidios al transporte y la energía hacia el interior del país y una mayor participación provincial en la recaudación nacional.' },
      { topic: 'Instituciones', position: 'Promueve consensos multipartidarios de centro a través del espacio federal Provincias Unidas.' },
    ],
    sources: ['hcdn.gob.ar', 'chequeado.com'],
    partyColor: COLORS.federal,
    matchAliases: ['juan schiaretti', 'schiaretti'],
  },
  {
    slug: 'karina-milei',
    name: 'Karina Milei',
    fullName: 'Karina Elizabeth Milei',
    avatar: '/images/politicians/karina-milei.jpg',
    avatarCredit: 'Gobierno Nacional — argentina.gob.ar (CC BY 4.0)',
    coalition: 'La Libertad Avanza',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Ejecutivo Nacional',
    role: 'Secretaria General de la Presidencia y Presidenta de LLA',
    district: 'Nación Argentina',
    birthDate: '28/03/1973',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciada en Relaciones Públicas e Institucionales por la Universidad Argentina de la Empresa (UADE).',
    summary:
      'Licenciada en Relaciones Públicas por la UADE sin cargos públicos previos, coordinó la campaña electoral de Javier Milei en 2021 y 2023. El 10 de diciembre de 2023 asumió como secretaria general de la Presidencia de la Nación y desde septiembre de 2024 ejerce la presidencia del partido La Libertad Avanza a escala nacional.',
    pastAffiliations: [
      'La Libertad Avanza (jefa de campaña 2023; presidenta nacional desde 2024)',
    ],
    careerTimeline: [
      { period: '2023–presente', role: 'Secretaria General de la Presidencia de la Nación', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Construcción Partidaria', position: 'Conduce la estructuración nacional de La Libertad Avanza como partido propio con personería en todos los distritos.' },
      { topic: 'Rol del Estado', position: 'Respalda la reducción del gasto político y administrativo de la Presidencia y la reasignación de dependencias estatales bajo criterio de austeridad.' },
      { topic: 'Economía', position: 'Acompaña íntegramente el programa de déficit cero, desregulación y apertura económica encabezado por el presidente Javier Milei.' },
      { topic: 'Agenda Institucional', position: 'Coordina la agenda protocolar y estratégica del Poder Ejecutivo nacional y la selección de candidaturas oficialistas.' },
    ],
    sources: ['argentina.gob.ar', 'casarosada.gob.ar', 'chequeado.com'],
    partyColor: COLORS.lla,
    matchAliases: ['karina milei'],
  },
  {
    slug: 'leandro-santoro',
    name: 'Leandro Santoro',
    fullName: 'Leandro Jorge Santoro',
    avatar: '/images/politicians/leandro-santoro.jpg',
    avatarCredit: 'Archivo oficial HCDN',
    coalition: 'Es Ahora Buenos Aires / Unión por la Patria',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Legislador de la Ciudad Autónoma de Buenos Aires',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '11/01/1976',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Ciencia Política por la Universidad de Buenos Aires (UBA). Docente universitario.',
    summary:
      'Politólogo y docente egresado de la Universidad de Buenos Aires, inició su militancia en la Unión Cívica Radical antes de confluir en las coaliciones encabezadas por el peronismo en la Ciudad de Buenos Aires. Tras desempeñarse como legislador porteño (2017–2021) y diputado nacional (2021–2025), encabezó la lista de Es Ahora Buenos Aires en los comicios de mayo de 2025 y retornó a la Legislatura de la Ciudad en diciembre de ese año.',
    pastAffiliations: [
      'Unión Cívica Radical / Los Irrompibles',
      'Frente para la Victoria (2015)',
      'Unidad Porteña / Frente de Todos (2017–2023)',
      'Unión por la Patria / Es Ahora Buenos Aires (2023–presente)',
    ],
    careerTimeline: [
      { period: '2015', role: 'Subsecretario para la Reforma Institucional', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2017–2021', role: 'Legislador de la Ciudad Autónoma de Buenos Aires', district: 'CABA', coalition: 'Unidad Porteña / Frente de Todos' },
      { period: '2021–2025', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Frente de Todos / Unión por la Patria' },
      { period: '2025–presente', role: 'Legislador de la Ciudad Autónoma de Buenos Aires', district: 'CABA', coalition: 'Es Ahora Buenos Aires' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Propone políticas de protección del salario, regulación de alquileres en la Ciudad de Buenos Aires y financiamiento estatal para PyMEs.' },
      { topic: 'Rol del Estado', position: 'Defiende la expansión de la educación pública, la salud estatal y los espacios verdes frente a la venta de tierras públicas porteñas.' },
      { topic: 'Instituciones', position: 'Promueve la ampliación de mecanismos de control legislativo, la defensa del sistema universitario nacional y la articulación de frentes progresistas en la CABA.' },
      { topic: 'Política Social', position: 'Impulsa proyectos de ampliación de derechos laborales, asistencia a sectores vulnerables y fortalecimiento del sistema previsional público.' },
    ],
    sources: ['legislatura.gob.ar', 'hcdn.gob.ar'],
    partyColor: COLORS.upAlt,
    matchAliases: ['leandro santoro', 'santoro'],
  },
  {
    slug: 'luis-caputo',
    name: 'Luis Caputo',
    fullName: 'Luis Andrés Caputo',
    avatar: '/images/politicians/luis-caputo.jpg',
    avatarCredit: 'Gobierno Nacional — argentina.gob.ar (CC BY 4.0)',
    coalition: 'La Libertad Avanza',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Ejecutivo Nacional',
    role: 'Ministro de Economía de la Nación Argentina',
    district: 'Nación Argentina',
    birthDate: '21/04/1965',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Economía por la Universidad de Buenos Aires (UBA). Docente de posgrado en la UCA.',
    summary:
      'Licenciado en Economía por la Universidad de Buenos Aires con trayectoria en entidades financieras internacionales, ocupó la Secretaría y el Ministerio de Finanzas y la presidencia del Banco Central entre 2015 y 2018 durante la presidencia de Mauricio Macri. El 10 de diciembre de 2023 asumió como ministro de Economía de la Nación bajo la administración de Javier Milei.',
    pastAffiliations: [
      'Gestión ejecutiva en Cambiemos (2015–2018)',
      'Gestión ejecutiva en La Libertad Avanza (2023–presente)',
    ],
    careerTimeline: [
      { period: '2015–2017', role: 'Secretario de Finanzas de la Nación', district: 'Nación Argentina', coalition: 'Cambiemos' },
      { period: '2017–2018', role: 'Ministro de Finanzas de la Nación', district: 'Nación Argentina', coalition: 'Cambiemos' },
      { period: '2018', role: 'Presidente del Banco Central (BCRA)', district: 'Nación Argentina', coalition: 'Cambiemos' },
      { period: '2023–presente', role: 'Ministro de Economía de la Nación Argentina', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Política Fiscal', position: 'Sostiene el superávit fiscal financiero como ancla central del programa económico mediante recorte del gasto público y eliminación de transferencias discrecionales.' },
      { topic: 'Política Monetaria', position: 'Impulsa la eliminación de pasivos remunerados del Banco Central, el saneamiento de su balance y la salida gradual de controles cambiarios tras acumular reservas.' },
      { topic: 'Deuda y Mercados', position: 'Prioriza el cumplimiento de vencimientos soberanos, la reducción del riesgo país y el retorno al financiamiento voluntario en mercados internacionales.' },
      { topic: 'Comercio y Desregulación', position: 'Acompaña la reducción de aranceles a importaciones, el régimen RIGI para inversiones de gran escala y la baja progresiva de impuestos distorsivos.' },
    ],
    sources: ['argentina.gob.ar/economia', 'chequeado.com'],
    partyColor: COLORS.lla,
    matchAliases: ['luis caputo', 'toto caputo', 'ministro caputo'],
  },
  {
    slug: 'manuel-adorni',
    name: 'Manuel Adorni',
    fullName: 'Manuel Adorni',
    avatar: '/images/politicians/manuel-adorni.png',
    avatarCredit: 'Gobierno Nacional — argentina.gob.ar (CC BY 4.0)',
    coalition: 'La Libertad Avanza',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Referentes',
    role: 'Referente de La Libertad Avanza (ex Jefe de Gabinete y ex Vocero Presidencial)',
    district: 'Nación Argentina / CABA',
    birthDate: '28/02/1980',
    birthPlace: 'La Plata, Provincia de Buenos Aires',
    education: 'Contador Público por la Universidad Argentina de la Empresa (UADE). Docente universitario en UAI y ESEADE.',
    summary:
      'Contador público egresado de la UADE, docente universitario y analista económico en medios de comunicación, ingresó a la función pública en diciembre de 2023 como vocero presidencial de la administración de Javier Milei y luego asumió como secretario de Comunicación y Medios. En noviembre de 2025 fue designado jefe de Gabinete de Ministros de la Nación, cargo al que renunció el 27 de junio de 2026.',
    pastAffiliations: [
      'La Libertad Avanza (2023–presente)',
    ],
    careerTimeline: [
      { period: '2023–2026', role: 'Vocero Presidencial de la Nación', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
      { period: '2024–2025', role: 'Secretario de Comunicación y Medios', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
      { period: '2025–2026', role: 'Jefe de Gabinete de Ministros de la Nación', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Respalda la reducción drástica del gasto público, el déficit cero, la eliminación de impuestos distorsivos y la desregulación de mercados.' },
      { topic: 'Rol del Estado', position: 'Promueve el cierre de organismos públicos considerados innecesarios, la reducción de la planta estatal y la privatización de medios y empresas estatales.' },
      { topic: 'Comunicación Oficial', position: 'Defendió durante su gestión la eliminación de la pauta oficial nacional a medios de comunicación y el uso de conferencias diarias como canal directo del Ejecutivo.' },
      { topic: 'Seguridad', position: 'Acompañó la implementación del protocolo antipiquetes y las reformas penales impulsadas por el Poder Ejecutivo nacional.' },
    ],
    sources: ['casarosada.gob.ar', 'argentina.gob.ar', 'chequeado.com'],
    partyColor: COLORS.llaAlt,
    matchAliases: ['manuel adorni', 'adorni'],
  },
  {
    slug: 'martin-llaryora',
    name: 'Martín Llaryora',
    fullName: 'Martín Miguel Llaryora',
    avatar: '/images/politicians/martin-llaryora.jpg',
    avatarCredit: 'Gobierno Nacional — argentina.gob.ar (CC BY 4.0)',
    coalition: 'Hacemos Unidos por Córdoba / Provincias Unidas',
    spaceGroup: 'Peronismo Federal',
    scopeGroup: 'Gobernadores y CABA',
    role: 'Gobernador de la Provincia de Córdoba',
    district: 'Provincia de Córdoba',
    birthDate: '06/10/1972',
    birthPlace: 'San Francisco, Provincia de Córdoba',
    education: 'Abogado por la Universidad Nacional de Córdoba (UNC). Diplomado en Gestión Pública (UCC).',
    summary:
      'Abogado egresado de la Universidad Nacional de Córdoba y dirigente del Partido Justicialista cordobés, fue concejal e intendente de San Francisco, ministro provincial de Industria, vicegobernador de Córdoba, diputado nacional e intendente de la capital provincial. En diciembre de 2023 asumió como gobernador de la provincia de Córdoba en representación de la coalición Hacemos Unidos por Córdoba.',
    pastAffiliations: [
      'Partido Justicialista de Córdoba',
      'Unión por Córdoba (2003–2018)',
      'Hacemos por Córdoba (2019–2023)',
      'Hacemos Unidos por Córdoba / Provincias Unidas (2023–presente)',
    ],
    careerTimeline: [
      { period: '2003–2007', role: 'Concejal de San Francisco', district: 'San Francisco, Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2007–2013', role: 'Intendente de San Francisco', district: 'San Francisco, Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2013–2014', role: 'Ministro de Industria, Comercio y Minería', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2015–2017', role: 'Vicegobernador de la Provincia de Córdoba', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2017–2019', role: 'Diputado de la Nación Argentina', district: 'Córdoba', coalition: 'Unión por Córdoba' },
      { period: '2019–2023', role: 'Intendente de la Ciudad de Córdoba', district: 'Córdoba Capital', coalition: 'Hacemos por Córdoba' },
      { period: '2023–presente', role: 'Gobernador de la Provincia de Córdoba', district: 'Córdoba', coalition: 'Hacemos Unidos por Córdoba' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Combina disciplina fiscal provincial con incentivos a la agroindustria, los biocombustibles y la economía del conocimiento, reclamando la baja de retenciones nacionales.' },
      { topic: 'Rol del Estado', position: 'Defiende un Estado provincial activo en obra pública, infraestructura productiva y articulación con el sector privado ("partido cordobés").' },
      { topic: 'Federalismo', position: 'Impulsa el reclamo por cajas previsionales provinciales no transferidas, la equidad en subsidios federales y la coordinación de gobernadores en Provincias Unidas.' },
      { topic: 'Seguridad y Educación', position: 'Promueve guardias locales de prevención en municipios cordobeses y la reforma curricular orientada a capacitación técnica y digital.' },
    ],
    sources: ['cba.gov.ar', 'hcdn.gob.ar'],
    partyColor: COLORS.federal,
    matchAliases: ['martin llaryora', 'llaryora'],
  },
  {
    slug: 'martin-lousteau',
    name: 'Martín Lousteau',
    fullName: 'Martín Gonzalo Lousteau',
    avatar: '/images/politicians/martin-lousteau.jpg',
    avatarCredit: 'Presidencia de la Nación (CC BY 2.0)',
    coalition: 'Unión Cívica Radical (UCR)',
    spaceGroup: 'UCR',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputado de la Nación Argentina',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '08/12/1970',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciado en Economía (Universidad de San Andrés) y MSc in Economics (London School of Economics).',
    summary:
      'Economista egresado de la Universidad de San Andrés con una maestría en la London School of Economics, se desempeñó como ministro de Producción bonaerense, presidente del Banco Provincia, ministro de Economía de la Nación (2007–2008) y embajador argentino en Estados Unidos (2015–2017). Referente de la Unión Cívica Radical —cuyo Comité Nacional presidió entre 2023 y 2025—, fue senador nacional por la Ciudad de Buenos Aires hasta diciembre de 2025, cuando asumió un nuevo mandato como diputado nacional.',
    pastAffiliations: [
      'Gestión técnica PJ / Frente para la Victoria (2005–2008)',
      'Frente Amplio UNEN / ECO (2013–2017)',
      'Evolución / Juntos por el Cambio (2017–2023)',
      'Unión Cívica Radical (2019–presente)',
    ],
    careerTimeline: [
      { period: '2005–2007', role: 'Presidente del Banco Provincia de Buenos Aires', district: 'Provincia de Buenos Aires', coalition: 'Gestión provincial' },
      { period: '2007–2008', role: 'Ministro de Economía y Producción de la Nación', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2013–2015', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Frente Amplio UNEN' },
      { period: '2015–2017', role: 'Embajador Argentino en los Estados Unidos', district: 'Exterior (EE. UU.)', coalition: 'ECO / Cambiemos' },
      { period: '2017–2019', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Evolución' },
      { period: '2019–2025', role: 'Senador de la Nación Argentina', district: 'CABA', coalition: 'Juntos por el Cambio / UCR' },
      { period: '2025–presente', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Unión Cívica Radical (UCR)' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Propone una estabilización macroeconómica sustentada en reformas tributarias progresivas, equilibrio fiscal sin recortes en educación ni ciencia y reglas estables para la inversión.' },
      { topic: 'Educación Pública', position: 'Defiende el financiamiento garantizado de las universidades nacionales públicas y la eficiencia del gasto estatal.' },
      { topic: 'Instituciones', position: 'Rechazó el DNU 70/2023 y votó en contra de la Ley Bases en el Senado, sosteniendo la necesidad de controles parlamentarios y límites a las facultades delegadas.' },
      { topic: 'Política Partidaria', position: 'Impulsa la autonomía de la Unión Cívica Radical como alternativa reformista diferenciada del oficialismo libertario y del kirchnerismo.' },
    ],
    sources: ['hcdn.gob.ar', 'senado.gob.ar'],
    partyColor: COLORS.ucr,
    matchAliases: ['martin lousteau', 'lousteau'],
  },
  {
    slug: 'mauricio-macri',
    name: 'Mauricio Macri',
    fullName: 'Mauricio Macri',
    avatar: '/images/politicians/mauricio-macri.jpg',
    avatarCredit: 'Presidencia de la Nación',
    coalition: 'Propuesta Republicana (PRO)',
    spaceGroup: 'PRO',
    scopeGroup: 'Referentes',
    role: 'Presidente del PRO (ex Presidente de la Nación)',
    district: 'Nación Argentina',
    birthDate: '08/02/1959',
    birthPlace: 'Tandil, Provincia de Buenos Aires',
    education: 'Ingeniero Civil por la Universidad Católica Argentina (UCA). Cursos de posgrado en Columbia y Wharton.',
    summary:
      'Ingeniero civil egresado de la Universidad Católica Argentina, presidió el Club Atlético Boca Juniors entre 1995 y 2007 y fundó el espacio político que dio origen a Propuesta Republicana (PRO). Ocupó una banca como diputado nacional, gobernó la Ciudad Autónoma de Buenos Aires durante dos mandatos consecutivos y ejerció la Presidencia de la Nación entre 2015 y 2019.',
    pastAffiliations: [
      'Compromiso para el Cambio (2003–2005)',
      'Propuesta Republicana / PRO (2005–presente)',
      'Cambiemos (2015–2019)',
      'Juntos por el Cambio (2019–2023)',
    ],
    careerTimeline: [
      { period: '2005–2007', role: 'Diputado de la Nación Argentina', district: 'CABA', coalition: 'Propuesta Republicana (PRO)' },
      { period: '2007–2015', role: 'Jefe de Gobierno de la CABA (2 mandatos)', district: 'CABA', coalition: 'Propuesta Republicana (PRO)' },
      { period: '2015–2019', role: 'Presidente de la Nación Argentina', district: 'Nación Argentina', coalition: 'Cambiemos (PRO)' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Promueve el equilibrio fiscal, la inserción en mercados internacionales de capitales, la reducción de retenciones agropecuarias y la reforma laboral e impositiva.' },
      { topic: 'Rol del Estado', position: 'Impulsa la modernización administrativa, la concesión o privatización de empresas públicas deficitarias y la articulación público-privada en infraestructura.' },
      { topic: 'Instituciones', position: 'Respalda la boleta única de papel, el fortalecimiento del sistema republicano y la cooperación legislativa condicionada del PRO con el Ejecutivo nacional.' },
      { topic: 'Política Exterior', position: 'Favorece la integración comercial con la Unión Europea (acuerdo Mercosur-UE), Estados Unidos y organismos multilaterales de crédito.' },
    ],
    sources: ['casarosada.gob.ar', 'hcdn.gob.ar'],
    partyColor: COLORS.pro,
    matchAliases: ['mauricio macri'],
  },
  {
    slug: 'maximiliano-pullaro',
    name: 'Maximiliano Pullaro',
    fullName: 'Maximiliano Nicolás Pullaro',
    avatar: '/images/politicians/maximiliano-pullaro.jpg',
    avatarCredit: 'Gobierno de Santa Fe (CC0 1.0)',
    coalition: 'UCR / Unidos para Cambiar Santa Fe / Provincias Unidas',
    spaceGroup: 'UCR',
    scopeGroup: 'Gobernadores y CABA',
    role: 'Gobernador de la Provincia de Santa Fe',
    district: 'Provincia de Santa Fe',
    birthDate: '06/12/1974',
    birthPlace: 'Wheelwright, Provincia de Santa Fe',
    education: 'Licenciado en Ciencia Política por la Universidad Nacional de Rosario (UNR).',
    summary:
      'Politólogo graduado en la Universidad Nacional de Rosario y dirigente de la Unión Cívica Radical, fue diputado de la provincia de Santa Fe en dos períodos (2011–2015 y 2019–2023) y ministro de Seguridad provincial durante la gobernación de Miguel Lifschitz (2015–2019). En diciembre de 2023 asumió como gobernador de Santa Fe por el frente Unidos para Cambiar Santa Fe, integrando además la mesa federal de mandatarios provinciales Provincias Unidas.',
    pastAffiliations: [
      'Unión Cívica Radical (UCR)',
      'Frente Progresista, Cívico y Social (2011–2019)',
      'Juntos por el Cambio / Evolución Radical (2019–2023)',
      'Unidos para Cambiar Santa Fe / Provincias Unidas (2023–presente)',
    ],
    careerTimeline: [
      { period: '2011–2015', role: 'Diputado de la Provincia de Santa Fe', district: 'Santa Fe', coalition: 'Frente Progresista (UCR)' },
      { period: '2015–2019', role: 'Ministro de Seguridad de Santa Fe', district: 'Santa Fe', coalition: 'Frente Progresista (UCR)' },
      { period: '2019–2023', role: 'Diputado de la Provincia de Santa Fe', district: 'Santa Fe', coalition: 'UCR / Juntos por el Cambio' },
      { period: '2023–presente', role: 'Gobernador de la Provincia de Santa Fe', district: 'Santa Fe', coalition: 'Unidos para Cambiar Santa Fe' },
    ],
    policyAxes: [
      { topic: 'Seguridad y Cárceles', position: 'Impulsa el control estricto de detenidos de alto perfil en cárceles provinciales, establecimientos de máxima seguridad y coordinación operativa federal contra el narcotráfico.' },
      { topic: 'Economía y Producción', position: 'Defiende la baja de retenciones agropecuarias, la infraestructura logística portuaria y vial de Santa Fe y el equilibrio fiscal provincial.' },
      { topic: 'Educación y Estado', position: 'Promueve reformas administrativas en el Estado santafesino, incentivos por presentismo docente y cambios en evaluación escolar.' },
      { topic: 'Federalismo', position: 'Articula con otros gobernadores en Provincias Unidas para negociar recursos federales, respaldando el equilibrio fiscal pero reclamando inversión productiva.' },
    ],
    sources: ['santafe.gob.ar'],
    partyColor: COLORS.ucr,
    matchAliases: ['maximiliano pullaro', 'pullaro'],
  },
  {
    slug: 'maximo-kirchner',
    name: 'Máximo Kirchner',
    fullName: 'Máximo Carlos Kirchner',
    avatar: '/images/politicians/maximo-kirchner.jpg',
    avatarCredit: 'HCDN / Wikimedia Commons',
    coalition: 'Partido Justicialista / La Cámpora / UP',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputado de la Nación Argentina y Presidente del Congreso del PJ bonaerense',
    district: 'Provincia de Buenos Aires',
    birthDate: '16/02/1977',
    birthPlace: 'La Plata, Provincia de Buenos Aires',
    education: 'Estudios universitarios incompletos de Periodismo y Derecho (sin título de grado).',
    summary:
      'Cofundador de la agrupación política La Cámpora en 2006, accedió a la Cámara de Diputados de la Nación en 2015 en representación de Santa Cruz y desde 2019 ocupa una banca por la provincia de Buenos Aires. Presidió el bloque del Frente de Todos hasta 2022 y condujo el Partido Justicialista bonaerense entre 2021 y 2026, año en que pasó a presidir el Congreso partidario provincial.',
    pastAffiliations: [
      'La Cámpora (cofundador en 2006)',
      'Frente para la Victoria (2015–2017)',
      'Unidad Ciudadana (2017–2019)',
      'Frente de Todos (2019–2023)',
      'Unión por la Patria (2023–presente)',
    ],
    careerTimeline: [
      { period: '2015–2019', role: 'Diputado de la Nación Argentina', district: 'Santa Cruz', coalition: 'Frente para la Victoria / Unidad Ciudadana' },
      { period: '2019–presente', role: 'Diputado de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'Frente de Todos / Unión por la Patria' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Impulsa impuestos extraordinarios a grandes fortunas (como el Aporte Solidario de 2020), controles a la fuga de capitales y rechazo a acuerdos de ajuste con el FMI.' },
      { topic: 'Rol del Estado', position: 'Defiende la preservación de empresas públicas, los subsidios segmentados a tarifas y el financiamiento estatal de la obra pública y la educación.' },
      { topic: 'Trabajo y Previsión', position: 'Promueve la actualización de haberes jubilatorios, el fortalecimiento sindical y la oposición a reformas laborales flexibilizadoras.' },
      { topic: 'Instituciones', position: 'Sostiene la conducción orgánica del peronismo bonaerense y la articulación parlamentaria opositora frente a las reformas de La Libertad Avanza.' },
    ],
    sources: ['hcdn.gob.ar', 'lanoticia1.com'],
    partyColor: COLORS.up,
    matchAliases: ['maximo kirchner'],
  },
  {
    slug: 'myriam-bregman',
    name: 'Myriam Bregman',
    fullName: 'Myriam Teresa Bregman',
    avatar: '/images/politicians/myriam-bregman.jpg',
    avatarCredit: 'Wikimedia Commons (CC BY-SA 4.0)',
    coalition: 'PTS / Frente de Izquierda - Unidad (FIT-U)',
    spaceGroup: 'Izquierda',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputada de la Nación Argentina',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '25/02/1972',
    birthPlace: 'Timote, Provincia de Buenos Aires',
    education: 'Abogada por la Facultad de Derecho de la Universidad de Buenos Aires (UBA).',
    summary:
      'Abogada egresada de la Universidad de Buenos Aires, fundó el Centro de Profesionales por los Derechos Humanos (CeProDH) e intervino como querellante en juicios por delitos de lesa humanidad. Referente del Partido de los Trabajadores Socialistas y candidata presidencial del FIT-U en 2023, fue legisladora porteña y diputada nacional en períodos anteriores, y en diciembre de 2025 asumió un nuevo mandato en la Cámara de Diputados por la Ciudad de Buenos Aires.',
    pastAffiliations: [
      'Partido de los Trabajadores Socialistas (PTS)',
      'Frente de Izquierda y de los Trabajadores (2011–2019)',
      'Frente de Izquierda y de Trabajadores - Unidad (2019–presente)',
    ],
    careerTimeline: [
      { period: '2015–2016', role: 'Diputada de la Nación Argentina (banca rotativa)', district: 'Provincia de Buenos Aires', coalition: 'FIT (PTS)' },
      { period: '2017–2021', role: 'Legisladora de la CABA', district: 'CABA', coalition: 'FIT / FIT-U' },
      { period: '2021–2024', role: 'Diputada de la Nación Argentina (banca rotativa)', district: 'CABA', coalition: 'FIT-U (PTS)' },
      { period: '2025–presente', role: 'Diputada de la Nación Argentina', district: 'CABA', coalition: 'FIT-U (PTS)' },
    ],
    policyAxes: [
      { topic: 'Economía y Deuda', position: 'Propone el desconocimiento y no pago de la deuda externa con el FMI, la nacionalización de la banca y el comercio exterior, y servicios públicos bajo control obrero.' },
      { topic: 'Trabajo', position: 'Impulsa la reducción de la jornada laboral a seis horas diarias sin rebaja salarial y la indexación automática de salarios y jubilaciones por inflación.' },
      { topic: 'Derechos Humanos', position: 'Defiende los juicios por delitos de lesa humanidad, el derecho al aborto legal y el rechazo a protocolos policiales que restrinjan la protesta social.' },
      { topic: 'Instituciones', position: 'Promueve la rotación de bancas legislativas y la equiparación de la dieta parlamentaria al salario docente.' },
    ],
    sources: ['hcdn.gob.ar', 'legislatura.gob.ar'],
    partyColor: COLORS.izquierda,
    matchAliases: ['myriam bregman', 'bregman'],
  },
  {
    slug: 'nicolas-del-cano',
    name: 'Nicolás del Caño',
    fullName: 'Nicolás del Caño',
    avatar: '/images/politicians/nicolas-del-cano.jpg',
    avatarCredit: 'HCDN — diputados.gov.ar (Dominio Público)',
    coalition: 'PTS / Frente de Izquierda - Unidad (FIT-U)',
    spaceGroup: 'Izquierda',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Diputado de la Nación Argentina',
    district: 'Provincia de Buenos Aires',
    birthDate: '06/02/1980',
    birthPlace: 'Ciudad de Córdoba, Provincia de Córdoba',
    education: 'Estudios universitarios en la UNC y Sociología en la UNCUYO (sin título de grado finalizado).',
    summary:
      'Dirigente del Partido de los Trabajadores Socialistas y referente del Frente de Izquierda y de Trabajadores - Unidad, fue candidato presidencial en 2015 y 2019 y candidato a vicepresidente en 2023. Ocupó bancas rotativas como diputado nacional por Mendoza (2013–2015) y por la provincia de Buenos Aires desde 2017, renovando su escaño en diciembre de 2025 tras los comicios legislativos de ese año.',
    pastAffiliations: [
      'Partido de los Trabajadores Socialistas (PTS)',
      'Frente de Izquierda y de los Trabajadores (2011–2019)',
      'Frente de Izquierda y de Trabajadores - Unidad (2019–presente)',
    ],
    careerTimeline: [
      { period: '2013–2015', role: 'Diputado de la Nación Argentina (banca rotativa)', district: 'Mendoza', coalition: 'FIT (PTS)' },
      { period: '2017–2021', role: 'Diputado de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'FIT / FIT-U' },
      { period: '2021–2025', role: 'Diputado de la Nación Argentina (rotada en jul 2025)', district: 'Provincia de Buenos Aires', coalition: 'FIT-U (PTS)' },
      { period: '2025–presente', role: 'Diputado de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'FIT-U (PTS)' },
    ],
    policyAxes: [
      { topic: 'Trabajo y Salarios', position: 'Impulsa proyectos de ley para establecer la jornada laboral de seis horas, prohibir despidos y fijar el salario mínimo equivalente a la canasta familiar.' },
      { topic: 'Economía y Deuda', position: 'Sostiene la ruptura con el FMI, la investigación y anulación de la deuda externa y la aplicación de impuestos permanentes a las grandes fortunas.' },
      { topic: 'Rol del Estado', position: 'Defiende la educación y salud públicas gratuitas, la estatización del transporte y la energía, y rechaza las privatizaciones y el RIGI.' },
      { topic: 'Instituciones', position: 'Mantiene el compromiso estatutario del FIT-U de rotar las bancas parlamentarias y percibir un ingreso equivalente al sueldo docente.' },
    ],
    sources: ['hcdn.gob.ar', 'lanoticia1.com'],
    partyColor: COLORS.izquierda,
    matchAliases: ['nicolas del cano', 'del cano'],
  },
  {
    slug: 'patricia-bullrich',
    name: 'Patricia Bullrich',
    fullName: 'Patricia Bullrich Luro Pueyrredón',
    avatar: '/images/politicians/patricia-bullrich.jpg',
    avatarCredit: 'Senado de la Nación / Archivo oficial',
    coalition: 'La Libertad Avanza',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Congreso y Legislatura',
    role: 'Senadora Nacional y Presidenta del Bloque LLA',
    district: 'Ciudad Autónoma de Buenos Aires',
    birthDate: '11/06/1956',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Licenciada en Humanidades (UP), Magíster en Ciencia Política (FLACSO) y Doctora en Ciencia Política (UNSAM).',
    summary:
      'Doctora en Ciencia Política por la UNSAM, ocupó bancas en la Cámara de Diputados y condujo las carteras nacionales de Trabajo, Seguridad Social y, en dos períodos distintos, Seguridad Nacional. Tras renunciar al Ministerio de Seguridad en diciembre de 2025 luego de resultar electa en los comicios legislativos, asumió como senadora nacional por la Ciudad de Buenos Aires al frente del bloque de La Libertad Avanza.',
    pastAffiliations: [
      'Partido Justicialista (1973–1997)',
      'Alianza (1999–2001)',
      'Unión por Todos / Coalición Cívica (2003–2015)',
      'Propuesta Republicana / PRO (2015–2025; presidenta 2020–2024)',
      'La Libertad Avanza (2025–presente)',
    ],
    careerTimeline: [
      { period: '1993–1997', role: 'Diputada de la Nación Argentina', district: 'CABA', coalition: 'Partido Justicialista' },
      { period: '2000–2001', role: 'Ministra de Trabajo y luego de Seguridad Social', district: 'Nación Argentina', coalition: 'Alianza' },
      { period: '2007–2015', role: 'Diputada de la Nación Argentina (2 mandatos)', district: 'CABA', coalition: 'Coalición Cívica / Unión por Todos' },
      { period: '2015–2019', role: 'Ministra de Seguridad de la Nación', district: 'Nación Argentina', coalition: 'Cambiemos (PRO)' },
      { period: '2023–2025', role: 'Ministra de Seguridad Nacional', district: 'Nación Argentina', coalition: 'La Libertad Avanza / PRO' },
      { period: '2025–presente', role: 'Senadora de la Nación Argentina', district: 'CABA', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Seguridad', position: 'Impulsa la aplicación del protocolo antipiquetes, el despliegue de fuerzas federales en zonas de narcocriminalidad y la baja de la edad de imputabilidad penal.' },
      { topic: 'Economía', position: 'Respalda el programa de ajuste fiscal, desregulación laboral y apertura económica impulsado por La Libertad Avanza.' },
      { topic: 'Justicia Penal', position: 'Promueve reformas al Código Penal como la ley antimafias, la reiterancia delictiva y el registro nacional de datos genéticos.' },
      { topic: 'Política Exterior', position: 'Acompaña la cooperación bilateral en seguridad e inteligencia con Estados Unidos e Israel.' },
    ],
    sources: ['senado.gob.ar', 'chequeado.com'],
    partyColor: COLORS.lla,
    matchAliases: ['patricia bullrich', 'bullrich'],
  },
  {
    slug: 'sergio-massa',
    name: 'Sergio Massa',
    fullName: 'Sergio Tomás Massa',
    avatar: '/images/politicians/sergio-massa.jpg',
    avatarCredit: 'Archivo oficial HCDN',
    coalition: 'Frente Renovador / Unión por la Patria',
    spaceGroup: 'Unión por la Patria / PJ',
    scopeGroup: 'Referentes',
    role: 'Referente del Frente Renovador (sin cargo estatal)',
    district: 'Provincia de Buenos Aires',
    birthDate: '28/04/1972',
    birthPlace: 'San Martín, Provincia de Buenos Aires',
    education: 'Abogado por la Universidad de Belgrano (UB).',
    summary:
      'Abogado egresado de la Universidad de Belgrano, inició su actividad partidaria en la UCeDé antes de incorporarse al Partido Justicialista y dirigir la ANSES, la intendencia de Tigre y la Jefatura de Gabinete de la Nación. Fundó el Frente Renovador en 2013, presidió la Cámara de Diputados entre 2019 y 2022, ejerció como ministro de Economía hasta diciembre de 2023 y fue candidato presidencial de Unión por la Patria en las elecciones de ese año.',
    pastAffiliations: [
      'UCeDé (juventud)',
      'Partido Justicialista / Frente para la Victoria (1995–2013)',
      'Frente Renovador / UNA / 1País (2013–2019)',
      'Frente de Todos / Unión por la Patria (2019–presente)',
    ],
    careerTimeline: [
      { period: '1999–2002', role: 'Diputado de la Provincia de Buenos Aires', district: 'Provincia de Buenos Aires', coalition: 'Partido Justicialista' },
      { period: '2002–2007', role: 'Director Ejecutivo de la ANSES', district: 'Nación Argentina', coalition: 'PJ / Frente para la Victoria' },
      { period: '2007–2013', role: 'Intendente de Tigre (licencia 2008–2009)', district: 'Tigre, PBA', coalition: 'Frente para la Victoria' },
      { period: '2008–2009', role: 'Jefe de Gabinete de Ministros de la Nación', district: 'Nación Argentina', coalition: 'Frente para la Victoria' },
      { period: '2013–2017', role: 'Diputado de la Nación Argentina', district: 'Provincia de Buenos Aires', coalition: 'Frente Renovador' },
      { period: '2019–2022', role: 'Presidente de la Cámara de Diputados de la Nación', district: 'Provincia de Buenos Aires', coalition: 'Frente de Todos' },
      { period: '2022–2023', role: 'Ministro de Economía de la Nación', district: 'Nación Argentina', coalition: 'Frente de Todos / UP' },
    ],
    policyAxes: [
      { topic: 'Economía', position: 'Promueve la industrialización con valor agregado, el impulso a las exportaciones energéticas y mineras para acumular reservas y la reducción de impuestos a los salarios.' },
      { topic: 'Rol del Estado', position: 'Sostiene un Estado con capacidad de regulación comercial y fomento productivo articulado con cámaras empresarias y sindicatos.' },
      { topic: 'Seguridad', position: 'Impulsa políticas de prevención municipal con centros de monitoreo, fuerzas locales y endurecimiento de penas contra el narcotráfico.' },
      { topic: 'Política Exterior', position: 'Favorece una inserción pragmática con socios comerciales diversos, incluyendo Estados Unidos, Brasil, China y organismos multilaterales.' },
    ],
    sources: ['hcdn.gob.ar', 'chequeado.com'],
    partyColor: COLORS.upAlt,
    matchAliases: ['sergio massa', 'massa'],
  },
  {
    slug: 'victoria-villarruel',
    name: 'Victoria Villarruel',
    fullName: 'Victoria Eugenia Villarruel',
    avatar: '/images/politicians/victoria-villarruel.jpg',
    avatarCredit: 'Honorable Senado de la Nación',
    coalition: 'Partido Demócrata / electa por LLA',
    spaceGroup: 'La Libertad Avanza',
    scopeGroup: 'Ejecutivo Nacional',
    role: 'Vicepresidenta de la Nación y Presidenta del Senado',
    district: 'Nación Argentina',
    birthDate: '13/04/1975',
    birthPlace: 'Ciudad Autónoma de Buenos Aires',
    education: 'Abogada (UBA) y Técnica en Seguridad Urbana y Portuaria (UTN).',
    summary:
      'Abogada egresada de la Universidad de Buenos Aires y técnica en Seguridad Urbana y Portuaria por la UTN, fundó y presidió la asociación civil CELTYV antes de incursionar en la política partidaria. Fue electa diputada nacional por la Ciudad de Buenos Aires en 2021 y desde diciembre de 2023 ocupa la Vicepresidencia de la Nación y la presidencia del Senado.',
    pastAffiliations: [
      'CELTYV (asociación civil, fundadora en 2006)',
      'Alianza La Libertad Avanza (2021–2023)',
      'Partido Demócrata de la Provincia de Buenos Aires (desde 2022)',
    ],
    careerTimeline: [
      { period: '2021–2023', role: 'Diputada de la Nación Argentina', district: 'CABA', coalition: 'La Libertad Avanza' },
      { period: '2023–presente', role: 'Vicepresidenta de la Nación / Presidenta del Senado', district: 'Nación Argentina', coalition: 'La Libertad Avanza' },
    ],
    policyAxes: [
      { topic: 'Seguridad y Defensa', position: 'Propone fortalecer el presupuesto y el equipamiento de las Fuerzas Armadas y revisar la normativa de defensa nacional para ampliar su capacidad operativa.' },
      { topic: 'Memoria y Justicia', position: 'Sostiene el reconocimiento estatal y judicial de las víctimas civiles y militares de organizaciones armadas de la década de 1970.' },
      { topic: 'Agenda Social', position: 'Manifiesta oposición a la legalización del aborto (Ley 27.610) y defiende posiciones conservadoras en materia de familia y cultura.' },
      { topic: 'Instituciones y Soberanía', position: 'Enfatiza el rol autónomo del Senado como cámara representativa de las provincias y defiende la soberanía argentina sobre las Islas Malvinas.' },
    ],
    sources: ['senado.gob.ar', 'hcdn.gob.ar'],
    partyColor: COLORS.llaAlt,
    matchAliases: ['victoria villarruel', 'villarruel'],
  },
];

export const POLITICIANS: Record<string, PoliticianConfig> = Object.fromEntries(
  POLITICIANS_LIST.map((p) => [p.name, p])
);

export const POLITICIANS_BY_SLUG: Record<string, PoliticianConfig> = Object.fromEntries(
  POLITICIANS_LIST.map((p) => [p.slug, p])
);

export function getPolitician(name: string): PoliticianConfig {
  if (POLITICIANS[name]) return POLITICIANS[name];
  const slug = slugifyPolitician(name);
  if (POLITICIANS_BY_SLUG[slug]) return POLITICIANS_BY_SLUG[slug];

  return {
    slug,
    name,
    fullName: name,
    avatar: '',
    avatarCredit: '',
    coalition: 'Sector Político',
    spaceGroup: 'Otros',
    scopeGroup: 'Referentes',
    role: 'Figura Pública',
    district: 'Nación Argentina',
    birthDate: '',
    birthPlace: '',
    education: '',
    summary: '',
    pastAffiliations: [],
    careerTimeline: [],
    policyAxes: [],
    sources: [],
    partyColor: COLORS.otros,
  };
}

export function getPoliticianBySlug(slug: string): PoliticianConfig | null {
  const normalized = slugifyPolitician(slug);
  return POLITICIANS_BY_SLUG[normalized] || null;
}

export function calculateAge(birthDateDDMMYYYY: string): number | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((birthDateDDMMYYYY || '').trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() < month || (now.getMonth() === month && now.getDate() < day)) {
    age -= 1;
  }
  return age >= 0 && age < 120 ? age : null;
}
