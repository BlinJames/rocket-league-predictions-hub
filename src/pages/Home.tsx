import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trophy, Users, Calendar, TrendingUp, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface League {
  id: string;
  name: string;
  short_name: string;
  status: string;
  description: string;
}

export const Home = () => {
  const navigate = useNavigate();
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [upcomingLeagues, setUpcomingLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    fetchLeagues();

    return () => subscription.unsubscribe();
  }, []);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name, short_name, status, description')
        .order('name');
      
      if (error) throw error;
      
      const active = data?.find(league => league.status === 'active');
      const upcoming = data?.filter(league => league.status === 'upcoming') || [];
      
      setActiveLeague(active || null);
      setUpcomingLeagues(upcoming);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = () => {
    if (activeLeague) {
      navigate('/leagues');
    }
  };

  const handleViewLeague = (leagueId: string) => {
    navigate(`/leagues?league=${leagueId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Accueil</h1>
            {user && (
              <p className="text-xs text-muted-foreground">
                Bienvenue, {user.email?.split('@')[0]}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <Button size="sm" variant="outline" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-1" />
                Connexion
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">
              Rocket League
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Ligue Active - Encart pour rejoindre */}
        {activeLeague && (
          <div className="card-match relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-red-500 text-white text-xs">
                  LIVE
                </Badge>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              
              <h2 className="text-lg font-bold mb-2">{activeLeague.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {activeLeague.description || 'Championnat en cours - Finales ce week-end !'}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4" />
                  <span>16 équipes</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-4 h-4" />
                  <span>En cours</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>2M€ de cashprize</span>
                </div>
              </div>
              
              <Button 
                className="btn-gaming-primary w-full" 
                onClick={handleJoinLeague}
              >
                Rejoindre la ligue
              </Button>
            </div>
          </div>
        )}

        {/* Mes Leagues */}
        <div>
          <h2 className="text-lg font-bold mb-4">Mes Leagues</h2>
          
          <div className="space-y-3">
            {upcomingLeagues.map((league) => (
              <Card 
                key={league.id} 
                className="card-gaming cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleViewLeague(league.id)}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{league.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {league.description || 'Tournoi à venir'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-xs">
                      {league.short_name}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      À venir
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
            
            {upcomingLeagues.length === 0 && (
              <Card className="card-gaming">
                <div className="p-6 text-center">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune ligue disponible</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-xs text-muted-foreground">Points totaux</div>
            </div>
          </Card>
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">8</div>
              <div className="text-xs text-muted-foreground">Série actuelle</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};