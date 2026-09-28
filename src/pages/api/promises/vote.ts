import type { APIRoute } from 'astro';
import { votePromise } from '../../../services/promises';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: 'Método no permitido por GET. Utilice POST enviando promiseId y voteType.' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { promiseId, voteType } = body;

    // Strict sanitization & validation
    if (
      !promiseId ||
      typeof promiseId !== 'string' ||
      promiseId.length > 32 ||
      !/^[a-zA-Z0-9_-]+$/.test(promiseId) ||
      !['fulfilled', 'inProgress', 'broken'].includes(voteType)
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parámetros inválidos. Requiere promiseId alfanumérico válido y voteType (fulfilled | inProgress | broken).'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const clientIp = rawIp.split(',')[0].trim().slice(0, 45); // Sanitize IP length (IPv6 max 45 chars)
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 255);

    const result = await votePromise(promiseId, voteType, clientIp, userAgent);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'No se pudo registrar el voto.' }),
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
    console.error('[API Vote Error]:', error?.message);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno al procesar el voto.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
