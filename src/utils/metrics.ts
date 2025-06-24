import { Jugador } from '@/types/jugador';

/**
 * Calcula la media ponderada de una métrica específica para todos los jugadores de un perfil
 * @param jugadores Lista de jugadores
 * @param metrica Nombre de la métrica a calcular
 * @returns Media ponderada de la métrica
 */
export const calcularMediaPonderada = (jugadores: Jugador[], metrica: string): number => {
  const valoresValidos = jugadores
    .map(j => j[metrica])
    .filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
    .map(v => Number(v));

  if (valoresValidos.length === 0) return 0;

  // Calcular la media ponderada usando el PFI como peso
  const sumaPonderada = valoresValidos.reduce((acc, valor, index) => {
    const jugador = jugadores[index];
    const peso = jugador.pfi || 1; // Si no hay PFI, usar peso 1
    return acc + (valor * peso);
  }, 0);

  const sumaPesos = jugadores.reduce((acc, j) => acc + (j.pfi || 1), 0);
  
  return sumaPonderada / sumaPesos;
};

/**
 * Calcula el rango de valores (mínimo y máximo) para cada métrica
 * @param jugadores Lista de jugadores
 * @param metricas Lista de métricas a calcular
 * @returns Objeto con rangos por métrica
 */
export const calcularRangosMetricas = (
  jugadores: Jugador[],
  metricas: string[]
): Record<string, { min: number; max: number }> => {
  const rangos: Record<string, { min: number; max: number }> = {};

  metricas.forEach(metrica => {
    const valores = jugadores
      .map(j => j[metrica])
      .filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
      .map(v => Number(v));

    if (valores.length === 0) {
      rangos[metrica] = { min: 0, max: 1 };
      return;
    }

    const min = Math.min(...valores);
    const max = Math.max(...valores);
    
    // Si min y max son iguales, establecer un rango artificial para evitar división por cero
    rangos[metrica] = {
      min: min === max ? Math.max(0, min - 0.1) : min,
      max: min === max ? min + 0.1 : max
    };
  });

  return rangos;
};

/**
 * Normaliza un valor entre 0 y 1 basado en su posición dentro del rango de valores de la métrica
 * @param valor Valor a normalizar
 * @param min Valor mínimo de la métrica
 * @param max Valor máximo de la métrica
 * @returns Valor normalizado entre 0 y 1
 */
export const normalizarValorEnRango = (valor: number, min: number, max: number): number => {
  // Si el valor está fuera del rango, lo ajustamos al límite más cercano
  const valorAjustado = Math.max(min, Math.min(max, valor));
  // Normalización lineal
  return (valorAjustado - min) / (max - min);
};

/**
 * Calcula estadísticas descriptivas para cada métrica
 * @param jugadores Lista de jugadores
 * @param metricas Lista de métricas a calcular
 * @returns Objeto con estadísticas por métrica
 */
export const calcularEstadisticasMetricas = (
  jugadores: Jugador[],
  metricas: string[]
): Record<string, { 
  min: number; 
  max: number; 
  percentil25: number; 
  percentil75: number;
  media: number;
}> => {
  const stats: Record<string, any> = {};

  metricas.forEach(metrica => {
    const valores = jugadores
      .map(j => j[metrica])
      .filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
      .map(v => Number(v))
      .sort((a, b) => a - b);

    if (valores.length === 0) {
      stats[metrica] = {
        min: 0,
        max: 1,
        percentil25: 0.25,
        percentil75: 0.75,
        media: 0.5
      };
      return;
    }

    const min = valores[0];
    const max = valores[valores.length - 1];
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    
    // Calcular percentiles
    const idx25 = Math.floor(valores.length * 0.25);
    const idx75 = Math.floor(valores.length * 0.75);
    const percentil25 = valores[idx25];
    const percentil75 = valores[idx75];

    stats[metrica] = {
      min: min === max ? Math.max(0, min - 0.1) : min,
      max: min === max ? min + 0.1 : max,
      percentil25,
      percentil75,
      media
    };
  });

  return stats;
}; 