import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlayerCard from './PlayerCard';
import { Jugador } from '@/types/jugador';
import { PerfilPFI } from '@/data/metricas-perfiles';
import { Search, SortAsc, SortDesc, Filter, Users, BarChart3, Euro } from 'lucide-react';
import { Calendar, Trophy } from 'lucide-react';

interface PlayersListProps {
  perfil: PerfilPFI;
  jugadores: Jugador[];
  onPlayerSelect: (jugador: Jugador) => void;
}

type MarketValueFilter = 'all' | 'with_value' | 'without_value';

const PlayersList: React.FC<PlayersListProps> = ({ perfil, jugadores, onPlayerSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'pfi' | 'edad' | 'nombre' | 'valor_mercado'>('pfi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');
  const [marketValueFilter, setMarketValueFilter] = useState<MarketValueFilter>('all');

  // Obtener competiciones únicas basadas en los datos reales
  const uniqueCompetitions = [...new Set(jugadores.map(j => {
    // Buscar en múltiples campos posibles para competición
    return j.competicion || j.Procedencia || j.Liga || j.Campeonato || 'No especificada';
  }))].filter(Boolean).sort();

  console.log('Competiciones únicas encontradas:', uniqueCompetitions);
  console.log('Muestra de jugadores:', jugadores.slice(0, 3));

  // Función auxiliar para obtener el valor numérico del mercado
  const getNumericMarketValue = (valor: string | number): number => {
    if (!valor || valor === 0 || valor === '0') return -1;
    const numValue = typeof valor === 'string' ? 
      parseFloat(valor.replace(/[^\d.-]/g, '')) : 
      valor;
    return isNaN(numValue) ? -1 : numValue;
  };

  // Filtrar y ordenar jugadores
  const filteredAndSortedPlayers = jugadores
    .filter(jugador => {
      const matchesSearch = jugador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (jugador.club || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAge = ageFilter === 'all' || 
                        (ageFilter === 'young' && jugador.edad <= 23) ||
                        (ageFilter === 'prime' && jugador.edad > 23 && jugador.edad <= 29) ||
                        (ageFilter === 'experienced' && jugador.edad > 29);
      
      const playerCompetition = jugador.competicion || jugador.Procedencia || jugador.Liga || jugador.Campeonato || 'No especificada';
      const matchesCompetition = competitionFilter === 'all' || playerCompetition === competitionFilter;
      
      // Nuevo filtro para valor de mercado
      const marketValue = getNumericMarketValue(jugador.valor_mercado);
      const matchesMarketValue = marketValueFilter === 'all' || 
                                (marketValueFilter === 'with_value' && marketValue >= 0) ||
                                (marketValueFilter === 'without_value' && marketValue < 0);
      
      return matchesSearch && matchesAge && matchesCompetition && matchesMarketValue;
    })
    .sort((a, b) => {
      let result = 0;
      
      switch (sortBy) {
        case 'pfi':
          result = a.pfi - b.pfi;
          break;
        case 'edad':
          result = a.edad - b.edad;
          break;
        case 'nombre':
          result = a.nombre.localeCompare(b.nombre);
          break;
        case 'valor_mercado':
          const valA = getNumericMarketValue(a.valor_mercado);
          const valB = getNumericMarketValue(b.valor_mercado);
          // Si ambos tienen valor, comparar normalmente
          if (valA >= 0 && valB >= 0) {
            result = valA - valB;
          } 
          // Si solo uno tiene valor, el que tiene valor va primero
          else if (valA >= 0) {
            result = -1;
          } else if (valB >= 0) {
            result = 1;
          }
          // Si ninguno tiene valor, mantener el orden original
          else {
            result = 0;
          }
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? result : -result;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (jugadores.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-12 text-center space-y-6">
          <div className="text-6xl opacity-20">📊</div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Datos no disponibles</h3>
            <p className="text-muted-foreground">
              Los datos para el perfil <strong>{perfil}</strong> aún no están cargados.
            </p>
          </div>
          <Badge variant="outline">
            Esperando datos JSON
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas mejorado */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text">Jugadores - {perfil}</CardTitle>
              <p className="text-muted-foreground">
                {filteredAndSortedPlayers.length} de {jugadores.length} jugadores
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{jugadores.length} total</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>PFI promedio: {(jugadores.reduce((sum, j) => sum + j.pfi, 0) / jugadores.length).toFixed(1)}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Controles de filtro y búsqueda mejorados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-white/20"
              />
            </div>
            
            {/* Filtro por edad */}
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder="Filtrar por edad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las edades</SelectItem>
                <SelectItem value="young">Jóvenes (≤23)</SelectItem>
                <SelectItem value="prime">Prime (24-29)</SelectItem>
                <SelectItem value="experienced">Veteranos (30+)</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filtro por competición */}
            <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder="Competición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las competiciones</SelectItem>
                {uniqueCompetitions.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Nuevo filtro de valor de mercado */}
            <Select value={marketValueFilter} onValueChange={(value) => setMarketValueFilter(value as MarketValueFilter)}>
              <SelectTrigger className="glass-card border-white/20">
                <SelectValue placeholder="Filtrar por valor de mercado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los valores</SelectItem>
                <SelectItem value="with_value">Con valor de mercado</SelectItem>
                <SelectItem value="without_value">Sin valor de mercado</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Ordenamiento */}
            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="glass-card border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pfi">PFI Score</SelectItem>
                  <SelectItem value="edad">Edad</SelectItem>
                  <SelectItem value="nombre">Nombre</SelectItem>
                  <SelectItem value="valor_mercado">Valor</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="glass-card border-white/20"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          {(searchTerm || ageFilter !== 'all' || competitionFilter !== 'all' || marketValueFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Search className="h-3 w-3" />
                  <span>Búsqueda: {searchTerm}</span>
                </Badge>
              )}
              {ageFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Edad: {
                    ageFilter === 'young' ? 'Jóvenes (≤23)' :
                    ageFilter === 'prime' ? 'Prime (24-29)' :
                    'Veteranos (30+)'
                  }</span>
                </Badge>
              )}
              {competitionFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Trophy className="h-3 w-3" />
                  <span>Competición: {competitionFilter}</span>
                </Badge>
              )}
              {marketValueFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Euro className="h-3 w-3" />
                  <span>Valor: {
                    marketValueFilter === 'with_value' ? 'Con valor' :
                    'Sin valor'
                  }</span>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedPlayers.map((jugador, idx) => (
          <PlayerCard
            key={`${jugador.nombre}-${jugador.club}-${idx}`}
            jugador={jugador}
            onViewDetails={onPlayerSelect}
            rank={idx + 1}
          />
        ))}
      </div>

      {filteredAndSortedPlayers.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center space-y-4">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">No se encontraron jugadores</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros para ver más resultados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayersList;
