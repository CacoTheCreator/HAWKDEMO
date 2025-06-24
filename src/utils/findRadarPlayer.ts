export function normalizarTexto(texto: string | undefined | null) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[.]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

// Función para calcular la distancia de Levenshtein entre dos strings
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // eliminación
          matrix[i][j - 1] + 1, // inserción
          matrix[i - 1][j - 1] + 1 // sustitución
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

export function findRadarPlayer(data: any[], nombre: string) {
  const nombreNorm = normalizarTexto(nombre);
  // 1. Buscar coincidencia exacta
  let jugador = data.find(j => normalizarTexto(j.Jugador) === nombreNorm);
  if (jugador) return jugador;

  // 2. Buscar coincidencia más cercana por Levenshtein
  let minDist = Infinity;
  let candidato = null;
  for (const j of data) {
    const dist = levenshtein(nombreNorm, normalizarTexto(j.Jugador));
    if (dist < minDist) {
      minDist = dist;
      candidato = j;
    }
  }
  // Si la distancia es razonable (<=2), devolver el candidato
  if (minDist <= 2) return candidato;
  return null;
} 