import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Jugador } from '@/types/jugador';
import { PerfilPFI, metricasPorPerfil } from '@/data/metricas-perfiles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, Target, Globe } from 'lucide-react';
import ProfileStatsCarousel from './ProfileStatsCarousel';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileStatisticsProps {
  jugadores: Jugador[];
  perfil: PerfilPFI;
  loading?: boolean;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const ProfileStatistics: React.FC<ProfileStatisticsProps> = ({ jugadores, perfil, loading }) => {
  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jugadores.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">No hay datos disponibles para generar estadísticas.</div>
        </CardContent>
      </Card>
    );
  }

  // Estadísticas generales
  const avgPFI = jugadores.reduce((sum, j) => sum + j.pfi, 0) / jugadores.length;
  const avgAge = jugadores.reduce((sum, j) => sum + j.edad, 0) / jugadores.length;
  const topPlayer = jugadores.reduce((top, current) => current.pfi > top.pfi ? current : top);
  
  // Distribución por edad
  const ageDistribution = [
    { range: 'Jóvenes (≤23)', count: jugadores.filter(j => j.edad <= 23).length },
    { range: 'Prime (24-29)', count: jugadores.filter(j => j.edad > 23 && j.edad <= 29).length },
    { range: 'Veteranos (30+)', count: jugadores.filter(j => j.edad > 29).length },
  ];

  // Distribución por competición
  const competitionStats = jugadores.reduce((acc, jugador) => {
    const comp = jugador.competicion || 'No especificada';
    acc[comp] = (acc[comp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const competitionData = Object.entries(competitionStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Distribución de PFI
  const pfiRanges = [
    { range: '90-100', count: jugadores.filter(j => j.pfi >= 90).length },
    { range: '80-89', count: jugadores.filter(j => j.pfi >= 80 && j.pfi < 90).length },
    { range: '70-79', count: jugadores.filter(j => j.pfi >= 70 && j.pfi < 80).length },
    { range: '60-69', count: jugadores.filter(j => j.pfi >= 60 && j.pfi < 70).length },
    { range: '<60', count: jugadores.filter(j => j.pfi < 60).length },
  ];

  // Top 10 jugadores por PFI
  const topPlayers = [...jugadores]
    .sort((a, b) => b.pfi - a.pfi)
    .slice(0, 10)
    .map((jugador, index) => ({
      nombre: jugador.nombre.length > 15 ? jugador.nombre.substring(0, 15) + '...' : jugador.nombre,
      pfi: jugador.pfi,
      rank: index + 1
    }));

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-football-green" />
              <div>
                <div className="text-2xl font-bold">{jugadores.length}</div>
                <div className="text-sm text-muted-foreground">Total Jugadores</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-football-gold" />
              <div>
                <div className="text-2xl font-bold">{avgPFI.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">PFI Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">{avgAge.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Edad Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold">{topPlayer.pfi.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Mejor PFI</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por edad */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Distribución por Edad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de PFI */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Distribución de PFI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pfiRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Carrusel de Análisis de Rendimiento */}
      <ProfileStatsCarousel jugadores={jugadores} perfil={perfil} />

      {/* Distribución por competición */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Distribución por Competición</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={competitionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {competitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {competitionData.map((comp, index) => (
                <div key={comp.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{comp.name}</span>
                  </div>
                  <Badge variant="outline">{comp.value} jugadores</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStatistics;
