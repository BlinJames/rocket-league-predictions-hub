import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Team {
  id: string;
  name: string;
  short_name: string;
  color: string;
}

interface Match {
  id: string;
  scheduled_at: string;
  team_a_id: string;
  team_b_id: string;
  match_type: string;
  stage: string;
  status: string;
  team_a?: Team;
  team_b?: Team;
  tournaments?: {
    name: string;
  };
}

interface Prediction {
  id: string;
  predicted_winner_id: string;
  predicted_score_a: number;
  predicted_score_b: number;
}

interface MatchCardProps {
  match: Match;
  variant?: 'featured' | 'compact';
}

export const MatchCard = ({ match, variant = 'compact' }: MatchCardProps) => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingPrediction();
  }, [match.id]);

  const checkExistingPrediction = async () => {
    try {
      const userId = '00000000-0000-4000-8000-000000000000';
      
      const { data } = await supabase
        .from('predictions')
        .select('id, predicted_winner_id, predicted_score_a, predicted_score_b')
        .eq('user_id', userId)
        .eq('match_id', match.id)
        .maybeSingle();

      setPrediction(data);
    } catch (error) {
      console.error('Error checking prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWinnerName = () => {
    if (!prediction) return '';
    return prediction.predicted_winner_id === match.team_a_id ? 
           match.team_a?.name : match.team_b?.name;
  };

  const handleClick = () => {
    navigate(`/match/${match.id}`);
  };

  if (variant === 'featured') {
    return (
      <div className="card-match relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-gaming-blue to-gaming-green"></div>
        </div>
        
        <div className="relative z-10">
          {/* Match Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{new Date(match.scheduled_at).toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <Badge className="bg-primary text-primary-foreground text-xs">
              {match.match_type?.toUpperCase()}
            </Badge>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: match.team_a?.color || '#1e90ff' }}
              >
                <span className="text-white font-bold text-lg">
                  {match.team_a?.short_name || 'T1'}
                </span>
              </div>
              <h3 className="font-bold text-sm">{match.team_a?.name || 'Team 1'}</h3>
            </div>

            <div className="text-center px-4">
              <div className="text-2xl font-bold mb-1">VS</div>
            </div>

            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: match.team_b?.color || '#32cd32' }}
              >
                <span className="text-white font-bold text-lg">
                  {match.team_b?.short_name || 'T2'}
                </span>
              </div>
              <h3 className="font-bold text-sm">{match.team_b?.name || 'Team 2'}</h3>
            </div>
          </div>

          {/* Action Button */}
          {loading ? (
            <Button disabled className="w-full">
              Chargement...
            </Button>
          ) : prediction ? (
            <div className="space-y-2">
              <div className="bg-accent/20 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Votre pronostic</span>
                </div>
                <div className="text-primary font-semibold">
                  {getWinnerName()} ({prediction.predicted_score_a}-{prediction.predicted_score_b})
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleClick}
              >
                Modifier le prono
              </Button>
            </div>
          ) : (
            <Button className="btn-gaming-primary w-full" onClick={handleClick}>
              Faire un prono
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <Card className="card-gaming cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline" className="text-xs">
            {match.tournaments?.name || 'Tournament'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {match.match_type?.toUpperCase() || 'BO5'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                 style={{ backgroundColor: match.team_a?.color || '#1e90ff' }}>
              <span className="text-white font-bold text-sm">
                {match.team_a?.short_name || 'TA'}
              </span>
            </div>
            <p className="text-xs font-medium">{match.team_a?.name || 'Team A'}</p>
          </div>
          
          <div className="text-center px-4">
            <div className="text-2xl font-bold mb-1">VS</div>
            <p className="text-xs text-muted-foreground">
              {new Date(match.scheduled_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                 style={{ backgroundColor: match.team_b?.color || '#32cd32' }}>
              <span className="text-white font-bold text-sm">
                {match.team_b?.short_name || 'TB'}
              </span>
            </div>
            <p className="text-xs font-medium">{match.team_b?.name || 'Team B'}</p>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-xs text-muted-foreground">
            Chargement...
          </div>
        ) : prediction ? (
          <div className="bg-accent/20 p-2 rounded text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">Votre prono</span>
            </div>
            <div className="text-xs text-primary font-semibold">
              {getWinnerName()} ({prediction.predicted_score_a}-{prediction.predicted_score_b})
            </div>
          </div>
        ) : (
          <Button 
            className="btn-gaming-primary w-full" 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Faire un prono
          </Button>
        )}
      </div>
    </Card>
  );
};