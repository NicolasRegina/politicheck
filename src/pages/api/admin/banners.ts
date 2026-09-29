import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { 
  getAllBanners, 
  upsertCivicBanner, 
  deleteCivicBanner, 
  toggleBannerActive, 
  createScopedClient,
  type CivicBanner 
} from '../../../services/supabase';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const method = request.method.toUpperCase();

  // Validate admin authentication
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isAdmin) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'No autorizado. Se requieren permisos de Administrador o Superadmin.' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const scopedClient = createScopedClient(token);

  try {
    // 1. GET: Fetch all banners
    if (method === 'GET') {
      const banners = await getAllBanners(scopedClient || undefined);
      return new Response(JSON.stringify({ success: true, banners }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. POST: Create or Update banner
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { id, title, image_url, destination_url, position, is_active } = body;

      if (!title || !image_url || !destination_url) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Faltan campos obligatorios: título, URL de imagen y URL de destino.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const payload: Partial<CivicBanner> = {
        title: title.trim(),
        image_url: image_url.trim(),
        destination_url: destination_url.trim(),
        position: position || 'home_top',
        is_active: Boolean(is_active),
        created_by: auth.user.id
      };

      if (id) {
        payload.id = id;
      }

      const result = await upsertCivicBanner(payload, scopedClient || undefined);
      if (!result.success) {
        return new Response(JSON.stringify({ success: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, banner: result.data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. PATCH: Toggle Active state
    if (method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const { id, is_active } = body;

      if (!id || typeof is_active !== 'boolean') {
        return new Response(JSON.stringify({ success: false, error: 'ID y estado activo requeridos.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await toggleBannerActive(id, is_active, scopedClient || undefined);
      if (!result.success) {
        return new Response(JSON.stringify({ success: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. DELETE: Delete banner
    if (method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');

      if (!id) {
        return new Response(JSON.stringify({ success: false, error: 'ID de banner requerido.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await deleteCivicBanner(id, scopedClient || undefined);
      if (!result.success) {
        return new Response(JSON.stringify({ success: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Método no soportado.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
