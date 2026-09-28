import type { APIRoute } from 'astro';
import { syncAllRssFeeds, getCachedArticles } from '../../../services/rss/sync';
import { clusterArticlesWithGemini, getCachedClusteredStories } from '../../../services/ai/clustering';
import { getNewsClustersFromSupabase } from '../../../services/supabase';

export const prerender = false;

// In-memory timestamp tracker for cooldown
let lastClusterTimestamp = 0;
const COOLDOWN_MS = 25 * 60 * 1000; // 25 minutes minimum cooldown to protect Gemini free quota

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const now = Date.now();

  // Authentication check for admin bypass or Vercel cron
  const authHeader = request.headers.get('authorization') || '';
  const adminQueryKey = url.searchParams.get('key') || url.searchParams.get('adminKey') || '';
  const expectedSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET || 'politicheck-admin-2027';

  const isAuthorizedAdmin = 
    authHeader === `Bearer ${expectedSecret}` || 
    adminQueryKey === expectedSecret ||
    url.hostname === 'localhost' || 
    url.hostname === '127.0.0.1';

  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isCron = url.searchParams.get('cron') === 'true';

  try {
    // 1. Fetch RSS Feeds
    const syncResult = await syncAllRssFeeds();
    const articles = syncResult.articles || [];
    const newArticlesCount = syncResult.newArticlesCount || 0;

    const timeSinceLastCluster = now - lastClusterTimestamp;
    const isCooldownActive = timeSinceLastCluster < COOLDOWN_MS;

    // Check if we should call Gemini AI:
    // Check if clusters exist in database or cache
    const existingClusters = (await getNewsClustersFromSupabase(1)) || getCachedClusteredStories();
    const hasClusters = existingClusters.length > 0;

    // Only call Gemini if:
    // a) Admin explicitly requested with key, OR
    // b) No clusters exist yet, OR
    // c) Cooldown has elapsed AND there are genuinely new articles
    const shouldCluster = isAuthorizedAdmin || !hasClusters || (!isCooldownActive && newArticlesCount > 0);

    let clustersCount = 0;
    let geminiInvoked = false;

    if (shouldCluster) {
      console.log(`[Sync API] Re-clustering triggered (New articles: ${newArticlesCount}, Admin: ${isAuthorizedAdmin}, HasClusters: ${hasClusters})`);
      const clusters = await clusterArticlesWithGemini(articles);
      clustersCount = clusters.length;
      lastClusterTimestamp = now;
      geminiInvoked = true;
    } else {
      console.log(`[Sync API] Cooldown active or no new articles. Returning cached clusters to save Gemini quota.`);
      // Read existing clusters from Supabase or local cache
      const cached = (await getNewsClustersFromSupabase(120)) || getCachedClusteredStories();
      clustersCount = cached.length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        articlesCount: articles.length,
        newArticlesCount,
        clustersCount,
        geminiInvoked,
        nextClusterAvailableInMinutes: Math.max(0, Math.round((COOLDOWN_MS - (Date.now() - lastClusterTimestamp)) / 60000)),
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (err) {
    console.error('[Sync API] Error syncing RSS feeds:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al sincronizar noticias RSS',
        message: (err as Error).message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
