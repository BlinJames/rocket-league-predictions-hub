import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface League {
  id: string;
  name: string;
  short_name: string;
  status: string;
}

interface Match {
  id: string;
  scheduled_at: string;
  team_a_id: string;
  team_b_id: string;
  match_type: string;
  stage: string;
  status: string;
}

export const Matches = () => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const handleMakePrediction = () => {
    navigate('/match/1'); // Navigate to match details page
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchMatchesForLeague(selectedLeague);
    }
  }, [selectedLeague]);

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
          tournaments!inner(league_id)
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
          <h1 className="text-xl font-bold">Matches</h1>
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
              <div className="card-match relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-r from-gaming-blue to-gaming-green"></div>
                </div>
                
                <div className="relative z-10">
                  {/* Match Info */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{new Date(matches[0].scheduled_at).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      {matches[0].match_type?.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gaming-blue rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">KC</span>
                      </div>
                      <h3 className="font-bold text-sm">Karmine Corp</h3>
                    </div>

                    <div className="text-center px-4">
                      <div className="text-2xl font-bold mb-1">VS</div>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gaming-green rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">F</span>
                      </div>
                      <h3 className="font-bold text-sm">Falcon</h3>
                    </div>
                  </div>

                  {/* Bet Button */}
                  <Button className="btn-gaming-primary w-full" onClick={handleMakePrediction}>
                    Faire un prono
                  </Button>
                </div>
              </div>
            </div>

            {/* Other Matches */}
            {matches.slice(1).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Autres matches</h3>
                <div className="space-y-4">
                  {matches.slice(1, 4).map((match) => (
                    <div key={match.id} className="card-gaming">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <span className="w-6 h-6 bg-yellow-500 rounded text-xs flex items-center justify-center font-bold text-black">
                            VS
                          </span>
                          Match {match.stage || 'TBD'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {match.match_type?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.scheduled_at).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
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
          <Button variant="outline" className="w-full">
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