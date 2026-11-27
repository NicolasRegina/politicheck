import type { Article, StoryCluster } from '../types';
import { OUTLETS_REGISTRY } from './outlets';

const STOP_WORDS = new Set([
  'para', 'como', 'sobre', 'entre', 'este', 'esta', 'estos', 'estas', 'tras', 'desde',
  'contra', 'hasta', 'hace', 'pero', 'segun', 'todo', 'todos', 'toda', 'todas',
  'porque', 'cuando', 'donde', 'quien', 'cual', 'dijo', 'afirma', 'aseguro', 'afirmo',
  'nuevo', 'nueva', 'nuevos', 'nuevas', 'argentina', 'argentino', 'argentinos',
  'gobierno', 'pais', 'ante', 'proyecto', 'nacional', 'medios', 'nota', 'ahora',
  'hoy', 'ayer', 'luego', 'sino', 'tambien', 'mientras', 'durante', 'despues', 'antes',
  'gran', 'menos', 'anos', 'solo', 'tiene', 'tienen', 'fueron', 'sera', 'seran',
  'hizo', 'haber', 'otro', 'otra', 'otros', 'otras', 'pasa', 'paso_verb', 'parte',
  'puede', 'pueden', 'cada', 'tres', 'cuatro', 'cinco', 'dias', 'horas', 'semana',
  'meses', 'mundo', 'ciudad', 'provincia', 'buenos', 'aires', 'minuto', 'vivo'
]);

const HIGH_SIGNAL_SHORT_TOKENS = new Set([
  'fmi', 'ypf', 'cgt', 'uba', 'dnu', 'ley', 'pro', 'ucr', 'lla', 'pba', 'afa', 'sad', 'iva', 'mep', 'ccl'
]);

export function normalizeUrlKey(url?: string): string {
  if (!url) return '';
  return url.trim().toLowerCase().split('?')[0].split('#')[0].replace(/\/+$/, '');
}

export function extractSignificantTokens(text?: string): Set<string> {
  if (!text) return new Set();
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');

  const tokens = new Set<string>();
  for (const word of normalized.split(/\s+/)) {
    if (!word) continue;
    if (HIGH_SIGNAL_SHORT_TOKENS.has(word)) {
      tokens.add(word);
    } else if (word.length >= 4 && !STOP_WORDS.has(word)) {
      tokens.add(word);
    }
  }
  return tokens;
}

export function computeTokenSimilarity(a: Set<string>, b: Set<string>): {
  intersection: number;
  jaccard: number;
  containment: number;
} {
  if (a.size === 0 || b.size === 0) {
    return { intersection: 0, jaccard: 0, containment: 0 };
  }
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  const union = a.size + b.size - intersection;
  const minSize = Math.min(a.size, b.size);
  return {
    intersection,
    jaccard: union > 0 ? intersection / union : 0,
    containment: minSize > 0 ? intersection / minSize : 0,
  };
}

export function recalculateSpectrum(articles: Article[]): StoryCluster['spectrum'] {
  let ofi = 0;
  let centro = 0;
  let opo = 0;
  for (const a of articles) {
    const o = OUTLETS_REGISTRY[a.outletId];
    const leaning = o?.baselineLeaning || 'centro_datos';
    if (leaning === 'oficialismo') ofi++;
    else if (leaning === 'oposicion') opo++;
    else centro++;
  }
  const total = articles.length || 1;
  const ofiPct = Math.round((ofi / total) * 100);
  const centroPct = Math.round((centro / total) * 100);
  const opoPct = Math.max(0, 100 - ofiPct - centroPct);
  return {
    oficialismoPct: ofiPct,
    centroDatosPct: centroPct,
    oposicionPct: opoPct,
    totalOutlets: articles.length,
  };
}

/**
 * Merges articles from two clusters keeping strictly 1 article per distinct outlet,
 * with NO artificial cap on total outlets so major breaking stories reflect full coverage.
 */
export function mergeClusterArticles(primary: Article[] = [], secondary: Article[] = []): Article[] {
  const byOutlet = new Map<string, Article>();

  const ingest = (list: Article[]) => {
    for (const art of list) {
      if (!art || !art.outletId) continue;
      const existing = byOutlet.get(art.outletId);
      if (!existing) {
        byOutlet.set(art.outletId, { ...art });
      } else {
        const existingTs = existing.timestamp || 0;
        const incomingTs = art.timestamp || 0;
        if (incomingTs > existingTs) {
          byOutlet.set(art.outletId, {
            ...art,
            specificFocus: art.specificFocus || existing.specificFocus,
          });
        } else if (!existing.specificFocus && art.specificFocus) {
          byOutlet.set(art.outletId, {
            ...existing,
            specificFocus: art.specificFocus,
          });
        }
      }
    }
  };

  ingest(primary);
  ingest(secondary);

  return Array.from(byOutlet.values()).toSorted((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

function getClusterTimestampMs(cluster: any): number {
  if (typeof cluster?.timestamp === 'number' && cluster.timestamp > 0) {
    return cluster.timestamp;
  }
  const raw = cluster?.updated_at || cluster?.updatedAt;
  if (raw) {
    const parsed = new Date(raw).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  const articles = Array.isArray(cluster?.articles) ? cluster.articles : [];
  const maxArtTs = articles.reduce((max: number, a: any) => Math.max(max, a?.timestamp || 0), 0);
  return maxArtTs || Date.now();
}

function isRealEditorialImage(url?: string): boolean {
  return Boolean(url && !url.startsWith('/images/'));
}

/**
 * Determines whether two clusters describe the same underlying news event
 * within a 48-hour window (by shared articles, headline token similarity, or shared press photo + topic).
 */
export function areClustersDuplicate(a: any, b: any, maxWindowHours = 48): boolean {
  if (!a || !b) return false;
  if (a.id && b.id && a.id === b.id) return true;

  // Don't merge national vs international clusters
  const isForeignA = a.category === 'Internacional' || a.kicker?.includes('MIRADA EXTERIOR');
  const isForeignB = b.category === 'Internacional' || b.kicker?.includes('MIRADA EXTERIOR');
  if (isForeignA !== isForeignB) return false;

  const tsA = getClusterTimestampMs(a);
  const tsB = getClusterTimestampMs(b);
  const diffHours = Math.abs(tsA - tsB) / (1000 * 60 * 60);
  if (diffHours > maxWindowHours) return false;

  // 1. Check shared articles (URL or ID)
  const artsA: Article[] = Array.isArray(a.articles) ? a.articles : [];
  const artsB: Article[] = Array.isArray(b.articles) ? b.articles : [];
  if (artsA.length > 0 && artsB.length > 0) {
    const keysA = new Set<string>();
    for (const art of artsA) {
      if (art.id) keysA.add(`id:${art.id}`);
      const urlKey = normalizeUrlKey(art.url);
      if (urlKey) keysA.add(`url:${urlKey}`);
    }
    let sharedCount = 0;
    for (const art of artsB) {
      const urlKey = normalizeUrlKey(art.url);
      if ((art.id && keysA.has(`id:${art.id}`)) || (urlKey && keysA.has(`url:${urlKey}`))) {
        sharedCount++;
      }
    }
    const minArts = Math.min(artsA.length, artsB.length);
    if (sharedCount >= 2 || (minArts > 0 && sharedCount / minArts >= 0.35)) {
      return true;
    }
  }

  // 2. Check headline token similarity (Jaccard / containment)
  const headlineA = a.neutralHeadline || a.neutral_headline || a.lead_title || '';
  const headlineB = b.neutralHeadline || b.neutral_headline || b.lead_title || '';
  const tokensA = extractSignificantTokens(headlineA);
  const tokensB = extractSignificantTokens(headlineB);
  const sim = computeTokenSimilarity(tokensA, tokensB);

  if (sim.intersection >= 3 && (sim.jaccard >= 0.42 || sim.containment >= 0.6)) {
    return true;
  }

  // 3. Same real press photo + thematic overlap
  const imgA = a.imageUrl || a.key_quotes?.imageUrl;
  const imgB = b.imageUrl || b.key_quotes?.imageUrl;
  if (isRealEditorialImage(imgA) && imgA === imgB && (sim.intersection >= 2 || sim.jaccard >= 0.25)) {
    return true;
  }

  return false;
}

/**
 * Collapses duplicate clusters in priority order (first wins), merging all unique outlets
 * from duplicates into the winning cluster and recalculating its ideological spectrum.
 */
export function deduplicateStoryClusters<T extends Record<string, any>>(clusters: T[], maxWindowHours = 48): T[] {
  const winners: T[] = [];

  for (const candidate of clusters) {
    const matchIdx = winners.findIndex((w) => areClustersDuplicate(w, candidate, maxWindowHours));
    if (matchIdx === -1) {
      winners.push({
        ...candidate,
        articles: Array.isArray(candidate.articles) ? [...candidate.articles] : [],
      });
    } else {
      const winner = winners[matchIdx];
      const mergedArticles = mergeClusterArticles(winner.articles || [], candidate.articles || []);
      const recalculatedSpectrum = recalculateSpectrum(mergedArticles);
      winners[matchIdx] = {
        ...winner,
        articles: mergedArticles,
        spectrum: recalculatedSpectrum,
      };
    }
  }

  return winners;
}

/**
 * Zero-token post-clustering enrichment: scans the full live RSS article pool
 * (all 31 outlets) and attaches matching articles from outlets not yet represented
 * in each Gemini cluster, recalculating the spectrum over all participating newsrooms.
 */
export function enrichClustersWithAllOutlets(
  clusters: StoryCluster[],
  allArticles: Article[],
  isSportsOrIrrelevant?: (article: Article) => boolean
): StoryCluster[] {
  if (!clusters.length || !allArticles.length) return clusters;

  // Pre-compute normalized title tokens for every article once
  const articleTokens = new Map<string, Set<string>>();
  for (const art of allArticles) {
    articleTokens.set(art.id, extractSignificantTokens(art.title));
  }

  return clusters.map((cluster) => {
    const existingOutlets = new Set((cluster.articles || []).map((a) => a.outletId));
    const clusterTs = getClusterTimestampMs(cluster);

    // Build high-confidence event signature tokens:
    // tokens from neutralHeadline + tokens appearing in >= 2 existing cluster article titles
    const headlineTokens = extractSignificantTokens(cluster.neutralHeadline);
    const termFreq = new Map<string, number>();
    for (const art of cluster.articles || []) {
      const toks = extractSignificantTokens(art.title);
      for (const t of toks) {
        termFreq.set(t, (termFreq.get(t) || 0) + 1);
      }
    }

    const signatureTokens = new Set<string>(headlineTokens);
    for (const [term, count] of termFreq.entries()) {
      if (count >= 2) signatureTokens.add(term);
    }

    if (signatureTokens.size < 2) return cluster;

    const additionsByOutlet = new Map<string, { article: Article; score: number }>();

    for (const art of allArticles) {
      if (existingOutlets.has(art.outletId)) continue;
      if (isSportsOrIrrelevant && isSportsOrIrrelevant(art)) continue;

      // Keep articles within +-24h of the cluster's main event window
      if (art.timestamp && Math.abs(art.timestamp - clusterTs) > 24 * 60 * 60 * 1000) {
        continue;
      }

      const artToks = articleTokens.get(art.id) || extractSignificantTokens(art.title);
      const sigSim = computeTokenSimilarity(signatureTokens, artToks);
      const headSim = computeTokenSimilarity(headlineTokens, artToks);

      // Strict matching threshold to avoid false-positive noise while capturing all outlets covering the exact event
      const isMatch =
        sigSim.intersection >= 3 ||
        (sigSim.intersection >= 2 && (headSim.jaccard >= 0.28 || headSim.containment >= 0.5));

      if (!isMatch) continue;

      const matchScore = sigSim.intersection * 10 + headSim.jaccard * 10;
      const prev = additionsByOutlet.get(art.outletId);
      if (
        !prev ||
        matchScore > prev.score ||
        (matchScore === prev.score && (art.timestamp || 0) > (prev.article.timestamp || 0))
      ) {
        additionsByOutlet.set(art.outletId, { article: art, score: matchScore });
      }
    }

    if (additionsByOutlet.size === 0) return cluster;

    const addedArticles = Array.from(additionsByOutlet.values()).map((entry) => entry.article);
    const mergedArticles = mergeClusterArticles(cluster.articles || [], addedArticles);
    const updatedSpectrum = recalculateSpectrum(mergedArticles);

    return {
      ...cluster,
      articles: mergedArticles,
      spectrum: updatedSpectrum,
    };
  });
}
