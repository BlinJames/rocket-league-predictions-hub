import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Matches = () => {
  const navigate = useNavigate();

  const handleMakePrediction = () => {
    navigate('/match/1'); // Navigate to match details page
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Prochain match</h1>
          <Badge variant="secondary" className="text-xs">
            RLCS M1
          </Badge>
        </div>
      </header>

      {/* Current Match */}
      <div className="p-4">
        <div className="card-match mb-6 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-r from-gaming-blue to-gaming-green"></div>
          </div>
          
          <div className="relative z-10">
            {/* Match Info */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>14 SEPT 2024 - 20:00</span>
              </div>
              <Badge className="bg-red-500 text-white text-xs">BDS</Badge>
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

        {/* Match Details */}
        <div className="space-y-4">
          <div className="card-gaming">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded text-xs flex items-center justify-center font-bold text-black">
                  NiP
                </span>
                NiP vs BDS
              </span>
              <Badge variant="outline" className="text-xs">Grand Final</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Top Grand - NiP</p>
          </div>

          <div className="card-gaming">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded text-xs flex items-center justify-center font-bold text-black">
                  NiP
                </span>
                NiP vs BDS
              </span>
              <Badge variant="outline" className="text-xs text-primary">Playoffs</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Vainqueur match - NiP</p>
          </div>

          <div className="card-gaming">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded text-xs flex items-center justify-center font-bold text-black">
                  NiP
                </span>
                NiP vs BDS
              </span>
              <Badge variant="outline" className="text-xs">4 janvier</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Vainqueur match - BDS</p>
          </div>
        </div>

        {/* All Predictions Button */}
        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Voir toutes mes pronos
          </Button>
        </div>

        {/* Next Match Preview */}
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Prochain match à prono</h2>
          
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