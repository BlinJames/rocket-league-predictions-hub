import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CheckCircle, Trophy } from 'lucide-react';

export const MatchDetails = () => {
  const [selectedTeam, setSelectedTeam] = useState<'karmine' | 'falcon' | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const { toast } = useToast();

  const handlePredictionSubmit = () => {
    setIsConfirmDialogOpen(false);
    setIsSuccessDialogOpen(true);
    toast({
      title: "Pronostic enregistré !",
      description: `Vous avez parié sur ${selectedTeam === 'karmine' ? 'Karmine Corp' : 'Team Falcons'}`,
    });
  };

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
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className={`btn-gaming-primary w-full transition-all duration-200 ${
                  selectedTeam ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                }`}
                disabled={!selectedTeam}
              >
                Faire un prono
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Confirmer votre pronostic
                </DialogTitle>
                <DialogDescription>
                  Vous êtes sur le point de parier sur <strong>{selectedTeam === 'karmine' ? 'Karmine Corp' : 'Team Falcons'}</strong> pour remporter ce match.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 p-4 bg-accent/20 rounded-lg">
                <div className={`w-8 h-8 ${selectedTeam === 'karmine' ? 'bg-gaming-blue' : 'bg-gaming-green'} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">
                    {selectedTeam === 'karmine' ? 'KC' : 'F'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedTeam === 'karmine' ? 'Karmine Corp' : 'Team Falcons'}</p>
                  <p className="text-sm text-muted-foreground">RLCS M1 - 14 Sept 2024</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handlePredictionSubmit} className="btn-gaming-primary">
                  Confirmer le prono
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

        {/* Validate Prediction Dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <DialogTitle className="text-green-500">Prono validé chef !</DialogTitle>
              <DialogDescription>
                Votre pronostic sur <strong>{selectedTeam === 'karmine' ? 'Karmine Corp' : 'Team Falcons'}</strong> a été enregistré avec succès.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-accent/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Match</span>
                  <span className="font-medium">Karmine Corp vs Team Falcons</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Votre prono</span>
                  <span className="font-medium text-primary">{selectedTeam === 'karmine' ? 'Karmine Corp' : 'Team Falcons'}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Points potentiels</span>
                  <span className="font-bold text-gaming-gold">+150 pts</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSuccessDialogOpen(false)} className="w-full btn-gaming-primary">
                Super !
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};