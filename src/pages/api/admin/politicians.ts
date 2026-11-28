import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { createScopedClient } from '../../../services/supabase';
import { invalidatePoliticiansCache } from '../../../services/politicians';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function jsonResponse(payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

async function authorizeAdmin(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return {
      error: jsonResponse(
        { success: false, error: 'No autorizado. Se requieren permisos de Administrador o Superadmin.' },
        403
      ),
    };
  }
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const scopedClient = createScopedClient(token);
  if (!scopedClient) {
    return { error: jsonResponse({ success: false, error: 'Cliente Supabase no disponible.' }, 500) };
  }
  return { auth, scopedClient };
}

export const GET: APIRoute = async ({ request }) => {
  const gate = await authorizeAdmin(request);
  if ('error' in gate) return gate.error!;

  try {
    const [polRes, alertRes] = await Promise.all([
      gate.scopedClient
        .from('politicians')
        .select('slug, name, role, coalition, space_group, scope_group, district, summary, career_timeline, updated_at')
        .eq('is_active', true)
        .order('name', { ascending: true }),
      gate.scopedClient
        .from('politician_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40),
    ]);

    if (polRes.error) throw polRes.error;
    if (alertRes.error) throw alertRes.error;

    return jsonResponse({
      success: true,
      politicians: polRes.data || [],
      alerts: alertRes.data || [],
    });
  } catch (err: any) {
    console.error('[API Admin Politicians GET]', err);
    return jsonResponse({ success: false, error: err?.message || 'Error interno del servidor' }, 500);
  }
};

type PatchActionHandler = (
  body: Record<string, any>,
  ctx: { userId: string; scopedClient: any }
) => Promise<Response>;

const PATCH_HANDLERS: Record<string, PatchActionHandler> = {
  async update_politician(body, { scopedClient }) {
    const { slug, role, coalition, district, scope_group, summary, career_timeline } = body;
    if (!slug || !role) {
      return jsonResponse({ success: false, error: 'Faltan slug y cargo.' }, 400);
    }

    const updatePayload: Record<string, any> = {
      role: String(role).trim(),
      updated_at: new Date().toISOString(),
    };
    if (typeof coalition === 'string' && coalition.trim()) updatePayload.coalition = coalition.trim();
    if (typeof district === 'string' && district.trim()) updatePayload.district = district.trim();
    if (typeof scope_group === 'string' && scope_group.trim()) updatePayload.scope_group = scope_group.trim();
    if (typeof summary === 'string') updatePayload.summary = summary.trim();
    if (Array.isArray(career_timeline)) {
      const sanitizedTimeline = career_timeline
        .filter((e: any) => e && typeof e.period === 'string' && typeof e.role === 'string' && e.period.trim() && e.role.trim())
        .map((e: any) => ({
          period: String(e.period).trim(),
          role: String(e.role).trim(),
          district: String(e.district || 'Nación Argentina').trim(),
          coalition: String(e.coalition || '').trim(),
        }));
      updatePayload.career_timeline = sanitizedTimeline;
    }

    const { data, error } = await scopedClient
      .from('politicians')
      .update(updatePayload)
      .eq('slug', slug)
      .select('slug, name, role, coalition, district, scope_group, summary, career_timeline, updated_at')
      .single();

    if (error) throw error;
    invalidatePoliticiansCache();
    return jsonResponse({ success: true, politician: data });
  },

  async approve_alert(body, { userId, scopedClient }) {
    const { alert_id, politician_slug, new_role } = body;
    if (!alert_id || !politician_slug) {
      return jsonResponse({ success: false, error: 'Faltan alert_id y politician_slug.' }, 400);
    }

    const nowIso = new Date().toISOString();
    if (typeof new_role === 'string' && new_role.trim()) {
      const { error: polErr } = await scopedClient
        .from('politicians')
        .update({ role: new_role.trim(), updated_at: nowIso })
        .eq('slug', politician_slug);
      if (polErr) throw polErr;
      invalidatePoliticiansCache();
    }

    const { error: alertErr } = await scopedClient
      .from('politician_alerts')
      .update({
        status: 'approved',
        suggested_role: typeof new_role === 'string' && new_role.trim() ? new_role.trim() : null,
        reviewed_by: userId,
        reviewed_at: nowIso,
      })
      .eq('id', alert_id);

    if (alertErr) throw alertErr;
    return jsonResponse({ success: true });
  },

  async dismiss_alert(body, { userId, scopedClient }) {
    const { alert_id } = body;
    if (!alert_id) {
      return jsonResponse({ success: false, error: 'Falta alert_id.' }, 400);
    }

    const { error } = await scopedClient
      .from('politician_alerts')
      .update({
        status: 'dismissed',
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', alert_id);

    if (error) throw error;
    return jsonResponse({ success: true });
  },
};

export const PATCH: APIRoute = async ({ request }) => {
  const gate = await authorizeAdmin(request);
  if ('error' in gate) return gate.error!;

  try {
    const body = await request.json().catch(() => ({}));
    const handler = PATCH_HANDLERS[String(body.action || '')];
    if (!handler) {
      return jsonResponse({ success: false, error: 'Acción no reconocida.' }, 400);
    }
    return await handler(body, { userId: gate.auth.user.id, scopedClient: gate.scopedClient });
  } catch (err: any) {
    console.error('[API Admin Politicians PATCH]', err);
    return jsonResponse({ success: false, error: err?.message || 'Error interno del servidor' }, 500);
  }
};
