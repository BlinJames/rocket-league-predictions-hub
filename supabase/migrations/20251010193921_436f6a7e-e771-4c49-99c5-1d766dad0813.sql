
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view members of their private leagues" ON private_league_members;
DROP POLICY IF EXISTS "Users can view private leagues they are members of" ON private_leagues;

-- Create a security definer function to check league membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_league_member(league_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM private_league_members
    WHERE private_league_id = league_id
      AND private_league_members.user_id = user_id
  );
$$;

-- Create a security definer function to get user's league IDs without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_league_ids(user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private_league_id
  FROM private_league_members
  WHERE private_league_members.user_id = user_id;
$$;

-- Recreate policies using the security definer functions
CREATE POLICY "Users can view members of their leagues"
ON private_league_members
FOR SELECT
TO authenticated
USING (
  public.is_league_member(private_league_id, auth.uid())
);

CREATE POLICY "Users can view their private leagues"
ON private_leagues
FOR SELECT
TO authenticated
USING (
  id IN (SELECT public.get_user_league_ids(auth.uid()))
);
