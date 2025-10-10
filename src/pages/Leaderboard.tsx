import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Target, Zap, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LeagueOption {
  id: string;
  name: string;
  type: 'public' | 'private';
}

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_points: number;
  correct_predictions: number;
  total_predictions: number;
  current_streak: number;
}

export const Leaderboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const leagueFromQuery = searchParams.get('league');
  const typeFromQuery = searchParams.get('type') as 'public' | 'private' | null;

  const [leagueType, setLeagueType] = useState<'public' | 'private'>(typeFromQuery || 'public');
  const [publicLeagues, setPublicLeagues] = useState<LeagueOption[]>([]);
  const [privateLeagues, setPrivateLeagues] = useState<LeagueOption[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>(leagueFromQuery || '');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagues();
  }, []);

  // Handle query params
  useEffect(() => {
    if (leagueFromQuery && typeFromQuery) {
      setSelectedLeague(leagueFromQuery);
      setLeagueType(typeFromQuery);
    }
  }, [leagueFromQuery, typeFromQuery]);

  useEffect(() => {
    if (selectedLeague) {
      if (leagueType === 'public') {
        fetchPublicLeaderboard(selectedLeague);
      } else {
        fetchPrivateLeaderboard(selectedLeague);
      }
    }
  }, [selectedLeague, leagueType]);

  const fetchLeagues = async () => {
    try {
      // Fetch public leagues
      const { data: publicData, error: publicError } = await supabase
        .from('leagues')
        .select('id, name')
        .order('name');

      if (publicError) throw publicError;
      
      const publicLeagueOptions = (publicData || []).map(l => ({
        id: l.id,
        name: l.name,
        type: 'public' as const
      }));
      setPublicLeagues(publicLeagueOptions);

      // Fetch private leagues the user is member of
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: privateData, error: privateError } = await supabase
          .from('private_leagues')
          .select('id, name')
          .order('created_at', { ascending: false });

        if (privateError) throw privateError;
        
        const privateLeagueOptions = (privateData || []).map(l => ({
          id: l.id,
          name: l.name,
          type: 'private' as const
        }));
        setPrivateLeagues(privateLeagueOptions);
      }

      // Set initial selection
      if (publicLeagueOptions.length > 0) {
        setSelectedLeague(publicLeagueOptions[0].id);
      }
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicLeaderboard = async (leagueId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url, total_points, correct_predictions, total_predictions, current_streak')
        .order('total_points', { ascending: false })
        .limit(50);

      if (error) throw error;

      const leaderboardData = (data || []).map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching public leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivateLeaderboard = async (privateLeagueId: string) => {
    try {
      setLoading(true);
      
      // Get members of the private league
      const { data: members, error: membersError } = await supabase
        .from('private_league_members')
        .select('user_id')
        .eq('private_league_id', privateLeagueId);

      if (membersError) throw membersError;

      const userIds = (members || []).map(m => m.user_id);

      if (userIds.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Get profiles for these users
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url, total_points, correct_predictions, total_predictions, current_streak')
        .in('user_id', userIds)
        .order('total_points', { ascending: false });

      if (error) throw error;

      const leaderboardData = (data || []).map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching private leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const currentLeagues = leagueType === 'public' ? publicLeagues : privateLeagues;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for user details modal (to be replaced with real data)
  const leaderboardData = [
    { 
      rank: 1, 
      name: 'User',
      username: 'AlexRL_Pro', 
      points: 1247, 
      avatar: 'AM',
      winStreak: 8,
      correctPredictions: 45,
      totalPredictions: 52,
      rewards: ['Champion', 'Streak Master', 'Perfect Week'],
      recentMatches: [
        { opponent: 'G2 vs BDS', prediction: 'G2', result: 'correct' },
        { opponent: 'Vitality vs NRG', prediction: 'Vitality', result: 'correct' },
        { opponent: 'FURIA vs C9', prediction: 'FURIA', result: 'wrong' }
      ]
    },
    { 
      rank: 2, 
      name: 'Sarah Connor', 
      username: 'SarahPredict', 
      points: 1189, 
      avatar: 'SC',
      winStreak: 5,
      correctPredictions: 42,
      totalPredictions: 49,
      rewards: ['Analyst', 'Hot Streak'],
      recentMatches: [
        { opponent: 'Team Liquid vs Oxygen', prediction: 'Liquid', result: 'correct' },
        { opponent: 'GenG vs Karmine', prediction: 'GenG', result: 'correct' }
      ]
    },
    { 
      rank: 3, 
      name: 'Marcus Kim', 
      username: 'MKPredictor', 
      points: 1156, 
      avatar: 'MK',
      winStreak: 3,
      correctPredictions: 39,
      totalPredictions: 47,
      rewards: ['Bronze Medal', 'Consistent'],
      recentMatches: [
        { opponent: 'Falcons vs PWR', prediction: 'Falcons', result: 'correct' }
      ]
    },
    { 
      rank: 4, 
      name: 'Emma Wilson', 
      username: 'EmmaGamer', 
      points: 1098, 
      avatar: 'EW',
      winStreak: 2,
      correctPredictions: 37,
      totalPredictions: 45,
      rewards: ['Rookie Star'],
      recentMatches: []
    },
    { 
      rank: 5, 
      name: 'David López', 
      username: 'DavidRL', 
      points: 1045, 
      avatar: 'DL',
      winStreak: 1,
      correctPredictions: 35,
      totalPredictions: 43,
      rewards: ['Dedicated Fan'],
      recentMatches: []
    },
    { 
      rank: 6, 
      name: 'Luna Chen', 
      username: 'LunaChen', 
      points: 987, 
      avatar: 'LC',
      winStreak: 0,
      correctPredictions: 33,
      totalPredictions: 41,
      rewards: ['Early Bird'],
      recentMatches: []
    },
    { 
      rank: 7, 
      name: 'Ryan Taylor', 
      username: 'RyanT_RL', 
      points: 934, 
      avatar: 'RT',
      winStreak: 2,
      correctPredictions: 31,
      totalPredictions: 39,
      rewards: ['Team Spirit'],
      recentMatches: []
    },
    { 
      rank: 8, 
      name: 'Zoe Martin', 
      username: 'ZoeMartin', 
      points: 876, 
      avatar: 'ZM',
      winStreak: 1,
      correctPredictions: 29,
      totalPredictions: 37,
      rewards: ['Lucky Guess'],
      recentMatches: []
    },
    { 
      rank: 9, 
      name: 'James Rodriguez', 
      username: 'JamesRL99', 
      points: 823, 
      avatar: 'JR',
      winStreak: 3,
      correctPredictions: 27,
      totalPredictions: 35,
      rewards: ['Comeback King'],
      recentMatches: []
    },
    { 
      rank: 10, 
      name: 'Mia Johnson', 
      username: 'MiaJ_Pred', 
      points: 789, 
      avatar: 'MJ',
      winStreak: 0,
      correctPredictions: 25,
      totalPredictions: 33,
      rewards: ['Observer'],
      recentMatches: []
    },
    { 
      rank: 11, 
      name: 'Carlos Sanchez', 
      username: 'CarlosS', 
      points: 756, 
      avatar: 'CS',
      winStreak: 1,
      correctPredictions: 23,
      totalPredictions: 31,
      rewards: ['Loyal Fan'],
      recentMatches: []
    },
    { 
      rank: 12, 
      name: 'Julien Dupont', 
      username: 'JulienD', 
      points: 723, 
      avatar: 'JD',
      winStreak: 2,
      correctPredictions: 21,
      totalPredictions: 29,
      rewards: ['Participant', 'Weekend Warrior'],
      recentMatches: []
    },
    { 
      rank: 13, 
      name: 'Aria Patel', 
      username: 'AriaPatel', 
      points: 689, 
      avatar: 'AP',
      winStreak: 0,
      correctPredictions: 19,
      totalPredictions: 27,
      rewards: ['First Timer'],
      recentMatches: []
    },
    { 
      rank: 14, 
      name: 'Noah Anderson', 
      username: 'NoahA_RL', 
      points: 656, 
      avatar: 'NA',
      winStreak: 1,
      correctPredictions: 17,
      totalPredictions: 25,
      rewards: ['Beginner'],
      recentMatches: []
    },
    { 
      rank: 15, 
      name: 'Sophia Lee', 
      username: 'SophiaLee', 
      points: 623, 
      avatar: 'SL',
      winStreak: 0,
      correctPredictions: 15,
      totalPredictions: 23,
      rewards: ['Starter'],
      recentMatches: []
    },
    { 
      rank: 16, 
      name: 'Lucas Brown', 
      username: 'LucasB', 
      points: 590, 
      avatar: 'LB',
      winStreak: 1,
      correctPredictions: 13,
      totalPredictions: 21,
      rewards: ['Newcomer'],
      recentMatches: []
    },
    { 
      rank: 17, 
      name: 'Chloe Davis', 
      username: 'ChloeD', 
      points: 557, 
      avatar: 'CD',
      winStreak: 2,
      correctPredictions: 11,
      totalPredictions: 19,
      rewards: ['Explorer'],
      recentMatches: []
    },
    { 
      rank: 18, 
      name: 'Ethan Miller', 
      username: 'EthanM', 
      points: 524, 
      avatar: 'EM',
      winStreak: 0,
      correctPredictions: 9,
      totalPredictions: 17,
      rewards: ['Rookie'],
      recentMatches: []
    },
    { 
      rank: 19, 
      name: 'Isabella Garcia', 
      username: 'IsabellaG', 
      points: 491, 
      avatar: 'IG',
      winStreak: 1,
      correctPredictions: 7,
      totalPredictions: 15,
      rewards: ['First Steps'],
      recentMatches: []
    },
    { 
      rank: 20, 
      name: 'Oliver White', 
      username: 'OliverW', 
      points: 458, 
      avatar: 'OW',
      winStreak: 0,
      correctPredictions: 5,
      totalPredictions: 13,
      rewards: ['Apprentice'],
      recentMatches: []
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">Classement</h1>
        <p className="text-sm text-muted-foreground">Comparez vos performances</p>
      </header>

      {/* League Type Tabs */}
      <div className="px-4 pt-4">
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

      {/* League Selector */}
      <div className="px-4 py-4 border-b border-border">
        {currentLeagues.length > 0 ? (
          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ligue" />
            </SelectTrigger>
            <SelectContent>
              {currentLeagues.map((league) => (
                <SelectItem key={league.id} value={league.id}>
                  {league.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {leagueType === 'private' 
                ? 'Vous n\'avez rejoint aucune ligue privée'
                : 'Aucune ligue disponible'}
            </p>
          </div>
        )}
      </div>

      {/* Podium */}
      {leaderboard.length > 0 ? (
        <div className="px-4 py-6">
          <div className="flex items-end justify-center gap-4 mb-6">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-gray-400">
                  {topThree[1].avatar_url ? (
                    <AvatarImage src={topThree[1].avatar_url} />
                  ) : null}
                  <AvatarFallback className="bg-secondary font-bold">
                    {getUserInitials(topThree[1].display_name || topThree[1].username)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-400 text-black text-xs font-bold px-2 py-1 rounded">2</div>
                <p className="text-xs mt-1">{topThree[1].display_name || topThree[1].username}</p>
                <p className="text-xs text-muted-foreground">{topThree[1].total_points} pts</p>
              </div>
            )}
            
            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-gaming-gold">
                  {topThree[0].avatar_url ? (
                    <AvatarImage src={topThree[0].avatar_url} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">
                    {getUserInitials(topThree[0].display_name || topThree[0].username)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gaming-gold text-black text-sm font-bold px-3 py-1 rounded">1</div>
                <p className="text-sm mt-1 font-semibold">{topThree[0].display_name || topThree[0].username}</p>
                <p className="text-sm text-muted-foreground font-medium">{topThree[0].total_points} pts</p>
              </div>
            )}
            
            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-amber-700">
                  {topThree[2].avatar_url ? (
                    <AvatarImage src={topThree[2].avatar_url} />
                  ) : null}
                  <AvatarFallback className="bg-secondary font-bold">
                    {getUserInitials(topThree[2].display_name || topThree[2].username)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded">3</div>
                <p className="text-xs mt-1">{topThree[2].display_name || topThree[2].username}</p>
                <p className="text-xs text-muted-foreground">{topThree[2].total_points} pts</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">
            {leagueType === 'private' 
              ? 'Aucun membre dans cette ligue pour le moment'
              : 'Aucun classement disponible'}
          </p>
        </div>
      )}

      {/* Rest of Leaderboard */}
      {restOfLeaderboard.length > 0 && (
        <div className="px-4 pb-6">
          <div className="space-y-2">
            {restOfLeaderboard.map((entry) => (
              <div key={entry.user_id} className="card-gaming flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-bold w-6">{entry.rank}</span>
                  <Avatar className="w-10 h-10">
                    {entry.avatar_url ? (
                      <AvatarImage src={entry.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getUserInitials(entry.display_name || entry.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{entry.display_name || entry.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.correct_predictions}/{entry.total_predictions} correctes
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{entry.total_points}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};