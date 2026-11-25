-- ========================================================
-- POLITICHECK: Security Hardening for Chat & Forum RLS (2026-11-25)
-- Prevents anonymous role spoofing (superadmin/admin/moderator) on chat_messages
-- and keeps forum_comments aligned with create_story_civic_debates.
-- ========================================================

-- Tighten Public Insert Messages on chat_messages so anonymous callers cannot spoof staff roles
ALTER POLICY "Public Insert Messages"
  ON public.chat_messages
  WITH CHECK (
    char_length(content) > 0
    AND char_length(content) <= 300
    AND sender_role = 'user'
    AND is_deleted = false
    AND is_pinned = false
  );
