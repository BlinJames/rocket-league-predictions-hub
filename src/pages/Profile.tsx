import { Settings, Edit, Calendar, Trophy, Target, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export const Profile = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    avatar: null
  });

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });

    fetchLeagues();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          displayName: data.display_name || '',
          username: data.username || '',
          email: user?.email || '',
          avatar: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt !',
      });
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  const predictions = [
    {
      id: 1,
      matchTitle: 'Team Falcons vs Karmine Corp',
      date: '14 Sept World Lyon',
      status: 'won',
      points: 150,
      prediction: { team: 'Team Falcons', score: '3-1' },
      actualResult: { winner: 'Team Falcons', score: '3-1' },
      confidence: 85
    },
    {
      id: 2,
      matchTitle: 'G2 Esports vs BDS',
      date: '13 Sept World Lyon',
      status: 'lost',
      points: 0,
      prediction: { team: 'G2 Esports', score: '3-2' },
      actualResult: { winner: 'BDS', score: '1-3' },
      confidence: 70
    },
    {
      id: 3,
      matchTitle: 'NRG vs FaZe Clan',
      date: '12 Sept World Lyon',
      status: 'pending',
      points: 0,
      prediction: { team: 'NRG', score: '3-1' },
      actualResult: null,
      confidence: 90
    }
  ];

  const rewards = [
    {
      id: 1,
      name: "Premier pas",
      description: "Faire votre premier pronostic",
      icon: "🎯",
      gradient: "from-red-500 to-orange-500",
      requirement: "Effectuer 1 pronostic",
      dateEarned: "15 Sept 2024"
    },
    {
      id: 2,
      name: "Série en or",
      description: "Réaliser 5 pronostics corrects consécutifs",
      icon: "⭐",
      gradient: "from-orange-500 to-yellow-500",
      requirement: "5 pronostics corrects d'affilée",
      dateEarned: "22 Sept 2024"
    },
    {
      id: 3,
      name: "Top 10 ligue",
      description: "Finir dans le top 10 d'une ligue",
      icon: "👑",
      gradient: "from-purple-500 to-pink-500",
      requirement: "Classement top 10 en fin de ligue",
      dateEarned: "25 Sept 2024"
    }
  ];

  useEffect(() => {
    // Fetch functions are now defined above
  }, []);

  const fetchLeagues = async () => {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      setLeagues(data || []);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const handleLeagueClick = (leagueId: string) => {
    navigate(`/leagues?league=${leagueId}`);
  };

  const getLeagueStatus = (league: any) => {
    const now = new Date();
    const startDate = league.start_date ? new Date(league.start_date) : null;
    const endDate = league.end_date ? new Date(league.end_date) : null;
    
    if (!startDate) return 'upcoming';
    if (startDate > now) return 'upcoming';
    if (endDate && endDate < now) return 'past';
    return 'current';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            {profile.avatar ? (
              <AvatarImage src={profile.avatar} alt={profile.displayName} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {profile.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="font-bold">{profile.displayName || 'Utilisateur'}</h1>
            <p className="text-xs text-muted-foreground">{profile.username || user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="card-gaming">
              <DialogHeader>
                <DialogTitle>Paramètres du profil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input 
                    id="displayName" 
                    value={profile.displayName} 
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input 
                    id="username" 
                    value={profile.username} 
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    L'email ne peut pas être modifié ici
                  </p>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={async () => {
                      if (user?.email) {
                        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                          redirectTo: `${window.location.origin}/`,
                        });
                        if (!error) {
                          toast({
                            title: 'Email envoyé',
                            description: 'Vérifiez vos emails pour réinitialiser votre mot de passe',
                          });
                        }
                      }
                    }}
                  >
                    Réinitialiser le mot de passe
                  </Button>
                  <Button className="w-full btn-gaming-primary">
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Se déconnecter">
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="stat-item">
            <div className="stat-value">12 444</div>
            <div className="stat-label">Points totaux</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">34</div>
            <div className="stat-label">Pronostics gagnés</div>
          </div>
          <div className="stat-item">
            <div className="stat-value text-primary">8</div>
            <div className="stat-label">Série de victoires</div>
          </div>
        </div>
      </div>

      {/* My Predictions */}
      <div className="px-4 mb-6">
        <h2 className="font-semibold mb-4">Mes pronos</h2>
        
        <div className="space-y-3">
          {predictions.map((prediction) => (
            <Dialog key={prediction.id}>
              <DialogTrigger asChild>
                <div className="card-gaming flex justify-between items-center cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      prediction.status === 'won' ? 'bg-gaming-green' : 
                      prediction.status === 'lost' ? 'bg-destructive' : 'bg-gaming-gold'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">{prediction.matchTitle}</p>
                      <p className="text-xs text-muted-foreground">{prediction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      prediction.status === 'won' ? 'text-gaming-green' : 
                      prediction.status === 'lost' ? 'text-destructive' : 'text-gaming-gold'
                    }`}>
                      {prediction.status === 'won' ? 'Gagnant' : 
                       prediction.status === 'lost' ? 'Perdu' : 'En attente'}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="card-gaming">
                <DialogHeader>
                  <DialogTitle>Détails du pronostic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{prediction.matchTitle}</h3>
                    <p className="text-sm text-muted-foreground">{prediction.date}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3">
                      <h4 className="text-sm font-medium mb-2">Mon pronostic</h4>
                      <p className="text-sm">Équipe: {prediction.prediction.team}</p>
                      <p className="text-sm">Score: {prediction.prediction.score}</p>
                      <p className="text-sm">Confiance: {prediction.confidence}%</p>
                    </Card>
                    
                    {prediction.actualResult ? (
                      <Card className="p-3">
                        <h4 className="text-sm font-medium mb-2">Résultat</h4>
                        <p className="text-sm">Gagnant: {prediction.actualResult.winner}</p>
                        <p className="text-sm">Score: {prediction.actualResult.score}</p>
                        <p className={`text-sm font-medium ${
                          prediction.status === 'won' ? 'text-gaming-green' : 'text-destructive'
                        }`}>
                          {prediction.points > 0 ? `+${prediction.points} pts` : '0 pts'}
                        </p>
                      </Card>
                    ) : (
                      <Card className="p-3">
                        <h4 className="text-sm font-medium mb-2">En attente</h4>
                        <p className="text-sm text-muted-foreground">Le match n'est pas encore terminé</p>
                      </Card>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>

      {/* See All Predictions Button */}
      <div className="px-4 mb-6">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/predictions')}
        >
          Voir toutes mes pronos
        </Button>
      </div>

      {/* My Leagues */}
      <div className="px-4 mb-6">
        <h2 className="font-semibold mb-4">Mes ligues</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {leagues.slice(0, 4).map((league) => {
            const status = getLeagueStatus(league);
            return (
              <div 
                key={league.id} 
                className="card-gaming text-center p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleLeagueClick(league.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      status === 'current' ? 'text-gaming-green border-gaming-green' :
                      status === 'upcoming' ? 'text-gaming-gold border-gaming-gold' :
                      'text-muted-foreground'
                    }`}
                  >
                    {status === 'current' ? 'En cours' : 
                     status === 'upcoming' ? 'À venir' : 'Terminé'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{league.short_name}</p>
                <p className="text-sm font-bold">Top 24</p>
                <p className="text-xs text-primary">
                  {league.start_date && league.end_date ? 
                    `Du ${new Date(league.start_date).toLocaleDateString('fr-FR')} au ${new Date(league.end_date).toLocaleDateString('fr-FR')}` :
                    'Dates à venir'
                  }
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* See All Leagues Button */}
      <div className="px-4 mb-6">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/leagues')}
        >
          Voir toutes mes ligues
        </Button>
      </div>

      {/* My Rewards */}
      <div className="px-4 mb-8">
        <h2 className="font-semibold mb-4">Mes Récompenses</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <Dialog key={reward.id}>
              <DialogTrigger asChild>
                <div className="text-center cursor-pointer hover:scale-105 transition-transform">
                  <div className={`w-12 h-12 bg-gradient-to-r ${reward.gradient} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                    <span className="text-white text-xl">{reward.icon}</span>
                  </div>
                  <p className="text-xs">{reward.name}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="card-gaming">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${reward.gradient} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-lg">{reward.icon}</span>
                    </div>
                    {reward.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Comment l'obtenir</h4>
                    <p className="text-sm text-muted-foreground">{reward.requirement}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Obtenu le</h4>
                    <p className="text-sm text-primary font-medium">{reward.dateEarned}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};