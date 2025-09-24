import { Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              J
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold">Julien D.</h1>
            <p className="text-xs text-muted-foreground">@juliend234</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-gaming flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Team Falcons vs Karmine Corp</p>
                  <p className="text-xs text-muted-foreground">14 Sept World Lyon</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">Gagnant</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* See All Predictions Button */}
      <div className="px-4 mb-6">
        <Button variant="outline" className="w-full">
          Voir toutes mes pronos
        </Button>
      </div>

      {/* My Leagues */}
      <div className="px-4 mb-6">
        <h2 className="font-semibold mb-4">Mes ligues</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="card-gaming text-center p-3">
            <p className="text-xs text-muted-foreground mb-1">RLCS Major 1 New York</p>
            <p className="text-sm font-bold">Top 24</p>
            <p className="text-xs text-primary">Du 7 au 7 décembre 2025</p>
          </div>
          <div className="card-gaming text-center p-3">
            <p className="text-xs text-muted-foreground mb-1">RLCS World Lyon</p>
            <p className="text-sm font-bold">Top 34</p>
            <p className="text-xs text-primary">Du 10 au 15 septembre 2025</p>
          </div>
        </div>
      </div>

      {/* See All Leagues Button */}
      <div className="px-4 mb-6">
        <Button variant="outline" className="w-full">
          Voir toutes mes ligues
        </Button>
      </div>

      {/* My Rewards */}
      <div className="px-4 mb-8">
        <h2 className="font-semibold mb-4">Mes Récompenses</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <p className="text-xs">Premier pas</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xl">⭐</span>
            </div>
            <p className="text-xs">Série en or</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xl">👑</span>
            </div>
            <p className="text-xs">Top 10 ligue</p>
          </div>
        </div>
      </div>
    </div>
  );
};