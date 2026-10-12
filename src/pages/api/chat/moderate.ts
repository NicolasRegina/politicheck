import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { moderateChatMessage } from '../../../services/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check caller role via central auth service
    const auth = await authenticateRequest(request);
    const isModerator = auth.isAuthenticated && (
      auth.isAdmin || 
      auth.isSuperadmin || 
      auth.profile?.role === 'moderator'
    );

    if (!isModerator) {
      return new Response(
        JSON.stringify({ success: false, error: 'No tenés permisos de moderación.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messageId, action } = body;
    if (!messageId || !['delete', 'pin', 'unpin'].includes(action)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Parámetros inválidos. messageId y action (delete | pin | unpin) requeridos.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await moderateChatMessage(messageId, action);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Error al moderar mensaje.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, action, messageId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
