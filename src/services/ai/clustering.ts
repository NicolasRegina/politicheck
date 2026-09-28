import fs from 'node:fs';
import path from 'node:path';
import type { Article, StoryCluster, SpectrumBreakdown } from '../../types';
import { OUTLETS, MOCK_STORIES } from '../../data/mockData';
import { saveNewsClustersToSupabase, getNewsClustersFromSupabase } from '../supabase';

const CLUSTERED_STORIES_FILE = path.resolve(process.cwd(), 'src/data/clustered_stories.json');

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

export function getStoryClusterById(id: string): StoryCluster | undefined {
  const cached = getCachedClusteredStories();
  const foundInCached = cached.find(s => s.id === id);
  if (foundInCached) return foundInCached;

  return MOCK_STORIES.find(s => s.id === id);
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

  for (const item of scoredArticles) {
    if (item.score > 0 && selected.length < maxArticles) {
      selected.push(item.article);
      selectedIds.add(item.article.id);
    }
  }

  // Ensure every monitored outlet has representation in candidate pool
  Object.values(byOutlet).forEach(outletArticles => {
    for (const a of outletArticles.slice(0, 2)) {
      if (!selectedIds.has(a.id) && selected.length < maxArticles + 25) {
        selected.push(a);
        selectedIds.add(a.id);
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
Eres el motor de análisis editorial y verificación de Politicheck.
Tu objetivo es analizar las siguientes noticias argentinas publicadas por distintos medios (Clarín, La Nación, Infobae, TN, Ámbito, El Cronista, Página 12, Perfil, elDiarioAR, Crónica, BAE Negocios, Cenital, La Derecha Diario, etc.) y agruparlas en torno a los hechos centrales de gran impacto ("Historias").

Reglas estrictas:
1. Agrupa solo aquellas noticias que cubren el mismo acontecimiento objetivo.
2. PRIORIDAD MÁXIMA - COBERTURA MULTI-MEDIO: Tu objetivo primordial es agrupar historias de gran envergadura nacional donde la mayor cantidad posible de redacciones (4, 5, 6, 7 o más diarios distintos) estén informando sobre el mismo hecho central. NO te limites a solo 2 diarios: incluye a TODOS los medios del listado que hablen de dicho hecho para que la comparación de titulares y el espectro editorial sea lo más amplio y representativo posible.
3. Escribe un titular neutral ("neutralHeadline") estrictamente factual, sin adjetivos tendenciosos.
4. Redacta un dictamen comparativo de encuadres ("aiComparisonNotice") que explique con rigor periodístico: qué priorizó cada redacción en su titular y qué omitió.
5. Clasifica la categoría ("Política", "Economía", "Sociedad", "Justicia" o "Internacional").
6. Estima la distribución del espectro editorial (oficialismoPct, centroDatosPct, oposicionPct) sumando el 100%.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "clusters": [
    {
      "kicker": "VOLANTA EN MAYÚSCULAS",
      "neutralHeadline": "Titular neutral y factual",
      "category": "Política",
      "summary": "Resumen objetivo en dos oraciones.",
      "aiComparisonNotice": "Síntesis del contraste de enfoques entre las múltiples redacciones.",
      "articleIds": ["id1", "id2", "id3", "id4", "id5"],
      "spectrum": {
        "oficialismoPct": 40,
        "centroDatosPct": 35,
        "oposicionPct": 25,
        "totalOutlets": 5
      }
    }
  ]
}

Noticias a analizar:
${JSON.stringify(candidateArticles.map(a => ({ id: a.id, medio: a.outletName, titulo: a.title, bajada: a.snippet })), null, 2)}
`;

    const CANDIDATE_MODELS = [
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
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

    const stories: StoryCluster[] = parsed.clusters.map((c, idx) => {
      const clusterArticles = c.articleIds
        .map(id => articleMap.get(id))
        .filter((a): a is Article => Boolean(a));

      // Pick best journalistic photo among the cluster
      const leadImgArticle = clusterArticles.find(a => Boolean(a.imageUrl));
      const imageUrl = leadImgArticle?.imageUrl || '/images/malvinas.jpg';

      // Calculate spectrum deterministically from participating articles and their outlets
      let ofi = 0;
      let centro = 0;
      let opo = 0;
      clusterArticles.forEach(a => {
        const o = OUTLETS[a.outletId];
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
        id: `story-ai-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: c.kicker,
        neutralHeadline: c.neutralHeadline,
        category: c.category,
        summary: c.summary,
        updatedAt: 'Reciente',
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
        const o = OUTLETS[a.outletId];
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
