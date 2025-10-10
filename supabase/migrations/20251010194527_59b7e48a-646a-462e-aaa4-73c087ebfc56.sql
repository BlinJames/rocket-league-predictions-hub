
-- Ensure creator is automatically added as a member on league creation
DROP TRIGGER IF EXISTS add_creator_member ON public.private_leagues;
CREATE TRIGGER add_creator_member
AFTER INSERT ON public.private_leagues
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_to_private_league();

-- Allow creators to view their own leagues immediately after creation (before membership lookup)
DROP POLICY IF EXISTS "Creators can view their own private leagues" ON public.private_leagues;
CREATE POLICY "Creators can view their own private leagues"
ON public.private_leagues
FOR SELECT
TO authenticated
USING (created_by = auth.uid());
