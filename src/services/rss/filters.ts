/**
 * Filter utility to determine if an international news article
 * is relevant to Argentine politics, economy, figures or society.
 */

const ARGENTINA_TERMS = [
  // Demonyms and Country
  'argentina',
  'argentino',
  'argentinos',
  'argentina',
  'argentinas',
  'argentine',
  'argentines',
  'argentinien',
  'buenos aires',
  'casa rosada',
  'quinta de olivos',
  'malvinas',
  'falkland',
  'falklands',

  // Key Political Figures
  'milei',
  'javier milei',
  'karina milei',
  'kirchner',
  'cristina kirchner',
  'maximo kirchner',
  'nestor kirchner',
  'cfk',
  'kirchnerismo',
  'kirchnerista',
  'kirchneristas',
  'kicillof',
  'axel kicillof',
  'macri',
  'mauricio macri',
  'bullrich',
  'patricia bullrich',
  'caputo',
  'luis caputo',
  'toto caputo',
  'villarruel',
  'victoria villarruel',
  'massa',
  'sergio massa',
  'sturzenegger',
  'federico sturzenegger',
  'francos',
  'guillermo francos',
  'manuel adorni',
  'adorni',
  'aramburu',
  'federico martin aramburu',

  // Movements and Coalitions
  'la libertad avanza',
  'libertario',
  'libertarios',
  'peronismo',
  'peronista',
  'peronistas',
  'juntos por el cambio',
  'union por la patria',
  'partido justicialista',

  // Economics, Institutions & Social Conflict
  'riesgo pais',
  'riesgo-pais',
  'banco central de la republica argentina',
  'banco central argentino',
  'bcra',
  'dolar blue',
  'peso argentino',
  'pesos argentinos',
  'cepo cambiario',
  'piquete',
  'piquetes',
  'piquetero',
  'piqueteros',
  'cacerolazo',
  'cacerolazos',
  'ley bases',
  'dnu 70',
  'aerolineas argentinas',
  'ypf',
  'vaca muerta'
];

function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether an article discusses Argentina, its government, politicians, or economy.
 */
export function isRelevantToArgentina(article: { title: string; snippet?: string; url?: string }): boolean {
  const normTitle = normalizeText(article.title);
  const normSnippet = normalizeText(article.snippet || '');
  const combined = `${normTitle} ${normSnippet}`;

  for (const term of ARGENTINA_TERMS) {
    const normTerm = normalizeText(term);
    if (!normTerm) continue;

    // Check whole word boundary
    const regex = new RegExp(`(^|\\s)${normTerm}(\\s|$)`, 'i');
    if (regex.test(combined)) {
      return true;
    }
  }

  // Also check URL slug if it contains /argentina/
  if (article.url) {
    const lowerUrl = article.url.toLowerCase();
    if (lowerUrl.includes('/argentina/') || lowerUrl.includes('-argentina-') || lowerUrl.includes('/argentina-')) {
      return true;
    }
  }

  return false;
}
