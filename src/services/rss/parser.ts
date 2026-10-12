import type { Article } from '../../types';
import type { RssFeedConfig } from './sources';

// HTML Entity decoder helper
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ');
}

// Clean string from CDATA and HTML tags
function cleanText(raw: string): string {
  if (!raw) return '';
  const withoutCdata = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  const withoutTags = withoutCdata.replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

// Format pubDate into clean news format (e.g. "21:25 hs" or "Hace 15 min")
function formatPubDate(rawDate: string): string {
  try {
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return 'Reciente';

    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
    if (diffMinutes < 1440) {
      const hours = String(date.getHours()).padStart(2, '0');
      const mins = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${mins} hs`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  } catch {
    return 'Reciente';
  }
}

import { optimizeMediaImageUrl } from '../../utils/images';

// Extract image URL from enclosure, media:content, or img tag
function extractImageUrl(itemXml: string): string | undefined {
  let rawUrl: string | undefined;

  // 1. Enclosure
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch && enclosureMatch[1] && !enclosureMatch[1].endsWith('.gif')) {
    rawUrl = enclosureMatch[1];
  } else {
    // 2. Media content
    const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
    if (mediaMatch && mediaMatch[1] && !mediaMatch[1].endsWith('.gif')) {
      rawUrl = mediaMatch[1];
    } else {
      // 3. Img inside description
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      if (descMatch) {
        const imgMatch = descMatch[1].match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1] && !imgMatch[1].includes('tracking') && !imgMatch[1].endsWith('.gif')) {
          rawUrl = imgMatch[1];
        }
      }
    }
  }

  return rawUrl ? optimizeMediaImageUrl(rawUrl, 800) : undefined;
}

// Filter out non-civic/non-political content (sports fixtures, entertainment gossip, horoscopes, or foreign non-Argentine local hubs)
export function isEditorialRelevantArticle(
  rawLink: string,
  title: string,
  snippet: string,
  category: 'nacional' | 'internacional' = 'nacional'
): boolean {
  const lowerUrl = (rawLink || '').toLowerCase();
  const lowerTitle = (title || '').toLowerCase();
  const lowerText = `${lowerTitle} ${(snippet || '').toLowerCase()}`;

  // 1. Exclude non-journalistic/sports/entertainment sections UNLESS there is a verified institutional/civic intersection (ADR 0006)
  const blacklistedUrlSegments = [
    '/deportes/',
    '/futbol/',
    '/teleshow/',
    '/espectaculos/',
    '/farandula/',
    '/famosos/',
    '/horoscopo/',
    '/zodiaco/',
    '/virales/',
    '/tendencias/',
    '/recetas/',
    '/gaming/',
    '/videojuegos/',
    '/celebrities/'
  ];

  const institutionalOverrideKeywords = [
    'gobierno', 'milei', 'justicia', 'ley', 'dnu', 'afa', 'igj', 'sad',
    'sociedades anonimas', 'casa rosada', 'denuncia', 'juez', 'congreso',
    'causa', 'arancel', 'incaa', 'fondos', 'campeon del mundo', 'campeón del mundo',
    'duelo nacional', 'luto'
  ];

  const hasInstitutionalAngle = institutionalOverrideKeywords.some(k => lowerText.includes(k));

  if (blacklistedUrlSegments.some(seg => lowerUrl.includes(seg))) {
    if (!hasInstitutionalAngle) {
      return false;
    }
  }

  // 2. For Argentine national outlets (e.g. Infobae global firehose), exclude foreign local hubs
  if (category === 'nacional') {
    const foreignCountryPaths = [
      'infobae.com/peru/',
      'infobae.com/mexico/',
      'infobae.com/colombia/',
      'infobae.com/espana/',
      'infobae.com/america/deportes/'
    ];
    if (foreignCountryPaths.some(path => lowerUrl.includes(path))) {
      return false;
    }
  }

  // 3. Always exclude sports match summaries and tournament fixtures (even with keywords)
  const sportsMatchPatterns = [
    /\b(vs\.?|contra|enfrenta a|visita a|recibe a)\b/i,
    /\b(minuto a minuto|en vivo hoy:? minuto a minuto)\b/i,
    /\b(liga 1|copa libertadores|copa sudamericana|torneo clausura|torneo apertura|champions league|premier league|la liga)\b/i,
    /\b(tabla de posiciones|goleadores|alineaciones|resumen y goles)\b/i
  ];

  const sportsKeywords = ['partido', 'goles', 'gol', 'torneo', 'estadio', 'apuestas', 'penales', 'dt '];
  if (sportsMatchPatterns.some(pat => pat.test(lowerTitle)) && sportsKeywords.some(k => lowerText.includes(k))) {
    return false;
  }

  return true;
}

export async function parseFeed(config: RssFeedConfig, timeoutMs = 8000): Promise<Article[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PoliticheckBot/1.0 (+https://politicheck.ar)',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      }
    });

    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[RSS Parser] Feed ${config.id} returned status ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    const articles: Article[] = [];

    for (let i = 0; i < itemMatches.length; i++) {
      const itemXml = itemMatches[i];

      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || itemXml.match(/<dc:date>([\s\S]*?)<\/dc:date>/i);

      const title = cleanText(titleMatch ? titleMatch[1] : '');
      const rawLink = cleanText(linkMatch ? linkMatch[1] : '');
      const snippet = cleanText(descMatch ? descMatch[1] : '').slice(0, 200);
      const pubDate = cleanText(pubDateMatch ? pubDateMatch[1] : '');
      const imageUrl = extractImageUrl(itemXml);

      let articleTimestamp = 0;
      if (pubDate) {
        const parsedD = new Date(pubDate);
        if (!isNaN(parsedD.getTime())) {
          articleTimestamp = parsedD.getTime();
        }
      }
      if (articleTimestamp === 0) {
        articleTimestamp = Date.now() - (i * 5 * 60 * 1000);
      }

      // Validate minimum editorial requirements and topical relevance
      if (
        title.length > 10 &&
        rawLink.startsWith('http') &&
        isEditorialRelevantArticle(rawLink, title, snippet, config.category)
      ) {
        const id = `art-${config.outletId}-${Math.abs(title.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`;
        
        articles.push({
          id,
          outletId: config.outletId,
          outletName: config.outletName,
          title,
          snippet,
          url: rawLink,
          publishedAt: formatPubDate(pubDate),
          timestamp: articleTimestamp,
          imageUrl
        });
      }
    }

    return articles;
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[RSS Parser] Failed to fetch feed ${config.id}:`, (err as Error).message);
    return [];
  }
}
