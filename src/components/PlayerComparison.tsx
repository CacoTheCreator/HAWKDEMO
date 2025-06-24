import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Jugador } from '@/types/jugador';
import { PerfilPFI, metricasPorPerfil, metricasClavesPorPerfil } from '@/data/metricas-perfiles';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, Trophy, Filter } from 'lucide-react';
import { calcularEstadisticasMetricas, normalizarValorEnRango } from '@/utils/metrics';
import radar_m from '../data/radar_m.json';
import radar_gk from '../data/radar_gk.json';
import radar_dc from '../data/radar_dc.json';
import radar_ld from '../data/radar_ld.json';
import radar_li from '../data/radar_li.json';
import radar_mcd from '../data/radar_mcd.json';
import radar_ex from '../data/radar_ex.json';
import radar_a from '../data/radar_a.json';
import { findRadarPlayer } from '../utils/findRadarPlayer';
import MiniRadarJugador from './MiniRadarJugador';

interface PlayerComparisonProps {
  jugadores: Jugador[];
  perfil: PerfilPFI;
}

const radarPorPerfil: Record<string, any[]> = {
  m: radar_m,
  gk: radar_gk,
  dc: radar_dc,
  ld: radar_ld,
  li: radar_li,
  mcd: radar_mcd,
  ex: radar_ex,
  a: radar_a,
};

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '')
    .trim();
}

const PlayerComparison: React.FC<PlayerComparisonProps> = ({ jugadores, perfil }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<[Jugador | null, Jugador | null]>([null, null]);
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  
  const metricas = metricasPorPerfil[perfil] || [];

  // Filtrar jugadores disponibles
  const filteredJugadores = useMemo(() => {
    return jugadores.filter(jugador => {
      const matchesCompetition = competitionFilter === 'all' || 
        jugador.competicion === competitionFilter;
      
      const matchesAge = ageFilter === 'all' || 
        (ageFilter === 'young' && jugador.edad <= 23) ||
        (ageFilter === 'prime' && jugador.edad > 23 && jugador.edad <= 29) ||
        (ageFilter === 'experienced' && jugador.edad > 29);
      
      return matchesCompetition && matchesAge;
    });
  }, [jugadores, competitionFilter, ageFilter]);

  // Selección aleatoria de dos jugadores al montar o cambiar perfil/filtros
  useEffect(() => {
    if (filteredJugadores.length >= 2) {
      const indices = [];
      while (indices.length < 2) {
        const idx = Math.floor(Math.random() * filteredJugadores.length);
        if (!indices.includes(idx)) indices.push(idx);
      }
      setSelectedPlayers([filteredJugadores[indices[0]], filteredJugadores[indices[1]]]);
    } else {
      setSelectedPlayers([null, null]);
    }
  }, [perfil, filteredJugadores.length]);

  // Obtener competiciones únicas
  const uniqueCompetitions = useMemo(() => {
    return [...new Set(jugadores.map(j => j.competicion))].filter(Boolean).sort();
  }, [jugadores]);

  const handlePlayerSelect = (index: 0 | 1, jugadorNombre: string) => {
    const jugador = filteredJugadores.find(j => j.nombre === jugadorNombre) || null;
    const newSelection: [Jugador | null, Jugador | null] = [...selectedPlayers];
    newSelection[index] = jugador;
    setSelectedPlayers(newSelection);
  };

  const getComparisonData = () => {
    if (!selectedPlayers[0] || !selectedPlayers[1]) return [];
    // Buscar en el JSON de radar por perfil
    const perfilKey = perfil?.toLowerCase() || 'm';
    const data = radarPorPerfil[perfilKey] || [];
    // Buscar los jugadores en el JSON de radar usando normalización
    const jugadorRadar1 = findRadarPlayer(data, selectedPlayers[0]!.nombre);
    const jugadorRadar2 = findRadarPlayer(data, selectedPlayers[1]!.nombre);
    const metricasRadar = data.length > 0 ? Object.keys(data[0].Valores) : [];
    return metricasRadar.map((metrica) => {
      const v1 = jugadorRadar1 && jugadorRadar1.Valores[metrica] != null ? jugadorRadar1.Valores[metrica] : 0;
      const v2 = jugadorRadar2 && jugadorRadar2.Valores[metrica] != null ? jugadorRadar2.Valores[metrica] : 0;
      return {
        metric: metrica,
        value1: v1,
        value2: v2,
      };
    });
  };

  const getStatComparison = (jugador1: Jugador, jugador2: Jugador, key: keyof Jugador) => {
    const val1 = jugador1[key];
    const val2 = jugador2[key];
    
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      if (val1 > val2) return 'higher';
      if (val1 < val2) return 'lower';
      return 'equal';
    }
    return 'equal';
  };

  const ComparisonIcon = ({ comparison }: { comparison: 'higher' | 'lower' | 'equal' }) => {
    switch (comparison) {
      case 'higher': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'lower': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Componente personalizado para el tooltip de comparación
  const ComparisonTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length || !payload[0]?.payload) return null;
    
    const data = payload[0].payload;
    const value1 = typeof data.value1 === 'number' ? data.value1.toFixed(2) : 'N/A';
    const value2 = typeof data.value2 === 'number' ? data.value2.toFixed(2) : 'N/A';
    const min = typeof data.min === 'number' ? data.min.toFixed(2) : 'N/A';
    const max = typeof data.max === 'number' ? data.max.toFixed(2) : 'N/A';

    return (
      <div className="bg-black/90 p-3 rounded-lg border border-gray-700 text-white text-sm">
        <p className="font-bold">{label}</p>
        <div className="space-y-1">
          <p className="text-green-400">
            {payload[0]?.name || 'Jugador 1'}: {value1}
          </p>
          <p className="text-yellow-400">
            {payload[1]?.name || 'Jugador 2'}: {value2}
          </p>
        </div>
        <p className="mt-2 text-gray-400">
          Rango: {min} - {max}
        </p>
      </div>
    );
  };

  // LOG TEMPORAL: Mostrar métricas y datos de los jugadores seleccionados
  console.log('[COMPARISON] Métricas:', metricas);
  console.log('[COMPARISON] Jugador 1:', selectedPlayers[0]);
  console.log('[COMPARISON] Jugador 2:', selectedPlayers[1]);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Comparación de Jugadores - {perfil}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder="Filtrar por competición" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" className="bg-background border-white/20">
                <SelectItem value="all">Todas las competiciones</SelectItem>
                {uniqueCompetitions.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder="Filtrar por edad" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" className="bg-background border-white/20">
                <SelectItem value="all">Todas las edades</SelectItem>
                <SelectItem value="young">Jóvenes (≤23)</SelectItem>
                <SelectItem value="prime">Prime (24-29)</SelectItem>
                <SelectItem value="experienced">Veteranos (30+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resumen de filtros */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {filteredJugadores.length} jugadores disponibles
              </span>
            </div>
            {(competitionFilter !== 'all' || ageFilter !== 'all') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setCompetitionFilter('all');
                  setAgeFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Selectores de jugadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jugador 1</label>
              <Select value={selectedPlayers[0]?.nombre || ''} onValueChange={(value) => handlePlayerSelect(0, value)}>
                <SelectTrigger className="glass-card border-white/20">
                  <SelectValue placeholder="Seleccionar jugador..." />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" className="bg-background border-white/20 max-h-60">
                  {filteredJugadores.map((jugador, index) => (
                    <SelectItem 
                      key={`1-${jugador.nombre}-${jugador.club}-${index}`} 
                      value={jugador.nombre}
                    >
                      {jugador.nombre} - {jugador.club}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Jugador 2</label>
              <Select value={selectedPlayers[1]?.nombre || ''} onValueChange={(value) => handlePlayerSelect(1, value)}>
                <SelectTrigger className="glass-card border-white/20">
                  <SelectValue placeholder="Seleccionar jugador..." />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" className="bg-background border-white/20 max-h-60">
                  {filteredJugadores.map((jugador, index) => (
                    <SelectItem 
                      key={`2-${jugador.nombre}-${jugador.club}-${index}`} 
                      value={jugador.nombre}
                    >
                      {jugador.nombre} - {jugador.club}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPlayers[0] && selectedPlayers[1] && (
            <>
              {/* Información básica de comparación con radares individuales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedPlayers.map((jugador, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <h3 className="font-bold text-xl">{jugador!.nombre}</h3>
                        {/* Radar individual prominente y agrandado */}
                        <div className="flex justify-center">
                          <MiniRadarJugador 
                            jugador={{
                              Jugador: jugador!.nombre,
                              Perfil: jugador!.posicion || perfil,
                              ...jugador!
                            }} 
                            size={220} 
                          />
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>PFI Score:</span>
                            <span className="font-bold text-football-green">{jugador!.pfi.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Edad:</span>
                            <span>{jugador!.edad} años</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Club:</span>
                            <span className="truncate">{jugador!.club}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Competición:</span>
                            <span className="truncate text-xs">{jugador!.competicion}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparación directa de estadísticas */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-center">Comparación Directa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="font-bold">{selectedPlayers[0]!.pfi.toFixed(1)}</div>
                        <ComparisonIcon comparison={getStatComparison(selectedPlayers[0]!, selectedPlayers[1]!, 'pfi')} />
                      </div>
                      <div className="text-center font-medium">PFI Score</div>
                      <div className="text-center">
                        <div className="font-bold">{selectedPlayers[1]!.pfi.toFixed(1)}</div>
                        <ComparisonIcon comparison={getStatComparison(selectedPlayers[1]!, selectedPlayers[0]!, 'pfi')} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-center">
                        <div className="font-bold">{selectedPlayers[0]!.edad}</div>
                        <ComparisonIcon comparison={getStatComparison(selectedPlayers[1]!, selectedPlayers[0]!, 'edad')} />
                      </div>
                      <div className="text-center font-medium">Edad</div>
                      <div className="text-center">
                        <div className="font-bold">{selectedPlayers[1]!.edad}</div>
                        <ComparisonIcon comparison={getStatComparison(selectedPlayers[0]!, selectedPlayers[1]!, 'edad')} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerComparison;
