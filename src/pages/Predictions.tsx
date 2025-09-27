import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Clock, XCircle, Trophy, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Match {
  id: string;
  scheduled_at: string;
  match_type: string;
  stage: string;
  status: string;
  team_a: { name: string; short_name: string; color: string };
  team_b: { name: string; short_name: string; color: string };
  tournaments: { name: string; leagues: { short_name: string } };
}

interface Prediction {
  id: string;
  predicted_winner_id: string;
  predicted_score_a: number;
  predicted_score_b: number;
  created_at: string;
  updated_at: string;
  is_correct: boolean | null;
  points_earned: number;
  match: Match;
}

export const Predictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const userId = '00000000-0000-4000-8000-000000000000';
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          predicted_winner_id,
          predicted_score_a,
          predicted_score_b,
          created_at,
          updated_at,
          is_correct,
          points_earned,
          match:matches(
            id,
            scheduled_at,
            match_type,
            stage,
            status,
            team_a:teams!team_a_id(name, short_name, color),
            team_b:teams!team_b_id(name, short_name, color),
            tournaments!inner(name, leagues!inner(short_name))
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(prediction => {
    if (filter === 'pending') return prediction.is_correct === null;
    if (filter === 'completed') return prediction.is_correct !== null;
    return true;
  });

  const getPredictionStatus = (prediction: Prediction) => {
    if (prediction.is_correct === null) {
      const matchTime = new Date(prediction.match.scheduled_at);
      const now = new Date();
      return matchTime > now ? 'pending' : 'waiting';
    }
    return prediction.is_correct ? 'correct' : 'incorrect';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'incorrect':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'correct':
        return 'Correct';
      case 'incorrect':
        return 'Incorrect';
      case 'pending':
        return 'En attente';
      case 'waiting':
        return 'Match terminé';
      default:
        return 'En cours';
    }
  };

  const getWinnerName = (prediction: Prediction) => {
    return prediction.predicted_winner_id === prediction.match.team_a.name ? 
           prediction.match.team_a.name : prediction.match.team_b.name;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des pronostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Mes Pronostics</h1>
          <Badge variant="secondary" className="text-xs">
            {predictions.length} prono{predictions.length > 1 ? 's' : ''}
          </Badge>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            Tous
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
            className="text-xs"
          >
            En attente
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="text-xs"
          >
            Terminés
          </Button>
        </div>
      </header>

      <div className="p-4">
        {filteredPredictions.length === 0 ? (
          <Card className="card-gaming">
            <div className="p-6 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {filter === 'all' ? 'Aucun pronostic pour le moment' : 
                 filter === 'pending' ? 'Aucun pronostic en attente' : 
                 'Aucun pronostic terminé'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPredictions.map((prediction) => {
              const status = getPredictionStatus(prediction);
              return (
                <Card 
                  key={prediction.id}
                  className="card-gaming cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium">{getStatusText(status)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {prediction.match.tournaments?.leagues?.short_name}
                        </Badge>
                        {prediction.points_earned > 0 && (
                          <Badge className="bg-gaming-gold text-black text-xs">
                            +{prediction.points_earned} pts
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">
                        {prediction.match.team_a.name} vs {prediction.match.team_b.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {prediction.match.match_type.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">
                        Prono: {getWinnerName(prediction)} ({prediction.predicted_score_a}-{prediction.predicted_score_b})
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(prediction.match.scheduled_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Prediction Details Dialog */}
      <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          {selectedPrediction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Détails du pronostic
                </DialogTitle>
                <DialogDescription>
                  {selectedPrediction.match.team_a.name} vs {selectedPrediction.match.team_b.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Match</span>
                    <span className="font-medium">{selectedPrediction.match.tournaments?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date(selectedPrediction.match.scheduled_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Votre prono</span>
                    <span className="font-medium text-primary">
                      {getWinnerName(selectedPrediction)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score prédit</span>
                    <span className="font-bold text-gaming-gold">
                      {selectedPrediction.predicted_score_a} - {selectedPrediction.predicted_score_b}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(getPredictionStatus(selectedPrediction))}
                      <span className="font-medium">
                        {getStatusText(getPredictionStatus(selectedPrediction))}
                      </span>
                    </div>
                  </div>
                  {selectedPrediction.points_earned > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Points gagnés</span>
                      <span className="font-bold text-gaming-gold">
                        +{selectedPrediction.points_earned} pts
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Pronostic fait le {new Date(selectedPrediction.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {selectedPrediction.updated_at !== selectedPrediction.created_at && (
                    <div className="text-xs text-muted-foreground">
                      Modifié le {new Date(selectedPrediction.updated_at).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};