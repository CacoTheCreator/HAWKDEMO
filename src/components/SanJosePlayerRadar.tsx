import React from 'react';
import { SanJoseJugador } from '@/types/jugador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, User, MapPin, DollarSign, Flag, Target, BarChart3, Star } from 'lucide-react';

interface SanJosePlayerRadarProps {
  jugador: SanJoseJugador;
}

const SanJosePlayerRadar: React.FC<SanJosePlayerRadarProps> = ({ jugador }) => {
  // Métricas específicas para mostrar en el radar
  const metricasRadar = [
    { key: 'Pases progresivos/90', value: jugador['Pases progresivos/90'], score: jugador['Pases progresivos/90_score'] },
    { key: 'Carreras en progresión/90', value: jugador['Carreras en progresión/90'], score: jugador['Carreras en progresión/90_score'] },
    { key: 'Pases en el último tercio/90', value: jugador['Pases en el último tercio/90'], score: jugador['Pases en el último tercio/90_score'] },
    { key: 'Remates/90', value: jugador['Remates/90'], score: jugador['Remates/90_score'] },
    { key: 'xG/90', value: jugador['xG/90'], score: jugador['xG/90_score'] },
    { key: 'Acciones defensivas realizadas/90', value: jugador['Acciones defensivas realizadas/90'], score: jugador['Acciones defensivas realizadas/90_score'] },
    { key: 'Duelos defensivos/90', value: jugador['Duelos defensivos/90'], score: jugador['Duelos defensivos/90_score'] },
    { key: 'Duelos/90', value: jugador['Duelos/90'], score: jugador['Duelos/90_score'] },
    { key: 'Faltas recibidas/90', value: jugador['Faltas recibidas/90'], score: jugador['Faltas recibidas/90_score'] }
  ];

  const getPositionColor = (posicion: string) => {
    const colors: Record<string, string> = {
      'Delantero': 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/30',
      'Extremo': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400/30',
      'Mediapunta': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400/30',
      'Mediocentro': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400/30',
      'Mediocentro Defensivo': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400/30',
      'Lateral': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400/30',
      'Defensa': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-400/30',
      'Arquero': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/30',
    };

    for (const [key, color] of Object.entries(colors)) {
      if (posicion.includes(key)) return color;
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400/30';
  };

  const getPFIColor = (pfi: number) => {
    if (pfi >= 80) return 'text-green-400';
    if (pfi >= 70) return 'text-yellow-400';
    if (pfi >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 12) return 'text-green-400';
    if (score >= 8) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatPFI = (pfi: number) => {
    return pfi.toFixed(1);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Información del jugador */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-football rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">{jugador.Jugador}</span>
            </div>
            <Badge className={`${getPositionColor(jugador.Posición)} shadow-lg border`}>
              {jugador.Posición}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 p-3 bg-card/30 rounded-lg border border-white/10">
              <User className="h-5 w-5 text-football-green" />
              <div>
                <div className="text-sm text-muted-foreground">Edad</div>
                <div className="font-semibold text-foreground">{jugador.Edad} años</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-card/30 rounded-lg border border-white/10">
              <MapPin className="h-5 w-5 text-football-green" />
              <div>
                <div className="text-sm text-muted-foreground">Equipo</div>
                <div className="font-semibold text-foreground">{jugador.Equipo}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-card/30 rounded-lg border border-white/10">
              <Flag className="h-5 w-5 text-football-green" />
              <div>
                <div className="text-sm text-muted-foreground">Nacionalidad</div>
                <div className="font-semibold text-foreground">{jugador.Nacionalidad}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-card/30 rounded-lg border border-white/10">
              <DollarSign className="h-5 w-5 text-football-green" />
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="font-semibold text-foreground">{formatValue(jugador['Valor de mercado'])}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-football-green/10 to-football-blue/10 rounded-lg border border-football-green/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">PFI San José M</div>
                  <div className={`text-2xl font-bold ${getPFIColor(jugador.PFI_SJE_M)}`}>
                    {formatPFI(jugador.PFI_SJE_M)}
                  </div>
                </div>
              </div>
              <Badge className="bg-football-green/20 border-football-green/30 text-football-green">
                Performance Score
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas por 90 minutos */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <span>Métricas por 90 minutos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metricasRadar.map(({ key, value, score }) => (
              <div key={key} className="text-center p-4 bg-card/30 rounded-lg border border-white/10 hover:border-football-green/30 transition-all duration-300 group">
                <div className="text-xl font-bold text-football-green group-hover:scale-110 transition-transform duration-300">
                  {value.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {key}
                </div>
                <div className={`text-xs mt-2 font-semibold ${getScoreColor(score)}`}>
                  Score: {score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scores ponderados */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span>Scores Ponderados (Contribución al PFI)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metricasRadar.map(({ key, score }) => (
              <div key={`score-${key}`} className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                <div className={`text-xl font-bold ${getScoreColor(score)} group-hover:scale-110 transition-transform duration-300`}>
                  {score.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {key.replace('/90', '').replace('_score', '')}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(score / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SanJosePlayerRadar; 