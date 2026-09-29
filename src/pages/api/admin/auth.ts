import type { APIRoute } from 'astro';
import { supabase, SUPERADMIN_EMAILS, getUserProfile } from '../../../services/supabase';
import { authenticateRequest } from '../../../services/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ success: false, error: 'Supabase no está configurado.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { action, email, password } = body;

    // 1. Action: Verify existing token or session
    if (action === 'verify') {
      const auth = await authenticateRequest(request);
      if (!auth.isAuthenticated) {
        return new Response(JSON.stringify({ success: false, error: auth.error }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        user: auth.user,
        profile: auth.profile,
        isAdmin: auth.isAdmin,
        isSuperadmin: auth.isSuperadmin
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Action: Login with Email & Password
    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Email y contraseña requeridos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authErr || !authData.user || !authData.session) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: authErr?.message || 'Credenciales incorrectas.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = authData.user;
    const isOwner = SUPERADMIN_EMAILS.includes(user.email?.toLowerCase() || '');

    // Check & elevate profile if needed
    let profile = await getUserProfile(user.id);
    if (!profile) {
      const role = isOwner ? 'superadmin' : 'user';
      const { data: created } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      profile = created;
    } else if (isOwner && profile.role !== 'superadmin') {
      await supabase.from('profiles').update({ role: 'superadmin' }).eq('id', user.id);
      profile.role = 'superadmin';
    }

    const isSuperadmin = profile?.role === 'superadmin' || isOwner;
    const isAdmin = isSuperadmin || profile?.role === 'admin';

    if (!isAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Acceso denegado: tu cuenta no tiene permisos administrativos en Politicheck.'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at
      },
      user: {
        id: user.id,
        email: user.email
      },
      profile,
      isAdmin,
      isSuperadmin
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `sb-access-token=${authData.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
