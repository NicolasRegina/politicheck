export interface OutletMeta {
  id: string;
  name: string;
  code: string;
  category: 'nacional' | 'internacional';
  baselineLeaning: 'oficialismo' | 'centro_datos' | 'oposicion';
  websiteUrl: string;
  badgeClass: string;
}

export const OUTLETS_REGISTRY: Record<string, OutletMeta> = {
  // 1. Clarín
  clarin: {
    id: 'clarin',
    name: 'Clarín',
    code: 'CLARÍN',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.clarin.com',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800'
  },
  // 2. La Nación
  lanacion: {
    id: 'lanacion',
    name: 'La Nación',
    code: 'LA NACIÓN',
    category: 'nacional',
    baselineLeaning: 'oficialismo',
    websiteUrl: 'https://www.lanacion.com.ar',
    badgeClass: 'bg-sky-100 text-sky-950 dark:bg-sky-950/70 dark:text-sky-200 border-sky-300 dark:border-sky-800'
  },
  // 3. Infobae
  infobae: {
    id: 'infobae',
    name: 'Infobae',
    code: 'INFOBAE',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.infobae.com',
    badgeClass: 'bg-orange-100 text-orange-950 dark:bg-orange-950/70 dark:text-orange-200 border-orange-300 dark:border-orange-800'
  },
  // 4. Todo Noticias (TN)
  tn: {
    id: 'tn',
    name: 'Todo Noticias (TN)',
    code: 'TN',
    category: 'nacional',
    baselineLeaning: 'oficialismo',
    websiteUrl: 'https://tn.com.ar',
    badgeClass: 'bg-blue-100 text-blue-950 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300 dark:border-blue-800'
  },
  // 5. Página 12
  pagina12: {
    id: 'pagina12',
    name: 'Página 12',
    code: 'PÁGINA 12',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.pagina12.com.ar',
    badgeClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800'
  },
  // 6. Ámbito Financiero
  ambito: {
    id: 'ambito',
    name: 'Ámbito Financiero',
    code: 'ÁMBITO',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.ambito.com',
    badgeClass: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950/70 dark:text-indigo-200 border-indigo-300 dark:border-indigo-800'
  },
  // 7. El Cronista
  cronista: {
    id: 'cronista',
    name: 'El Cronista',
    code: 'EL CRONISTA',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.cronista.com',
    badgeClass: 'bg-teal-100 text-teal-950 dark:bg-teal-950/70 dark:text-teal-200 border-teal-300 dark:border-teal-800'
  },
  // 8. Diario Perfil
  perfil: {
    id: 'perfil',
    name: 'Perfil',
    code: 'PERFIL',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.perfil.com',
    badgeClass: 'bg-purple-100 text-purple-950 dark:bg-purple-950/70 dark:text-purple-200 border-purple-300 dark:border-purple-800'
  },
  // 9. elDiarioAR
  eldiarioar: {
    id: 'eldiarioar',
    name: 'elDiarioAR',
    code: 'ELDIARIO.AR',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.eldiarioar.com',
    badgeClass: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
  },
  // 10. Crónica
  cronica: {
    id: 'cronica',
    name: 'Crónica',
    code: 'CRÓNICA',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.cronica.com.ar',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },
  // 11. BAE Negocios
  baenegocios: {
    id: 'baenegocios',
    name: 'BAE Negocios',
    code: 'BAE NEGOCIOS',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.baenegocios.com',
    badgeClass: 'bg-amber-100 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-800'
  },
  // 12. La Izquierda Diario
  izquierdadiario: {
    id: 'izquierdadiario',
    name: 'La Izquierda Diario',
    code: 'IZQUIERDA DIARIO',
    category: 'nacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://www.laizquierdadiario.com',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-300 dark:border-rose-800'
  },
  // 13. Cenital
  cenital: {
    id: 'cenital',
    name: 'Cenital',
    code: 'CENITAL',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://cenital.com',
    badgeClass: 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950/70 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800'
  },
  // 14. El Economista
  eleconomista: {
    id: 'eleconomista',
    name: 'El Economista',
    code: 'EL ECONOMISTA',
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://eleconomista.com.ar',
    badgeClass: 'bg-yellow-100 text-yellow-950 dark:bg-yellow-950/70 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800'
  },
  // 15. Financial Times
  ft: {
    id: 'ft',
    name: 'Financial Times',
    code: 'FINANCIAL TIMES',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.ft.com',
    badgeClass: 'bg-pink-100 text-pink-950 dark:bg-pink-950/70 dark:text-pink-200 border-pink-300 dark:border-pink-800'
  },
  // 16. El País
  elpais: {
    id: 'elpais',
    name: 'El País',
    code: 'EL PAÍS',
    category: 'internacional',
    baselineLeaning: 'oposicion',
    websiteUrl: 'https://elpais.com',
    badgeClass: 'bg-slate-200 text-slate-950 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
  },
  // 17. CNN en Español
  cnn: {
    id: 'cnn',
    name: 'CNN en Español',
    code: 'CNN',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://cnnespanol.cnn.com',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  },
  // 18. BBC News Mundo
  bbcmundo: {
    id: 'bbcmundo',
    name: 'BBC News Mundo',
    code: 'BBC MUNDO',
    category: 'internacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: 'https://www.bbc.com/mundo',
    badgeClass: 'bg-red-100 text-red-950 dark:bg-red-950/70 dark:text-red-200 border-red-300 dark:border-red-800'
  }
};

export function getOutletMeta(id: string): OutletMeta {
  if (OUTLETS_REGISTRY[id]) return OUTLETS_REGISTRY[id];

  return {
    id,
    name: id.toUpperCase(),
    code: id.toUpperCase(),
    category: 'nacional',
    baselineLeaning: 'centro_datos',
    websiteUrl: '#',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
  };
}
