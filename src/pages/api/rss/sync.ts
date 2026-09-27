import type { APIRoute } from 'astro';
import { syncAllRssFeeds, getCachedArticles } from '../../../services/rss/sync';
import { clusterArticlesWithGemini } from '../../../services/ai/clustering';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const shouldCluster = url.searchParams.get('cluster') === 'true' || forceRefresh;

  try {
    let articles = getCachedArticles();
    if (forceRefresh || articles.length === 0) {
      const syncResult = await syncAllRssFeeds();
      articles = syncResult.articles || [];
    }

    let clustersCount = 0;
    if (shouldCluster && articles.length > 0) {
      const clusters = await clusterArticlesWithGemini(articles);
      clustersCount = clusters.length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: articles.length,
        clustersCount,
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
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to sync RSS feeds',
        message: (err as Error).message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
