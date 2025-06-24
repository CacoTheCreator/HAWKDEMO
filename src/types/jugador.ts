export interface Jugador {
  nombre: string;
  edad: number;
  valor_mercado: string;
  club: string;
  competicion: string;
  posicion: string;
  pfi: number;
  // Las 9 métricas específicas para cada perfil se agregarán dinámicamente
  [metrica: string]: any;
}

export interface PerfilData {
  perfil: string;
  jugadores: Jugador[];
  metricas: string[];
  descripcion?: string;
}

// Nueva interfaz para jugadores de San José Earthquakes
export interface SanJoseJugador {
  // Información básica
  Jugador: string;
  Edad: number;
  Equipo: string;
  Nacionalidad: string;
  Posición: string;
  'Valor de mercado': number;
  PFI_SJE_M: number;
  
  // Métricas técnicas por 90 minutos
  'Pases progresivos/90': number;
  'Carreras en progresión/90': number;
  'Pases en el último tercio/90': number;
  'Remates/90': number;
  'xG/90': number;
  'Acciones defensivas realizadas/90': number;
  'Duelos defensivos/90': number;
  'Duelos/90': number;
  'Faltas recibidas/90': number;
  
  // Scores ponderados
  'Pases progresivos/90_score': number;
  'Carreras en progresión/90_score': number;
  'Pases en el último tercio/90_score': number;
  'Remates/90_score': number;
  'xG/90_score': number;
  'Acciones defensivas realizadas/90_score': number;
  'Duelos defensivos/90_score': number;
  'Duelos/90_score': number;
  'Faltas recibidas/90_score': number;
}

export interface SanJoseData {
  jugadores: SanJoseJugador[];
  metricas: string[];
  descripcion?: string;
}
