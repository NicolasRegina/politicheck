import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { moderateForumComment, reportForumComment } from '../../../services/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { commentId, action } = body;

    if (!commentId || typeof commentId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'commentId es requerido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validActions = ['delete', 'pin', 'unpin', 'collapse', 'uncollapse', 'report'];
    if (!validActions.includes(action)) {
      return new Response(
        JSON.stringify({ success: false, error: `Acción inválida. Acciones permitidas: ${validActions.join(', ')}.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Community report action is open to citizens
    if (action === 'report') {
      const result = await reportForumComment(commentId);
      if (!result.success) {
        return new Response(
          JSON.stringify({ success: false, error: result.error || 'Error al reportar comentario.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'report', 
          commentId, 
          reportCount: result.reportCount,
          isCollapsed: result.isCollapsed 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Other actions (delete, pin, collapse) require staff privileges
    const auth = await authenticateRequest(request);
    const isModerator = auth.isAuthenticated && (
      auth.isAdmin || 
      auth.isSuperadmin || 
      auth.profile?.role === 'moderator'
    );

    if (!isModerator) {
      return new Response(
        JSON.stringify({ success: false, error: 'No tenés permisos de moderación cívica.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await moderateForumComment(commentId, action);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Error al ejecutar acción de moderación.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, action, commentId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
