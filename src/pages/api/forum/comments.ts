import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { getForumComments, postForumComment } from '../../../services/supabase';
import { authenticateRequest } from '../../../services/auth';

export const prerender = false;

// In-memory IP cooldown tracker for rate limiting (1 comment/reply every 4s)
const ipCooldowns = new Map<string, number>();

// Basic profanity / toxicity filter for civic debate
const BANNED_TERMS = [
  'hijo de puta', 'hdp', 'la concha de tu', 'forro de mierda', 
  'pelotudo de mierda', 'mogolico', 'subnormal', 'asesino hdp',
  'morite', 'ojala te mueras', 'negro de mierda', 'vayan a laburar lacras'
];

function containsProhibitedLanguage(text: string): boolean {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return BANNED_TERMS.some(term => {
    const normTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.includes(normTerm);
  });
}

function getVoterHash(ip: string, userAgent: string): string {
  const salt = process.env.VOTE_SALT || 'politicheck-civic-forum-salt-2027';
  return crypto.createHash('sha256').update(`${ip}::${userAgent}::${salt}`).digest('hex').substring(0, 24);
}

export const GET: APIRoute = async ({ url, request }) => {
  try {
    const storyId = url.searchParams.get('story_id') || url.searchParams.get('storyId');
    if (!storyId) {
      return new Response(
        JSON.stringify({ success: false, error: 'story_id es requerido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sortParam = (url.searchParams.get('sort') || 'top') as 'top' | 'newest' | 'debated';
    const sort = ['top', 'newest', 'debated'].includes(sortParam) ? sortParam : 'top';

    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'anonymous';
    const voterHash = getVoterHash(rawIp, userAgent);

    const comments = await getForumComments(storyId, sort, voterHash);

    return new Response(
      JSON.stringify({
        success: true,
        storyId,
        sort,
        count: comments.length,
        comments
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error al obtener comentarios del debate.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
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

    const { storyId, parentId, content, authorName } = body;

    if (!storyId || typeof storyId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'storyId es requerido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'El contenido del aporte no puede estar vacío.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isReply = Boolean(parentId);
    const maxChars = isReply ? 350 : 600;

    if (content.length > maxChars) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `El aporte excede el límite de ${maxChars} caracteres permitido para ${isReply ? 'respuestas' : 'comentarios principales'}.` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check toxicity filter
    if (containsProhibitedLanguage(content)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Tu aporte contiene términos que no cumplen con las normas de debate cívico y respeto mutuo de Politicheck.' 
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate Limiting
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'anonymous';
    const voterHash = getVoterHash(rawIp, userAgent);

    const now = Date.now();
    const lastPost = ipCooldowns.get(voterHash) || 0;
    if (now - lastPost < 3500) {
      const waitSeconds = Math.ceil((3500 - (now - lastPost)) / 1000);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Por favor esperá ${waitSeconds}s antes de enviar otro comentario para garantizar una deliberación ordenada.` 
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    ipCooldowns.set(voterHash, now);

    // Clean old cooldown entries periodically
    if (ipCooldowns.size > 2000) {
      for (const [k, v] of ipCooldowns.entries()) {
        if (now - v > 30000) ipCooldowns.delete(k);
      }
    }

    // Optional user authentication check
    const auth = await authenticateRequest(request);
    let authorRole: 'superadmin' | 'admin' | 'moderator' | 'verified' | 'user' = 'user';
    let userId: string | null = null;
    let finalAuthorName = authorName?.trim() || 'Ciudadano';

    if (auth.isAuthenticated && auth.user) {
      userId = auth.user.id;
      if (auth.isSuperadmin) {
        authorRole = 'superadmin';
      } else if (auth.isAdmin) {
        authorRole = 'admin';
      } else if (auth.profile?.role === 'moderator') {
        authorRole = 'moderator';
      } else {
        authorRole = 'verified';
      }

      if (!authorName && auth.profile?.full_name) {
        finalAuthorName = auth.profile.full_name;
      }
    }

    const result = await postForumComment({
      storyId,
      parentId: parentId || null,
      content,
      authorName: finalAuthorName,
      authorRole,
      ipHash: voterHash,
      userId
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Error al guardar el aporte.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, comment: result.comment }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
