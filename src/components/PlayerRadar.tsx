import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { findRadarPlayer } from '../utils/findRadarPlayer';

// Importar los JSON de radar
import radar_m from '../data/radar_m.json';
import radar_gk from '../data/radar_gk.json';
import radar_dc from '../data/radar_dc.json';
import radar_ld from '../data/radar_ld.json';
import radar_li from '../data/radar_li.json';
import radar_mcd from '../data/radar_mcd.json';
import radar_ex from '../data/radar_ex.json';
import radar_a from '../data/radar_a.json';

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

interface PlayerRadarProps {
  jugador: { Jugador: string; Perfil: string; [key: string]: any };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 p-3 rounded-lg border border-gray-700 text-white text-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PlayerRadar: React.FC<PlayerRadarProps> = ({ jugador }) => {
  // Determinar el perfil correcto basado en la posición del jugador
  const getPerfilKey = (posicion: string): string => {
    const posicionLower = posicion.toLowerCase();
    
    // Mapeo más específico basado en los nombres exactos de los perfiles
    if (posicionLower.includes('mediapunta') || posicionLower.includes('(m)')) return 'm';
    if (posicionLower.includes('arquero') || posicionLower.includes('(gk)') || posicionLower.includes('gk')) return 'gk';
    if (posicionLower.includes('defensa central') || posicionLower.includes('(dc)') || posicionLower.includes('dc')) return 'dc';
    if (posicionLower.includes('lateral derecho') || posicionLower.includes('(ld)') || posicionLower.includes('ld')) return 'ld';
    if (posicionLower.includes('lateral izquierdo') || posicionLower.includes('(li)') || posicionLower.includes('li')) return 'li';
    if (posicionLower.includes('mediocentro defensivo') || posicionLower.includes('(mcd)') || posicionLower.includes('mcd')) return 'mcd';
    if (posicionLower.includes('extremo') || posicionLower.includes('(ex)') || posicionLower.includes('ex')) return 'ex';
    if (posicionLower.includes('delantero') || posicionLower.includes('(a)') || posicionLower.includes('a')) return 'a';
    
    // Fallbacks más genéricos
    if (posicionLower.includes('defensa')) return 'dc';
    if (posicionLower.includes('lateral')) return 'ld';
    if (posicionLower.includes('mediocampo') || posicionLower.includes('centrocampista')) return 'm';
    if (posicionLower.includes('portero') || posicionLower.includes('guardameta')) return 'gk';
    if (posicionLower.includes('delantero') || posicionLower.includes('atacante')) return 'a';
    
    return 'm'; // default
  };

  const perfilKey = getPerfilKey(jugador.Perfil);
  const data = radarPorPerfil[perfilKey] || [];
  // Buscar el jugador en el JSON de radar usando la función utilitaria
  const jugadorRadar = findRadarPlayer(data, jugador.Jugador);
  const metricas = data.length > 0 ? Object.keys(data[0].Valores) : [];

  // Preparar datos para el radar
  const radarData = metricas.map(metrica => ({
    metric: metrica,
    [jugador.Jugador]: jugadorRadar && jugadorRadar.Valores[metrica] != null ? jugadorRadar.Valores[metrica] : 0,
  }));

  if (!jugadorRadar) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-center gradient-text">Radar de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-6xl opacity-20">📊</div>
            <p className="text-red-500">No hay datos de radar disponibles para este jugador.</p>
            <p className="text-sm text-muted-foreground">
              Jugador: {jugador.Jugador}<br/>
              Perfil: {jugador.Perfil}<br/>
              Clave de búsqueda: {perfilKey}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-center gradient-text">Análisis - {jugador.Perfil}</CardTitle>
        <p className="text-center text-sm text-muted-foreground">{jugador.Jugador}</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid 
              gridType="polygon" 
              radialLines={true}
              stroke="rgba(255,255,255,0.2)"
            />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ 
                fontSize: 11, 
                fill: '#94a3b8',
              }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 1]} 
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickCount={5}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Radar
              name={jugador.Jugador}
              dataKey={jugador.Jugador}
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <div className="flex justify-center space-x-4 text-sm">
            {jugador.PFI && <span>PFI: <strong className="text-football-green">{jugador.PFI.toFixed ? jugador.PFI.toFixed(2) : jugador.PFI}</strong></span>}
            {jugador.Edad && <span>Edad: <strong>{jugador.Edad}</strong></span>}
          </div>
          {jugador.Club && <p className="text-xs text-muted-foreground">{jugador.Club}</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Valores normalizados respecto al rango completo de la métrica
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerRadar;
