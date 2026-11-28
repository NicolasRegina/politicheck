import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { syncAllRssFeeds, getLastSyncTimestampAsync } from '../../../services/rss/sync';
import { 
  clusterArticlesWithGemini, 
  clusterForeignArticlesWithGemini 
} from '../../../services/ai/clustering';

export const prerender = false;
export const maxDuration = 60;

export const POST: APIRoute = async ({ request }) => {
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'No autorizado. Se requieren permisos de Administrador o Superadmin.' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const startTime = Date.now();

  try {
    console.log(`[Admin Force Sync] Initiated by ${auth.user.email} (${auth.profile?.role})`);

    // 1. Fetch all RSS feeds
    const syncResult = await syncAllRssFeeds();
    const articles = syncResult.articles || [];
    const foreignArticles = syncResult.foreignArticles || [];
    const newArticlesCount = syncResult.newArticlesCount || 0;

    // 2. Force AI Clustering on both National and Foreign sets
    let nationalClusters: any[] = [];
    let foreignClusters: any[] = [];

    if (articles.length > 0) {
      nationalClusters = await clusterArticlesWithGemini(articles, undefined, 'admin');
    }

    if (foreignArticles.length > 0) {
      foreignClusters = await clusterForeignArticlesWithGemini(foreignArticles);
    }

    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    const lastSync = await getLastSyncTimestampAsync();

    return new Response(JSON.stringify({
      success: true,
      elapsedSeconds,
      articlesCount: articles.length,
      foreignArticlesCount: foreignArticles.length,
      newArticlesCount,
      nationalClustersCount: nationalClusters.length,
      foreignClustersCount: foreignClusters.length,
      lastSyncTimestamp: lastSync,
      triggeredBy: auth.user.email,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('[Admin Force Sync] Error during forced sync:', err);
    return new Response(JSON.stringify({
      success: false,
      error: 'Error al forzar sincronización',
      message: err.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
