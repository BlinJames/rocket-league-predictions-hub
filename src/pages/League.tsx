import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Globe, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MatchCard } from '@/components/MatchCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

interface League {
  id: string;
  name: string;
  short_name: string;
  status: string;
}

interface PrivateLeague {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  based_on_league_id: string;
  created_at: string;
  leagues?: {
    name: string;
    short_name: string;
  };
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

const formSchema = z.object({
  leagueName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(50, 'Le nom doit contenir maximum 50 caractères'),
  basedOnLeague: z.string().min(1, 'Veuillez sélectionner une ligue'),
});

export const League = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [privateLeagues, setPrivateLeagues] = useState<PrivateLeague[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [leagueType, setLeagueType] = useState<'public' | 'private'>('public');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leagueName: '',
      basedOnLeague: '',
    },
  });

  // Get league from query params
  const searchParams = new URLSearchParams(location.search);
  const leagueFromQuery = searchParams.get('league');

  const handleMakePrediction = (matchId: string) => {
    navigate(`/match/${matchId}`);
  };

  useEffect(() => {
    fetchLeagues();
    fetchPrivateLeagues();
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

  const fetchPrivateLeagues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('private_leagues')
        .select(`
          id,
          name,
          invite_code,
          created_by,
          based_on_league_id,
          created_at,
          leagues(name, short_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPrivateLeagues(data || []);
    } catch (error) {
      console.error('Error fetching private leagues:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour créer une ligue');
        return;
      }

      // Generate invite code
      const { data: inviteCodeData, error: inviteError } = await supabase
        .rpc('generate_invite_code');
      
      if (inviteError) throw inviteError;

      const { data, error } = await supabase
        .from('private_leagues')
        .insert({
          name: values.leagueName,
          based_on_league_id: values.basedOnLeague,
          created_by: user.id,
          invite_code: inviteCodeData,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Ligue créée avec succès !');
      setCreatedInviteCode(data.invite_code);
      fetchPrivateLeagues();
      form.reset();
    } catch (error) {
      console.error('Error creating private league:', error);
      toast.error('Erreur lors de la création de la ligue');
    }
  };

  const handleJoinLeague = async () => {
    if (!joinCode.trim()) {
      toast.error('Veuillez entrer un code d\'invitation');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour rejoindre une ligue');
        return;
      }

      // Find the league with this invite code
      const { data: leagueData, error: leagueError } = await supabase
        .from('private_leagues')
        .select('id')
        .eq('invite_code', joinCode.toUpperCase())
        .single();

      if (leagueError || !leagueData) {
        toast.error('Code d\'invitation invalide');
        return;
      }

      // Add user to the league
      const { error: memberError } = await supabase
        .from('private_league_members')
        .insert({
          private_league_id: leagueData.id,
          user_id: user.id,
        });

      if (memberError) {
        if (memberError.code === '23505') {
          toast.error('Vous êtes déjà membre de cette ligue');
        } else {
          throw memberError;
        }
        return;
      }

      toast.success('Vous avez rejoint la ligue !');
      setJoinCode('');
      fetchPrivateLeagues();
    } catch (error) {
      console.error('Error joining league:', error);
      toast.error('Erreur lors de la tentative de rejoindre la ligue');
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copié !');
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
        <h1 className="text-xl font-bold">Ligues</h1>
        <p className="text-sm text-muted-foreground">Rejoignez la compétition</p>
      </header>

      {/* Create League Button & Join */}
      <div className="p-4 space-y-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-black font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Créer une ligue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une ligue privée</DialogTitle>
              <DialogDescription>
                Créez votre propre ligue basée sur une compétition officielle
              </DialogDescription>
            </DialogHeader>
            {createdInviteCode ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Votre ligue a été créée !</p>
                  <p className="text-sm font-medium">Code d'invitation :</p>
                  <div className="flex items-center gap-2">
                    <Input value={createdInviteCode} readOnly className="text-center text-lg font-bold" />
                    <Button size="icon" variant="outline" onClick={() => copyInviteCode(createdInviteCode)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Partagez ce code avec vos amis</p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setCreatedInviteCode(null);
                    setDialogOpen(false);
                    setLeagueType('private');
                  }}
                >
                  Voir ma ligue
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="basedOnLeague"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ligue officielle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une ligue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leagues.map((league) => (
                              <SelectItem key={league.id} value={league.id}>
                                {league.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leagueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la ligue</FormLabel>
                        <FormControl>
                          <Input placeholder="Ma ligue entre amis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Créer la ligue
                  </Button>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Join League Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher une ligue..."
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="uppercase"
          />
          <Button variant="outline" onClick={handleJoinLeague}>
            Rejoindre
          </Button>
        </div>
      </div>

      {/* League Type Tabs */}
      <div className="px-4 pb-4">
        <Tabs value={leagueType} onValueChange={(v) => setLeagueType(v as 'public' | 'private')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Publiques
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mes ligues ({privateLeagues.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {leagueType === 'public' ? (
        <>
          {/* League Selector */}
          <div className="px-4 pb-4 border-b border-border">
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
        </>
      ) : (
        /* Private Leagues */
        <div className="p-4">
          {privateLeagues.length > 0 ? (
            <div className="space-y-4">
              {privateLeagues.map((league) => (
                <div key={league.id} className="card-gaming">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{league.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Basée sur {league.leagues?.name || 'N/A'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {league.leagues?.short_name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      value={league.invite_code}
                      readOnly
                      className="text-center font-mono text-sm"
                    />
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => copyInviteCode(league.invite_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => {
                      setSelectedLeague(league.based_on_league_id);
                      setLeagueType('public');
                    }}
                  >
                    Voir les matchs
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Aucune ligue privée</p>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre propre ligue ou rejoignez-en une avec un code d'invitation
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première ligue
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};