import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Jugador } from '@/types/jugador';
import { TrendingUp, Eye, BarChart3, MapPin, Calendar, Euro } from 'lucide-react';
import MiniRadarJugador from './MiniRadarJugador';

// Función auxiliar para formatear el valor de mercado
const formatMarketValue = (value: string | number): string => {
  if (!value || value === 0 || value === '0') return 'No disponible';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  if (isNaN(numValue)) return 'No disponible';
  
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M €`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K €`;
  }
  return `${numValue.toLocaleString()} €`;
};

interface PlayerCardProps {
  jugador: Jugador;
  onViewDetails: (jugador: Jugador) => void;
  rank?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ jugador, onViewDetails, rank }) => {
  const getPFIColor = (pfi: number) => {
    if (pfi >= 85) return 'text-green-400';
    if (pfi >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getPFIBadgeVariant = (pfi: number) => {
    if (pfi >= 85) return 'default';
    if (pfi >= 75) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="glass-card hover-lift group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex items-center gap-3">
            {rank && (
              <Badge variant="outline" className="w-fit text-xs">
                #{rank}
              </Badge>
            )}
            <div>
              <h3 className="font-bold text-lg group-hover:text-football-green transition-colors">
                {jugador.nombre}
              </h3>
              <p className="text-sm text-muted-foreground">{jugador.posicion}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${getPFIColor(jugador.pfi)}`}>
              {jugador.pfi.toFixed(1)}
            </div>
            <Badge variant={getPFIBadgeVariant(jugador.pfi)} className="text-xs">
              PFI Score
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Radar Section */}
        <div className="flex justify-center">
          <div className="relative">
            <MiniRadarJugador 
              jugador={{
                Jugador: jugador.nombre,
                Perfil: jugador.posicion || '',
                ...jugador
              }} 
              size={80} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-muted-foreground bg-background/80 px-1 rounded">
                Radar
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{jugador.edad} años</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <span className={`font-medium ${jugador.valor_mercado && jugador.valor_mercado !== '0' ? 'text-football-gold' : 'text-muted-foreground'}`}>
              {formatMarketValue(jugador.valor_mercado)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{jugador.club}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{jugador.competicion}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 group-hover:border-football-green transition-colors"
            onClick={() => onViewDetails(jugador)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="group-hover:border-football-green transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
