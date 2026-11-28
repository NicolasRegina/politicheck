const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  : null;

const RSS_FEEDS = [
  // 1. Clarín
  { id: 'clarin-politica', outletId: 'clarin', outletName: 'Clarín', category: 'nacional', url: 'https://www.clarin.com/rss/politica/' },
  { id: 'clarin-economia', outletId: 'clarin', outletName: 'Clarín', category: 'nacional', url: 'https://www.clarin.com/rss/economia/' },
  { id: 'clarin-lo-ultimo', outletId: 'clarin', outletName: 'Clarín', category: 'nacional', url: 'https://www.clarin.com/rss/lo-ultimo/' },

  // 2. La Nación
  { id: 'lanacion-general', outletId: 'lanacion', outletName: 'La Nación', category: 'nacional', url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml' },

  // 3. Infobae
  { id: 'infobae-general', outletId: 'infobae', outletName: 'Infobae', category: 'nacional', url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml' },

  // 4. Todo Noticias (TN)
  { id: 'tn-general', outletId: 'tn', outletName: 'Todo Noticias (TN)', category: 'nacional', url: 'https://tn.com.ar/rss.xml' },

  // 5. Página 12
  { id: 'pagina12-portada', outletId: 'pagina12', outletName: 'Página 12', category: 'nacional', url: 'https://www.pagina12.com.ar/rss/portada.xml' },

  // 6. Ámbito Financiero
  { id: 'ambito-home', outletId: 'ambito', outletName: 'Ámbito Financiero', category: 'nacional', url: 'https://www.ambito.com/rss/pages/home.xml' },
  { id: 'ambito-politica', outletId: 'ambito', outletName: 'Ámbito Financiero', category: 'nacional', url: 'https://www.ambito.com/rss/pages/politica.xml' },

  // 7. El Cronista
  { id: 'cronista-general', outletId: 'cronista', outletName: 'El Cronista', category: 'nacional', url: 'https://www.cronista.com/files/rss/news.xml' },

  // 8. Diario Perfil
  { id: 'perfil-general', outletId: 'perfil', outletName: 'Perfil', category: 'nacional', url: 'https://www.perfil.com/feed' },

  // 9. elDiarioAR
  { id: 'eldiarioar-general', outletId: 'eldiarioar', outletName: 'elDiarioAR', category: 'nacional', url: 'https://www.eldiarioar.com/rss/' },

  // 10. Crónica
  { id: 'cronica-general', outletId: 'cronica', outletName: 'Crónica', category: 'nacional', url: 'https://www.cronica.com.ar/feed/politica.xml' },

  // 11. BAE Negocios
  { id: 'baenegocios-general', outletId: 'baenegocios', outletName: 'BAE Negocios', category: 'nacional', url: 'https://www.baenegocios.com/feed/economia.xml' },

  // 12. La Izquierda Diario
  { id: 'izquierdadiario-general', outletId: 'izquierdadiario', outletName: 'La Izquierda Diario', category: 'nacional', url: 'https://www.laizquierdadiario.com/spip.php?page=backend' },

  // 13. Cenital
  { id: 'cenital-general', outletId: 'cenital', outletName: 'Cenital', category: 'nacional', url: 'https://cenital.com/feed/' },

  // 14. El Economista
  { id: 'eleconomista-general', outletId: 'eleconomista', outletName: 'El Economista', category: 'nacional', url: 'https://eleconomista.com.ar/feed/' },

  // 15. La Derecha Diario
  { id: 'derechadiario-general', outletId: 'derechadiario', outletName: 'La Derecha Diario', category: 'nacional', url: 'https://derechadiario.com.ar/feed/' },

  // 16. El País (Internacional)
  { id: 'elpais-america', outletId: 'elpais', outletName: 'El País', category: 'internacional', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada' },

  // 17. BBC Mundo (Internacional)
  { id: 'bbcmundo-general', outletId: 'bbcmundo', outletName: 'BBC News Mundo', category: 'internacional', url: 'https://feeds.bbci.co.uk/mundo/rss.xml' },

  // 18. France 24 (Internacional)
  { id: 'france24-americas', outletId: 'france24', outletName: 'France 24', category: 'internacional', url: 'https://www.france24.com/es/am%C3%A9ricas/rss' }
];

function decodeHtmlEntities(str) {
  return (str || '')
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

function cleanText(raw) {
  if (!raw) return '';
  const withoutCdata = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  const withoutTags = withoutCdata.replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

function formatPubDate(timestamp) {
  try {
    const date = new Date(timestamp);
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

function optimizeMediaImageUrl(url, maxWidth = 800) {
  if (!url || typeof url !== 'string') return undefined;
  let clean = url.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) return clean;
  try {
    if (clean.includes('/resizer/') || clean.includes('auth=')) {
      clean = clean.replace(/([?&])width=\d+/i, `$1width=${maxWidth}`);
      clean = clean.replace(/([?&])w=\d+/i, `$1w=${maxWidth}`);
      const maxHeight = Math.round(maxWidth * (9 / 16));
      clean = clean.replace(/([?&])height=\d+/i, `$1height=${maxHeight}`);
      clean = clean.replace(/([?&])h=\d+/i, `$1h=${maxHeight}`);
    }
    if (clean.includes('fotos.perfil.com') && clean.includes('/trim/')) {
      clean = clean.replace(/\/trim\/\d+\/\d+\//i, `/trim/${maxWidth}/${Math.round(maxWidth * 9 / 16)}/`);
    }
    if (clean.includes('clarin.com') || clean.includes('lanacion.com.ar')) {
      clean = clean.replace(/([?&])width=\d+/i, `$1width=${maxWidth}`);
      clean = clean.replace(/([?&])w=\d+/i, `$1w=${maxWidth}`);
    }
    return clean;
  } catch {
    return url;
  }
}

const NON_IMAGE_PATTERNS = [
  'vodgc.net', '/player/', '/embed/', 'youtube.com', 'youtu.be', 'vimeo.com',
  'dailymotion.com', 'jwplatform.com', 'brightcove', 'rudo.video', 'mdstrm.com',
  'twitch.tv', 'spotify.com', 'soundcloud.com', 'doubleclick.net', 'googlesyndication.com',
  'tracking', 'pixel.'
];
const NON_IMAGE_EXT = /\.(mp4|m3u8|webm|mov|avi|mp3|wav|ogg|m4a|pdf|html?|php|js|css|gif)(\?|#|$)/i;

function isValidImageUrl(u) {
  if (!u) return false;
  const clean = u.replace(/&amp;/g, '&').trim();
  if (!/^https?:\/\//i.test(clean)) return false;
  const lower = clean.toLowerCase();
  return !NON_IMAGE_EXT.test(lower) && !NON_IMAGE_PATTERNS.some((p) => lower.includes(p));
}

function extractImageUrl(itemXml) {
  const candidates = [];
  for (const m of itemXml.matchAll(/<enclosure\b([^>]+)>/gi)) {
    const attrs = m[1] || '';
    if (/type=["'](?:video|audio)\//i.test(attrs)) continue;
    const urlMatch = attrs.match(/\burl=["']([^"']+)["']/i);
    if (urlMatch?.[1]) candidates.push(urlMatch[1]);
  }
  for (const m of itemXml.matchAll(/<media:content\b([^>]+)>/gi)) {
    const attrs = m[1] || '';
    if (/medium=["'](?:video|audio)["']/i.test(attrs) || /type=["'](?:video|audio)\//i.test(attrs)) continue;
    const urlMatch = attrs.match(/\burl=["']([^"']+)["']/i);
    if (urlMatch?.[1]) candidates.push(urlMatch[1]);
  }
  for (const m of itemXml.matchAll(/<media:thumbnail\b([^>]+)>/gi)) {
    const urlMatch = (m[1] || '').match(/\burl=["']([^"']+)["']/i);
    if (urlMatch?.[1]) candidates.push(urlMatch[1]);
  }
  const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
  if (descMatch) {
    for (const m of descMatch[1].matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
      if (m[1]) candidates.push(m[1]);
    }
  }
  const validRaw = candidates.find(isValidImageUrl);
  return validRaw ? optimizeMediaImageUrl(validRaw, 800) : undefined;
}

const ARGENTINA_KEYWORDS = [
  'argentina', 'argentino', 'argentinos', 'milei', 'buenos aires', 'casa rosada',
  'kicillof', 'malvinas', 'patagonia', 'caputo', 'bullrich', 'indec', 'bcra'
];

function isRelevantToArgentina(title, snippet) {
  const text = `${title || ''} ${snippet || ''}`.toLowerCase();
  return ARGENTINA_KEYWORDS.some(k => text.includes(k));
}

function isEditorialRelevantArticle(rawLink, title, snippet, category = 'nacional') {
  const lowerUrl = (rawLink || '').toLowerCase();
  const lowerTitle = (title || '').toLowerCase();
  const lowerText = `${lowerTitle} ${(snippet || '').toLowerCase()}`;

  const blacklistedUrlSegments = [
    '/deportes/', '/futbol/', '/teleshow/', '/espectaculos/', '/farandula/',
    '/famosos/', '/horoscopo/', '/zodiaco/', '/virales/', '/tendencias/',
    '/recetas/', '/gaming/', '/videojuegos/', '/celebrities/'
  ];

  const institutionalOverrideKeywords = [
    'gobierno', 'milei', 'justicia', 'ley', 'dnu', 'afa', 'igj', 'sad',
    'sociedades anonimas', 'casa rosada', 'denuncia', 'juez', 'congreso',
    'causa', 'arancel', 'incaa', 'fondos', 'campeon del mundo', 'campeón del mundo',
    'duelo nacional', 'luto'
  ];

  const hasInstitutionalAngle = institutionalOverrideKeywords.some(k => lowerText.includes(k));

  if (blacklistedUrlSegments.some(seg => lowerUrl.includes(seg))) {
    if (!hasInstitutionalAngle) return false;
  }

  if (category === 'nacional') {
    const foreignCountryPaths = [
      'infobae.com/peru/', 'infobae.com/mexico/', 'infobae.com/colombia/',
      'infobae.com/espana/', 'infobae.com/america/deportes/'
    ];
    if (foreignCountryPaths.some(path => lowerUrl.includes(path))) return false;
  }

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

async function parseFeed(config) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(config.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PoliticheckBot/1.0 (+https://politicheck.ar)',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      }
    });
    clearTimeout(timer);
    if (!res.ok) return [];

    const xml = await res.text();
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    const articles = [];

    for (let i = 0; i < itemMatches.length; i++) {
      const itemXml = itemMatches[i];
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || itemXml.match(/<dc:date>([\s\S]*?)<\/dc:date>/i);

      const title = cleanText(titleMatch ? titleMatch[1] : '');
      const rawLink = cleanText(linkMatch ? linkMatch[1] : '');
      const snippet = cleanText(descMatch ? descMatch[1] : '').slice(0, 220);
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

      if (title.length > 10 && rawLink.startsWith('http') && isEditorialRelevantArticle(rawLink, title, snippet, config.category)) {
        const id = `art-${config.outletId}-${Math.abs(title.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`;
        articles.push({
          id,
          outletId: config.outletId,
          outletName: config.outletName,
          title,
          snippet,
          url: rawLink,
          publishedAt: formatPubDate(articleTimestamp),
          timestamp: articleTimestamp,
          imageUrl
        });
      }
    }
    return articles;
  } catch (e) {
    clearTimeout(timer);
    return [];
  }
}

async function run() {
  console.log(`📡 [Sync All RSS] Fetching ${RSS_FEEDS.length} official feeds in parallel...`);
  const startTime = Date.now();

  const results = await Promise.allSettled(RSS_FEEDS.map(f => parseFeed(f)));
  const nationalArticles = [];
  const foreignArticles = [];

  results.forEach((res, idx) => {
    const feed = RSS_FEEDS[idx];
    if (res.status === 'fulfilled') {
      const articles = res.value;
      if (feed.category === 'internacional') {
        const relevant = articles.filter(a => isRelevantToArgentina(a.title, a.snippet));
        foreignArticles.push(...relevant);
      } else {
        nationalArticles.push(...articles);
      }
    }
  });

  // Deduplicate
  function deduplicate(list) {
    const seenUrls = new Set();
    const seenTitles = new Set();
    const unique = [];
    for (const art of list) {
      const cleanUrl = art.url.split('?')[0].toLowerCase();
      const normTitle = art.title.toLowerCase().replace(/[^a-z0-9]/gi, '').slice(0, 40);
      if (!seenUrls.has(cleanUrl) && !seenTitles.has(normTitle)) {
        seenUrls.add(cleanUrl);
        seenTitles.add(normTitle);
        unique.push(art);
      }
    }
    return unique;
  }

  const uniqueNational = deduplicate(nationalArticles);
  const uniqueForeign = deduplicate(foreignArticles);

  // CRITICAL: Sort chronologically by publication timestamp (newest first across ALL outlets!)
  uniqueNational.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  uniqueForeign.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const combinedArticles = [...uniqueNational, ...uniqueForeign];
  combinedArticles.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  console.log(`✅ Fetched ${combinedArticles.length} articles (${uniqueForeign.length} foreign on Arg) in ${Date.now() - startTime}ms`);

  const nowIso = new Date().toISOString();
  const syncResult = {
    timestamp: nowIso,
    totalFetched: nationalArticles.length + foreignArticles.length,
    uniqueArticles: combinedArticles.length,
    newArticlesCount: combinedArticles.length,
    foreignArticlesCount: uniqueForeign.length,
    articles: combinedArticles,
    foreignArticles: uniqueForeign
  };

  fs.writeFileSync('./src/data/live_articles.json', JSON.stringify(syncResult, null, 2), 'utf8');
  fs.writeFileSync('./src/data/foreign_articles.json', JSON.stringify(uniqueForeign, null, 2), 'utf8');
  console.log(`💾 Saved fresh live_articles.json with timestamp ${nowIso}`);

  if (supabase) {
    try {
      const { error: feedErr } = await supabase.from('news_clusters').upsert({
        id: 'live-feed-cache',
        lead_title: 'LIVE_FEED_CACHE',
        neutral_headline: 'Feed de noticias en tiempo real',
        summary: 'Agregación consolidada de todos los feeds RSS monitoreados',
        category: 'Feed',
        spectrum: { oficialismoPct: 0, centroDatosPct: 100, oposicionPct: 0, totalOutlets: 1 },
        articles: combinedArticles.slice(0, 150),
        key_quotes: { timestamp: nowIso, totalArticles: combinedArticles.length },
        updated_at: nowIso
      }, { onConflict: 'id' });
      if (feedErr) console.warn('⚠️ Supabase live feed save error:', feedErr.message);
      else console.log('☁️ Successfully saved live feed to Supabase cloud cache!');
    } catch (sbErr) {
      console.warn('⚠️ Supabase live feed exception:', sbErr.message);
    }
  }

  console.log(`\n📰 Top 8 newest articles across all outlets (Minuto a Minuto preview):`);
  combinedArticles.slice(0, 8).forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.outletName}] (${a.publishedAt}) ${a.title.slice(0, 70)}...`);
  });

  // Call Gemini for clustering fresh news
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'tu_clave_aqui') {
    console.log('⚠️ No GEMINI_API_KEY, skipping AI clustering.');
    return;
  }

  console.log(`\n🤖 Calling Gemini Flash with fresh articles to generate balanced clusters...`);
  
  // Balance candidate articles across distinct outlets (max 4 per outlet)
  const candidateArticles = [];
  const candOutletCounts = {};
  for (const a of combinedArticles) {
    const count = candOutletCounts[a.outletId] || 0;
    if (count < 4 && candidateArticles.length < 80) {
      candidateArticles.push(a);
      candOutletCounts[a.outletId] = count + 1;
    }
  }

  const systemInstruction = `Eres el motor de análisis editorial y verificación de Politicheck (Observatorio de Cobertura Periodística de Argentina).
Tu objetivo es analizar noticias argentinas de última hora y agruparlas en torno a los hechos centrales de gran impacto ("Historias").

REGLAS DE ORO OBLIGATORIAS:
1. COMPARACIÓN MULTI-MEDIO ESTRICTA SIN TOPE:
   - ESTÁ TERMINANTEMENTE PROHIBIDO que un cluster contenga más de 1 artículo del mismo medio. Cada noticia en "articleIds" DEBE ser de un medio DIFERENTE.
   - Cada cluster DEBE incluir un MÍNIMO de 2 medios distintos e incluir TODOS los medios distintos del listado que cubran ese mismo hecho (sin límite máximo).
2. COHERENCIA FACTUAL Y ANTI-DUPLICADOS ESTRICTA:
   - Todas las noticias del cluster deben cubrir EXACTAMENTE EL MISMO ACONTECIMIENTO OBJETIVO.
   - ESTÁ PROHIBIDO crear más de 1 cluster sobre el mismo tema o acontecimiento central en esta misma corrida. Si varios artículos cubren ángulos distintos del mismo hecho (ej. votación en el Senado y repercusiones), unificalos en UN SOLO cluster.
   - NO agrupes noticias solo porque compartan una palabra genérica.
3. VARIEDAD TEMÁTICA Y NÚMERO DE HISTORIAS (OBLIGATORIO):
   - Genera entre 4 y 6 historias DISTINTAS y equilibradas (al menos 1-2 de "Política", 1-2 de "Economía", y 1 de "Sociedad" o "Justicia").
   - "clusters[0]" será la Gran Apertura de Tapa de mayor trascendencia nacional.
4. Escribe "neutralHeadline" estrictamente factual, "summary" en dos oraciones objetivas, y "aiComparisonNotice" explicando qué priorizó y qué omitió cada redacción.`;

  const inputPayload = `Noticias a analizar:\n${JSON.stringify(
    candidateArticles.map(a => ({ id: a.id, medio: a.outletName, titulo: a.title, bajada: a.snippet })),
    null,
    2
  )}`;

  const clusteringSchema = {
    type: 'object',
    properties: {
      clusters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            kicker: { type: 'string' },
            neutralHeadline: { type: 'string' },
            category: { type: 'string', enum: ['Política', 'Economía', 'Sociedad', 'Justicia', 'Internacional'] },
            summary: { type: 'string' },
            aiComparisonNotice: { type: 'string' },
            articleIds: { type: 'array', items: { type: 'string' } },
          },
          required: ['kicker', 'neutralHeadline', 'category', 'summary', 'aiComparisonNotice', 'articleIds'],
        },
      },
    },
    required: ['clusters'],
  };

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const models = ['gemini-4-hydrogen', 'gemini-3.5-flash-lite'];
    let text = '';
    let usedModel = '';
    let usedUsage = null;

    for (const model of models) {
      try {
        const interaction = await ai.interactions.create({
          model,
          system_instruction: systemInstruction,
          input: inputPayload,
          store: false,
          generation_config: { thinking_level: 'low' },
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: clusteringSchema,
          },
        });
        if (interaction.output_text) {
          text = interaction.output_text;
          usedModel = model;
          usedUsage = interaction.usage || null;
          break;
        }
      } catch (modelErr) {
        console.warn(`⚠️ Model ${model} failed (${modelErr?.status || modelErr?.message}), trying fallback...`);
      }
    }

    if (text) {
      console.log(`🤖 Clustered with ${usedModel} (Interactions API v1)`);
      if (text) {
        const parsed = JSON.parse(text);
        const articleMap = new Map(combinedArticles.map(a => [a.id, a]));
        const OUTLETS_LEANING = {
          clarin: 'centro_datos',
          lanacion: 'oficialismo',
          pagina12: 'oposicion',
          infobae: 'centro_datos',
          tn: 'oficialismo',
          ambito: 'oposicion',
          cronista: 'centro_datos',
          perfil: 'centro_datos',
          eldiarioar: 'oposicion',
          cronica: 'centro_datos',
          baenegocios: 'centro_datos',
          izquierdadiario: 'oposicion',
          cenital: 'oposicion',
          eleconomista: 'centro_datos',
          derechadiario: 'oficialismo'
        };

        const rawClusters = parsed.clusters.map((c, idx) => {
          const rawArticles = (c.articleIds || []).map(id => articleMap.get(id)).filter(Boolean);
          const seenOutlets = new Set();
          const clusterArticles = [];
          for (const a of rawArticles) {
            if (!seenOutlets.has(a.outletId)) {
              seenOutlets.add(a.outletId);
              clusterArticles.push(a);
            }
          }
          const leadImg = clusterArticles.find(a => Boolean(a.imageUrl))?.imageUrl ||
            (c.category === 'Economía' ? '/images/regalias.jpg' : c.category === 'Sociedad' ? '/images/universidad.jpg' : '/images/malvinas.jpg');

          const cleanSlug = (c.neutralHeadline || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 50)
            .replace(/^-|-$/g, '');
          const uniqueId = cleanSlug ? `story-${cleanSlug}` : `story-ai-${Date.now().toString(36)}-${idx + 1}`;

          const time = clusterArticles[0]?.publishedAt || 'Hoy';
          return {
            id: uniqueId,
            isLeadStory: idx === 0,
            kicker: c.kicker,
            neutralHeadline: c.neutralHeadline,
            category: c.category || 'Política',
            summary: c.summary,
            updatedAt: time,
            timestamp: clusterArticles[0]?.timestamp || Date.now(),
            imageUrl: leadImg,
            imageCaption: `Cobertura periodística de ${clusterArticles[0]?.outletName || 'prensa oficial'}.`,
            articles: clusterArticles,
            aiComparisonNotice: c.aiComparisonNotice
          };
        });

        // Shared dedup + zero-token all-outlet enrichment helpers (mirroring src/utils/clusterDedup.ts)
        const STOP = new Set([
          'para','como','sobre','tras','ante','pero','entre','desde','hasta','contra','hacia','segun',
          'este','esta','estos','estas','ese','esa','esos','esas','aquel','todo','toda','todos','todas',
          'otro','otra','otros','otras','mas','menos','muy','tambien','solo','ahora','hoy','ayer','luego',
          'cuando','donde','quien','cual','porque','aunque','mientras','sera','fueron','estaba','tiene',
          'tienen','hace','hacer','dijo','aseguro','afirmo','senalo','destaco','explico','anuncio','pidio',
          'confirmo','nego','cruzo','apunto','volvio','marco','advirtio','argentina','argentino','argentinos',
          'pais','nacional','gobierno','casa','rosada','presidente','ministro','nota','noticia','diario'
        ]);
        const tokenize = (text) => new Set(
          String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOP.has(w))
        );
        const tokenSim = (a, b) => {
          if (a.size === 0 || b.size === 0) return 0;
          let inter = 0;
          for (const t of a) if (b.has(t)) inter++;
          return Math.max(inter / Math.min(a.size, b.size), inter / (a.size + b.size - inter));
        };
        const computeSpec = (arts) => {
          let ofi = 0, centro = 0, opo = 0;
          for (const a of arts) {
            const l = OUTLETS_LEANING[a.outletId] || 'centro_datos';
            if (l === 'oficialismo') ofi++;
            else if (l === 'oposicion') opo++;
            else centro++;
          }
          const total = arts.length || 1;
          const ofiPct = Math.round((ofi / total) * 100);
          const centroPct = Math.round((centro / total) * 100);
          return { oficialismoPct: ofiPct, centroDatosPct: centroPct, oposicionPct: Math.max(0, 100 - ofiPct - centroPct), totalOutlets: total };
        };
        const mergeArts = (base, incoming) => {
          const map = new Map();
          for (const a of [...(base || []), ...(incoming || [])]) {
            if (!a || !a.outletId) continue;
            if (!map.has(a.outletId)) map.set(a.outletId, a);
          }
          return Array.from(map.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        };
        const isDup = (a, b) => {
          const urlsA = new Set((a.articles || []).map(x => x.url).filter(Boolean));
          if ((b.articles || []).some(x => x.url && urlsA.has(x.url))) return true;
          const tA = tokenize(`${a.neutralHeadline || ''} ${a.summary || ''}`);
          const tB = tokenize(`${b.neutralHeadline || ''} ${b.summary || ''}`);
          let shared = 0;
          for (const t of tA) if (tB.has(t)) shared++;
          return shared >= 3 && tokenSim(tA, tB) >= 0.38;
        };

        // 1. Intra-run deduplication
        const deduped = [];
        for (const c of rawClusters) {
          const match = deduped.find(d => isDup(d, c));
          if (match) {
            match.articles = mergeArts(match.articles, c.articles);
          } else {
            deduped.push({ ...c, articles: mergeArts([], c.articles) });
          }
        }

        // 2. Zero-token enrichment across ALL national RSS outlets (no max cap)
        const clusters = deduped.map((c) => {
          const cTokens = tokenize(`${c.neutralHeadline} ${c.summary}`);
          const existingOutlets = new Set(c.articles.map(a => a.outletId));
          const extra = [];
          for (const art of combinedArticles) {
            if (existingOutlets.has(art.outletId)) continue;
            const aTokens = tokenize(`${art.title} ${(art.snippet || '').slice(0, 140)}`);
            let shared = 0;
            for (const t of aTokens) if (cTokens.has(t)) shared++;
            if (shared >= 3 && tokenSim(aTokens, cTokens) >= 0.42) {
              existingOutlets.add(art.outletId);
              extra.push(art);
            }
          }
          const finalArts = mergeArts(c.articles, extra);
          return { ...c, articles: finalArts, spectrum: computeSpec(finalArts) };
        });

        clusters.sort((a, b) => (b.articles.length - a.articles.length) || ((b.timestamp || 0) - (a.timestamp || 0)));
        clusters.forEach((c, i) => { c.isLeadStory = i === 0; });

        console.log(`🎉 Gemini generated ${clusters.length} deduplicated & enriched clusters!`);
        clusters.forEach((c, i) => {
          console.log(`  ${i + 1}. [${c.category}] (${c.updatedAt}) ${c.neutralHeadline.slice(0, 60)}... (${c.articles.length} medios)`);
        });

        fs.writeFileSync('./src/data/clustered_stories.json', JSON.stringify(clusters, null, 2), 'utf8');
        console.log(`💾 Updated src/data/clustered_stories.json with fresh AI clusters!`);

        if (supabase && clusters.length > 0) {
          try {
            // 3. 36-hour Supabase merge (preserves existing /historia/:id URLs & Debate Cívico)
            const lookbackIso = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
            const { data: recentExisting } = await supabase
              .from('news_clusters')
              .select('id, lead_title, neutral_headline, category, articles, key_quotes, updated_at')
              .neq('id', 'live-feed-cache')
              .neq('id', 'foreign-feed-cache')
              .neq('id', 'clustering-telemetry-cache')
              .gt('updated_at', lookbackIso)
              .order('updated_at', { ascending: false })
              .limit(60);

            const existingPool = (recentExisting || []).map(row => ({
              id: row.id,
              neutralHeadline: row.neutral_headline || row.lead_title || '',
              summary: '',
              articles: Array.isArray(row.articles) ? row.articles : [],
              key_quotes: row.key_quotes || {}
            }));

            const mergedById = new Map();
            clusters.forEach((c, idx) => {
              const matchedExisting = existingPool.find(ex => ex.id === c.id || isDup(ex, c));
              const targetId = matchedExisting ? matchedExisting.id : c.id;
              const prevInBatch = mergedById.get(targetId);
              let mergedArticles = matchedExisting ? mergeArts(matchedExisting.articles, c.articles) : c.articles;
              if (prevInBatch) {
                mergedArticles = mergeArts(prevInBatch.articles, mergedArticles);
              }
              const finalSpec = computeSpec(mergedArticles);

              mergedById.set(targetId, {
                id: targetId,
                lead_title: c.neutralHeadline,
                neutral_headline: c.neutralHeadline,
                summary: c.summary,
                category: c.category || 'Política',
                spectrum: finalSpec,
                articles: mergedArticles,
                key_quotes: {
                  kicker: c.kicker,
                  imageUrl: c.imageUrl,
                  imageCaption: c.imageCaption,
                  aiComparisonNotice: c.aiComparisonNotice,
                  isLeadStory: idx === 0,
                  updatedAt: c.updatedAt
                },
                updated_at: new Date().toISOString()
              });
            });

            const rows = Array.from(mergedById.values());
            const { error: clustErr } = await supabase.from('news_clusters').upsert(rows, { onConflict: 'id' });
            if (clustErr) console.warn('⚠️ Supabase clusters save error:', clustErr.message);
            else console.log(`☁️ Successfully merged & saved ${rows.length} clusters to Supabase cloud!`);

            // 4. Save clustering telemetry for /admin
            const totalEnriched = rows.reduce((acc, r) => acc + (r.articles?.length || 0), 0);
            const avgOutlets = Number((totalEnriched / Math.max(1, rows.length)).toFixed(1));
            const maxOutlets = Math.max(...rows.map(r => r.articles?.length || 0));
            await supabase.from('news_clusters').upsert({
              id: 'clustering-telemetry-cache',
              lead_title: `Telemetry (${usedModel || 'gemini-3.5-flash-lite'})`,
              neutral_headline: `Telemetry (${usedModel || 'gemini-3.5-flash-lite'})`,
              summary: `avg=${avgOutlets}, manual_script`,
              category: 'Sistema',
              spectrum: { oficialismoPct: 0, centroDatosPct: 100, oposicionPct: 0, totalOutlets: 1 },
              articles: [],
              key_quotes: {
                model: usedModel || 'gemini-3.5-flash-lite',
                inputTokens: Number(usedUsage?.total_input_tokens ?? usedUsage?.input_tokens ?? Math.round(((systemInstruction?.length || 0) + (inputPayload?.length || 0)) / 4)),
                outputTokens: Number(usedUsage?.total_output_tokens ?? usedUsage?.output_tokens ?? Math.round((text?.length || 0) / 4)),
                thoughtTokens: Number(usedUsage?.total_thought_tokens ?? usedUsage?.thought_tokens ?? 0),
                clustersCount: rows.length,
                avgOutletsPerCluster: avgOutlets,
                maxOutletsPerCluster: maxOutlets,
                totalArticlesEnriched: totalEnriched,
                source: 'manual_script',
                updatedAt: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            // 5. Institutional role-change alert scan on merged rows (service-role only)
            if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
              const serviceSb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
                auth: { persistSession: false, autoRefreshToken: false }
              });
              const { data: pols } = await serviceSb.from('politicians').select('slug, name').eq('is_active', true);
              const VERBS = [
                { kw: 'renunció', kind: 'resignation', rx: /\b(renuncio|presento su renuncia|renuncia de)\b/i },
                { kw: 'dimitió', kind: 'resignation', rx: /\b(dimitio|dimision de)\b/i },
                { kw: 'dejó el cargo', kind: 'resignation', rx: /\b(dejo el cargo|deja el cargo|dejo el ministerio|deja el ministerio)\b/i },
                { kw: 'destituido', kind: 'resignation', rx: /\b(destituid[oa]|desplazad[oa] del cargo)\b/i },
                { kw: 'asumió', kind: 'appointment', rx: /\b(asumio como|asume como|asumio al frente de)\b/i },
                { kw: 'juró', kind: 'appointment', rx: /\b(juro como|jura como)\b/i },
                { kw: 'designado', kind: 'appointment', rx: /\b(fue designad[oa]|designaron a|nombro como)\b/i },
                { kw: 'inhabilitación', kind: 'disqualification', rx: /\b(inhabilitacion perpetua|condena firme)\b/i }
              ];
              const suggestRole = (sentence, trig) => {
                if (trig.kind === 'resignation') return 'Sin cargo público estatal (verificar renuncia)';
                if (trig.kind === 'disqualification') return 'Sin cargo estatal · inhabilitado/a (verificar fallo)';
                const m = sentence.match(/\b(?:asumi[oó]|asume|jur[oó]|jura|designad[oa]|nombr[oó])\s+(?:como|al frente de)\s+([^.,;:()]{4,85})/i);
                if (m && m[1]) {
                  const cl = m[1].trim().replace(/\s+(y|en medio|tras|luego|despu[eé]s)\b.*$/i, '').trim();
                  if (cl.length >= 4) return cl.charAt(0).toUpperCase() + cl.slice(1);
                }
                return null;
              };
              const alertRows = [];
              for (const row of rows) {
                const sentences = [row.neutral_headline, ...(row.summary || '').split(/(?<=[.!?])\s+/)].filter(Boolean);
                for (const s of sentences) {
                  const norm = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                  const trig = VERBS.find(v => v.rx.test(norm));
                  if (!trig) continue;
                  for (const p of (pols || [])) {
                    const pNorm = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    if (new RegExp(`\\b${pNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(norm)) {
                      alertRows.push({
                        politician_slug: p.slug,
                        politician_name: p.name,
                        story_id: row.id,
                        story_headline: row.neutral_headline.slice(0, 280),
                        story_url: `/historia/${row.id}`,
                        trigger_keyword: trig.kw,
                        detected_snippet: s.slice(0, 400),
                        suggested_role: suggestRole(s, trig),
                        status: 'pending'
                      });
                    }
                  }
                }
              }
              if (alertRows.length > 0) {
                await serviceSb.from('politician_alerts').upsert(alertRows, { onConflict: 'politician_slug,story_id', ignoreDuplicates: true });
                console.log(`🔔 Recorded ${alertRows.length} pending politician role alert(s).`);
              }
            }
          } catch (sbErr) {
            console.warn('⚠️ Supabase clusters exception:', sbErr.message);
          }
        }
      }
    } else {
      console.warn('Gemini returned empty output from all candidate models.');
    }
  } catch (err) {
    console.error('Error clustering with Gemini:', err);
  }
}

run();
