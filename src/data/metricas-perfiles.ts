export const metricasPorPerfil = {
  "Delantero (A)": [
    "xG/90",
    "Remates/90",
    "Toques en el área de penalti/90",
    "Goles/90",
    "xA/90",
    "Jugadas claves/90",
    "Duelos atacantes/90",
    "Pases progresivos/90",
    "Duelos atacantes ganados, %"
  ],
  "Extremo (EX)": [
    "Aceleraciones/90",
    "Carreras en progresión/90",
    "Centros/90",
    "Duelos atacantes/90",
    "Duelos atacantes ganados, %",
    "xA/90",
    "Regates/90",
    "Pases progresivos/90",
    "Toques en el área de penalti/90"
  ],
  "Mediapunta (M)": [
    "xA/90",
    "Jugadas claves/90",
    "Pases en el último tercio/90",
    "Pases progresivos/90",
    "Carreras en progresión/90",
    "Centros desde el último tercio/90",
    "Asistencias/90",
    "Pases al área de penalti/90",
    "Ataque en profundidad/90"
  ],
  "Mediocentro Defensivo (MCD)": [
    "Interceptaciones/90",
    "Acciones defensivas realizadas/90",
    "Duelos defensivos/90",
    "Duelos defensivos ganados, %",
    "Tiros interceptados/90",
    "Pases progresivos/90",
    "Pases largos/90",
    "Precisión pases largos, %",
    "Pases hacia adelante/90"
  ],
  "Lateral Izquierdo (LI)": [
    "Carreras en progresión/90",
    "Aceleraciones/90",
    "Centros desde la banda izquierda/90",
    "Precisión centros desde la banda izquierda, %",
    "Acciones defensivas realizadas/90",
    "Duelos defensivos ganados, %",
    "Interceptaciones/90",
    "Pases progresivos/90",
    "Jugadas claves/90"
  ],
  "Lateral Derecho (LD)": [
    "Acciones defensivas realizadas/90",
    "Interceptaciones/90",
    "Centros desde la banda derecha/90",
    "Precisión centros desde la banda derecha, %",
    "Carreras en progresión/90",
    "Pases progresivos/90",
    "Aceleraciones/90",
    "Duelos defensivos ganados, %",
    "Jugadas claves/90"
  ],
  "Defensa Central (DC)": [
    "Acciones defensivas realizadas/90",
    "Duelos defensivos/90",
    "Duelos defensivos ganados, %",
    "Duelos aéreos en los 90",
    "Interceptaciones/90",
    "Tiros interceptados/90",
    "Pases progresivos/90",
    "Pases hacia adelante/90",
    "Precisión pases largos, %"
  ],
  "Arquero (GK)": [
    "Paradas, %",
    "Goles evitados/90",
    "Remates en contra/90",
    "Porterías imbatidas en los 90",
    "xG en contra/90",
    "Pases/90",
    "Precisión pases, %",
    "Pases largos/90",
    "Precisión pases largos, %"
  ]
};

export type PerfilPFI = keyof typeof metricasPorPerfil;

export const perfiles = Object.keys(metricasPorPerfil) as PerfilPFI[];

// Mapeo explícito de métricas visibles a claves normalizadas del JSON
export const metricasClavesPorPerfil: Record<PerfilPFI, Record<string, string>> = {
  "Delantero (A)": {
    "xG/90": "norm_xG/90",
    "Remates/90": "norm_Remates/90",
    "Toques en el área de penalti/90": "norm_Toques en el área de penalti/90",
    "Goles/90": "norm_Goles/90",
    "xA/90": "norm_xA/90",
    "Jugadas claves/90": "norm_Jugadas claves/90",
    "Duelos atacantes/90": "norm_Duelos atacantes/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Duelos atacantes ganados, %": "norm_Duelos atacantes ganados, %"
  },
  "Extremo (EX)": {
    "Aceleraciones/90": "norm_Aceleraciones/90",
    "Carreras en progresión/90": "norm_Carreras en progresión/90",
    "Centros/90": "norm_Centros/90",
    "Duelos atacantes/90": "norm_Duelos atacantes/90",
    "Duelos atacantes ganados, %": "norm_Duelos atacantes ganados, %",
    "xA/90": "norm_xA/90",
    "Regates/90": "norm_Regates/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Toques en el área de penalti/90": "norm_Toques en el área de penalti/90"
  },
  "Mediapunta (M)": {
    "xA/90": "norm_xA/90",
    "Jugadas claves/90": "norm_Jugadas claves/90",
    "Pases en el último tercio/90": "norm_Pases en el último tercio/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Carreras en progresión/90": "norm_Carreras en progresión/90",
    "Centros desde el último tercio/90": "norm_Centros desde el último tercio/90",
    "Asistencias/90": "norm_Asistencias/90",
    "Pases al área de penalti/90": "norm_Pases al área de penalti/90",
    "Ataque en profundidad/90": "norm_Ataque en profundidad/90"
  },
  "Mediocentro Defensivo (MCD)": {
    "Interceptaciones/90": "norm_Interceptaciones/90",
    "Acciones defensivas realizadas/90": "norm_Acciones defensivas realizadas/90",
    "Duelos defensivos/90": "norm_Duelos defensivos/90",
    "Duelos defensivos ganados, %": "norm_Duelos defensivos ganados, %",
    "Tiros interceptados/90": "norm_Tiros interceptados/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Pases largos/90": "norm_Pases largos/90",
    "Precisión pases largos, %": "norm_Precisión pases largos, %",
    "Pases hacia adelante/90": "norm_Pases hacia adelante/90"
  },
  "Lateral Izquierdo (LI)": {
    "Carreras en progresión/90": "norm_Carreras en progresión/90",
    "Aceleraciones/90": "norm_Aceleraciones/90",
    "Centros desde la banda izquierda/90": "norm_Centros desde la banda izquierda/90",
    "Precisión centros desde la banda izquierda, %": "norm_Precisión centros desde la banda izquierda, %",
    "Acciones defensivas realizadas/90": "norm_Acciones defensivas realizadas/90",
    "Duelos defensivos ganados, %": "norm_Duelos defensivos ganados, %",
    "Interceptaciones/90": "norm_Interceptaciones/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Jugadas claves/90": "norm_Jugadas claves/90"
  },
  "Lateral Derecho (LD)": {
    "Acciones defensivas realizadas/90": "norm_Acciones defensivas realizadas/90",
    "Interceptaciones/90": "norm_Interceptaciones/90",
    "Centros desde la banda derecha/90": "norm_Centros desde la banda derecha/90",
    "Precisión centros desde la banda derecha, %": "norm_Precisión centros desde la banda derecha, %",
    "Carreras en progresión/90": "norm_Carreras en progresión/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Aceleraciones/90": "norm_Aceleraciones/90",
    "Duelos defensivos ganados, %": "norm_Duelos defensivos ganados, %",
    "Jugadas claves/90": "norm_Jugadas claves/90"
  },
  "Defensa Central (DC)": {
    "Acciones defensivas realizadas/90": "norm_Acciones defensivas realizadas/90",
    "Duelos defensivos/90": "norm_Duelos defensivos/90",
    "Duelos defensivos ganados, %": "norm_Duelos defensivos ganados, %",
    "Duelos aéreos en los 90": "norm_Duelos aéreos en los 90",
    "Interceptaciones/90": "norm_Interceptaciones/90",
    "Tiros interceptados/90": "norm_Tiros interceptados/90",
    "Pases progresivos/90": "norm_Pases progresivos/90",
    "Pases hacia adelante/90": "norm_Pases hacia adelante/90",
    "Precisión pases largos, %": "norm_Precisión pases largos, %"
  },
  "Arquero (GK)": {
    "Paradas, %": "norm_Paradas, %",
    "Goles evitados/90": "norm_Goles evitados/90",
    "Remates en contra/90": "norm_Remates en contra/90",
    "Porterías imbatidas en los 90": "norm_Porterías imbatidas en los 90",
    "xG en contra/90": "norm_xG en contra/90",
    "Pases/90": "norm_Pases/90",
    "Precisión pases, %": "norm_Precisión pases, %",
    "Pases largos/90": "norm_Pases largos/90",
    "Precisión pases largos, %": "norm_Precisión pases largos, %"
  }
};
