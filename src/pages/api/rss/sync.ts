import type { APIRoute } from 'astro';
import { syncAllRssFeeds, getCachedArticles, getLastSyncTimestamp } from '../../../services/rss/sync';
import { 
  clusterArticlesWithGemini, 
  getCachedClusteredStories,
  clusterForeignArticlesWithGemini,
  getCachedForeignClusters 
} from '../../../services/ai/clustering';
import { getNewsClustersFromSupabase } from '../../../services/supabase';
import { autoTweetLatestStory } from '../../../services/twitter';

export const prerender = false;

// In-memory timestamp tracker for cooldown
let lastClusterTimestamp = 0;
const COOLDOWN_MS = 25 * 60 * 1000; // 25 minutes minimum cooldown to protect Gemini free quota

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  // Fast-path: live sync status without scraping overhead
  if (url.searchParams.get('status') === 'true') {
    const lastSync = getLastSyncTimestamp();
    return new Response(JSON.stringify({
      success: true,
      lastSyncTimestamp: lastSync,
      now: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store' }
    });
  }

  const now = Date.now();

  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const isCron = url.searchParams.get('cron') === 'true';
  const isVercelCron = request.headers.get('x-vercel-cron') === '1' || isCron;
  const authHeader = request.headers.get('Authorization') || '';
  const expectedSecret = process.env.CRON_SECRET || 'politicheck_cron_dev_secret';
  const adminQueryKey = url.searchParams.get('key') || '';

  const isAuthorizedAdmin = 
    authHeader === `Bearer ${expectedSecret}` || 
    adminQueryKey === expectedSecret ||
    isVercelCron ||
    url.hostname === 'localhost' || 
    url.hostname === '127.0.0.1';

  try {
    // 1. Fetch RSS Feeds (both national and international filtered for Argentina)
    const syncResult = await syncAllRssFeeds();
    const articles = syncResult.articles || [];
    const foreignArticles = syncResult.foreignArticles || [];
    const newArticlesCount = syncResult.newArticlesCount || 0;

    const timeSinceLastCluster = now - lastClusterTimestamp;
    const isCooldownActive = timeSinceLastCluster < COOLDOWN_MS;

    // Check if we should call Gemini AI:
    const existingClusters = (await getNewsClustersFromSupabase(1)) || getCachedClusteredStories();
    const hasClusters = existingClusters.length > 0;
    const existingForeignClusters = getCachedForeignClusters();
    const hasForeignClusters = existingForeignClusters.length > 0;

    const shouldCluster = isAuthorizedAdmin || !hasClusters || !hasForeignClusters || (!isCooldownActive && newArticlesCount > 0);

    let clustersCount = 0;
    let foreignClustersCount = 0;
    let geminiInvoked = false;

    if (shouldCluster) {
      console.log(`[Sync API] Re-clustering triggered (New articles: ${newArticlesCount}, Foreign on Arg: ${foreignArticles.length}, Admin: ${isAuthorizedAdmin})`);
      const clusters = await clusterArticlesWithGemini(articles);
      const foreignClusters = await clusterForeignArticlesWithGemini(foreignArticles);
      clustersCount = clusters.length;
      foreignClustersCount = foreignClusters.length;
      lastClusterTimestamp = now;
      geminiInvoked = true;
    } else {
      console.log(`[Sync API] Cooldown active or no new articles. Returning cached clusters.`);
      const cached = (await getNewsClustersFromSupabase(120)) || getCachedClusteredStories();
      clustersCount = cached.length;
      foreignClustersCount = existingForeignClusters.length;
    }

    // 3. Automated Social Media Syndication (X / Twitter Bot @politicheck_ok)
    let twitterResult = null;
    try {
      twitterResult = await autoTweetLatestStory({ baseUrl: url.origin });
    } catch (twErr) {
      console.warn('[Sync API] Twitter auto-post non-fatal error:', twErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        articlesCount: articles.length,
        foreignArticlesCount: foreignArticles.length,
        newArticlesCount,
        clustersCount,
        foreignClustersCount,
        geminiInvoked,
        twitterResult,
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
