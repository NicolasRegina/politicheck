import type { APIRoute } from 'astro';
import { getPromises, getPromisesStats } from '../../../services/promises';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const promises = getPromises();
    const stats = getPromisesStats(promises);

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        promises
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
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
