import React from 'react';
import { SanJoseJugador } from '@/types/jugador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, User, MapPin, Star } from 'lucide-react';

interface SanJosePlayersListProps {
  jugadores: SanJoseJugador[];
  onPlayerSelect: (jugador: SanJoseJugador) => void;
}

const SanJosePlayersList: React.FC<SanJosePlayersListProps> = ({ jugadores, onPlayerSelect }) => {
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

  const getPFIBadgeColor = (pfi: number) => {
    if (pfi >= 80) return 'bg-green-500/20 border-green-500/30 text-green-300';
    if (pfi >= 70) return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
    if (pfi >= 60) return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
    return 'bg-red-500/20 border-red-500/30 text-red-300';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-football rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">San José Earthquakes</h2>
            <p className="text-sm text-muted-foreground">Plantilla completa ordenada por rendimiento</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 px-4 py-2 bg-card/50 rounded-lg border border-white/10">
          <Star className="h-4 w-4 text-football-green" />
          <span className="text-sm font-medium text-foreground">
            {jugadores.length} jugadores
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {jugadores.map((jugador, index) => (
          <Card 
            key={jugador.Jugador} 
            className="glass-card hover:shadow-2xl hover:shadow-football-green/10 transition-all duration-300 cursor-pointer hover:scale-[1.02] border-white/10 hover:border-football-green/30 group"
            onClick={() => onPlayerSelect(jugador)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-football rounded-full text-white font-bold text-lg shadow-lg group-hover:shadow-football-green/50 transition-all duration-300">
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-football-green transition-colors duration-300">
                        {jugador.Jugador}
                      </h3>
                      <Badge className={`${getPositionColor(jugador.Posición)} shadow-lg border`}>
                        {jugador.Posición}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <User className="h-4 w-4" />
                        <span>{jugador.Edad} años</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <MapPin className="h-4 w-4" />
                        <span>{jugador.Equipo}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <TrendingUp className="h-4 w-4" />
                        <span>PFI: {formatPFI(jugador.PFI_SJE_M)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-muted-foreground">{jugador.Nacionalidad}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Valor: {formatValue(jugador['Valor de mercado'])}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-3xl font-bold ${getPFIColor(jugador.PFI_SJE_M)} group-hover:scale-110 transition-transform duration-300`}>
                    {formatPFI(jugador.PFI_SJE_M)}
                  </div>
                  <Badge className={`${getPFIBadgeColor(jugador.PFI_SJE_M)} mt-1 border`}>
                    PFI Score
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jugadores.length === 0 && (
        <Card className="glass-card animate-scale-in">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-gradient-football rounded-full flex items-center justify-center shadow-2xl">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold gradient-text">No hay jugadores disponibles</h3>
                <p className="text-muted-foreground max-w-md">
                  Los datos de San José Earthquakes no están disponibles en este momento. 
                  Intenta recargar la página o contacta al administrador.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SanJosePlayersList; 