import type { APIRoute } from 'astro';
import { authenticateRequest } from '../../../services/auth';
import { 
  getAllProfiles, 
  updateUserRole, 
  SUPERADMIN_EMAILS, 
  createScopedClient,
  type UserRole 
} from '../../../services/supabase';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const method = request.method.toUpperCase();

  // Validate SUPERADMIN access strictly
  const auth = await authenticateRequest(request);
  if (!auth.isAuthenticated || !auth.isSuperadmin) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Acceso restringido. Solo el Superadministrador (contacto@politicheck.com.ar) puede gestionar roles y usuarios.' 
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const scopedClient = createScopedClient(token);

  try {
    // 1. GET: Fetch all profiles
    if (method === 'GET') {
      const profiles = await getAllProfiles(scopedClient || undefined);
      return new Response(JSON.stringify({ success: true, profiles }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. POST: Update user role
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { userId, targetEmail, role } = body;

      if (!userId || !role) {
        return new Response(JSON.stringify({
          success: false,
          error: 'userId y rol son obligatorios.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Safeguard: Prevent modifying or demoting the permanent superadmin
      if (targetEmail && SUPERADMIN_EMAILS.includes(targetEmail.toLowerCase()) && role !== 'superadmin') {
        return new Response(JSON.stringify({
          success: false,
          error: 'No está permitido degradar al Superadministrador principal (contacto@politicheck.com.ar).'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const validRoles: UserRole[] = ['superadmin', 'admin', 'moderator', 'user'];
      if (!validRoles.includes(role)) {
        return new Response(JSON.stringify({
          success: false,
          error: `Rol inválido. Debe ser uno de: ${validRoles.join(', ')}`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await updateUserRole(userId, role, scopedClient || undefined);
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
