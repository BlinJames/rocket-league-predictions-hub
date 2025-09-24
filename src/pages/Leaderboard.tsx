import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: 'Julien D', username: 'Julien D', points: '1 16pt', avatar: 'J' },
    { rank: 2, name: 'Julien D', username: 'Julien D', points: '1 16pt', avatar: 'J' },
    { rank: 3, name: 'Julien D', username: 'Julien D', points: '1 16pt', avatar: 'J' },
    { rank: 11, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 12, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 13, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 14, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 15, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 16, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 17, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 18, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 19, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
    { rank: 20, name: 'Pascal R.', username: 'Pascal R.', points: '1 16pt', avatar: 'P' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Classement</h1>
          <Badge variant="secondary" className="text-xs">
            RLCS M1
          </Badge>
        </div>
      </header>

      {/* Podium */}
      <div className="px-4 py-6">
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <div className="text-center">
            <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-gray-400">
              <AvatarFallback className="bg-secondary font-bold">J</AvatarFallback>
            </Avatar>
            <div className="bg-gray-400 text-black text-xs font-bold px-2 py-1 rounded">2</div>
            <p className="text-xs mt-1">Julien D</p>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-2 border-2 border-gaming-gold">
              <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 font-bold text-white">J</AvatarFallback>
            </Avatar>
            <div className="bg-gaming-gold text-black text-sm font-bold px-3 py-1 rounded">1</div>
            <p className="text-sm mt-1 font-semibold">Julien D</p>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <Avatar className="w-12 h-12 mx-auto mb-2 border-2 border-orange-600">
              <AvatarFallback className="bg-secondary font-bold">J</AvatarFallback>
            </Avatar>
            <div className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">3</div>
            <p className="text-xs mt-1">Julien D</p>
          </div>
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
            <div 
              key={index} 
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
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
                  <AvatarFallback className={`font-bold text-sm ${
                    user.avatar === 'P' ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'
                  }`}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{user.name}</span>
              </div>
              <span className="text-sm font-bold">{user.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};