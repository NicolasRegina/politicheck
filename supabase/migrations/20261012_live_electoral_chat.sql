-- ========================================================
-- POLITICHECK: Sala de Chat Electoral en Vivo & Moderación Cívica
-- Ejecutar en el SQL Editor de tu proyecto en Supabase:
-- https://supabase.com/dashboard/project/vfvhrudlqmnwsmquadrr/sql
-- ========================================================

-- 1. Tabla de Canales de Chat
CREATE TABLE IF NOT EXISTS public.chat_channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_live BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Canales iniciales por defecto
INSERT INTO public.chat_channels (id, name, description, is_active, is_live)
VALUES 
  ('general', 'Debate Ciudadano General', 'Intercambio abierto de noticias y encuadres del día', true, false),
  ('debate-electoral', 'Sala Electoral en Vivo', 'Transmisión simultánea durante debates y coberturas clave', true, true),
  ('economia-datos', 'Economía & Reformas', 'Análisis de inflación, reservas, presupuesto y medidas', true, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Mensajes de Chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'user' CHECK (sender_role IN ('superadmin', 'admin', 'moderator', 'user')),
  content TEXT NOT NULL CHECK (char_length(content) <= 300),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_by UUID REFERENCES auth.users(id),
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Índices de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_created 
  ON public.chat_messages(channel_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_active 
  ON public.chat_messages(channel_id, created_at DESC) 
  WHERE is_deleted = false;

-- 4. Habilitar Seguridad a Nivel de Filas (Row Level Security - RLS)
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Canales
-- Lectura pública para cualquier visitante
CREATE POLICY "Public Read Active Channels"
  ON public.chat_channels FOR SELECT
  USING (is_active = true);

-- Administración de canales: Superadmins y Admins
CREATE POLICY "Admin Manage Channels"
  ON public.chat_channels FOR ALL
  TO authenticated
  USING (public.get_my_role() IN ('superadmin', 'admin'))
  WITH CHECK (public.get_my_role() IN ('superadmin', 'admin'));

-- 6. Políticas de Mensajes de Chat
-- Lectura pública de mensajes no borrados
CREATE POLICY "Public Read Active Messages"
  ON public.chat_messages FOR SELECT
  USING (
    is_deleted = false 
    OR (auth.uid() IS NOT NULL AND public.get_my_role() IN ('superadmin', 'admin', 'moderator'))
  );

-- Inserción de mensajes: Abierta a ciudadanos (con o sin cuenta autenticada)
CREATE POLICY "Public Insert Messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    char_length(content) > 0 
    AND char_length(content) <= 300
    AND is_deleted = false
    AND is_pinned = false
  );

-- Moderación de mensajes: Solo Superadmins, Admins y Moderadores pueden actualizar (marcar borrado o fijar)
CREATE POLICY "Moderators Manage Messages"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (public.get_my_role() IN ('superadmin', 'admin', 'moderator'))
  WITH CHECK (public.get_my_role() IN ('superadmin', 'admin', 'moderator'));

-- 7. Publicación Realtime para WebSockets
-- Permite que Supabase emita los cambios de mensajes instantáneamente a todos los clientes conectados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;
