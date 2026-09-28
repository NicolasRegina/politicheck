import type { APIRoute } from 'astro';
import { getCachedArticles } from '../../../services/rss/sync';
import { getCachedClusteredStories } from '../../../services/ai/clustering';
import { MOCK_STORIES } from '../../../data/mockData';
import { detectBreakingNews } from '../../../services/breaking';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const articles = getCachedArticles();
    let stories = getCachedClusteredStories();
    if (stories.length === 0) {
      stories = MOCK_STORIES;
    }

    const breakingAlert = detectBreakingNews(stories, articles);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        totalArticles: articles.length,
        latestArticles: articles.slice(0, 15),
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
