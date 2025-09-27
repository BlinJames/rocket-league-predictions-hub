import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MatchCard } from '@/components/MatchCard';

interface League {
  id: string;
  name: string;
  short_name: string;
  status: string;
}

interface Team {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

interface Match {
  id: string;
  scheduled_at: string;
  team_a_id: string;
  team_b_id: string;
  match_type: string;
  stage: string;
  status: string;
  team_a?: Team;
  team_b?: Team;
  tournaments?: {
    name: string;
  };
}

export const League = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  // Get league from query params
  const searchParams = new URLSearchParams(location.search);
  const leagueFromQuery = searchParams.get('league');

  const handleMakePrediction = (matchId: string) => {
    navigate(`/match/${matchId}`);
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchMatchesForLeague(selectedLeague);
    }
  }, [selectedLeague]);

  // Set league from query param when leagues are loaded
  useEffect(() => {
    if (leagueFromQuery && leagues.length > 0) {
      setSelectedLeague(leagueFromQuery);
    } else if (leagues.length > 0 && !selectedLeague) {
      setSelectedLeague(leagues[0].id);
    }
  }, [leagues, leagueFromQuery]);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name, short_name, status')
        .order('name');
      
      if (error) throw error;
      
      setLeagues(data || []);
      if (data && data.length > 0) {
        setSelectedLeague(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchesForLeague = async (leagueId: string) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          scheduled_at,
          team_a_id,
          team_b_id,
          match_type,
          stage,
          status,
          tournaments!inner(name, league_id),
          team_a:teams!team_a_id(id, name, short_name, color),
          team_b:teams!team_b_id(id, name, short_name, color)
        `)
        .eq('tournaments.league_id', leagueId)
        .order('scheduled_at');
      
      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des ligues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Leagues</h1>
          {selectedLeague && (
            <Badge variant="secondary" className="text-xs">
              {leagues.find(l => l.id === selectedLeague)?.short_name}
            </Badge>
          )}
        </div>
      </header>

      {/* League Selector */}
      <div className="p-4 border-b border-border">
        <Tabs value={selectedLeague} onValueChange={setSelectedLeague} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            {leagues.map((league) => (
              <TabsTrigger 
                key={league.id} 
                value={league.id}
                className="text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {league.short_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Matches Content */}
      <div className="p-4">
        {matches.length > 0 ? (
          <>
            {/* Current/Next Match */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">Prochain match</h2>
              <MatchCard match={matches[0]} variant="featured" />
            </div>

            {/* Other Matches */}
            {matches.slice(1).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Autres matches</h3>
                <div className="space-y-3">
                  {matches.slice(1, 4).map((match) => (
                    <MatchCard key={match.id} match={match} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun match disponible pour cette ligue</p>
          </div>
        )}

        {/* All Predictions Button */}
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/predictions')}>
            Voir toutes mes pronos
          </Button>
        </div>

        {/* Stats Preview */}
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Mes statistiques</h2>
          
          <div className="card-gaming">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="stat-item">
                <div className="stat-value text-lg">12 444</div>
                <div className="stat-label">Points totaux</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-lg">34</div>
                <div className="stat-label">Pronostics gagnés</div>
              </div>
              <div className="stat-item">
                <div className="stat-value text-lg text-primary">🔥</div>
                <div className="stat-label">Série de victoires</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};