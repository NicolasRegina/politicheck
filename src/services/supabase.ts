import { createClient } from '@supabase/supabase-js';
import type { ChatChannel, ChatMessage, ForumComment, ForumAuthorRole } from '../types';
import { MemoryTtlCache } from './cache.ts';
import {
  areClustersDuplicate,
  deduplicateStoryClusters,
  mergeClusterArticles,
  recalculateSpectrum,
} from '../utils/clusterDedup';

const supabaseUrl = import.meta.env?.SUPABASE_URL || process.env.SUPABASE_URL || import.meta.env?.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || import.meta.env?.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

export const supabaseReadCache = new MemoryTtlCache();

const CLUSTERS_TTL_MS = 3 * 60 * 1000;
const FEED_TTL_MS = 3 * 60 * 1000;
const TIMESTAMP_TTL_MS = 2 * 60 * 1000;
const BANNER_TTL_MS = 10 * 60 * 1000;

export function invalidateNewsCache(): void {
  supabaseReadCache.invalidate('clusters:');
  supabaseReadCache.invalidate('feed:');
  supabaseReadCache.invalidate('last-sync-ts');
}

export function invalidateBannersCache(): void {
  supabaseReadCache.invalidate('banner:');
}

/**
 * Record a citizen vote in Supabase cloud PostgreSQL
 */
export async function recordSupabaseVote(
  promiseId: string,
  voterHash: string,
  voteType: 'fulfilled' | 'inProgress' | 'broken'
): Promise<{ success: boolean; isNew?: boolean; switched?: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  // Map to DB enum: 'cumple' | 'en-proceso' | 'no-cumple'
  const dbVoteType = 
    voteType === 'fulfilled' ? 'cumple' :
    voteType === 'inProgress' ? 'en-proceso' : 'no-cumple';

  try {
    // Check if voter already voted
    const { data: existing, error: fetchErr } = await supabase
      .from('citizen_votes')
      .select('vote_type')
      .eq('promise_id', promiseId)
      .eq('voter_hash', voterHash)
      .maybeSingle();

    if (fetchErr) {
      console.warn('[Supabase] Warning fetching existing vote:', fetchErr.message);
    }

    if (existing) {
      if (existing.vote_type === dbVoteType) {
        return { success: true, isNew: false, switched: false };
      }
      // Update existing vote
      const { error: updateErr } = await supabase
        .from('citizen_votes')
        .update({
          vote_type: dbVoteType,
          updated_at: new Date().toISOString()
        })
        .eq('promise_id', promiseId)
        .eq('voter_hash', voterHash);

      if (updateErr) throw updateErr;
      return { success: true, isNew: false, switched: true };
    }

    // Insert new vote
    const { error: insertErr } = await supabase
      .from('citizen_votes')
      .insert({
        promise_id: promiseId,
        voter_hash: voterHash,
        vote_type: dbVoteType
      });

    if (insertErr) throw insertErr;
    return { success: true, isNew: true, switched: false };
  } catch (err: any) {
    console.error('[Supabase] Error recording citizen vote:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch aggregated citizen votes for all promises from Supabase
 */
export async function getSupabaseVotesAggregated(): Promise<Record<string, { fulfilled: number; inProgress: number; broken: number }>> {
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('citizen_votes')
      .select('promise_id, vote_type');

    if (error || !data) {
      console.warn('[Supabase] Could not load votes:', error?.message);
      return {};
    }

    const aggregated: Record<string, { fulfilled: number; inProgress: number; broken: number }> = {};

    for (const row of data) {
      if (!aggregated[row.promise_id]) {
        aggregated[row.promise_id] = { fulfilled: 0, inProgress: 0, broken: 0 };
      }
      if (row.vote_type === 'cumple') {
        aggregated[row.promise_id].fulfilled += 1;
      } else if (row.vote_type === 'en-proceso') {
        aggregated[row.promise_id].inProgress += 1;
      } else if (row.vote_type === 'no-cumple') {
        aggregated[row.promise_id].broken += 1;
      }
    }

    return aggregated;
  } catch (err: any) {
    console.error('[Supabase] Aggregation error:', err.message);
    return {};
  }
}

/**
 * Compute editorial score to determine the Gran Apertura de Tapa.
 * Prioritizes:
 * 1. Breadth of coverage: number of distinct newsrooms covering the story.
 * 2. Freshness: stories from today/recent hours score exponentially higher than stories from days ago.
 */
export function computeClusterEditorialScore(story: any): number {
  const now = Date.now();
  const rawUpdated = new Date(story.updated_at || story.updatedAt).getTime();
  const articleTimes = (Array.isArray(story.articles) ? story.articles : [])
    .map((a: any) => typeof a.timestamp === 'number' && !isNaN(a.timestamp) && a.timestamp > 0 ? a.timestamp : new Date(a.publishedAt).getTime())
    .filter((t: number) => !isNaN(t) && t > 0);

  const bestTime = articleTimes.length > 0 ? Math.max(...articleTimes) : (!isNaN(rawUpdated) ? rawUpdated : (story.timestamp || 0));
  const ageHours = bestTime > 0 ? Math.max(0, (now - bestTime) / (1000 * 60 * 60)) : 72;

  const distinctOutlets = new Set((story.articles || []).map((a: any) => a.outletId || a.outletName)).size;

  // 60 points per distinct newsroom reporting
  const coverageScore = distinctOutlets * 60;

  // Freshness score:
  // < 6h: 300 pts
  // < 12h: 200 pts
  // < 24h: 100 pts
  // > 24h: heavily penalized so it moves down to the secondary feed
  let freshnessScore = 0;
  if (ageHours < 6) {
    freshnessScore = 300;
  } else if (ageHours < 12) {
    freshnessScore = 200;
  } else if (ageHours < 24) {
    freshnessScore = 100;
  } else {
    // 24h+ penalty: -150 points per day of age
    freshnessScore = -Math.min(1500, Math.round((ageHours / 24) * 150));
  }

  return coverageScore + freshnessScore;
}

/**
 * Save clustered news stories into Supabase cloud cache.
 * Deduplicates incoming clusters and merges into any matching cluster from the last 36 hours
 * so existing story URLs, forum debates, and all accumulated outlets are preserved.
 */
export async function saveNewsClustersToSupabase(clusters: any[]): Promise<boolean> {
  if (!supabase || !clusters || clusters.length === 0) return false;

  try {
    // 1. Deduplicate incoming batch against itself first
    const uniqueIncoming = deduplicateStoryClusters(clusters, 48);

    // 2. Load recent clusters (last 36h) to detect ongoing stories and merge outlets into their existing ID
    const lookbackIso = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const { data: recentExisting } = await supabase
      .from('news_clusters')
      .select('id, lead_title, neutral_headline, category, articles, key_quotes, updated_at')
      .neq('id', 'live-feed-cache')
      .neq('id', 'foreign-feed-cache')
      .gt('updated_at', lookbackIso)
      .order('updated_at', { ascending: false })
      .limit(40);

    const existingPool = Array.isArray(recentExisting) ? recentExisting : [];
    const claimedExistingIds = new Set<string>();

    const mergedById = new Map<string, any>();

    uniqueIncoming.forEach((c, idx) => {
      const matchedExisting = existingPool.find(
        (ex) => !claimedExistingIds.has(ex.id) && areClustersDuplicate(ex, c, 36)
      );

      let targetId = c.id;
      let finalArticles = Array.isArray(c.articles) ? c.articles : [];
      let finalSpectrum = c.spectrum;

      if (matchedExisting) {
        claimedExistingIds.add(matchedExisting.id);
        targetId = matchedExisting.id;
        finalArticles = mergeClusterArticles(finalArticles, Array.isArray(matchedExisting.articles) ? matchedExisting.articles : []);
        finalSpectrum = recalculateSpectrum(finalArticles);
      }

      const articleTimes = finalArticles
        .map((a: any) => typeof a.timestamp === 'number' ? a.timestamp : new Date(a.publishedAt).getTime())
        .filter((t: number) => !isNaN(t) && t > 0);
      const clusterTimestamp = Math.max(
        c.timestamp || 0,
        articleTimes.length > 0 ? Math.max(...articleTimes) : Date.now()
      );

      mergedById.set(targetId, {
        id: targetId,
        lead_title: c.leadTitle || c.neutralHeadline,
        neutral_headline: c.neutralHeadline,
        summary: c.summary,
        category: c.category || 'Política',
        spectrum: finalSpectrum,
        articles: finalArticles,
        key_quotes: {
          kicker: c.kicker,
          imageUrl: c.imageUrl,
          imageCaption: c.imageCaption,
          aiComparisonNotice: c.aiComparisonNotice,
          isLeadStory: c.isLeadStory ?? (idx === 0),
          updatedAt: c.updatedAt,
          timestamp: clusterTimestamp,
          outletsCount: new Set(finalArticles.map((a: any) => a.outletId || a.outletName)).size
        },
        updated_at: new Date(clusterTimestamp).toISOString()
      });
    });

    const rows = Array.from(mergedById.values());

    const { error } = await supabase
      .from('news_clusters')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving news clusters:', error.message);
      return false;
    }
    invalidateNewsCache();

    // Non-blocking human-in-the-loop institutional role-change detector (ADR-0009)
    try {
      const { detectAndRecordPoliticianRoleAlerts } = await import('./politicians');
      await detectAndRecordPoliticianRoleAlerts(uniqueIncoming);
    } catch (alertErr: any) {
      console.warn('[Supabase] Non-fatal role-alert scan error:', alertErr?.message || alertErr);
    }

    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving news clusters:', err.message);
    return false;
  }
}

export interface GetNewsClustersOptions {
  maxAgeMinutes?: number;
  maxAgeDays?: number;
  limit?: number;
}

/**
 * Load latest cached news clusters from Supabase with historical accumulation
 */
export async function getNewsClustersFromSupabase(
  param?: number | GetNewsClustersOptions,
  maxAgeDays = 7,
  client = supabase
): Promise<any[] | null> {
  if (!client) return null;

  let limit = 45;
  let cacheWindowKey = '';
  let minTime: string;

  if (typeof param === 'object' && param !== null) {
    limit = param.limit || 45;
    if (param.maxAgeMinutes) {
      cacheWindowKey = `m${param.maxAgeMinutes}`;
      minTime = new Date(Date.now() - param.maxAgeMinutes * 60 * 1000).toISOString();
    } else {
      const days = param.maxAgeDays || 7;
      cacheWindowKey = `d${days}`;
      minTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    }
  } else {
    const num = typeof param === 'number' ? param : 100;
    if (num <= 240) {
      cacheWindowKey = `m${num}`;
      minTime = new Date(Date.now() - num * 60 * 1000).toISOString();
      limit = 30;
    } else {
      const days = maxAgeDays || 7;
      cacheWindowKey = `d${days}`;
      minTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      limit = 45;
    }
  }

  const cacheKey = `clusters:${cacheWindowKey}:${limit}`;

  return supabaseReadCache.getOrLoad(cacheKey, CLUSTERS_TTL_MS, async () => {
    try {
      const { data, error } = await client
        .from('news_clusters')
        .select('id, lead_title, neutral_headline, summary, category, spectrum, articles, key_quotes, updated_at')
        .neq('id', 'live-feed-cache')
        .neq('id', 'foreign-feed-cache')
        .gt('updated_at', minTime)
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return null;
      }

      // Map DB rows back to full application StoryCluster objects
      const mapped = data.map(row => {
        const meta = (typeof row.key_quotes === 'object' && row.key_quotes !== null) ? row.key_quotes : {};
        const firstArticleImg = Array.isArray(row.articles) && row.articles[0]?.imageUrl;
        const defaultImg = row.category === 'Economía' ? '/images/regalias.jpg' : row.category === 'Sociedad' ? '/images/universidad.jpg' : '/images/malvinas.jpg';

        const articleTimes = (Array.isArray(row.articles) ? row.articles : [])
          .map((a: any) => typeof a.timestamp === 'number' ? a.timestamp : new Date(a.publishedAt).getTime())
          .filter((t: number) => !isNaN(t) && t > 0);
        const accurateTimestamp = meta.timestamp || (articleTimes.length > 0 ? Math.max(...articleTimes) : new Date(row.updated_at).getTime());

        return {
          id: row.id,
          isLeadStory: false,
          kicker: meta.kicker || (row.category === 'Internacional' ? 'MIRADA EXTERIOR' : 'EN COBERTURA'),
          neutralHeadline: row.neutral_headline || row.lead_title,
          category: row.category,
          summary: row.summary,
          updatedAt: meta.updatedAt || row.updated_at,
          timestamp: accurateTimestamp,
          imageUrl: meta.imageUrl || firstArticleImg || defaultImg,
          imageCaption: meta.imageCaption || `Cobertura periodística de ${row.articles?.[0]?.outletName || 'prensa oficial'}.`,
          spectrum: row.spectrum,
          articles: row.articles || [],
          aiComparisonNotice: meta.aiComparisonNotice || ''
        };
      });

      // Rank stories by Editorial Score (Most relevant multi-outlet news of today first)
      mapped.sort((a, b) => {
        const scoreA = computeClusterEditorialScore(a);
        const scoreB = computeClusterEditorialScore(b);
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        const timeA = a.timestamp || new Date(a.updatedAt).getTime() || 0;
        const timeB = b.timestamp || new Date(b.updatedAt).getTime() || 0;
        return timeB - timeA;
      });

      if (mapped.length > 0) {
        mapped[0].isLeadStory = true;
      }

      return mapped;
    } catch (err: any) {
      console.error('[Supabase] Exception loading news clusters:', err.message);
      return null;
    }
  });
}

/**
 * Fetch a single story cluster directly from Supabase by its exact ID
 */
export async function getStoryClusterByIdFromSupabase(id: string): Promise<any | null> {
  if (!supabase || !id) return null;

  try {
    const { data: row, error } = await supabase
      .from('news_clusters')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !row) return null;

    const meta = (typeof row.key_quotes === 'object' && row.key_quotes !== null) ? row.key_quotes : {};
    const firstArticleImg = Array.isArray(row.articles) && row.articles[0]?.imageUrl;
    const defaultImg = row.category === 'Economía' ? '/images/regalias.jpg' : row.category === 'Sociedad' ? '/images/universidad.jpg' : '/images/malvinas.jpg';

    return {
      id: row.id,
      isLeadStory: meta.isLeadStory === true,
      kicker: meta.kicker || (row.category === 'Internacional' ? 'MIRADA EXTERIOR' : 'EN COBERTURA'),
      neutralHeadline: row.neutral_headline || row.lead_title,
      category: row.category,
      summary: row.summary,
      updatedAt: meta.updatedAt || row.updated_at,
      imageUrl: meta.imageUrl || firstArticleImg || defaultImg,
      imageCaption: meta.imageCaption || `Cobertura periodística de ${row.articles?.[0]?.outletName || 'prensa oficial'}.`,
      spectrum: row.spectrum,
      articles: row.articles || [],
      aiComparisonNotice: meta.aiComparisonNotice || ''
    };
  } catch (err: any) {
    console.error('[Supabase] Exception loading story cluster by ID:', err.message);
    return null;
  }
}

/**
 * Save live minute-by-minute articles feed into Supabase cloud cache
 */
export async function saveLiveArticlesToSupabase(articles: any[], timestamp?: string): Promise<boolean> {
  if (!supabase || !articles || articles.length === 0) return false;

  try {
    const isoTimestamp = timestamp || new Date().toISOString();
    const { error } = await supabase
      .from('news_clusters')
      .upsert({
        id: 'live-feed-cache',
        lead_title: 'LIVE_FEED_CACHE',
        neutral_headline: 'Feed de noticias en tiempo real',
        summary: 'Agregación consolidada de todos los feeds RSS monitoreados',
        category: 'Feed',
        spectrum: { oficialismoPct: 0, centroDatosPct: 100, oposicionPct: 0, totalOutlets: 1 },
        articles: articles.slice(0, 150),
        key_quotes: { timestamp: isoTimestamp, totalArticles: articles.length },
        updated_at: isoTimestamp
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving live feed cache:', error.message);
      return false;
    }
    invalidateNewsCache();
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving live feed cache:', err.message);
    return false;
  }
}

/**
 * Load ONLY the last sync timestamp from Supabase (~50 bytes instead of full articles array)
 */
export async function getLastSyncTimestampFromSupabase(client = supabase): Promise<string | null> {
  if (!client) return null;

  return supabaseReadCache.getOrLoad('last-sync-ts', TIMESTAMP_TTL_MS, async () => {
    try {
      const { data, error } = await client
        .from('news_clusters')
        .select('updated_at')
        .eq('id', 'live-feed-cache')
        .maybeSingle();

      if (error || !data?.updated_at) {
        return null;
      }
      return data.updated_at as string;
    } catch (err: any) {
      console.error('[Supabase] Exception loading last sync timestamp:', err.message);
      return null;
    }
  });
}

/**
 * Load live minute-by-minute articles feed from Supabase cloud cache
 */
export async function getLiveArticlesFromSupabase(client = supabase): Promise<{ articles: any[]; timestamp: string } | null> {
  if (!client) return null;

  return supabaseReadCache.getOrLoad('feed:live', FEED_TTL_MS, async () => {
    try {
      const { data, error } = await client
        .from('news_clusters')
        .select('articles, key_quotes, updated_at')
        .eq('id', 'live-feed-cache')
        .maybeSingle();

      if (error || !data || !Array.isArray(data.articles) || data.articles.length === 0) {
        return null;
      }

      const meta = (typeof data.key_quotes === 'object' && data.key_quotes !== null) ? data.key_quotes : {};
      return {
        articles: data.articles,
        timestamp: meta.timestamp || data.updated_at
      };
    } catch (err: any) {
      console.error('[Supabase] Exception loading live feed cache:', err.message);
      return null;
    }
  });
}

/**
 * Save foreign articles feed into Supabase cloud cache
 */
export async function saveLiveForeignArticlesToSupabase(articles: any[], timestamp?: string): Promise<boolean> {
  if (!supabase || !articles || articles.length === 0) return false;

  try {
    const isoTimestamp = timestamp || new Date().toISOString();
    const { error } = await supabase
      .from('news_clusters')
      .upsert({
        id: 'foreign-feed-cache',
        lead_title: 'FOREIGN_FEED_CACHE',
        neutral_headline: 'Feed de prensa internacional sobre Argentina',
        summary: 'Agregación consolidada de medios internacionales monitoreados',
        category: 'Internacional',
        spectrum: { oficialismoPct: 0, centroDatosPct: 100, oposicionPct: 0, totalOutlets: 1 },
        articles: articles.slice(0, 100),
        key_quotes: { timestamp: isoTimestamp, totalArticles: articles.length },
        updated_at: isoTimestamp
      }, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving foreign feed cache:', error.message);
      return false;
    }
    invalidateNewsCache();
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving foreign feed cache:', err.message);
    return false;
  }
}

/**
 * Load foreign articles feed from Supabase cloud cache
 */
export async function getLiveForeignArticlesFromSupabase(client = supabase): Promise<{ articles: any[]; timestamp: string } | null> {
  if (!client) return null;

  return supabaseReadCache.getOrLoad('feed:foreign', FEED_TTL_MS, async () => {
    try {
      const { data, error } = await client
        .from('news_clusters')
        .select('articles, key_quotes, updated_at')
        .eq('id', 'foreign-feed-cache')
        .maybeSingle();

      if (error || !data || !Array.isArray(data.articles) || data.articles.length === 0) {
        return null;
      }

      const meta = (typeof data.key_quotes === 'object' && data.key_quotes !== null) ? data.key_quotes : {};
      return {
        articles: data.articles,
        timestamp: meta.timestamp || data.updated_at
      };
    } catch (err: any) {
      console.error('[Supabase] Exception loading foreign feed cache:', err.message);
      return null;
    }
  });
}

// ==========================================
// 🛡️ RBAC & Civic Banners Management System
// ==========================================

export type UserRole = 'superadmin' | 'admin' | 'moderator' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface CivicBanner {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  position: string;
  is_active: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Superadmin emails that are automatically promoted to 'superadmin'
 */
export const SUPERADMIN_EMAILS = [
  (process.env.SUPERADMIN_EMAIL || import.meta.env?.SUPERADMIN_EMAIL || 'contacto@politicheck.com.ar').toLowerCase()
];

/**
 * Helper to create a scoped Supabase client with a user's JWT access token
 */
export function createScopedClient(accessToken?: string) {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!accessToken) return supabase;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

/**
 * Get active banner for public rendering (e.g. on homepage)
 */
export async function getActiveCivicBanner(position = 'home_top', client = supabase): Promise<CivicBanner | null> {
  if (!client) return null;

  return supabaseReadCache.getOrLoad(`banner:${position}`, BANNER_TTL_MS, async () => {
    try {
      const { data, error } = await client
        .from('banners')
        .select('id, title, image_url, destination_url, position, is_active, updated_at')
        .eq('position', position)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('[Supabase] Warning fetching active banner:', error.message);
        return null;
      }
      return data as CivicBanner | null;
    } catch (err: any) {
      console.error('[Supabase] Exception fetching active banner:', err.message);
      return null;
    }
  });
}

/**
 * Get all banners for admin dashboard
 */
export async function getAllBanners(client = supabase): Promise<CivicBanner[]> {
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Warning fetching all banners:', error.message);
      return [];
    }
    return (data || []) as CivicBanner[];
  } catch (err: any) {
    console.error('[Supabase] Exception fetching all banners:', err.message);
    return [];
  }
}

/**
 * Upsert banner (create or edit)
 */
export async function upsertCivicBanner(
  banner: Partial<CivicBanner>,
  client = supabase
): Promise<{ success: boolean; data?: CivicBanner; error?: string }> {
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const payload = {
      ...banner,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('banners')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    invalidateBannersCache();
    return { success: true, data: data as CivicBanner };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Toggle banner active state
 */
export async function toggleBannerActive(
  bannerId: string,
  isActive: boolean,
  client = supabase
): Promise<{ success: boolean; error?: string }> {
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client
      .from('banners')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', bannerId);

    if (error) return { success: false, error: error.message };
    invalidateBannersCache();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a banner
 */
export async function deleteCivicBanner(
  bannerId: string,
  client = supabase
): Promise<{ success: boolean; error?: string }> {
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client
      .from('banners')
      .delete()
      .eq('id', bannerId);

    if (error) return { success: false, error: error.message };
    invalidateBannersCache();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Get profile for a specific user ID
 */
export async function getUserProfile(userId: string, client = supabase): Promise<UserProfile | null> {
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase] Warning fetching profile:', error.message);
      return null;
    }

    if (data && SUPERADMIN_EMAILS.includes(data.email?.toLowerCase()) && data.role !== 'superadmin') {
      // Auto-elevate superadmin if needed
      await client.from('profiles').update({ role: 'superadmin' }).eq('id', userId);
      data.role = 'superadmin';
    }

    return data as UserProfile | null;
  } catch (err: any) {
    console.error('[Supabase] Exception fetching profile:', err.message);
    return null;
  }
}

/**
 * Get all profiles for Superadmin user management
 */
export async function getAllProfiles(client = supabase): Promise<UserProfile[]> {
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Warning fetching profiles:', error.message);
      return [];
    }
    return (data || []) as UserProfile[];
  } catch (err: any) {
    console.error('[Supabase] Exception fetching profiles:', err.message);
    return [];
  }
}

/**
 * Update user role (only superadmins can call this securely)
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  client = supabase
): Promise<{ success: boolean; error?: string }> {
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ========================================================
// LIVE ELECTORAL CHAT & CIVIC FORUM SERVICE
// ========================================================

export const DEFAULT_CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'Debate Ciudadano General',
    description: 'Intercambio abierto de noticias y encuadres del día',
    is_active: true,
    is_live: false
  },
  {
    id: 'debate-electoral',
    name: 'Sala Electoral en Vivo',
    description: 'Transmisión simultánea durante debates y coberturas clave',
    is_active: true,
    is_live: true
  },
  {
    id: 'economia-datos',
    name: 'Economía & Reformas',
    description: 'Análisis de inflación, reservas, presupuesto y medidas',
    is_active: true,
    is_live: false
  }
];

// Fallback in-memory messages for dev/offline resilience
const fallbackMessages: Record<string, ChatMessage[]> = {
  'general': [
    {
      id: 'mock-1',
      channel_id: 'general',
      sender_name: 'Moderación Politicheck',
      sender_role: 'admin',
      content: '¡Bienvenidos al espacio de debate cívico en vivo! Mantené el respeto y fundamentá con fuentes.',
      is_pinned: true,
      is_deleted: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  'debate-electoral': [
    {
      id: 'mock-2',
      channel_id: 'debate-electoral',
      sender_name: 'Observatorio Electoral',
      sender_role: 'superadmin',
      content: 'Sala especial activa para el seguimiento en directo de debates y anuncios de campaña.',
      is_pinned: true,
      is_deleted: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};

/**
 * Fetch active chat channels
 */
export async function getChatChannels(client = supabase): Promise<ChatChannel[]> {
  if (!client) return DEFAULT_CHAT_CHANNELS;

  try {
    const { data, error } = await client
      .from('chat_channels')
      .select('*')
      .eq('is_active', true)
      .order('is_live', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_CHAT_CHANNELS;
    }
    return data as ChatChannel[];
  } catch {
    return DEFAULT_CHAT_CHANNELS;
  }
}

/**
 * Fetch messages for a specific channel
 */
export async function getChatMessages(
  channelId: string,
  limit = 50,
  client = supabase
): Promise<ChatMessage[]> {
  if (!client) {
    return (fallbackMessages[channelId] || []).filter(m => !m.is_deleted);
  }

  try {
    const { data, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('channel_id', channelId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.warn('[Chat Service] Error fetching messages:', error.message);
      return (fallbackMessages[channelId] || []).filter(m => !m.is_deleted);
    }

    return (data || []) as ChatMessage[];
  } catch (err: any) {
    console.error('[Chat Service] Exception fetching messages:', err.message);
    return (fallbackMessages[channelId] || []).filter(m => !m.is_deleted);
  }
}

/**
 * Send a new chat message
 */
export async function sendChatMessage(
  channelId: string,
  content: string,
  senderName: string,
  senderRole: 'superadmin' | 'admin' | 'moderator' | 'user' = 'user',
  ipHash?: string,
  client = supabase
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  const sanitizedContent = content.trim().slice(0, 300);
  const sanitizedName = senderName.trim().slice(0, 40) || 'Ciudadano';

  if (!sanitizedContent) {
    return { success: false, error: 'El mensaje no puede estar vacío.' };
  }

  if (!client) {
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channel_id: channelId,
      sender_name: sanitizedName,
      sender_role: senderRole,
      content: sanitizedContent,
      is_pinned: false,
      is_deleted: false,
      ip_hash: ipHash,
      created_at: new Date().toISOString()
    };
    if (!fallbackMessages[channelId]) fallbackMessages[channelId] = [];
    fallbackMessages[channelId].push(newMsg);
    return { success: true, message: newMsg };
  }

  try {
    const { data, error } = await client
      .from('chat_messages')
      .insert({
        channel_id: channelId,
        content: sanitizedContent,
        sender_name: sanitizedName,
        sender_role: senderRole,
        ip_hash: ipHash,
        is_pinned: false,
        is_deleted: false
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: data as ChatMessage };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Moderate a message (delete or pin)
 */
export async function moderateChatMessage(
  messageId: string,
  action: 'delete' | 'pin' | 'unpin',
  client = supabase
): Promise<{ success: boolean; error?: string }> {
  if (!client) {
    for (const ch in fallbackMessages) {
      const msg = fallbackMessages[ch].find(m => m.id === messageId);
      if (msg) {
        if (action === 'delete') msg.is_deleted = true;
        if (action === 'pin') msg.is_pinned = true;
        if (action === 'unpin') msg.is_pinned = false;
        return { success: true };
      }
    }
    return { success: true };
  }

  try {
    const updatePayload: Record<string, any> = {};
    if (action === 'delete') updatePayload.is_deleted = true;
    if (action === 'pin') updatePayload.is_pinned = true;
    if (action === 'unpin') updatePayload.is_pinned = false;

    const { error } = await client
      .from('chat_messages')
      .update(updatePayload)
      .eq('id', messageId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ========================================================
// 🏛️ STORY CIVIC FORUM SERVICE (DEBATE CÍVICO DE HISTORIAS)
// ========================================================

// Fallback in-memory storage for offline/dev environments
const fallbackForumComments: Record<string, ForumComment[]> = {};
const fallbackForumVotes: Map<string, 1 | -1> = new Map();

/**
 * Fetch and assemble hierarchical forum comments for a story (Roots + Nested Replies)
 */
export async function getForumComments(
  storyId: string,
  sort: 'top' | 'newest' | 'debated' = 'top',
  voterHash?: string,
  client = supabase
): Promise<ForumComment[]> {
  if (!client) {
    const list = fallbackForumComments[storyId] || [];
    return buildForumTree(list, sort, voterHash);
  }

  try {
    // 1. Fetch comments for this story
    const { data: comments, error } = await client
      .from('forum_comments')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: true });

    if (error || !comments) {
      console.warn('[Forum Service] Error fetching comments:', error?.message);
      const list = fallbackForumComments[storyId] || [];
      return buildForumTree(list, sort, voterHash);
    }

    // 2. Fetch voter's existing votes if voterHash provided
    let userVotesMap = new Map<string, 1 | -1>();
    if (voterHash) {
      const commentIds = comments.map(c => c.id);
      if (commentIds.length > 0) {
        const { data: votes } = await client
          .from('forum_votes')
          .select('comment_id, vote_value')
          .in('comment_id', commentIds)
          .eq('voter_hash', voterHash);

        if (votes) {
          for (const v of votes) {
            userVotesMap.set(v.comment_id, v.vote_value as 1 | -1);
          }
        }
      }
    }

    // 3. Attach user vote to comments
    const commentsWithVote: ForumComment[] = comments.map(c => ({
      ...c,
      user_vote: (userVotesMap.get(c.id) || 0) as 1 | -1 | 0,
      content: c.is_deleted ? '⚖️ [Aporte eliminado por infringir las normas de convivencia cívica]' : c.content
    }));

    return buildForumTree(commentsWithVote, sort, voterHash);
  } catch (err: any) {
    console.error('[Forum Service] Exception fetching comments:', err.message);
    const list = fallbackForumComments[storyId] || [];
    return buildForumTree(list, sort, voterHash);
  }
}

/**
 * Helper to build 2-level hierarchical comment tree with custom sorting
 */
function buildForumTree(
  flatList: ForumComment[],
  sort: 'top' | 'newest' | 'debated',
  voterHash?: string
): ForumComment[] {
  const rootComments: ForumComment[] = [];
  const repliesMap = new Map<string, ForumComment[]>();

  for (const item of flatList) {
    const itemCopy = { ...item };
    if (voterHash && fallbackForumVotes.size > 0 && !itemCopy.user_vote) {
      itemCopy.user_vote = (fallbackForumVotes.get(`${itemCopy.id}::${voterHash}`) || 0) as 1 | -1 | 0;
    }

    if (!itemCopy.parent_id) {
      itemCopy.replies = [];
      rootComments.push(itemCopy);
    } else {
      const parentId = itemCopy.parent_id;
      if (!repliesMap.has(parentId)) {
        repliesMap.set(parentId, []);
      }
      repliesMap.get(parentId)!.push(itemCopy);
    }
  }

  // Attach replies to roots and sort replies chronologically
  for (const root of rootComments) {
    const replies = repliesMap.get(root.id) || [];
    replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    root.replies = replies;
  }

  // Sort root comments based on selected mode
  rootComments.sort((a, b) => {
    // Pinned comments always on top
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }

    if (sort === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    if (sort === 'debated') {
      const repliesCountA = a.replies?.length || 0;
      const repliesCountB = b.replies?.length || 0;
      if (repliesCountA !== repliesCountB) {
        return repliesCountB - repliesCountA;
      }
      return b.karma_score - a.karma_score;
    }

    // Default: 'top' (Relevancia cívica por Karma)
    if (a.karma_score !== b.karma_score) {
      return b.karma_score - a.karma_score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return rootComments;
}

/**
 * Post a new forum comment (Root comment or nested reply)
 */
export async function postForumComment(
  params: {
    storyId: string;
    parentId?: string | null;
    content: string;
    authorName: string;
    authorRole?: ForumAuthorRole;
    ipHash?: string;
    userId?: string | null;
  },
  client = supabase
): Promise<{ success: boolean; comment?: ForumComment; error?: string }> {
  const { storyId, parentId, content, authorName, authorRole = 'user', ipHash, userId } = params;

  const isReply = Boolean(parentId);
  const maxLength = isReply ? 350 : 600;
  const sanitizedContent = content.trim();
  const sanitizedName = authorName.trim().slice(0, 40) || 'Ciudadano';

  if (!sanitizedContent) {
    return { success: false, error: 'El aporte no puede estar vacío.' };
  }

  if (sanitizedContent.length > maxLength) {
    return { 
      success: false, 
      error: `El aporte supera el límite de ${maxLength} caracteres (${isReply ? 'respuesta' : 'comentario raíz'}).` 
    };
  }

  if (!client) {
    const newComment: ForumComment = {
      id: `forum-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      story_id: storyId,
      parent_id: parentId || null,
      user_id: userId || null,
      author_name: sanitizedName,
      author_role: authorRole,
      content: sanitizedContent,
      ip_hash: ipHash || null,
      karma_score: 0,
      upvotes: 0,
      downvotes: 0,
      report_count: 0,
      is_pinned: false,
      is_deleted: false,
      is_collapsed: false,
      created_at: new Date().toISOString(),
      replies: []
    };

    if (!fallbackForumComments[storyId]) fallbackForumComments[storyId] = [];
    fallbackForumComments[storyId].push(newComment);
    return { success: true, comment: newComment };
  }

  try {
    const { data, error } = await client
      .from('forum_comments')
      .insert({
        story_id: storyId,
        parent_id: parentId || null,
        user_id: userId || null,
        author_name: sanitizedName,
        author_role: authorRole,
        content: sanitizedContent,
        ip_hash: ipHash || null,
        karma_score: 0,
        upvotes: 0,
        downvotes: 0,
        report_count: 0,
        is_pinned: false,
        is_deleted: false,
        is_collapsed: false
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, comment: data as ForumComment };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cast or toggle a civic vote (▲ Upvote or ▼ Downvote) on a comment
 */
export async function voteForumComment(
  params: {
    commentId: string;
    voterHash: string;
    voteValue: 1 | -1;
  },
  client = supabase
): Promise<{ success: boolean; voteValue: 1 | -1 | 0; karma_score: number; upvotes: number; downvotes: number; error?: string }> {
  const { commentId, voterHash, voteValue } = params;

  if (!client) {
    const voteKey = `${commentId}::${voterHash}`;
    const currentVote = fallbackForumVotes.get(voteKey) || 0;
    let nextVote: 1 | -1 | 0 = voteValue;

    if (currentVote === voteValue) {
      // Toggle off
      fallbackForumVotes.delete(voteKey);
      nextVote = 0;
    } else {
      fallbackForumVotes.set(voteKey, voteValue);
      nextVote = voteValue;
    }

    // Find in memory
    for (const sId in fallbackForumComments) {
      const c = fallbackForumComments[sId].find(item => item.id === commentId);
      if (c) {
        if (currentVote === 1) c.upvotes = Math.max(0, c.upvotes - 1);
        if (currentVote === -1) c.downvotes = Math.max(0, c.downvotes - 1);
        if (nextVote === 1) c.upvotes += 1;
        if (nextVote === -1) c.downvotes += 1;
        c.karma_score = c.upvotes - c.downvotes;
        if (c.karma_score <= -5) c.is_collapsed = true;
        return {
          success: true,
          voteValue: nextVote,
          karma_score: c.karma_score,
          upvotes: c.upvotes,
          downvotes: c.downvotes
        };
      }
    }

    return { success: true, voteValue: nextVote, karma_score: nextVote, upvotes: nextVote === 1 ? 1 : 0, downvotes: nextVote === -1 ? 1 : 0 };
  }

  try {
    // 1. Fetch existing vote for this comment and voter hash
    const { data: existingVote, error: fetchErr } = await client
      .from('forum_votes')
      .select('id, vote_value')
      .eq('comment_id', commentId)
      .eq('voter_hash', voterHash)
      .maybeSingle();

    if (fetchErr) {
      console.warn('[Forum Service] Warning fetching existing vote:', fetchErr.message);
    }

    let finalVote: 1 | -1 | 0 = voteValue;

    if (existingVote) {
      if (existingVote.vote_value === voteValue) {
        // Toggle off: remove vote
        const { error: delErr } = await client
          .from('forum_votes')
          .delete()
          .eq('id', existingVote.id);

        if (delErr) throw delErr;
        finalVote = 0;
      } else {
        // Switch vote
        const { error: updErr } = await client
          .from('forum_votes')
          .update({ vote_value: voteValue })
          .eq('id', existingVote.id);

        if (updErr) throw updErr;
        finalVote = voteValue;
      }
    } else {
      // Insert new vote
      const { error: insErr } = await client
        .from('forum_votes')
        .insert({
          comment_id: commentId,
          voter_hash: voterHash,
          vote_value: voteValue
        });

      if (insErr) throw insErr;
      finalVote = voteValue;
    }

    // 2. Query updated comment karma (calculated by DB trigger)
    const { data: updatedComment, error: commentErr } = await client
      .from('forum_comments')
      .select('karma_score, upvotes, downvotes')
      .eq('id', commentId)
      .single();

    if (commentErr || !updatedComment) {
      return {
        success: true,
        voteValue: finalVote,
        karma_score: finalVote,
        upvotes: finalVote === 1 ? 1 : 0,
        downvotes: finalVote === -1 ? 1 : 0
      };
    }

    return {
      success: true,
      voteValue: finalVote,
      karma_score: updatedComment.karma_score,
      upvotes: updatedComment.upvotes,
      downvotes: updatedComment.downvotes
    };
  } catch (err: any) {
    console.error('[Forum Service] Error recording forum vote:', err.message);
    return { success: false, voteValue: 0, karma_score: 0, upvotes: 0, downvotes: 0, error: err.message };
  }
}

/**
 * Moderate a forum comment (delete, pin, unpin, collapse, uncollapse)
 */
export async function moderateForumComment(
  commentId: string,
  action: 'delete' | 'pin' | 'unpin' | 'collapse' | 'uncollapse',
  client = supabase
): Promise<{ success: boolean; error?: string }> {
  if (!client) {
    for (const sId in fallbackForumComments) {
      const c = fallbackForumComments[sId].find(item => item.id === commentId);
      if (c) {
        if (action === 'delete') c.is_deleted = true;
        if (action === 'pin') c.is_pinned = true;
        if (action === 'unpin') c.is_pinned = false;
        if (action === 'collapse') c.is_collapsed = true;
        if (action === 'uncollapse') c.is_collapsed = false;
        return { success: true };
      }
    }
    return { success: true };
  }

  try {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (action === 'delete') updatePayload.is_deleted = true;
    if (action === 'pin') updatePayload.is_pinned = true;
    if (action === 'unpin') updatePayload.is_pinned = false;
    if (action === 'collapse') updatePayload.is_collapsed = true;
    if (action === 'uncollapse') updatePayload.is_collapsed = false;

    const { error } = await client
      .from('forum_comments')
      .update(updatePayload)
      .eq('id', commentId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Report a comment. Automatically collapses when 3 or more reports are accumulated.
 */
export async function reportForumComment(
  commentId: string,
  client = supabase
): Promise<{ success: boolean; reportCount: number; isCollapsed: boolean; error?: string }> {
  if (!client) {
    for (const sId in fallbackForumComments) {
      const c = fallbackForumComments[sId].find(item => item.id === commentId);
      if (c) {
        c.report_count += 1;
        if (c.report_count >= 3) c.is_collapsed = true;
        return { success: true, reportCount: c.report_count, isCollapsed: c.is_collapsed };
      }
    }
    return { success: true, reportCount: 1, isCollapsed: false };
  }

  try {
    // 1. Fetch current report count
    const { data: current, error: fetchErr } = await client
      .from('forum_comments')
      .select('report_count, is_collapsed')
      .eq('id', commentId)
      .single();

    if (fetchErr || !current) {
      return { success: false, reportCount: 0, isCollapsed: false, error: fetchErr?.message || 'Comentario no encontrado.' };
    }

    const nextCount = (current.report_count || 0) + 1;
    const nextCollapsed = nextCount >= 3 ? true : current.is_collapsed;

    const { error: updErr } = await client
      .from('forum_comments')
      .update({
        report_count: nextCount,
        is_collapsed: nextCollapsed,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (updErr) return { success: false, reportCount: current.report_count, isCollapsed: current.is_collapsed, error: updErr.message };

    return { success: true, reportCount: nextCount, isCollapsed: nextCollapsed };
  } catch (err: any) {
    return { success: false, reportCount: 0, isCollapsed: false, error: err.message };
  }
}



