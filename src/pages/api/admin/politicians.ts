import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { createScopedClient } from '../../../services/supabase';
import { invalidatePoliticiansCache } from '../../../services/politicians';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const method = request.method.toUpperCase();

  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'No autorizado. Se requieren permisos de Administrador o Superadmin.',
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const scopedClient = createScopedClient(token);

  if (!scopedClient) {
    return new Response(
      JSON.stringify({ success: false, error: 'Cliente Supabase no disponible.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    if (method === 'GET') {
      const [polRes, alertRes] = await Promise.all([
        scopedClient
          .from('politicians')
          .select('slug, name, role, coalition, space_group, scope_group, district, summary, updated_at')
          .eq('is_active', true)
          .order('name', { ascending: true }),
        scopedClient
          .from('politician_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(40),
      ]);

      if (polRes.error) throw polRes.error;
      if (alertRes.error) throw alertRes.error;

      return new Response(
        JSON.stringify({
          success: true,
          politicians: polRes.data || [],
          alerts: alertRes.data || [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const { action } = body;

      if (action === 'update_politician') {
        const { slug, role, coalition, district, scope_group, summary } = body;
        if (!slug || !role) {
          return new Response(
            JSON.stringify({ success: false, error: 'Faltan slug y cargo.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const updatePayload: Record<string, any> = {
          role: String(role).trim(),
          updated_at: new Date().toISOString(),
        };
        if (typeof coalition === 'string' && coalition.trim()) updatePayload.coalition = coalition.trim();
        if (typeof district === 'string' && district.trim()) updatePayload.district = district.trim();
        if (typeof scope_group === 'string' && scope_group.trim()) updatePayload.scope_group = scope_group.trim();
        if (typeof summary === 'string' && summary.trim()) updatePayload.summary = summary.trim();

        const { data, error } = await scopedClient
          .from('politicians')
          .update(updatePayload)
          .eq('slug', slug)
          .select('slug, name, role, coalition, district, scope_group, updated_at')
          .single();

        if (error) throw error;
        invalidatePoliticiansCache();

        return new Response(JSON.stringify({ success: true, politician: data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (action === 'approve_alert') {
        const { alert_id, politician_slug, new_role } = body;
        if (!alert_id || !politician_slug) {
          return new Response(
            JSON.stringify({ success: false, error: 'Faltan alert_id y politician_slug.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
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
            suggested_role: typeof new_role === 'string' ? new_role.trim() : null,
            reviewed_by: auth.user.id,
            reviewed_at: nowIso,
          })
          .eq('id', alert_id);

        if (alertErr) throw alertErr;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (action === 'dismiss_alert') {
        const { alert_id } = body;
        if (!alert_id) {
          return new Response(
            JSON.stringify({ success: false, error: 'Falta alert_id.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await scopedClient
          .from('politician_alerts')
          .update({
            status: 'dismissed',
            reviewed_by: auth.user.id,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', alert_id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Acción no reconocida.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: false, error: 'Método no soportado.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[API Admin Politicians]', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
