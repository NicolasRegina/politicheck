import type { APIRoute } from 'astro';
import { getCachedArticlesAsync, getLastSyncTimestampAsync } from '../../../services/rss/sync';
import { getCachedClusteredStories } from '../../../services/ai/clustering';
import { getNewsClustersFromSupabase } from '../../../services/supabase';
import { detectBreakingNews } from '../../../services/breaking';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const [articles, cloudStories, lastSync] = await Promise.all([
      getCachedArticlesAsync(),
      getNewsClustersFromSupabase({ maxAgeDays: 2, limit: 15 }),
      getLastSyncTimestampAsync()
    ]);
    const stories = (cloudStories && cloudStories.length > 0) ? cloudStories : getCachedClusteredStories();
    const breakingAlert = detectBreakingNews(stories, articles);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        lastSyncTimestamp: lastSync,
        totalArticles: articles.length,
        latestArticles: articles.slice(0, 20),
        storiesCount: stories.length,
        leadStoryId: stories[0]?.id,
        breakingAlert
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
