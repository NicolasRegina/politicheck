import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

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
    const rows = clusters.map(c => ({
      id: c.id,
      lead_title: c.leadTitle || c.neutralHeadline,
      neutral_headline: c.neutralHeadline,
      summary: c.summary,
      category: c.category || 'Política',
      spectrum: c.spectrum,
      articles: c.articles,
      key_quotes: c.keyQuotes || [],
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
 * Load latest cached news clusters from Supabase
 */
export async function getNewsClustersFromSupabase(maxAgeMinutes = 120): Promise<any[] | null> {
  if (!supabase) return null;

  try {
    const minTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('news_clusters')
      .select('*')
      .gt('updated_at', minTime)
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    // Map DB rows back to application Story objects
    return data.map(row => ({
      id: row.id,
      leadTitle: row.lead_title,
      neutralHeadline: row.neutral_headline,
      summary: row.summary,
      category: row.category,
      spectrum: row.spectrum,
      articles: row.articles,
      keyQuotes: row.key_quotes,
      updatedAt: row.updated_at
    }));
  } catch (err: any) {
    console.error('[Supabase] Exception loading news clusters:', err.message);
    return null;
  }
}
