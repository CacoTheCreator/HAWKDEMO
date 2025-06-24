import React, { useState, useMemo, useEffect } from 'react';
import { SanJoseJugador } from '@/types/jugador';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Line, LineChart, Tooltip, Legend } from 'recharts';
import { TrendingUp, User, MapPin, DollarSign, Filter, Expand, BarChart3, Target } from 'lucide-react';

interface SanJoseComparisonProps {
  jugadores: SanJoseJugador[];
}

const SanJoseComparison: React.FC<SanJoseComparisonProps> = ({ jugadores }) => {
  const [selectedPlayer1, setSelectedPlayer1] = useState<string>('');
  const [selectedPlayer2, setSelectedPlayer2] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterNationality, setFilterNationality] = useState<string>('all');

  // Reset players when filters change
  useEffect(() => {
    setSelectedPlayer1('');
    setSelectedPlayer2('');
  }, [filterPosition, filterNationality]);

  // Obtener opciones únicas para filtros
  const positions = useMemo(() => {
    const uniquePositions = [...new Set(jugadores.map(j => j.Posición).filter(Boolean))];
    return uniquePositions.sort();
  }, [jugadores]);

  const nationalities = useMemo(() => {
    const uniqueNationalities = [...new Set(jugadores.map(j => j.Nacionalidad).filter(Boolean))];
    return uniqueNationalities.sort();
  }, [jugadores]);

  // Aplicar filtros
  const filteredPlayers = useMemo(() => {
    return jugadores.filter(jugador => {
      const matchesPosition = filterPosition === 'all' || jugador.Posición === filterPosition;
      const matchesNationality = filterNationality === 'all' || jugador.Nacionalidad === filterNationality;
      return matchesPosition && matchesNationality;
    });
  }, [jugadores, filterPosition, filterNationality]);

  // Calcular promedio general de scores
  const averageScores = useMemo(() => {
    if (filteredPlayers.length === 0) return null;

    const metrics = [
      'Pases progresivos/90_score',
      'Carreras en progresión/90_score',
      'Pases en el último tercio/90_score',
      'Remates/90_score',
      'xG/90_score',
      'Acciones defensivas realizadas/90_score',
      'Duelos defensivos/90_score',
      'Duelos/90_score',
      'Faltas recibidas/90_score'
    ];

    const averages: Record<string, number> = {};
    metrics.forEach(metric => {
      const sum = filteredPlayers.reduce((acc, player) => {
        const value = player[metric as keyof SanJoseJugador] as number;
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);
      averages[metric] = sum / filteredPlayers.length;
    });

    return averages;
  }, [filteredPlayers]);

  // Preparar datos para el radar chart
  const radarData = useMemo(() => {
    const metrics = [
      { key: 'Pases progresivos/90_score', label: 'Pases Progresivos' },
      { key: 'Carreras en progresión/90_score', label: 'Carreras Progresión' },
      { key: 'Pases en el último tercio/90_score', label: 'Pases Último Tercio' },
      { key: 'Remates/90_score', label: 'Remates' },
      { key: 'xG/90_score', label: 'xG' },
      { key: 'Acciones defensivas realizadas/90_score', label: 'Acciones Defensivas' },
      { key: 'Duelos defensivos/90_score', label: 'Duelos Defensivos' },
      { key: 'Duelos/90_score', label: 'Duelos' },
      { key: 'Faltas recibidas/90_score', label: 'Faltas Recibidas' }
    ];

    const data = metrics.map(({ key, label }) => {
      const point: any = { metric: label };
      
      // Agregar datos del jugador 1
      if (selectedPlayer1) {
        const player1 = filteredPlayers.find(p => p.Jugador === selectedPlayer1);
        if (player1) {
          point.player1 = player1[key as keyof SanJoseJugador] as number;
        }
      }
      
      // Agregar datos del jugador 2
      if (selectedPlayer2 && selectedPlayer2 !== 'average') {
        const player2 = filteredPlayers.find(p => p.Jugador === selectedPlayer2);
        if (player2) {
          point.player2 = player2[key as keyof SanJoseJugador] as number;
        }
      }
      
      // Agregar promedio si solo hay un jugador seleccionado o se compara con el promedio
      const showAverage = (selectedPlayer1 && !selectedPlayer2) || 
                          (!selectedPlayer1 && selectedPlayer2 && selectedPlayer2 !== 'average') || 
                          (selectedPlayer1 && selectedPlayer2 === 'average');

      if (averageScores && showAverage) {
        point.average = averageScores[key];
      }
      
      return point;
    });

    return data;
  }, [filteredPlayers, selectedPlayer1, selectedPlayer2, averageScores]);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filtros */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <span>Filtros de Comparación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <Target className="h-4 w-4 text-football-green" />
                <span>Posición</span>
              </label>
              <Select value={filterPosition} onValueChange={setFilterPosition}>
                <SelectTrigger className="border-white/20 focus:border-football-green/50 bg-card/50">
                  <SelectValue placeholder="Todas las posiciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las posiciones</SelectItem>
                  {positions.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <User className="h-4 w-4 text-football-green" />
                <span>Nacionalidad</span>
              </label>
              <Select value={filterNationality} onValueChange={setFilterNationality}>
                <SelectTrigger className="border-white/20 focus:border-football-green/50 bg-card/50">
                  <SelectValue placeholder="Todas las nacionalidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las nacionalidades</SelectItem>
                  {nationalities.map(nationality => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de jugadores para comparación */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span>Comparación de Jugadores</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Jugador 1</label>
              <Select value={selectedPlayer1} onValueChange={setSelectedPlayer1}>
                <SelectTrigger className="border-white/20 focus:border-football-green/50 bg-card/50">
                  <SelectValue placeholder="Seleccionar jugador" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPlayers.map(player => (
                    <SelectItem key={player.Jugador} value={player.Jugador}>
                      {player.Jugador} - {player.Posición}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Jugador 2</label>
              <Select value={selectedPlayer2} onValueChange={setSelectedPlayer2}>
                <SelectTrigger className="border-white/20 focus:border-football-green/50 bg-card/50">
                  <SelectValue placeholder="Seleccionar jugador (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="average">Promedio general</SelectItem>
                  {filteredPlayers.map(player => (
                    <SelectItem key={player.Jugador} value={player.Jugador}>
                      {player.Jugador} - {player.Posición}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      {(selectedPlayer1 || selectedPlayer2) && (
        <Dialog>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
              <CardTitle className="flex items-center space-x-3 text-foreground">
                <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span>Radar Chart Comparativo</span>
              </CardTitle>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-football-green/20">
                  <Expand className="h-5 w-5 text-football-green" />
                </Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-96 bg-card/30 rounded-lg p-4 border border-white/10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#10B981" strokeOpacity={0.3} />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fontSize: 12, fill: '#10B981' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 15]} 
                      tick={{ fontSize: 10, fill: '#10B981' }}
                    />
                    
                    {selectedPlayer1 && (
                      <Radar
                        name={selectedPlayer1}
                        dataKey="player1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    )}
                    
                    {selectedPlayer2 && selectedPlayer2 !== 'average' && (
                      <Radar
                        name={selectedPlayer2}
                        dataKey="player2"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    )}
                    
                    {(() => {
                      const showAverage = (selectedPlayer1 && !selectedPlayer2) || 
                                          (!selectedPlayer1 && selectedPlayer2 && selectedPlayer2 !== 'average') || 
                                          (selectedPlayer1 && selectedPlayer2 === 'average');
                      if (showAverage) {
                        return (
                          <Radar
                            name="Promedio"
                            dataKey="average"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.3}
                          />
                        );
                      }
                      return null;
                    })()}
                    
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <DialogContent className="max-w-4xl h-[80vh] bg-background/95 backdrop-blur-sm border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground">Radar Chart Comparativo - Vista Ampliada</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[calc(80vh-4rem)] p-4">
              <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#10B981" strokeOpacity={0.5} />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fontSize: 14, fill: '#10B981' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 15]} 
                      tick={{ fontSize: 12, fill: '#10B981' }}
                    />
                    
                    {selectedPlayer1 && (
                      <Radar
                        name={selectedPlayer1}
                        dataKey="player1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    )}
                    
                    {selectedPlayer2 && selectedPlayer2 !== 'average' && (
                      <Radar
                        name={selectedPlayer2}
                        dataKey="player2"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    )}
                    
                    {(() => {
                      const showAverage = (selectedPlayer1 && !selectedPlayer2) || 
                                          (!selectedPlayer1 && selectedPlayer2 && selectedPlayer2 !== 'average') || 
                                          (selectedPlayer1 && selectedPlayer2 === 'average');
                      if (showAverage) {
                        return (
                          <Radar
                            name="Promedio"
                            dataKey="average"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.4}
                            strokeWidth={2}
                          />
                        );
                      }
                      return null;
                    })()}
                    
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10B981', color: '#ffffff' }} />
                    <Legend wrapperStyle={{ fontSize: '14px', color: '#ffffff' }}/>
                  </RadarChart>
                </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Ranking de jugadores */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-football-green/10 to-football-blue/10 border-b border-white/10">
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-football rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>Ranking de Jugadores</span>
            </div>
            <Badge variant="outline" className="border-football-green/30 text-football-green">
              {filteredPlayers.length} jugadores
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredPlayers.map((jugador, index) => (
              <div 
                key={jugador.Jugador}
                className="flex items-center justify-between p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-all duration-300 border border-white/10 hover:border-football-green/30 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-football rounded-full text-white font-bold text-sm shadow-lg group-hover:shadow-football-green/50 transition-all duration-300">
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-foreground group-hover:text-football-green transition-colors duration-300">
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
                        <DollarSign className="h-4 w-4" />
                        <span>{formatValue(jugador['Valor de mercado'])}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${getPFIColor(jugador.PFI_SJE_M)} group-hover:scale-110 transition-transform duration-300`}>
                    {jugador.PFI_SJE_M.toFixed(1)}
                  </div>
                  <Badge className="mt-1 bg-football-green/20 border-football-green/30 text-football-green">
                    PFI Score
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SanJoseComparison; 