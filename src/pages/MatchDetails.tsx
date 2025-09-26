import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Trophy, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Schema de validation pour les scores
const scoreSchema = z.object({
  teamAScore: z.number().min(0).max(7),
  teamBScore: z.number().min(0).max(7),
}).refine((data) => {
  // Validation personnalisée selon le format du match
  return true; // On validera plus tard selon BO5/BO7
});

// Type pour les données du match
interface MatchData {
  id: string;
  teamA: { name: string; shortName: string; color: string };
  teamB: { name: string; shortName: string; color: string };
  matchType: 'bo5' | 'bo7';
  scheduledAt: string;
  tournament: string;
  stage: string;
}

export const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTeam, setSelectedTeam] = useState<'teamA' | 'teamB' | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [teamAScore, setTeamAScore] = useState<number>(0);
  const [teamBScore, setTeamBScore] = useState<number>(0);
  const [scoreErrors, setScoreErrors] = useState<string[]>([]);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Récupérer les données du match depuis Supabase
  useEffect(() => {
    if (!id) return;
    
    const fetchMatchData = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id,
            scheduled_at,
            match_type,
            stage,
            tournaments!inner(name, leagues!inner(short_name)),
            team_a:teams!team_a_id(name, short_name, color),
            team_b:teams!team_b_id(name, short_name, color)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setMatchData({
            id: data.id,
            teamA: {
              name: data.team_a?.name || 'Team A',
              shortName: data.team_a?.short_name || 'TA',
              color: data.team_a?.color || '#1e90ff'
            },
            teamB: {
              name: data.team_b?.name || 'Team B',
              shortName: data.team_b?.short_name || 'TB',
              color: data.team_b?.color || '#32cd32'
            },
            matchType: data.match_type as 'bo5' | 'bo7',
            scheduledAt: data.scheduled_at,
            tournament: data.tournaments?.leagues?.short_name || 'Tournament',
            stage: data.stage || 'Match'
          });
        }
      } catch (error) {
        console.error('Error fetching match data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du match",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [id, toast]);

  const validateScore = (scoreA: number, scoreB: number): string[] => {
    const errors: string[] = [];
    if (!matchData) return errors;
    
    const maxWins = matchData.matchType === 'bo5' ? 3 : 4;
    const maxScore = maxWins;
    
    if (scoreA < 0 || scoreB < 0) {
      errors.push('Les scores ne peuvent pas être négatifs');
    }
    
    if (scoreA > maxScore || scoreB > maxScore) {
      errors.push(`Score maximum pour un ${matchData.matchType.toUpperCase()}: ${maxScore}`);
    }
    
    // Un des deux scores doit être le score gagnant
    if (scoreA !== maxScore && scoreB !== maxScore) {
      errors.push(`Un des scores doit être ${maxScore} pour gagner en ${matchData.matchType.toUpperCase()}`);
    }
    
    // Les deux ne peuvent pas avoir le score gagnant
    if (scoreA === maxScore && scoreB === maxScore) {
      errors.push('Les deux équipes ne peuvent pas avoir le score gagnant');
    }
    
    // Vérifier que le perdant n'a pas un score trop élevé
    if (scoreA === maxScore && scoreB >= maxScore) {
      errors.push(`Si ${matchData.teamA.shortName} gagne ${maxScore}, ${matchData.teamB.shortName} doit avoir moins de ${maxScore}`);
    }
    if (scoreB === maxScore && scoreA >= maxScore) {
      errors.push(`Si ${matchData.teamB.shortName} gagne ${maxScore}, ${matchData.teamA.shortName} doit avoir moins de ${maxScore}`);
    }
    
    return errors;
  };

  const handleScoreChange = (team: 'A' | 'B', value: string) => {
    const numValue = parseInt(value) || 0;
    if (team === 'A') {
      setTeamAScore(numValue);
      setScoreErrors(validateScore(numValue, teamBScore));
    } else {
      setTeamBScore(numValue);
      setScoreErrors(validateScore(teamAScore, numValue));
    }
  };

  const handlePredictionSubmit = () => {
    if (!matchData || !selectedTeam) return;
    
    const errors = validateScore(teamAScore, teamBScore);
    if (errors.length > 0) {
      setScoreErrors(errors);
      return;
    }
    
    setIsConfirmDialogOpen(false);
    setIsSuccessDialogOpen(true);
    
    const winnerName = selectedTeam === 'teamA' ? matchData.teamA.name : matchData.teamB.name;
    toast({
      title: "Pronostic enregistré !",
      description: `Vous avez parié sur ${winnerName} avec le score ${teamAScore}-${teamBScore}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Match non trouvé</p>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">{matchData.tournament}</Badge>
              <Badge variant="outline" className="text-xs">{matchData.matchType.toUpperCase()}</Badge>
            </div>
          </div>
          <p className="text-sm opacity-80">{new Date(matchData.scheduledAt).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </header>

        {/* Teams Match */}
        <div className="px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedTeam(selectedTeam === 'teamA' ? null : 'teamA')}
              className={`text-center transition-all duration-200 ${
                selectedTeam === 'teamA' ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-transparent" 
                   style={{ backgroundColor: matchData.teamA.color }}>
                <span className="text-white font-bold text-xl">{matchData.teamA.shortName}</span>
              </div>
              <h3 className="font-bold text-white">{matchData.teamA.name}</h3>
            </button>

            <div className="text-center px-6">
              <div className="text-3xl font-bold text-white mb-2">VS</div>
            </div>

            <button
              onClick={() => setSelectedTeam(selectedTeam === 'teamB' ? null : 'teamB')}
              className={`text-center transition-all duration-200 ${
                selectedTeam === 'teamB' ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-transparent"
                   style={{ backgroundColor: matchData.teamB.color }}>
                <span className="text-white font-bold text-xl">{matchData.teamB.shortName}</span>
              </div>
              <h3 className="font-bold text-white">{matchData.teamB.name}</h3>
            </button>
          </div>

          {/* Selection Indicator */}
          {selectedTeam && (
            <div className="text-center mb-6">
              <p className="text-white text-sm opacity-80">
                Équipe sélectionnée: {selectedTeam === 'teamA' ? matchData.teamA.name : matchData.teamB.name}
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
                  Prédisez le vainqueur et le score final pour ce match {matchData.matchType.toUpperCase()}.
                </DialogDescription>
              </DialogHeader>
              
              {/* Score Input Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-4 bg-accent/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                       style={{ backgroundColor: selectedTeam === 'teamA' ? matchData.teamA.color : matchData.teamB.color }}>
                    <span className="text-white font-bold text-sm">
                      {selectedTeam === 'teamA' ? matchData.teamA.shortName : matchData.teamB.shortName}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedTeam === 'teamA' ? matchData.teamA.name : matchData.teamB.name}</p>
                    <p className="text-sm text-muted-foreground">{matchData.tournament} - {matchData.matchType.toUpperCase()}</p>
                  </div>
                </div>

                {/* Score Inputs */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Score final prédit</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="teamAScore" className="text-xs text-muted-foreground">{matchData.teamA.shortName}</Label>
                      <Input
                        id="teamAScore"
                        type="number"
                        min="0"
                        max={matchData.matchType === 'bo5' ? '3' : '4'}
                        value={teamAScore}
                        onChange={(e) => handleScoreChange('A', e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <span className="text-muted-foreground font-bold">-</span>
                    <div className="flex-1">
                      <Label htmlFor="teamBScore" className="text-xs text-muted-foreground">{matchData.teamB.shortName}</Label>
                      <Input
                        id="teamBScore"
                        type="number"
                        min="0"
                        max={matchData.matchType === 'bo5' ? '3' : '4'}
                        value={teamBScore}
                        onChange={(e) => handleScoreChange('B', e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {matchData.matchType === 'bo5' ? 'Premier à 3 victoires' : 'Premier à 4 victoires'}
                  </p>
                </div>

                {/* Score Validation Errors */}
                {scoreErrors.length > 0 && (
                  <div className="space-y-2">
                    {scoreErrors.map((error, index) => (
                      <div key={index} className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handlePredictionSubmit} 
                  className="btn-gaming-primary"
                  disabled={scoreErrors.length > 0 || !selectedTeam}
                >
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
                Votre pronostic sur <strong>{selectedTeam === 'teamA' ? matchData.teamA.name : matchData.teamB.name}</strong> a été enregistré avec succès.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Match</span>
                    <span className="font-medium">{matchData.teamA.name} vs {matchData.teamB.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Votre prono</span>
                    <span className="font-medium text-primary">{selectedTeam === 'teamA' ? matchData.teamA.name : matchData.teamB.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Score prédit</span>
                    <span className="font-bold text-gaming-gold">{teamAScore} - {teamBScore}</span>
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