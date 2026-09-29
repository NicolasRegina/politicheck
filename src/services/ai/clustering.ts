import fs from 'node:fs';
import path from 'node:path';
import type { Article, StoryCluster, SpectrumBreakdown } from '../../types';
import { saveNewsClustersToSupabase, getNewsClustersFromSupabase } from '../supabase';
import { OUTLETS_REGISTRY } from '../../utils/outlets';

const CLUSTERED_STORIES_FILE = path.resolve(process.cwd(), 'src/data/clustered_stories.json');
const FOREIGN_CLUSTERED_STORIES_FILE = path.resolve(process.cwd(), 'src/data/foreign_clusters.json');

export function saveClusteredStories(stories: StoryCluster[]) {
  try {
    fs.writeFileSync(CLUSTERED_STORIES_FILE, JSON.stringify(stories, null, 2), 'utf-8');
    saveNewsClustersToSupabase(stories).catch(err => {
      console.warn('[AI Clustering] Supabase background save notice:', err);
    });
  } catch (err) {
    console.error('[AI Clustering] Error saving clustered stories:', err);
  }
}

export function saveForeignClusteredStories(stories: StoryCluster[]) {
  try {
    fs.writeFileSync(FOREIGN_CLUSTERED_STORIES_FILE, JSON.stringify(stories, null, 2), 'utf-8');
    saveNewsClustersToSupabase(stories).catch(err => {
      console.warn('[AI Clustering] Supabase foreign save notice:', err);
    });
  } catch (err) {
    console.error('[AI Clustering] Error saving foreign clustered stories:', err);
  }
}

export function getCachedClusteredStories(): StoryCluster[] {
  try {
    if (fs.existsSync(CLUSTERED_STORIES_FILE)) {
      const data = fs.readFileSync(CLUSTERED_STORIES_FILE, 'utf-8');
      const parsed = JSON.parse(data) as StoryCluster[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[AI Clustering] Error reading cached clustered stories:', err);
  }
  return [];
}

export function getCachedForeignClusters(): StoryCluster[] {
  try {
    if (fs.existsSync(FOREIGN_CLUSTERED_STORIES_FILE)) {
      const data = fs.readFileSync(FOREIGN_CLUSTERED_STORIES_FILE, 'utf-8');
      const parsed = JSON.parse(data) as StoryCluster[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[AI Clustering] Error reading cached foreign clustered stories:', err);
  }
  return [];
}

export async function getCachedForeignClustersAsync(): Promise<StoryCluster[]> {
  try {
    const dbClusters = await getNewsClustersFromSupabase(1440);
    if (dbClusters && dbClusters.length > 0) {
      const foreign = dbClusters.filter(c => c.category === 'Internacional' || c.kicker?.includes('MIRADA EXTERIOR'));
      if (foreign.length > 0) {
        return foreign;
      }
    }
  } catch (err) {
    console.warn('[AI Clustering] Supabase foreign clusters read error:', err);
  }
  return getCachedForeignClusters();
}

export function getStoryClusterById(id: string): StoryCluster | undefined {
  const cached = getCachedClusteredStories();
  const foundInCached = cached.find(s => s.id === id);
  if (foundInCached) return foundInCached;

  const cachedForeign = getCachedForeignClusters();
  const foundInForeign = cachedForeign.find(s => s.id === id);
  if (foundInForeign) return foundInForeign;

  return undefined;
}

export async function getStoryClusterByIdAsync(id: string): Promise<StoryCluster | undefined> {
  const local = getStoryClusterById(id);
  if (local) return local;

  const dbClusters = await getNewsClustersFromSupabase(1440);
  if (dbClusters) {
    const found = dbClusters.find(s => s.id === id);
    if (found) return found;
  }
  return undefined;
}

interface GeminiClusterResponse {
  clusters: {
    kicker: string;
    neutralHeadline: string;
    category: string;
    summary: string;
    aiComparisonNotice: string;
    articleIds: string[];
    spectrum: SpectrumBreakdown;
  }[];
}

function getGeminiKey(explicitKey?: string): string | undefined {
  if (explicitKey && explicitKey !== 'tu_clave_aqui') return explicitKey;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'tu_clave_aqui') return process.env.GEMINI_API_KEY;
  if (typeof import.meta !== 'undefined' && import.meta.env?.GEMINI_API_KEY && import.meta.env.GEMINI_API_KEY !== 'tu_clave_aqui') {
    return import.meta.env.GEMINI_API_KEY;
  }
  try {
    const envFile = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf-8');
      const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
      if (match) {
        const val = match[1].trim().replace(/^["']|["']$/g, '');
        if (val && val !== 'tu_clave_aqui') return val;
      }
    }
  } catch {
    // fallback
  }
  return undefined;
}

export function selectCrossOutletCandidates(articles: Article[], maxArticles = 75): Article[] {
  // 1. Group articles by outlet
  const byOutlet: Record<string, Article[]> = {};
  articles.forEach(a => {
    if (!byOutlet[a.outletId]) byOutlet[a.outletId] = [];
    byOutlet[a.outletId].push(a);
  });

  // 2. Extract meaningful tokens from titles and snippets
  const stopWords = new Set([
    'para', 'como', 'sobre', 'entre', 'este', 'esta', 'estos', 'estas', 'tras', 'desde',
    'contra', 'hasta', 'hace', 'pero', 'mas', 'menos', 'segun', 'todo', 'todos', 'toda',
    'todas', 'porque', 'cuando', 'donde', 'quien', 'cual', 'cuanto', 'dijo', 'afirma',
    'aseguro', 'afirmo', 'nuevo', 'nueva', 'nuevos', 'nuevas', 'noticia', 'diario', 'prensa',
    'argentina', 'argentino', 'argentinos', 'gobierno', 'pais', 'este', 'esta', 'ante'
  ]);

  const wordToOutlets = new Map<string, Set<string>>();
  articles.forEach(a => {
    const text = (a.title + ' ' + (a.snippet || '')).toLowerCase();
    const words = text
      .replace(/[^a-záéíóúüñ0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !stopWords.has(w));

    const uniqueWordsInArticle = new Set(words);
    uniqueWordsInArticle.forEach(w => {
      if (!wordToOutlets.has(w)) wordToOutlets.set(w, new Set());
      wordToOutlets.get(w)!.add(a.outletId);
    });
  });

  // 3. Find hot cross-outlet keywords covered by 3 or more distinct outlets
  const crossOutletKeywords = new Set<string>();
  wordToOutlets.forEach((outlets, word) => {
    if (outlets.size >= 3) {
      crossOutletKeywords.add(word);
    }
  });

  // 4. Score articles based on overlap with cross-outlet keywords
  const scoredArticles = articles.map(a => {
    const text = (a.title + ' ' + (a.snippet || '')).toLowerCase();
    let score = 0;
    crossOutletKeywords.forEach(kw => {
      if (text.includes(kw)) {
        score += wordToOutlets.get(kw)?.size || 1;
      }
    });
    return { article: a, score };
  });

  scoredArticles.sort((a, b) => b.score - a.score);

  const selected: Article[] = [];
  const selectedIds = new Set<string>();
  const outletCounts: Record<string, number> = {};

  for (const item of scoredArticles) {
    const oId = item.article.outletId;
    const currentCount = outletCounts[oId] || 0;
    // Cap at max 4 articles per outlet in candidate pool so no single outlet dominates
    if (item.score > 0 && selected.length < maxArticles && currentCount < 4) {
      selected.push(item.article);
      selectedIds.add(item.article.id);
      outletCounts[oId] = currentCount + 1;
    }
  }

  // Ensure every monitored outlet has representation in candidate pool
  Object.values(byOutlet).forEach(outletArticles => {
    for (const a of outletArticles.slice(0, 2)) {
      const currentCount = outletCounts[a.outletId] || 0;
      if (!selectedIds.has(a.id) && selected.length < maxArticles + 25 && currentCount < 4) {
        selected.push(a);
        selectedIds.add(a.id);
        outletCounts[a.outletId] = currentCount + 1;
      }
    }
  });

  return selected;
}

export async function clusterArticlesWithGemini(
  articles: Article[],
  apiKey?: string
): Promise<StoryCluster[]> {
  const geminiKey = getGeminiKey(apiKey);

  if (!geminiKey) {
    console.log('[AI Clustering] No GEMINI_API_KEY found, using rule-based algorithmic clustering.');
    return ruleBasedClustering(articles);
  }

  try {
    const candidateArticles = selectCrossOutletCandidates(articles, 80);
    console.log(`[AI Clustering] Calling Gemini Flash with ${candidateArticles.length} cross-outlet curated articles (from ${articles.length} total)...`);
    const prompt = `
Eres el motor de análisis editorial y verificación de Politicheck (Observatorio de Cobertura Periodística de Argentina).
Tu objetivo es analizar las siguientes noticias argentinas y agruparlas en torno a los hechos centrales de gran impacto ("Historias").

REGLAS DE ORO OBLIGATORIAS:
1. REGLA FUNDAMENTAL - COMPARACIÓN MULTI-MEDIO ESTRICTA:
   - El propósito de Politicheck es comparar cómo DISTINTAS REDACCIONES cubren el mismo hecho.
   - ESTÁ TERMINANTEMENTE PROHIBIDO que un cluster contenga más de 1 artículo del mismo medio. Cada noticia en "articleIds" DEBE ser de un diario DIFERENTE (por ejemplo: 1 de Clarín, 1 de La Nación, 1 de Infobae, 1 de Ámbito, 1 de Página 12, 1 de elDiarioAR, etc.).
   - Cada cluster DEBE incluir un MÍNIMO de 2 medios distintos (idealmente entre 3 y 6 medios distintos).
   - NUNCA agrupes noticias de un solo diario.

2. COHERENCIA FACTUAL Y TEMÁTICA ESTRICTA:
   - Todas las noticias del cluster deben cubrir EXACTAMENTE EL MISMO ACONTECIMIENTO OBJETIVO.
   - NO agrupes noticias solo porque compartan una palabra genérica. Por ejemplo: NO juntes "Fútbol en Malvinas" con "Debate de sanciones por hidrocarburos en Malvinas". Son dos noticias completamente distintas. Si un artículo no trata del suceso específico central, descártalo.

3. VARIEDAD TEMÁTICA Y NÚMERO DE HISTORIAS (OBLIGATORIO):
   Debes generar obligatoriamente entre 4 y 6 clusters/historias diferentes y equilibradas:
   - Al menos 1 o 2 historias de "Política" (ej. declaraciones del gobierno, Congreso, internas políticas, relaciones internacionales).
   - Al menos 1 o 2 historias de "Economía" (ej. actividad económica, recesión, dólar, deuda, reservas, inflación).
   - Al menos 1 historia de "Sociedad", "Educación" o "Justicia" (ej. causas judiciales, universidades, reclamos salariales, seguridad).
   El primer cluster del array ("clusters[0]") será la Gran Apertura de Tapa de mayor trascendencia e impacto nacional.

4. Escribe un titular neutral ("neutralHeadline") estrictamente factual, sin adjetivos tendenciosos.
5. Redacta un dictamen comparativo de encuadres ("aiComparisonNotice") que explique con rigor periodístico: qué priorizó cada redacción en su titular y qué omitió.
6. Clasifica la categoría ("Política", "Economía", "Sociedad", "Justicia" o "Internacional").
7. Estima la distribución del espectro editorial (oficialismoPct, centroDatosPct, oposicionPct) sumando el 100%.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "clusters": [
    {
      "kicker": "VOLANTA EN MAYÚSCULAS",
      "neutralHeadline": "Titular neutral y factual",
      "category": "Política",
      "summary": "Resumen objetivo en dos oraciones.",
      "aiComparisonNotice": "Síntesis del contraste de enfoques entre las múltiples redacciones.",
      "articleIds": ["id_medio_1", "id_medio_2", "id_medio_3"],
      "spectrum": {
        "oficialismoPct": 40,
        "centroDatosPct": 35,
        "oposicionPct": 25,
        "totalOutlets": 3
      }
    }
  ]
}

Noticias a analizar:
${JSON.stringify(candidateArticles.map(a => ({ id: a.id, medio: a.outletName, titulo: a.title, bajada: a.snippet })), null, 2)}
`;

    const CANDIDATE_MODELS = [
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash'
    ];

    let rawJson = '';
    let usedModel = '';

    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            rawJson = candidateText;
            usedModel = model;
            break;
          }
        } else {
          console.warn(`[AI Clustering] Model ${model} returned ${res.status}. Probando alternativo...`);
        }
      } catch (fetchErr) {
        console.warn(`[AI Clustering] Model ${model} network error:`, fetchErr);
      }
    }

    if (!rawJson) {
      console.warn('[AI Clustering] No se pudo obtener respuesta de Gemini, usando clustering algorítmico.');
      return ruleBasedClustering(articles);
    }

    console.log(`[AI Clustering] Clustered successfully with Google Gemini (${usedModel})`);

    const parsed: GeminiClusterResponse = JSON.parse(rawJson);
    const articleMap = new Map(articles.map(a => [a.id, a]));

    const stories: StoryCluster[] = parsed.clusters
      .map((c, idx) => {
        const rawArticles = c.articleIds
          .map(id => articleMap.get(id))
          .filter((a): a is Article => Boolean(a));

        // POLITICHECK ENFORCEMENT: Strictly at most 1 article per outlet in a cluster
        const seenOutlets = new Set<string>();
        const clusterArticles: Article[] = [];
        for (const a of rawArticles) {
          if (!seenOutlets.has(a.outletId)) {
            seenOutlets.add(a.outletId);
            clusterArticles.push(a);
          }
        }

        // Pick best journalistic photo among the cluster
        const leadImgArticle = clusterArticles.find(a => Boolean(a.imageUrl));
      const fallbackImg = c.category === 'Economía' 
        ? '/images/regalias.jpg' 
        : c.category === 'Sociedad' 
          ? '/images/universidad.jpg' 
          : '/images/malvinas.jpg';
      const imageUrl = leadImgArticle?.imageUrl || fallbackImg;

      // Calculate spectrum deterministically from participating articles and their outlets
      let ofi = 0;
      let centro = 0;
      let opo = 0;
      clusterArticles.forEach(a => {
        const o = OUTLETS_REGISTRY[a.outletId];
        const leaning = o?.baselineLeaning || 'centro_datos';
        if (leaning === 'oficialismo') ofi++;
        else if (leaning === 'oposicion') opo++;
        else centro++;
      });
      const total = clusterArticles.length || 1;
      const ofiPct = Math.round((ofi / total) * 100);
      const centroPct = Math.round((centro / total) * 100);
      const opoPct = Math.max(0, 100 - ofiPct - centroPct);

      // Extract accurate timestamp from articles
      const articleTimes = clusterArticles
        .map(a => a.publishedAt)
        .filter(t => t && t !== 'Reciente');
      const formattedTimestamp = articleTimes[0] || (clusterArticles[0] ? 'Hoy' : 'Reciente');

      return {
        id: `story-ai-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: c.kicker,
        neutralHeadline: c.neutralHeadline,
        category: c.category,
        summary: c.summary,
        updatedAt: formattedTimestamp,
        imageUrl,
        imageCaption: `Cobertura periodística de ${leadImgArticle?.outletName || 'prensa oficial'}.`,
        spectrum: {
          oficialismoPct: ofiPct,
          centroDatosPct: centroPct,
          oposicionPct: opoPct,
          totalOutlets: total
        },
        articles: clusterArticles,
        aiComparisonNotice: c.aiComparisonNotice
      };
    });

    // Safeguard: If Gemini returned fewer than 3 clusters, complement with rule-based clusters to ensure multiple categories
    if (stories.length < 3) {
      console.log(`[AI Clustering] Gemini returned only ${stories.length} cluster(s). Complementing with rule-based stories to ensure balanced categories...`);
      const fallbackStories = ruleBasedClustering(articles);
      const existingHeadlines = new Set(stories.map(s => s.neutralHeadline.toLowerCase()));
      for (const fb of fallbackStories) {
        if (!existingHeadlines.has(fb.neutralHeadline.toLowerCase())) {
          fb.isLeadStory = false;
          fb.id = `story-fb-${stories.length + 1}`;
          stories.push(fb);
        }
      }
    }

    if (stories.length > 0) {
      saveClusteredStories(stories);
    }
    console.log(`[AI Clustering] Gemini successfully generated ${stories.length} story clusters!`);
    return stories;
  } catch (err) {
    console.warn('[AI Clustering] Gemini call failed, falling back to rule-based clustering:', (err as Error).message);
    const fallbackStories = ruleBasedClustering(articles);
    if (fallbackStories.length > 0) {
      saveClusteredStories(fallbackStories);
    }
    return fallbackStories;
  }
}

// Deterministic rule-based clustering algorithm based on semantic keyword intersections
function ruleBasedClustering(articles: Article[]): StoryCluster[] {
  const topics = [
    {
      kicker: 'RELACIONES EXTERIORES • SOBERANÍA',
      keywords: ['malvinas', 'britanico', 'streeting', 'defensa', 'reino unido'],
      category: 'Política',
      neutralHeadline: 'Declaraciones del secretario de Defensa británico sobre las Islas Malvinas y reacciones del arco político argentino',
      summary: 'El funcionario del Reino Unido afirmó que su país está preparado para proteger el archipiélago por la fuerza. La diplomacia argentina y bloques legislativos coordinaron iniciativas de repudio y debate parlamentario.',
      aiNotice: 'Clarín e Infobae destacaron el riesgo de escalada militar; La Nación enfatizó la capacidad de disuasión y el statu quo; Ámbito relevó la respuesta diplomática regional en el Parlasur.',
      defaultImage: '/images/malvinas.jpg',
      defaultCaption: 'El secretario de Defensa británico Wes Streeting durante sus declaraciones. (Foto: Archivo de Prensa / AP)'
    },
    {
      kicker: 'FEDERALISMO • ENERGÍA & RECURSOS',
      keywords: ['regalias', 'ziliotto', 'cornejo', 'represa', 'nihuiles', 'pampa', 'mendoza'],
      category: 'Economía',
      neutralHeadline: 'Disputa entre Nación y provincias por la coparticipación de regalías de represas hidroeléctricas',
      summary: 'El decreto que modificó la distribución de ingresos energéticos generó un choque directo entre los gobernadores Ziliotto y Cornejo sobre los convenios vigentes desde 1992.',
      aiNotice: 'Medios regionales y opositores denuncian el avasallamiento del federalismo; sectores afines a Mendoza defienden la legitimidad territorial de la explotación hidroeléctrica.',
      defaultImage: '/images/regalias.jpg',
      defaultCaption: 'El gobernador pampeano Sergio Ziliotto en conferencia de prensa sobre recursos hídricos. (Foto: Prensa Oficial)'
    },
    {
      kicker: 'EDUCACIÓN PÚBLICA • CONFLICTO SALARIAL',
      keywords: ['universitario', 'docente', 'marcha federal', 'conadu', 'financiamiento'],
      category: 'Sociedad',
      neutralHeadline: 'Federaciones universitarias convocan a paro nacional de 72 horas y ratifican nueva Marcha Federal',
      summary: 'Los gremios docentes y no docentes resolvieron medidas de fuerza en demanda de la aplicación de la Ley de Financiamiento y recomposición de partidas salariales.',
      aiNotice: 'Página 12 y Ámbito priorizan la pérdida salarial y el riesgo de congelamiento científico; Clarín pone el foco en el cronograma de paros y resoluciones de la Justicia.',
      defaultImage: '/images/universidad.jpg',
      defaultCaption: 'Movilización universitaria en defensa del presupuesto de la educación pública. (Foto: Cobertura Periodística)'
    },
    {
      kicker: 'MERCADOS & MACROECONOMÍA',
      keywords: ['bonos', 'riesgo pais', 'wall street', 'industria', 'fmi', 'recesion'],
      category: 'Economía',
      neutralHeadline: 'Volatilidad en títulos de deuda soberana y debate por el nivel de actividad fabril',
      summary: 'El riesgo país experimentó oscilaciones ante la incertidumbre en los mercados internacionales y los reclamos de incentivos formulados por cámaras industriales.',
      aiNotice: 'El Cronista enfatiza el reaseguro de la disciplina presupuestaria; Ámbito analiza la fragilidad del frente externo y el impacto en la recaudación tributaria.',
      defaultImage: '/images/mercados.jpg',
      defaultCaption: 'Operaciones financieras y cotización de títulos soberanos en el recinto bursátil. (Foto: Ámbito)'
    }
  ];

  const stories: StoryCluster[] = [];

  topics.forEach((topic, idx) => {
    const matchingArticles = articles.filter(a => {
      const text = `${a.title} ${a.snippet}`.toLowerCase();
      return topic.keywords.some(k => text.includes(k));
    });

    if (matchingArticles.length > 0) {
      const leadImg = matchingArticles.find(a => Boolean(a.imageUrl))?.imageUrl || topic.defaultImage;

      // Select 1 top article per distinct outlet to maximize diversity across newsrooms
      const uniqueOutletArticles: Article[] = [];
      const seenOutlet = new Set<string>();
      matchingArticles.forEach(a => {
        if (!seenOutlet.has(a.outletId)) {
          seenOutlet.add(a.outletId);
          uniqueOutletArticles.push(a);
        }
      });
      const selectedArticles = uniqueOutletArticles.slice(0, 8);

      // Calculate spectrum dynamically based on selected outlets
      let ofi = 0, centro = 0, opo = 0;
      selectedArticles.forEach(a => {
        const o = OUTLETS_REGISTRY[a.outletId];
        if (o?.baselineLeaning === 'oficialismo') ofi++;
        else if (o?.baselineLeaning === 'oposicion') opo++;
        else centro++;
      });
      const total = selectedArticles.length || 1;
      const ofiPct = Math.round((ofi / total) * 100);
      const centroPct = Math.round((centro / total) * 100);
      const opoPct = Math.max(0, 100 - ofiPct - centroPct);

      stories.push({
        id: `story-cluster-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: topic.kicker,
        neutralHeadline: topic.neutralHeadline,
        category: topic.category,
        summary: topic.summary,
        updatedAt: selectedArticles[0]?.publishedAt || 'Reciente',
        imageUrl: leadImg,
        imageCaption: topic.defaultCaption,
        spectrum: {
          oficialismoPct: ofiPct,
          centroDatosPct: centroPct,
          oposicionPct: opoPct,
          totalOutlets: total
        },
        articles: selectedArticles,
        aiComparisonNotice: topic.aiNotice
      });
    }
  });

  return stories;
}

export async function clusterForeignArticlesWithGemini(
  foreignArticles: Article[],
  explicitKey?: string
): Promise<StoryCluster[]> {
  if (!foreignArticles || foreignArticles.length === 0) {
    return getCachedForeignClusters();
  }

  const apiKey = getGeminiKey(explicitKey);
  if (!apiKey) {
    console.warn('[AI Clustering] No Gemini API key found for foreign clustering. Using rule-based fallback.');
    const fallback = ruleBasedForeignClustering(foreignArticles);
    if (fallback.length > 0) saveForeignClusteredStories(fallback);
    return fallback;
  }

  console.log(`[AI Clustering] Invoking Gemini 2.5 to cluster ${foreignArticles.length} international articles about Argentina...`);

  const articlesPromptPayload = foreignArticles.map(a => ({
    id: a.id,
    outletId: a.outletId,
    outletName: a.outletName,
    title: a.title,
    snippet: a.snippet
  }));

  const systemPrompt = `Eres el Editor de Política Internacional de POLITICHECK (Argentina).
Tu misión es analizar la cobertura que realiza la PRENSA INTERNACIONAL (medios de España, Francia, Reino Unido, Estados Unidos, Alemania, Japón, China, etc.) sobre ARGENTINA.

Los artículos proporcionados ya han sido filtrados para tratar exclusivamente sobre la República Argentina (gobierno de Javier Milei, Cristina Kirchner, Kicillof, reformas fiscales, inflación, Malvinas, política exterior o conflictividad).

Instrucciones:
1. Agrupa estos artículos internacionales en entre 1 y 3 historias coherentes (clusters).
2. Para cada historia genera:
   - "kicker": Prefijo "MIRADA EXTERIOR • " seguido del tema en mayúsculas (ej: "MIRADA EXTERIOR • DIPLOMACIA & MALVINAS", "MIRADA EXTERIOR • REFORMAS ECONÓMICAS").
   - "neutralHeadline": Titular neutral en español de alto rigor periodístico que sintetice el debate en la prensa extranjera.
   - "category": Siempre "Internacional".
   - "summary": Resumen explicativo de 2 a 3 oraciones en español analizando cómo ven la situación desde afuera.
   - "aiComparisonNotice": Párrafo de contraste específico comparando la cobertura de los distintos medios internacionales (ej: "The Guardian (Reino Unido) y France 24 ponen el foco en las advertencias diplomáticas y el tono del discurso en la ONU, mientras Expansión (España) subraya las sanciones a petroleras y La Vanguardia analiza el impacto interno.").
   - "articleIds": Lista de IDs de artículos incluidos.
   - "spectrum": Estima el desglose porcentual según la afinidad o crítica del enfoque frente a las medidas del gobierno argentino:
     * "oficialismoPct": Coberturas que ponderan positivamente las reformas o el rumbo oficial.
     * "centroDatosPct": Reportes fácticos, institucionales o bursátiles neutros.
     * "oposicionPct": Críticas sobre el impacto social, tensión política o advertencias adversas.
     * La suma debe ser exactamente 100.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "clusters": [
    {
      "kicker": "MIRADA EXTERIOR • ...",
      "neutralHeadline": "...",
      "category": "Internacional",
      "summary": "...",
      "aiComparisonNotice": "...",
      "articleIds": ["id1", "id2"],
      "spectrum": {
        "oficialismoPct": 30,
        "centroDatosPct": 45,
        "oposicionPct": 25,
        "totalOutlets": 2
      }
    }
  ]
}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Artículos internacionales sobre Argentina para analizar:\n${JSON.stringify(articlesPromptPayload, null, 2)}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed: GeminiClusterResponse = JSON.parse(rawJson);
    const articleMap = new Map(foreignArticles.map(a => [a.id, a]));

    const stories: StoryCluster[] = parsed.clusters.map((c, idx) => {
      const clusterArticles = c.articleIds
        .map(id => articleMap.get(id))
        .filter((a): a is Article => Boolean(a));

      const leadImgArticle = clusterArticles.find(a => Boolean(a.imageUrl));
      const imageUrl = leadImgArticle?.imageUrl || '/images/macri-milei.jpg';

      let ofi = 0, centro = 0, opo = 0;
      clusterArticles.forEach(a => {
        const o = OUTLETS_REGISTRY[a.outletId];
        const leaning = o?.baselineLeaning || 'centro_datos';
        if (leaning === 'oficialismo') ofi++;
        else if (leaning === 'oposicion') opo++;
        else centro++;
      });
      const total = clusterArticles.length || 1;
      const ofiPct = Math.round((ofi / total) * 100);
      const centroPct = Math.round((centro / total) * 100);
      const opoPct = Math.max(0, 100 - ofiPct - centroPct);

      return {
        id: `foreign-ai-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: c.kicker,
        neutralHeadline: c.neutralHeadline,
        category: 'Internacional',
        summary: c.summary,
        updatedAt: 'Reciente',
        imageUrl,
        imageCaption: `Cobertura internacional de ${leadImgArticle?.outletName || 'prensa extranjera'}.`,
        spectrum: {
          oficialismoPct: ofiPct,
          centroDatosPct: centroPct,
          oposicionPct: opoPct,
          totalOutlets: total
        },
        articles: clusterArticles,
        aiComparisonNotice: c.aiComparisonNotice
      };
    });

    if (stories.length > 0) {
      saveForeignClusteredStories(stories);
    }
    console.log(`[AI Clustering] Gemini successfully generated ${stories.length} foreign story clusters!`);
    return stories;
  } catch (err) {
    console.warn('[AI Clustering] Gemini foreign call failed, falling back to rule-based foreign clustering:', (err as Error).message);
    const fallbackStories = ruleBasedForeignClustering(foreignArticles);
    if (fallbackStories.length > 0) {
      saveForeignClusteredStories(fallbackStories);
    }
    return fallbackStories;
  }
}

// Rule-based fallback for foreign articles
function ruleBasedForeignClustering(articles: Article[]): StoryCluster[] {
  const topics = [
    {
      kicker: 'MIRADA EXTERIOR • DIPLOMACIA & MALVINAS',
      keywords: ['malvinas', 'onu', 'falkland', 'cancilleria', 'reino unido', 'diplomacia', 'belicismo'],
      category: 'Internacional',
      neutralHeadline: 'La diplomacia argentina y el reclamo por Malvinas bajo la lupa de los corresponsales en Europa',
      summary: 'Cadenas y periódicos internacionales de Francia, Reino Unido y España analizan el impacto del discurso oficial en la Asamblea de la ONU y las advertencias sobre licencias petroleras en el Atlántico Sur.',
      aiNotice: 'The Guardian (Reino Unido) subraya la advertencia de que Argentina "tomará cartas en el asunto"; France 24 destaca la tensión con Gran Bretaña por proyectos petroleros; La Vanguardia califica el posicionamiento de causa nacional indeclinable.',
      defaultImage: '/images/malvinas.jpg',
      defaultCaption: 'Debate en foros internacionales sobre la soberanía del Atlántico Sur y licencias energéticas.'
    },
    {
      kicker: 'MIRADA EXTERIOR • MACROECONOMÍA & REFORMAS',
      keywords: ['pobreza', 'industria', 'actividad', 'inflacion', 'recesion', 'ajuste', 'pib', 'contraccion', 'contratajo'],
      category: 'Internacional',
      neutralHeadline: 'Prensa económica internacional evalúa la contracción industrial y los indicadores sociales del programa de estabilización',
      summary: 'Publicaciones especializadas como Expansión y France 24 examinan la divergencia entre la desaceleración de los precios y el costo sobre la actividad fabril y los índices de vulnerabilidad social.',
      aiNotice: 'Expansión enfatiza la contracción del 2,9% en el nivel de actividad y los reclamos del sector privado; France 24 pone el acento en el incremento de la pobreza urbana durante el primer semestre.',
      defaultImage: '/images/mercados.jpg',
      defaultCaption: 'Evolución de los indicadores de actividad económica y producción monitoreados desde el exterior.'
    },
    {
      kicker: 'MIRADA EXTERIOR • ENERGÍA & INVERSIONES',
      keywords: ['petroleo', 'vista', 'ypf', 'vaca muerta', 'thiel', 'inversion', 'inversores', 'bonos'],
      category: 'Internacional',
      neutralHeadline: 'Inversores globales ponderan las oportunidades en el sector energético y las barreras cambiarias',
      summary: 'Medios financieros europeos y asiáticos destacan el apetito de fondos de capital de riesgo por activos estratégicos en Vaca Muerta a la espera de la unificación del mercado cambiario.',
      aiNotice: 'Expansión reporta la entrada de fondos tecnológicos internacionales en petroleras argentinas; la prensa anglosajona mantiene cautela ante los plazos de salida del cepo.',
      defaultImage: '/images/macri-milei.jpg',
      defaultCaption: 'Inversiones internacionales y proyecciones de exportación en la cuenca hidrocarburífera argentina.'
    }
  ];

  const stories: StoryCluster[] = [];

  topics.forEach((topic, idx) => {
    const matchingArticles = articles.filter(a => {
      const text = `${a.title} ${a.snippet}`.toLowerCase();
      return topic.keywords.some(k => text.includes(k));
    });

    if (matchingArticles.length > 0) {
      const leadImg = matchingArticles.find(a => Boolean(a.imageUrl))?.imageUrl || topic.defaultImage;

      // Select up to 1 article per distinct outlet
      const uniqueOutletArticles: Article[] = [];
      const seenOutlet = new Set<string>();
      matchingArticles.forEach(a => {
        if (!seenOutlet.has(a.outletId)) {
          seenOutlet.add(a.outletId);
          uniqueOutletArticles.push(a);
        }
      });
      const selectedArticles = uniqueOutletArticles.slice(0, 8);

      let ofi = 0, centro = 0, opo = 0;
      selectedArticles.forEach(a => {
        const o = OUTLETS_REGISTRY[a.outletId];
        if (o?.baselineLeaning === 'oficialismo') ofi++;
        else if (o?.baselineLeaning === 'oposicion') opo++;
        else centro++;
      });
      const total = selectedArticles.length || 1;
      const ofiPct = Math.round((ofi / total) * 100);
      const centroPct = Math.round((centro / total) * 100);
      const opoPct = Math.max(0, 100 - ofiPct - centroPct);

      stories.push({
        id: `foreign-cluster-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: topic.kicker,
        neutralHeadline: topic.neutralHeadline,
        category: topic.category,
        summary: topic.summary,
        updatedAt: selectedArticles[0]?.publishedAt || 'Reciente',
        imageUrl: leadImg,
        imageCaption: topic.defaultCaption,
        spectrum: {
          oficialismoPct: ofiPct,
          centroDatosPct: centroPct,
          oposicionPct: opoPct,
          totalOutlets: total
        },
        articles: selectedArticles,
        aiComparisonNotice: topic.aiNotice
      });
    }
  });

  return stories;
}
