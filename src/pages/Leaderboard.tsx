import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Target, Zap, Award } from 'lucide-react';
import { useState } from 'react';

export const Leaderboard = () => {
  const [selectedLeague, setSelectedLeague] = useState('RLCS M1');
  
  const leagues = [
    'RLCS M1',
    'RLCS M2', 
    'World Championship',
    'Regional Championship'
  ];

  const leaderboardData = [
    { 
      rank: 1, 
      name: 'Alex Mendez', 
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
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Classement</h1>
          <Select value={selectedLeague} onValueChange={setSelectedLeague}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {leagues.map((league) => (
                <SelectItem key={league} value={league}>
                  {league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Podium */}
      <div className="px-4 py-6">
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-gray-400">
                  <AvatarFallback className="bg-secondary font-bold">{leaderboardData[1]?.avatar}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-400 text-black text-xs font-bold px-2 py-1 rounded">2</div>
                <p className="text-xs mt-1">{leaderboardData[1]?.name}</p>
              </div>
            </DialogTrigger>
            {leaderboardData[1] && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {leaderboardData[1].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{leaderboardData[1].name}</div>
                      <div className="text-sm text-muted-foreground">@{leaderboardData[1].username}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">{leaderboardData[1].points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{leaderboardData[1].correctPredictions}/{leaderboardData[1].totalPredictions}</div>
                        <div className="text-xs text-muted-foreground">Réussis</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">{leaderboardData[1].winStreak}</div>
                        <div className="text-xs text-muted-foreground">Série</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Award className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold">{leaderboardData[1].rewards.length}</div>
                        <div className="text-xs text-muted-foreground">Récompenses</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Matches */}
                  {leaderboardData[1].recentMatches.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Matchs récents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {leaderboardData[1].recentMatches.map((match, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex-1">{match.opponent}</span>
                            <span className="font-medium">{match.prediction}</span>
                            <Badge 
                              variant={match.result === 'correct' ? 'default' : 'destructive'}
                              className="ml-2 text-xs"
                            >
                              {match.result === 'correct' ? '✓' : '✗'}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rewards */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Récompenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {leaderboardData[1].rewards.map((reward, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            )}
          </Dialog>

          {/* 1st Place */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-gaming-gold">
                  <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">{leaderboardData[0]?.avatar}</AvatarFallback>
                </Avatar>
                <div className="bg-gaming-gold text-black text-sm font-bold px-3 py-1 rounded">1</div>
                <p className="text-sm mt-1 font-semibold">{leaderboardData[0]?.name}</p>
              </div>
            </DialogTrigger>
            {leaderboardData[0] && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {leaderboardData[0].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{leaderboardData[0].name}</div>
                      <div className="text-sm text-muted-foreground">@{leaderboardData[0].username}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">{leaderboardData[0].points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{leaderboardData[0].correctPredictions}/{leaderboardData[0].totalPredictions}</div>
                        <div className="text-xs text-muted-foreground">Réussis</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">{leaderboardData[0].winStreak}</div>
                        <div className="text-xs text-muted-foreground">Série</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Award className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold">{leaderboardData[0].rewards.length}</div>
                        <div className="text-xs text-muted-foreground">Récompenses</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Matches */}
                  {leaderboardData[0].recentMatches.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Matchs récents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {leaderboardData[0].recentMatches.map((match, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex-1">{match.opponent}</span>
                            <span className="font-medium">{match.prediction}</span>
                            <Badge 
                              variant={match.result === 'correct' ? 'default' : 'destructive'}
                              className="ml-2 text-xs"
                            >
                              {match.result === 'correct' ? '✓' : '✗'}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rewards */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Récompenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {leaderboardData[0].rewards.map((reward, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            )}
          </Dialog>

          {/* 3rd Place */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-orange-600">
                  <AvatarFallback className="bg-secondary font-bold">{leaderboardData[2]?.avatar}</AvatarFallback>
                </Avatar>
                <div className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">3</div>
                <p className="text-xs mt-1">{leaderboardData[2]?.name}</p>
              </div>
            </DialogTrigger>
            {leaderboardData[2] && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {leaderboardData[2].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{leaderboardData[2].name}</div>
                      <div className="text-sm text-muted-foreground">@{leaderboardData[2].username}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">{leaderboardData[2].points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{leaderboardData[2].correctPredictions}/{leaderboardData[2].totalPredictions}</div>
                        <div className="text-xs text-muted-foreground">Réussis</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">{leaderboardData[2].winStreak}</div>
                        <div className="text-xs text-muted-foreground">Série</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Award className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold">{leaderboardData[2].rewards.length}</div>
                        <div className="text-xs text-muted-foreground">Récompenses</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Matches */}
                  {leaderboardData[2].recentMatches.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Matchs récents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {leaderboardData[2].recentMatches.map((match, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex-1">{match.opponent}</span>
                            <span className="font-medium">{match.prediction}</span>
                            <Badge 
                              variant={match.result === 'correct' ? 'default' : 'destructive'}
                              className="ml-2 text-xs"
                            >
                              {match.result === 'correct' ? '✓' : '✗'}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rewards */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Récompenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {leaderboardData[2].rewards.map((reward, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>

        {/* Current User Highlight */}
        <div className="bg-primary/20 border-2 border-primary rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold">12e</span>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">J</AvatarFallback>
              </Avatar>
              <span className="font-semibold">Julien D</span>
            </div>
            <span className="text-sm font-bold">134</span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="px-4">
        <div className="space-y-2">
          {leaderboardData.map((user, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div 
                  className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:bg-accent/30 transition-colors ${
                    user.rank <= 3 ? 'bg-accent/50' : 'bg-card/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold text-sm ${
                      user.rank <= 3 ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {user.rank}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold">{user.points}</span>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="text-lg font-bold">{user.points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <div className="text-lg font-bold">{user.correctPredictions}/{user.totalPredictions}</div>
                        <div className="text-xs text-muted-foreground">Réussis</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-lg font-bold">{user.winStreak}</div>
                        <div className="text-xs text-muted-foreground">Série</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-3 text-center">
                        <Award className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-lg font-bold">{user.rewards.length}</div>
                        <div className="text-xs text-muted-foreground">Récompenses</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Matches */}
                  {user.recentMatches.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Matchs récents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {user.recentMatches.map((match, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="flex-1">{match.opponent}</span>
                            <span className="font-medium">{match.prediction}</span>
                            <Badge 
                              variant={match.result === 'correct' ? 'default' : 'destructive'}
                              className="ml-2 text-xs"
                            >
                              {match.result === 'correct' ? '✓' : '✗'}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Rewards */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Récompenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {user.rewards.map((reward, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};