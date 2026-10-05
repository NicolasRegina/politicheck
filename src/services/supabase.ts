import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.SUPABASE_URL || process.env.SUPABASE_URL || import.meta.env?.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || import.meta.env?.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

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
 * Save clustered news stories into Supabase cloud cache
 */
export async function saveNewsClustersToSupabase(clusters: any[]): Promise<boolean> {
  if (!supabase || !clusters || clusters.length === 0) return false;

  try {
    const rows = clusters.map((c, idx) => ({
      id: c.id,
      lead_title: c.leadTitle || c.neutralHeadline,
      neutral_headline: c.neutralHeadline,
      summary: c.summary,
      category: c.category || 'Política',
      spectrum: c.spectrum,
      articles: c.articles,
      key_quotes: {
        kicker: c.kicker,
        imageUrl: c.imageUrl,
        imageCaption: c.imageCaption,
        aiComparisonNotice: c.aiComparisonNotice,
        isLeadStory: c.isLeadStory ?? (idx === 0),
        updatedAt: c.updatedAt
      },
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('news_clusters')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] Error saving news clusters:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving news clusters:', err.message);
    return false;
  }
}

/**
 * Load latest cached news clusters from Supabase with historical accumulation
 */
export async function getNewsClustersFromSupabase(limitOrMinutes = 100, maxAgeDays = 60): Promise<any[] | null> {
  if (!supabase) return null;

  try {
    // Support both legacy maxAgeMinutes (e.g. 1440) or limit (e.g. 100)
    let limit = 100;
    let days = maxAgeDays;
    if (limitOrMinutes > 365) {
      // legacy minutes parameter
      days = Math.max(30, Math.round(limitOrMinutes / 1440));
      limit = 150;
    } else if (limitOrMinutes > 0) {
      limit = limitOrMinutes;
    }

    const minTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('news_clusters')
      .select('*')
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

      return {
        id: row.id,
        isLeadStory: false,
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
    });

    // Guarantee that the freshest story is always the lead story, followed chronologically by historical stories
    mapped.sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime() || 0;
      const timeB = new Date(b.updatedAt).getTime() || 0;
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
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving live feed cache:', err.message);
    return false;
  }
}

/**
 * Load live minute-by-minute articles feed from Supabase cloud cache
 */
export async function getLiveArticlesFromSupabase(): Promise<{ articles: any[]; timestamp: string } | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('news_clusters')
      .select('*')
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
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception saving foreign feed cache:', err.message);
    return false;
  }
}

/**
 * Load foreign articles feed from Supabase cloud cache
 */
export async function getLiveForeignArticlesFromSupabase(): Promise<{ articles: any[]; timestamp: string } | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('news_clusters')
      .select('*')
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
  (process.env.SUPERADMIN_EMAIL || import.meta.env?.SUPERADMIN_EMAIL || 'admin@politicheck.com.ar').toLowerCase()
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
export async function getActiveCivicBanner(position = 'home_top'): Promise<CivicBanner | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
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

