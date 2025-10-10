
-- Update the function to handle duplicate insertions gracefully
CREATE OR REPLACE FUNCTION public.add_creator_to_private_league()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.private_league_members (private_league_id, user_id)
  VALUES (NEW.id, NEW.created_by)
  ON CONFLICT (private_league_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;
