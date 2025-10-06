-- Create private leagues table
CREATE TABLE public.private_leagues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  based_on_league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create private league members table
CREATE TABLE public.private_league_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  private_league_id UUID NOT NULL REFERENCES public.private_leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(private_league_id, user_id)
);

-- Enable RLS
ALTER TABLE public.private_leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_league_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for private_leagues
CREATE POLICY "Users can view private leagues they are members of"
ON public.private_leagues
FOR SELECT
USING (
  id IN (
    SELECT private_league_id 
    FROM public.private_league_members 
    WHERE user_id::text = (auth.uid())::text
  )
);

CREATE POLICY "Users can create private leagues"
ON public.private_leagues
FOR INSERT
WITH CHECK ((auth.uid())::text = (created_by)::text);

CREATE POLICY "League creators can update their leagues"
ON public.private_leagues
FOR UPDATE
USING ((auth.uid())::text = (created_by)::text);

CREATE POLICY "League creators can delete their leagues"
ON public.private_leagues
FOR DELETE
USING ((auth.uid())::text = (created_by)::text);

-- RLS Policies for private_league_members
CREATE POLICY "Users can view members of their private leagues"
ON public.private_league_members
FOR SELECT
USING (
  private_league_id IN (
    SELECT private_league_id 
    FROM public.private_league_members 
    WHERE user_id::text = (auth.uid())::text
  )
);

CREATE POLICY "Anyone can join a private league"
ON public.private_league_members
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can leave private leagues"
ON public.private_league_members
FOR DELETE
USING ((auth.uid())::text = (user_id)::text);

-- Function to generate random invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Trigger to auto-add creator as member
CREATE OR REPLACE FUNCTION public.add_creator_to_private_league()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.private_league_members (private_league_id, user_id)
  VALUES (NEW.id, NEW.created_by);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_private_league_created
  AFTER INSERT ON public.private_leagues
  FOR EACH ROW EXECUTE FUNCTION public.add_creator_to_private_league();