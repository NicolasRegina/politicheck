-- ========================================================
-- POLITICHECK: Migración de Roles RBAC y Gestión de Banners
-- Ejecutar este script en el SQL Editor de tu proyecto en Supabase:
-- https://supabase.com/dashboard/project/vfvhrudlqmnwsmquadrr/sql
-- ========================================================

-- 1. Tabla de Perfiles con Roles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('superadmin', 'admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Banners Publicitarios y Patrocinios Cívicos
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'home_top',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar Seguridad a Nivel de Filas (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 4. Función de ayuda para verificar roles de forma segura
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. Políticas de Seguridad (RLS) para Banners
-- Lectura pública: Cualquier visitante puede ver banners que estén ACTIVOS
CREATE POLICY "Public Read Active Banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

-- Gestión completa de banners: Solo superadmins y admins
CREATE POLICY "Admin Full Access Banners"
  ON public.banners FOR ALL
  TO authenticated
  USING (public.get_my_role() IN ('superadmin', 'admin'))
  WITH CHECK (public.get_my_role() IN ('superadmin', 'admin'));

-- 6. Políticas de Seguridad (RLS) para Profiles
-- Cada usuario puede leer su propio perfil
CREATE POLICY "Users Can Read Own Profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Superadmin puede ver y gestionar todos los perfiles
CREATE POLICY "Superadmin Can Manage Profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.get_my_role() = 'superadmin')
  WITH CHECK (public.get_my_role() = 'superadmin');

-- 7. Trigger automático: Al registrarse un usuario en Supabase Auth, se crea su perfil en profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN LOWER(NEW.email) = 'contacto@politicheck.com.ar' THEN 'superadmin' ELSE 'user' END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      role = CASE WHEN LOWER(EXCLUDED.email) = 'contacto@politicheck.com.ar' THEN 'superadmin' ELSE public.profiles.role END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================================
-- INSTRUCCIONES PARA PROMOVER A TU PRIMER SUPERADMIN:
-- Una vez que crees tu usuario con email y contraseña desde:
-- Supabase Dashboard -> Authentication -> Users -> "Add User"
-- Ejecuta la siguiente línea cambiando tu email:
--
-- UPDATE public.profiles 
-- SET role = 'superadmin' 
-- WHERE email = 'tu_email@ejemplo.com';
-- ========================================================
