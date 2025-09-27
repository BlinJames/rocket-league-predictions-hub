-- Temporarily allow anonymous predictions for testing
DROP POLICY IF EXISTS "Users can create their own predictions" ON public.predictions;

CREATE POLICY "Anyone can create predictions" 
ON public.predictions 
FOR INSERT 
WITH CHECK (true);

-- Also update the update policy to allow anonymous updates
DROP POLICY IF EXISTS "Users can update their own predictions before match starts" ON public.predictions;

CREATE POLICY "Anyone can update predictions before match starts" 
ON public.predictions 
FOR UPDATE 
USING (EXISTS ( SELECT 1
   FROM matches
  WHERE ((matches.id = predictions.match_id) AND (matches.status = 'scheduled'::text) AND (matches.scheduled_at > now()))));