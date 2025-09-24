-- Create tables for Rocket League esports betting app

-- Teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  color TEXT DEFAULT '#ffffff',
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Leagues table  
CREATE TABLE public.leagues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  start_date DATE,
  end_date DATE,
  prize_pool INTEGER,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tournaments table (specific events within leagues)
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_a_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  team_b_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  team_a_score INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES public.teams(id),
  match_type TEXT DEFAULT 'bo5' CHECK (match_type IN ('bo3', 'bo5', 'bo7')),
  stage TEXT, -- 'group', 'quarterfinal', 'semifinal', 'final', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraint to ensure team_a and team_b are different
  CONSTRAINT different_teams CHECK (team_a_id != team_b_id)
);

-- Profiles table for users/bettors
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  favorite_team_id UUID REFERENCES public.teams(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  predicted_winner_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  predicted_score_a INTEGER,
  predicted_score_b INTEGER,
  confidence_level INTEGER DEFAULT 1 CHECK (confidence_level BETWEEN 1 AND 3),
  points_earned INTEGER DEFAULT 0,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint: one prediction per user per match
  UNIQUE(user_id, match_id)
);

-- League participants (teams in leagues)
CREATE TABLE public.league_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint: one entry per team per league
  UNIQUE(league_id, team_id)
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (teams, leagues, tournaments, matches)
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Leagues are viewable by everyone" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "League participants are viewable by everyone" ON public.league_participants FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for predictions
CREATE POLICY "Users can view all predictions" ON public.predictions FOR SELECT USING (true);
CREATE POLICY "Users can create their own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own predictions before match starts" ON public.predictions 
  FOR UPDATE USING (
    auth.uid()::text = user_id::text AND 
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE matches.id = predictions.match_id 
      AND matches.status = 'scheduled'
      AND matches.scheduled_at > now()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON public.leagues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_predictions_updated_at BEFORE UPDATE ON public.predictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.teams (name, short_name, color, region) VALUES
  ('Karmine Corp', 'KC', '#1e90ff', 'Europe'),
  ('Team Falcons', 'Falcons', '#32cd32', 'Middle East'),
  ('BDS Esport', 'BDS', '#ff4500', 'Europe'),
  ('Ninjas in Pyjamas', 'NiP', '#ffd700', 'Europe'),
  ('G2 Esports', 'G2', '#ff1744', 'North America'),
  ('Team Vitality', 'VIT', '#9c27b0', 'Europe');

INSERT INTO public.leagues (name, short_name, description, start_date, end_date, prize_pool, status) VALUES
  ('RLCS Major 1 New York', 'RLCS M1', 'Premier tournoi RLCS de la saison', '2025-12-05', '2025-12-07', 1000000, 'upcoming'),
  ('RLCS Major 2 Paris', 'RLCS M2', 'Deuxième major RLCS à Paris', '2026-05-10', '2026-05-14', 1500000, 'upcoming'),
  ('RLCS World Championship Lyon', 'RLCS Worlds', 'Championnat du monde RLCS', '2025-09-12', '2025-09-17', 2000000, 'active');

INSERT INTO public.tournaments (league_id, name, location, start_date, end_date, status) 
SELECT 
  l.id,
  l.name || ' - Main Event',
  CASE 
    WHEN l.short_name = 'RLCS M1' THEN 'New York, USA'
    WHEN l.short_name = 'RLCS M2' THEN 'Paris, France'  
    WHEN l.short_name = 'RLCS Worlds' THEN 'Lyon, France'
  END,
  l.start_date::timestamp,
  l.end_date::timestamp,
  l.status
FROM public.leagues l;