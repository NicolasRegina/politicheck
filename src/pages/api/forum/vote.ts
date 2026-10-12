import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { voteForumComment } from '../../../services/supabase';

export const prerender = false;

function getVoterHash(ip: string, userAgent: string): string {
  const salt = process.env.VOTE_SALT || 'politicheck-civic-forum-salt-2027';
  return crypto.createHash('sha256').update(`${ip}::${userAgent}::${salt}`).digest('hex').substring(0, 24);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Cuerpo de solicitud inválido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { commentId, voteValue } = body;

    if (!commentId || typeof commentId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'commentId es requerido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (voteValue !== 1 && voteValue !== -1) {
      return new Response(
        JSON.stringify({ success: false, error: 'voteValue debe ser 1 (▲) o -1 (▼).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'anonymous';
    const voterHash = getVoterHash(rawIp, userAgent);

    const result = await voteForumComment({
      commentId,
      voterHash,
      voteValue: voteValue as 1 | -1
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Error al registrar voto cívico.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        commentId,
        voteValue: result.voteValue,
        karma_score: result.karma_score,
        upvotes: result.upvotes,
        downvotes: result.downvotes
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
