import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Prediction {
  id: string;
  predicted_winner_id: string;
  predicted_score_a: number;
  predicted_score_b: number;
  points_earned: number;
  is_correct: boolean | null;
  created_at: string;
  match: {
    id: string;
    scheduled_at: string;
    stage: string;
    status: string;
    team_a_id: string;
    team_b_id: string;
    team_a: {
      name: string;
      short_name: string;
      color: string;
    };
    team_b: {
      name: string;
      short_name: string;
      color: string;
    };
    tournaments: {
      leagues: {
        short_name: string;
      };
    };
  };
}

export const Predictions = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    pending: 0,
    totalPoints: 0
  });

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      // TODO: Remplacer par l'ID utilisateur réel quand l'auth sera implémentée
      const userId = 'temp-user-id';
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          predicted_winner_id,
          predicted_score_a,
          predicted_score_b,
          points_earned,
          is_correct,
          created_at,
          matches!inner(
            id,
            scheduled_at,
            stage,
            status,
            team_a_id,
            team_b_id,
            team_a:teams!team_a_id(name, short_name, color),
            team_b:teams!team_b_id(name, short_name, color),
            tournaments!inner(
              leagues!inner(short_name)
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPredictions = data?.map(pred => ({
        ...pred,
        match: {
          ...pred.matches,
          tournaments: pred.matches.tournaments
        }
      })) || [];

      setPredictions(formattedPredictions);

      // Calculer les statistiques
      const total = formattedPredictions.length;
      const correct = formattedPredictions.filter(p => p.is_correct === true).length;
      const pending = formattedPredictions.filter(p => p.is_correct === null).length;
      const totalPoints = formattedPredictions.reduce((sum, p) => sum + (p.points_earned || 0), 0);

      setStats({ total, correct, pending, totalPoints });
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictedWinner = (prediction: Prediction) => {
    if (prediction.predicted_winner_id === prediction.match.team_a_id) {
      return prediction.match.team_a;
    }
    return prediction.match.team_b;
  };

  const getStatusIcon = (prediction: Prediction) => {
    if (prediction.is_correct === null) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return prediction.is_correct 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (prediction: Prediction) => {
    if (prediction.is_correct === null) return "En attente";
    return prediction.is_correct ? "Correct" : "Incorrect";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos pronostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Mes Pronostics</h1>
          <Badge variant="secondary" className="text-xs">
            {predictions.length} prono{predictions.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Points gagnés</div>
            </div>
          </Card>
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.correct}</div>
              <div className="text-xs text-muted-foreground">Pronostics corrects</div>
            </div>
          </Card>
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">En attente</div>
            </div>
          </Card>
          <Card className="card-gaming">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Taux de réussite</div>
            </div>
          </Card>
        </div>

        {/* Liste des pronostics */}
        <div>
          <h2 className="text-lg font-bold mb-4">Historique</h2>
          
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((prediction) => {
                const winner = getPredictedWinner(prediction);
                return (
                  <Card key={prediction.id} className="card-gaming">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {prediction.match.tournaments.leagues.short_name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {prediction.match.stage}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(prediction)}
                          <span className="text-xs text-muted-foreground">
                            {getStatusText(prediction)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: prediction.match.team_a.color }}
                            >
                              <span className="text-white font-bold text-xs">
                                {prediction.match.team_a.short_name}
                              </span>
                            </div>
                            <span className="text-sm">vs</span>
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: prediction.match.team_b.color }}
                            >
                              <span className="text-white font-bold text-xs">
                                {prediction.match.team_b.short_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {prediction.predicted_score_a} - {prediction.predicted_score_b}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Score prédit
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: winner.color }}
                          ></div>
                          <span>Prono: {winner.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {prediction.points_earned > 0 && (
                            <span className="text-green-500 font-medium">
                              +{prediction.points_earned} pts
                            </span>
                          )}
                          <span>
                            {new Date(prediction.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="card-gaming">
              <div className="p-8 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Aucun pronostic pour le moment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Commencez à faire vos premiers pronostics sur les matches !
                </p>
                <Button 
                  onClick={() => navigate('/leagues')} 
                  className="btn-gaming-primary"
                >
                  Voir les matches
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};