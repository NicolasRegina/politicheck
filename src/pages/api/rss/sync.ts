import type { APIRoute } from 'astro';
import { syncAllRssFeeds, getCachedArticles } from '../../../services/rss/sync';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === 'true';

  try {
    let cached = getCachedArticles();
    if (forceRefresh || cached.length === 0) {
      const syncResult = await syncAllRssFeeds();
      return new Response(JSON.stringify(syncResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

    return new Response(JSON.stringify({
      count: cached.length,
      articles: cached
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Failed to sync RSS feeds',
      message: (err as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
