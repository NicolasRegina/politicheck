import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { getChatMessages, sendChatMessage, getChatChannels } from '../../../services/supabase';

export const prerender = false;

// Simple in-memory IP cooldown tracker for rate limiting (1 msg every 4s)
const ipCooldowns = new Map<string, number>();

function getIpHash(ip: string, userAgent: string): string {
  const salt = process.env.VOTE_SALT || 'politicheck-chat-salt-2027';
  return crypto.createHash('sha256').update(`${ip}::${userAgent}::${salt}`).digest('hex').substring(0, 16);
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const channelId = url.searchParams.get('channel') || 'general';
    const channels = await getChatChannels();
    const messages = await getChatMessages(channelId, 60);

    return new Response(
      JSON.stringify({
        success: true,
        channelId,
        channels,
        messages
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error al obtener mensajes.' }),
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

    const { channelId = 'general', content, senderName } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'El mensaje no puede estar vacío.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (content.length > 300) {
      return new Response(
        JSON.stringify({ success: false, error: 'El mensaje supera el límite de 300 caracteres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate Limiting check per IP
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'anonymous';
    const ipHash = getIpHash(rawIp, userAgent);

    const now = Date.now();
    const lastPost = ipCooldowns.get(ipHash) || 0;
    if (now - lastPost < 3500) {
      const waitSeconds = Math.ceil((3500 - (now - lastPost)) / 1000);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Por favor esperá ${waitSeconds}s antes de enviar otro mensaje para evitar spam.` 
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    ipCooldowns.set(ipHash, now);

    // Clean old cooldown entries every 100 requests
    if (ipCooldowns.size > 2000) {
      for (const [k, v] of ipCooldowns.entries()) {
        if (now - v > 30000) ipCooldowns.delete(k);
      }
    }

    const result = await sendChatMessage(
      channelId,
      content,
      senderName || 'Ciudadano',
      'user',
      ipHash
    );

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Error al guardar el mensaje.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: result.message }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
