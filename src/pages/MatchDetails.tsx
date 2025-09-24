import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const MatchDetails = () => {
  const [selectedTeam, setSelectedTeam] = useState<'karmine' | 'falcon' | null>(null);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-gaming-blue via-transparent to-gaming-green"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">Prochain match</h1>
            <span className="text-sm opacity-80">RLCS M1</span>
          </div>
          <p className="text-sm opacity-80">14 SEPT 2024 - 20:00</p>
          <p className="text-xs opacity-60">BDS</p>
        </header>

        {/* Teams Match */}
        <div className="px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedTeam(selectedTeam === 'karmine' ? null : 'karmine')}
              className={`text-center transition-all duration-200 ${
                selectedTeam === 'karmine' ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
            >
              <div className="w-20 h-20 bg-gaming-blue rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-transparent">
                <span className="text-white font-bold text-xl">KC</span>
              </div>
              <h3 className="font-bold text-white">Karmine Corp</h3>
            </button>

            <div className="text-center px-6">
              <div className="text-3xl font-bold text-white mb-2">VS</div>
            </div>

            <button
              onClick={() => setSelectedTeam(selectedTeam === 'falcon' ? null : 'falcon')}
              className={`text-center transition-all duration-200 ${
                selectedTeam === 'falcon' ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
            >
              <div className="w-20 h-20 bg-gaming-green rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-transparent">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h3 className="font-bold text-white">Falcon</h3>
            </button>
          </div>

          {/* Selection Indicator */}
          {selectedTeam && (
            <div className="text-center mb-6">
              <p className="text-white text-sm opacity-80">
                Équipe sélectionnée: {selectedTeam === 'karmine' ? 'Karmine Corp' : 'Falcon'}
              </p>
            </div>
          )}

          {/* Bet Button */}
          <Button 
            className={`btn-gaming-primary w-full transition-all duration-200 ${
              selectedTeam ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
            }`}
            disabled={!selectedTeam}
          >
            Faire un prono
          </Button>
        </div>

        {/* Match Stats */}
        <div className="px-4">
          <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-1">0</div>
                <div className="text-sm opacity-80">Score</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">0</div>
                <div className="text-sm opacity-80">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Validate Prediction Button */}
        <div className="px-4 mt-6">
          <Button 
            className="btn-gaming-primary w-full"
            disabled={!selectedTeam}
          >
            Valider mon prono
          </Button>
        </div>

        {/* Success Message */}
        <div className="px-4 mt-8">
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
            <h3 className="text-white font-bold mb-2">Prono validé chef !</h3>
            <p className="text-green-400 text-sm">
              Votre pronostic a été enregistré avec succès
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};