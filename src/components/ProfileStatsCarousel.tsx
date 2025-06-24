import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Jugador } from '@/types/jugador';
import { PerfilPFI, metricasPorPerfil } from '@/data/metricas-perfiles';
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import radar_m from '../data/radar_m.json';
import radar_gk from '../data/radar_gk.json';
import radar_dc from '../data/radar_dc.json';
import radar_ld from '../data/radar_ld.json';
import radar_li from '../data/radar_li.json';
import radar_mcd from '../data/radar_mcd.json';
import radar_ex from '../data/radar_ex.json';
import radar_a from '../data/radar_a.json';

interface ProfileStatsCarouselProps {
  jugadores: Jugador[];
  perfil: PerfilPFI;
}

// Configuración de métricas por perfil para el scatter plot
const scatterMetricsConfig: Record<PerfilPFI, { x: string; y: string; title: string }> = {
  'Delantero (A)': { x: 'norm_xG/90', y: 'norm_Goles/90', title: 'Eficiencia Ofensiva' },
  'Extremo (EX)': { x: 'norm_Aceleraciones/90', y: 'norm_Regates exitosos/90', title: 'Explosividad vs Regate' },
  'Mediapunta (M)': { x: 'norm_xA/90', y: 'norm_Jugadas claves/90', title: 'Creatividad Ofensiva' },
  'Mediocentro Defensivo (MCD)': { x: 'norm_Intercepciones/90', y: 'norm_Duelos defensivos/90', title: 'Eficiencia Defensiva' },
  'Lateral Izquierdo (LI)': { x: 'norm_Centros desde la banda/90', y: 'norm_Duelos ofensivos/90', title: 'Impacto Ofensivo' },
  'Lateral Derecho (LD)': { x: 'norm_Centros desde la banda/90', y: 'norm_Duelos ofensivos/90', title: 'Impacto Ofensivo' },
  'Defensa Central (DC)': { x: 'norm_Duelos defensivos/90', y: 'norm_Intercepciones/90', title: 'Solidez Defensiva' },
  'Arquero (GK)': { x: 'norm_Paradas/90', y: 'norm_Goles concedidos/90', title: 'Efectividad' }
};

// Configuración de métricas para el top 10
const topMetricsConfig: Record<PerfilPFI, { metric: string; label: string; title: string }> = {
  'Delantero (A)': { metric: 'norm_Goles/90', label: 'Goles/90', title: 'Top 10 Goleadores' },
  'Extremo (EX)': { metric: 'norm_Regates exitosos/90', label: 'Regates exitosos/90', title: 'Top 10 Regateadores' },
  'Mediapunta (M)': { metric: 'norm_xA/90', label: 'xA/90', title: 'Top 10 Asistentes' },
  'Mediocentro Defensivo (MCD)': { metric: 'norm_Intercepciones/90', label: 'Intercepciones/90', title: 'Top 10 Recuperadores' },
  'Lateral Izquierdo (LI)': { metric: 'norm_Centros desde la banda/90', label: 'Centros/90', title: 'Top 10 Centradores' },
  'Lateral Derecho (LD)': { metric: 'norm_Centros desde la banda/90', label: 'Centros/90', title: 'Top 10 Centradores' },
  'Defensa Central (DC)': { metric: 'norm_Duelos defensivos/90', label: 'Duelos defensivos/90', title: 'Top 10 Defensores' },
  'Arquero (GK)': { metric: 'norm_Paradas/90', label: 'Paradas/90', title: 'Top 10 Porteros' }
};

// Mapeo de nombres amigables para métricas
const metricLabels: Record<string, string> = {
  'norm_xG/90': 'xG/90',
  'norm_Goles/90': 'Goles/90',
  'norm_xA/90': 'xA/90',
  'norm_Jugadas claves/90': 'Jugadas clave/90',
  'norm_Aceleraciones/90': 'Aceleraciones/90',
  'norm_Regates exitosos/90': 'Regates exitosos/90',
  'norm_Intercepciones/90': 'Intercepciones/90',
  'norm_Duelos defensivos/90': 'Duelos defensivos/90',
  'norm_Centros desde la banda/90': 'Centros/90',
  'norm_Duelos ofensivos/90': 'Duelos ofensivos/90',
  'norm_Paradas/90': 'Paradas/90',
  'norm_Goles concedidos/90': 'Goles concedidos/90',
};

const radarPorPerfil: Record<string, any[]> = {
  'Delantero (A)': radar_a,
  'Extremo (EX)': radar_ex,
  'Mediapunta (M)': radar_m,
  'Mediocentro Defensivo (MCD)': radar_mcd,
  'Lateral Izquierdo (LI)': radar_li,
  'Lateral Derecho (LD)': radar_ld,
  'Defensa Central (DC)': radar_dc,
  'Arquero (GK)': radar_gk,
};

const ProfileStatsCarousel: React.FC<ProfileStatsCarouselProps> = ({ jugadores, perfil }) => {
  // Usar el JSON de radar como fuente de datos para el scatter plot
  const radarData = radarPorPerfil[perfil] || [];
  // LOGS DE DEPURACIÓN
  console.log('[ProfileStatsCarousel] radarData:', radarData);

  if (jugadores.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No hay datos disponibles para generar estadísticas.</div>
        </CardContent>
      </Card>
    );
  }

  // Filtrar datos válidos para scatter plot
  const scatterConf = scatterMetricsConfig[perfil];
  const scatterData = radarData.filter(j =>
    typeof j.Valores?.[scatterConf.x.replace('norm_', '')] === 'number' &&
    typeof j.Valores?.[scatterConf.y.replace('norm_', '')] === 'number'
  ).map(j => ({
    ...j,
    [scatterConf.x]: j.Valores[scatterConf.x.replace('norm_', '')],
    [scatterConf.y]: j.Valores[scatterConf.y.replace('norm_', '')],
    nombre: j.Jugador
  }));
  console.log('[ProfileStatsCarousel] scatterData:', scatterData);
  console.log('[ProfileStatsCarousel] scatterConf:', scatterConf);

  // Filtrar datos válidos para top 10
  const topConf = topMetricsConfig[perfil];
  const topData = jugadores
    .filter(j => typeof j[topConf.metric] === 'number' && !isNaN(j[topConf.metric]))
    .sort((a, b) => (b[topConf.metric] as number) - (a[topConf.metric] as number))
    .slice(0, 10);
  console.log('[ProfileStatsCarousel] topData:', topData);
  console.log('[ProfileStatsCarousel] topConf:', topConf);

  // Tooltip personalizado para scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const jugador = payload[0].payload;
      return (
        <div className="bg-background/90 border border-border rounded-lg p-2 text-xs shadow-xl">
          <div className="font-semibold mb-1">{jugador.nombre}</div>
          <div>{metricLabels[scatterConf.x] || scatterConf.x}: <b>{jugador[scatterConf.x]?.toFixed(2)}</b></div>
          <div>{metricLabels[scatterConf.y] || scatterConf.y}: <b>{jugador[scatterConf.y]?.toFixed(2)}</b></div>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para barras
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const jugador = payload[0].payload;
      return (
        <div className="bg-background/90 border border-border rounded-lg p-2 text-xs shadow-xl">
          <div className="font-semibold mb-1">{jugador.nombre || jugador.Jugador}</div>
          <div>{metricLabels[topConf.metric] || topConf.metric}: <b>{jugador[topConf.metric]?.toFixed(2)}</b></div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Análisis de Rendimiento</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Carousel className="w-full">
          <CarouselContent>
            {/* Scatter Plot */}
            <CarouselItem>
              <div className="h-[400px]">
                <h3 className="text-lg font-semibold mb-4">{scatterConf.title}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey={scatterConf.x}
                      name={metricLabels[scatterConf.x] || scatterConf.x}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      label={{ value: metricLabels[scatterConf.x] || scatterConf.x, position: 'insideBottom', offset: -10, fill: '#cbd5e1' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey={scatterConf.y}
                      name={metricLabels[scatterConf.y] || scatterConf.y}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      label={{ value: metricLabels[scatterConf.y] || scatterConf.y, angle: -90, position: 'insideLeft', offset: 0, fill: '#cbd5e1' }}
                    />
                    <Tooltip content={<CustomScatterTooltip />} />
                    <Scatter 
                      data={scatterData} 
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CarouselItem>

            {/* Top 10 Bar Chart */}
            <CarouselItem>
              <div className="h-[400px]">
                <h3 className="text-lg font-semibold mb-4">{topConf.title}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey={topConf.metric} label={{ value: metricLabels[topConf.metric] || topConf.metric, position: 'insideBottom', offset: -10, fill: '#cbd5e1' }} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis dataKey="nombre" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={150} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey={topConf.metric} 
                      fill="#8B5CF6" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCarousel; 