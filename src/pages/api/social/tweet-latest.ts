import type { APIRoute } from 'astro';
import { autoTweetLatestStory, formatViralStoryTweet, postCustomTweet } from '../../../services/twitter';
import { getCachedClusteredStories } from '../../../services/ai/clustering';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const isPreview = url.searchParams.get('preview') === 'true';
  const force = url.searchParams.get('force') === 'true';
  const origin = url.origin;

  try {
    // 1. Check if customText was provided via POST body
    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (body.customText && typeof body.customText === 'string') {
        const result = await postCustomTweet(body.customText.trim());
        return new Response(
          JSON.stringify(result),
          {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (isPreview) {
      const stories = getCachedClusteredStories();
      if (!stories || stories.length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'No hay historias disponibles' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const topStory = stories.find(s => s.isLeadStory) || stories[0];
      const previewText = formatViralStoryTweet(topStory, false, origin);

      return new Response(
        JSON.stringify({
          success: true,
          preview: true,
          storyId: topStory.id,
          storyTitle: topStory.neutralHeadline,
          characterCount: previewText.length,
          tweetText: previewText
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Attempt to publish automatic latest story
    const result = await autoTweetLatestStory({ force, baseUrl: origin });

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
