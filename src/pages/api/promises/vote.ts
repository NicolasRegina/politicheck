import type { APIRoute } from 'astro';
import { votePromise } from '../../../services/promises';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: 'Método no permitido por GET. Utilice POST enviando promiseId y voteType.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { promiseId, voteType } = body;

    if (!promiseId || !['fulfilled', 'inProgress', 'broken'].includes(voteType)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parámetros inválidos. Requiere promiseId y voteType (fulfilled | inProgress | broken).'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = votePromise(promiseId, voteType);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        promise: result.promise
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
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
