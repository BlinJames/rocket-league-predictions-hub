import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Home = () => {
  console.log("Home component is rendering");
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="text-white">
          <h1 className="text-2xl font-bold">RLCS WORLD LYON</h1>
          <p className="text-sm opacity-80">12 Sept 2023 - 17h30</p>
          <p className="text-xs opacity-70 flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            750k viewers
          </p>
          <p className="text-xs opacity-70 mt-1">Temps restant: 09:12:23</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings size={24} />
        </Button>
      </header>

      {/* Join League Button */}
      <div className="px-4 mt-6">
        <Button className="btn-gaming-primary w-full">
          Rejoindre la Ligue
        </Button>
      </div>

      {/* My Leagues Section */}
      <div className="px-4 mt-8">
        <h2 className="text-white font-semibold mb-4">Mes ligues</h2>
        
        <div className="space-y-3">
          <div className="card-gaming flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm">RLCS Major 1 New York</h3>
              <p className="text-xs text-muted-foreground">Du 5 au 7 décembre 2025</p>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">4 wins</span>
          </div>

          <div className="card-gaming flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm">RLCS Major 2 Paris</h3>
              <p className="text-xs text-muted-foreground">Du 10 au 14 mai 2026</p>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">6 wins</span>
          </div>
        </div>
      </div>

      {/* All Leagues Button */}
      <div className="px-4 mt-6">
        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
          Voir toutes les ligues
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
};