import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Importar los JSON de radar
import radar_m from '../data/radar_m.json';
import radar_gk from '../data/radar_gk.json';
import radar_dc from '../data/radar_dc.json';
import radar_ld from '../data/radar_ld.json';
import radar_li from '../data/radar_li.json';
import radar_mcd from '../data/radar_mcd.json';
import radar_ex from '../data/radar_ex.json';
import radar_a from '../data/radar_a.json';

// Definir los perfiles y sus datos
const perfiles = [
  { key: 'm', label: 'Mediapuntas ofensivos', data: radar_m },
  { key: 'gk', label: 'Arqueros', data: radar_gk },
  { key: 'dc', label: 'Defensas centrales', data: radar_dc },
  { key: 'ld', label: 'Laterales derechos', data: radar_ld },
  { key: 'li', label: 'Laterales izquierdos', data: radar_li },
  { key: 'mcd', label: 'Mediocentros defensivos', data: radar_mcd },
  { key: 'ex', label: 'Extremos', data: radar_ex },
  { key: 'a', label: 'Delanteros', data: radar_a },
];

// Componente personalizado para el tooltip
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

const RadarChartJugador: React.FC = () => {
  const [perfilKey, setPerfilKey] = useState('m');
  const [jugador1, setJugador1] = useState('');
  const [jugador2, setJugador2] = useState('');

  // Obtener el perfil actual
  const perfilActual = perfiles.find(p => p.key === perfilKey);
  const data = perfilActual?.data || [];

  // Obtener las métricas del primer jugador (todos los jugadores tienen las mismas métricas)
  const metricas = data.length > 0 ? Object.keys(data[0].Valores) : [];

  // Preparar datos para el radar
  const radarData = metricas.map(metrica => {
    const j1 = data.find(j => j.Jugador === jugador1);
    const j2 = data.find(j => j.Jugador === jugador2);
    return {
      metric: metrica,
      [jugador1]: j1 && j1.Valores[metrica] != null ? j1.Valores[metrica] : 0,
      [jugador2]: j2 && j2.Valores[metrica] != null ? j2.Valores[metrica] : 0,
    };
  });

  // Log temporal para depuración
  console.log('jugador1:', jugador1, 'jugador2:', jugador2);
  console.log('radarData:', radarData);

  // Seleccionar dos jugadores aleatorios si no hay seleccionados
  React.useEffect(() => {
    if (data.length > 0 && (!jugador1 || !jugador2)) {
      const jugadoresAleatorios = [...data]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(j => j.Jugador);
      
      if (!jugador1) setJugador1(jugadoresAleatorios[0]);
      if (!jugador2) setJugador2(jugadoresAleatorios[1]);
    }
  }, [perfilKey, data]);

  return (
    <Card className="glass-card max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center gradient-text">Radar Comparativo de Jugadores</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selector de perfil */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {perfiles.map(p => (
            <button
              key={p.key}
              className={`px-4 py-2 rounded-full transition-colors ${
                perfilKey === p.key 
                  ? 'bg-football-green text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => {
                setPerfilKey(p.key);
                setJugador1('');
                setJugador2('');
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Selectores de jugadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select value={jugador1} onValueChange={setJugador1}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona Jugador 1" />
            </SelectTrigger>
            <SelectContent>
              {data.map(j => (
                <SelectItem key={j.Jugador} value={j.Jugador}>
                  {j.Jugador}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jugador2} onValueChange={setJugador2}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona Jugador 2" />
            </SelectTrigger>
            <SelectContent>
              {data.map(j => (
                <SelectItem key={j.Jugador} value={j.Jugador}>
                  {j.Jugador}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Radar Chart */}
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
              {jugador1 && (
                <Radar
                  name={jugador1}
                  dataKey={jugador1}
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              )}
              {jugador2 && (
                <Radar
                  name={jugador2}
                  dataKey={jugador2}
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Valores normalizados (0-1) respecto al perfil seleccionado
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarChartJugador; 