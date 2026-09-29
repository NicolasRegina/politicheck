import type { APIRoute } from 'astro';
import { getCachedArticlesAsync, getLastSyncTimestampAsync } from '../../../services/rss/sync';
import { getCachedClusteredStories } from '../../../services/ai/clustering';
import { getNewsClustersFromSupabase } from '../../../services/supabase';
import { detectBreakingNews } from '../../../services/breaking';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const articles = await getCachedArticlesAsync();
    const cloudStories = await getNewsClustersFromSupabase(1440);
    const stories = (cloudStories && cloudStories.length > 0) ? cloudStories : getCachedClusteredStories();
    const breakingAlert = detectBreakingNews(stories, articles);
    const lastSync = await getLastSyncTimestampAsync();

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
          'Cache-Control': 'no-cache, no-store, must-revalidate'
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
