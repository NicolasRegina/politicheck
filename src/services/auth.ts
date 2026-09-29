import { supabase, getUserProfile, SUPERADMIN_EMAILS, type UserProfile, type UserRole } from './supabase';

export interface AuthContext {
  isAuthenticated: boolean;
  user: any | null;
  profile: UserProfile | null;
  isSuperadmin: boolean;
  isAdmin: boolean;
  error?: string;
}

/**
 * Extract bearer token from Request Authorization header or cookies
 */
export function extractAuthToken(request: Request): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  return cookies['sb-access-token'] || cookies['politicheck_auth_token'] || null;
}

/**
 * Validate authenticated user and fetch their RBAC profile
 */
export async function authenticateRequest(request: Request): Promise<AuthContext> {
  const token = extractAuthToken(request);
  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      isSuperadmin: false,
      isAdmin: false,
      error: 'No se proveyó token de sesión.'
    };
  }

  if (!supabase) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      isSuperadmin: false,
      isAdmin: false,
      error: 'Supabase no está disponible.'
    };
  }

  try {
    // Verify token with Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        isSuperadmin: false,
        isAdmin: false,
        error: userError?.message || 'Token inválido o expirado.'
      };
    }

    const user = userData.user;
    const isOwnerEmail = SUPERADMIN_EMAILS.includes(user.email?.toLowerCase() || '');

    // Get or create profile
    let profile = await getUserProfile(user.id);
    if (!profile) {
      // First time profile creation fallback
      const initialRole: UserRole = isOwnerEmail ? 'superadmin' : 'user';
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          role: initialRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      profile = (newProfile as UserProfile) || {
        id: user.id,
        email: user.email || '',
        role: initialRole
      };
    }

    const isSuperadmin = profile.role === 'superadmin' || isOwnerEmail;
    const isAdmin = isSuperadmin || profile.role === 'admin';

    return {
      isAuthenticated: true,
      user,
      profile,
      isSuperadmin,
      isAdmin
    };
  } catch (err: any) {
    return {
      isAuthenticated: false,
      user: null,
      profile: null,
      isSuperadmin: false,
      isAdmin: false,
      error: err.message
    };
  }
}
