-- ========================================================
-- POLITICHECK: Debate Cívico de Historia (Story Forum) & Karma Transaccional
-- Ejecutar en el SQL Editor de tu proyecto en Supabase:
-- https://supabase.com/dashboard/project/vfvhrudlqmnwsmquadrr/sql
-- ========================================================

-- 1. Tabla de Comentarios del Foro Cívico (2 niveles: Raíz y Respuestas)
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id TEXT NOT NULL,
  parent_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'user' CHECK (author_role IN ('superadmin', 'admin', 'moderator', 'verified', 'user')),
  content TEXT NOT NULL,
  ip_hash TEXT,
  karma_score INTEGER NOT NULL DEFAULT 0,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_by UUID REFERENCES auth.users(id),
  is_collapsed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Validación de longitud según jerarquía
  CONSTRAINT chk_content_length CHECK (
    (parent_id IS NULL AND char_length(content) > 0 AND char_length(content) <= 600) OR
    (parent_id IS NOT NULL AND char_length(content) > 0 AND char_length(content) <= 350)
  )
);

-- 2. Tabla de Auditoría de Votos Cívicos (▲ / ▼)
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL,
  vote_value SMALLINT NOT NULL CHECK (vote_value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_forum_vote_per_comment UNIQUE (comment_id, voter_hash)
);

-- 3. Índices de Alto Rendimiento para Consulta y Ordenamiento
CREATE INDEX IF NOT EXISTS idx_forum_comments_story_created 
  ON public.forum_comments(story_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_comments_story_karma 
  ON public.forum_comments(story_id, karma_score DESC);

CREATE INDEX IF NOT EXISTS idx_forum_comments_parent 
  ON public.forum_comments(parent_id) 
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_forum_votes_comment_voter 
  ON public.forum_votes(comment_id, voter_hash);

-- 4. Trigger Transaccional para Recálculo Atómico de Karma
CREATE OR REPLACE FUNCTION public.recalculate_comment_karma()
RETURNS TRIGGER AS $$
DECLARE
  target_comment_id UUID;
  new_upvotes INTEGER;
  new_downvotes INTEGER;
  new_karma INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_comment_id := OLD.comment_id;
  ELSE
    target_comment_id := NEW.comment_id;
  END IF;

  SELECT 
    COALESCE(COUNT(*) FILTER (WHERE vote_value = 1), 0),
    COALESCE(COUNT(*) FILTER (WHERE vote_value = -1), 0)
  INTO new_upvotes, new_downvotes
  FROM public.forum_votes
  WHERE comment_id = target_comment_id;

  new_karma := new_upvotes - new_downvotes;

  UPDATE public.forum_comments
  SET 
    upvotes = new_upvotes,
    downvotes = new_downvotes,
    karma_score = new_karma,
    is_collapsed = CASE 
      WHEN new_karma <= -5 OR report_count >= 3 THEN true 
      ELSE is_collapsed 
    END,
    updated_at = now()
  WHERE id = target_comment_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_forum_votes_karma ON public.forum_votes;
CREATE TRIGGER trg_forum_votes_karma
AFTER INSERT OR UPDATE OR DELETE ON public.forum_votes
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_comment_karma();

-- 5. Habilitar Seguridad a Nivel de Filas (RLS)
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para Comentarios
-- Lectura pública para cualquier ciudadano (los comentarios eliminados se muestran con aviso neutral)
CREATE POLICY "Public Read Forum Comments"
  ON public.forum_comments FOR SELECT
  USING (true);

-- Inserción pública de comentarios y respuestas
CREATE POLICY "Public Insert Forum Comments"
  ON public.forum_comments FOR INSERT
  WITH CHECK (
    char_length(content) > 0 
    AND (
      (parent_id IS NULL AND char_length(content) <= 600) OR
      (parent_id IS NOT NULL AND char_length(content) <= 350)
    )
    AND is_deleted = false
    AND is_pinned = false
    AND report_count = 0
    AND karma_score = 0
  );

-- Moderación: solo roles privilegiados pueden actualizar borrado, pin o colapso
CREATE POLICY "Moderators Manage Forum Comments"
  ON public.forum_comments FOR UPDATE
  TO authenticated
  USING (public.get_my_role() IN ('superadmin', 'admin', 'moderator'))
  WITH CHECK (public.get_my_role() IN ('superadmin', 'admin', 'moderator'));

-- 7. Políticas RLS para Votos Cívicos
-- Lectura pública de votos auditados
CREATE POLICY "Public Read Forum Votes"
  ON public.forum_votes FOR SELECT
  USING (true);

-- Inserción / modificación de votos por hash
CREATE POLICY "Public Manage Forum Votes"
  ON public.forum_votes FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. Publicación Realtime para WebSockets Selectivos de Comentarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'forum_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
  END IF;
END $$;
