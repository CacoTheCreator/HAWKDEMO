import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import radar_m from '../data/radar_m.json';
import radar_gk from '../data/radar_gk.json';
import radar_dc from '../data/radar_dc.json';
import radar_ld from '../data/radar_ld.json';
import radar_li from '../data/radar_li.json';
import radar_mcd from '../data/radar_mcd.json';
import radar_ex from '../data/radar_ex.json';
import radar_a from '../data/radar_a.json';
import { findRadarPlayer } from '../utils/findRadarPlayer';

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

interface MiniRadarJugadorProps {
  jugador: { Jugador: string; Perfil: string; [key: string]: any };
  size?: number;
}

const MiniRadarJugador: React.FC<MiniRadarJugadorProps> = ({ jugador, size = 120 }) => {
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
  const jugadorRadar = findRadarPlayer(data, jugador.Jugador);
  const metricas = data.length > 0 ? Object.keys(data[0].Valores) : [];

  // Si no hay datos del jugador, mostrar un placeholder
  if (!jugadorRadar || metricas.length === 0) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full"
      >
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Sin datos</div>
          <div className="text-xs text-muted-foreground">{jugador.Jugador}</div>
        </div>
      </div>
    );
  }

  const radarData = metricas.map(metrica => ({
    metric: metrica,
    [jugador.Jugador]: jugadorRadar.Valores[metrica] != null ? jugadorRadar.Valores[metrica] : 0,
  }));

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius={size/2.2}>
          <PolarGrid 
            gridType="polygon" 
            radialLines={false} 
            stroke="rgba(255,255,255,0.15)" 
          />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={false} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 1]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name={jugador.Jugador}
            dataKey={jugador.Jugador}
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.35}
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 1, r: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniRadarJugador; 