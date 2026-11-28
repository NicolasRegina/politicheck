-- ADR-0009: Politicians Glossary & Human-in-the-Loop Role-Change Alerts
-- Versioned schema + hardened RLS (no anon INSERT on politician_alerts)

CREATE TABLE IF NOT EXISTS public.politicians (
  slug text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  full_name text NOT NULL,
  avatar text NOT NULL DEFAULT '',
  avatar_credit text NOT NULL DEFAULT '',
  coalition text NOT NULL,
  space_group text NOT NULL,
  scope_group text NOT NULL,
  role text NOT NULL,
  district text NOT NULL DEFAULT 'Nación Argentina',
  birth_date text NOT NULL DEFAULT '',
  birth_place text NOT NULL DEFAULT '',
  education text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  past_affiliations text[] NOT NULL DEFAULT '{}',
  career_timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  policy_axes jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources text[] NOT NULL DEFAULT '{}',
  party_color jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_politicians_space_group ON public.politicians (space_group);
CREATE INDEX IF NOT EXISTS idx_politicians_scope_group ON public.politicians (scope_group);
CREATE INDEX IF NOT EXISTS idx_politicians_name ON public.politicians (name);

ALTER TABLE public.politicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Active Politicians" ON public.politicians;
CREATE POLICY "Public Read Active Politicians"
  ON public.politicians
  FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin Full Access Politicians" ON public.politicians;
CREATE POLICY "Admin Full Access Politicians"
  ON public.politicians
  FOR ALL
  TO authenticated
  USING (get_my_role() = ANY (ARRAY['superadmin'::text, 'admin'::text]))
  WITH CHECK (get_my_role() = ANY (ARRAY['superadmin'::text, 'admin'::text]));

CREATE TABLE IF NOT EXISTS public.politician_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_slug text NOT NULL REFERENCES public.politicians(slug) ON DELETE CASCADE,
  politician_name text NOT NULL,
  story_id text NOT NULL,
  story_headline text NOT NULL,
  story_url text,
  trigger_keyword text NOT NULL,
  detected_snippet text NOT NULL DEFAULT '',
  suggested_role text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT politician_alerts_unique_story UNIQUE (politician_slug, story_id)
);

CREATE INDEX IF NOT EXISTS idx_politician_alerts_status_created ON public.politician_alerts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_politician_alerts_slug ON public.politician_alerts (politician_slug);

ALTER TABLE public.politician_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sync Insert Pending Politician Alerts" ON public.politician_alerts;

DROP POLICY IF EXISTS "Admin Full Access Politician Alerts" ON public.politician_alerts;
CREATE POLICY "Admin Full Access Politician Alerts"
  ON public.politician_alerts
  FOR ALL
  TO authenticated
  USING (get_my_role() = ANY (ARRAY['superadmin'::text, 'admin'::text]))
  WITH CHECK (get_my_role() = ANY (ARRAY['superadmin'::text, 'admin'::text]));
