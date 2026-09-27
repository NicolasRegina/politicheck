import fs from 'node:fs';
import path from 'node:path';
import type { Article, StoryCluster, SpectrumBreakdown } from '../../types';
import { OUTLETS } from '../../data/mockData';

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
    console.log(`[AI Clustering] Calling Gemini Flash to cluster ${articles.length} articles...`);
    const prompt = `
Eres el motor de análisis editorial y verificación de Politicheck.
Tu objetivo es analizar las siguientes noticias argentinas de las últimas horas publicadas por distintos medios (Clarín, La Nación, Infobae, Ámbito, El Cronista, Página 12, etc.) y agruparlas en torno al mismo hecho central ("Historia").

Reglas estrictas:
1. Agrupa solo aquellas noticias que cubren el mismo acontecimiento objetivo.
2. Cada grupo ("Historia") debe tener preferentemente noticias de 2 o más medios diferentes.
3. Escribe un titular neutral ("neutralHeadline") estrictamente factual, sin adjetivos tendenciosos.
4. Redacta un dictamen comparativo de encuadres ("aiComparisonNotice") que explique con rigor periodístico: qué priorizó cada medio en su titular y qué omitió.
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
      "aiComparisonNotice": "Síntesis del contraste de enfoques entre los medios.",
      "articleIds": ["id1", "id2"],
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
${JSON.stringify(articles.slice(0, 35).map(a => ({ id: a.id, medio: a.outletName, titulo: a.title, bajada: a.snippet })), null, 2)}
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
          ...c.spectrum,
          totalOutlets: clusterArticles.length
        },
        articles: clusterArticles,
        aiComparisonNotice: c.aiComparisonNotice
      };
    });

    console.log(`[AI Clustering] Gemini successfully generated ${stories.length} story clusters!`);
    return stories;
  } catch (err) {
    console.warn('[AI Clustering] Gemini call failed, falling back to rule-based clustering:', (err as Error).message);
    return ruleBasedClustering(articles);
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

      // Calculate spectrum dynamically based on monitored outlets
      const outletsSet = new Set(matchingArticles.map(a => a.outletId));
      let ofi = 0, centro = 0, opo = 0;
      outletsSet.forEach(id => {
        const o = OUTLETS[id];
        if (o?.baselineLeaning === 'oficialismo') ofi++;
        else if (o?.baselineLeaning === 'oposicion') opo++;
        else centro++;
      });
      const total = outletsSet.size || 1;

      stories.push({
        id: `story-cluster-${idx + 1}`,
        isLeadStory: idx === 0,
        kicker: topic.kicker,
        neutralHeadline: topic.neutralHeadline,
        category: topic.category,
        summary: topic.summary,
        updatedAt: matchingArticles[0]?.publishedAt || 'Reciente',
        imageUrl: leadImg,
        imageCaption: topic.defaultCaption,
        spectrum: {
          oficialismoPct: Math.round((ofi / total) * 100),
          centroDatosPct: Math.round((centro / total) * 100),
          oposicionPct: Math.round((opo / total) * 100),
          totalOutlets: total
        },
        articles: matchingArticles.slice(0, 4),
        aiComparisonNotice: topic.aiNotice
      });
    }
  });

  return stories;
}
