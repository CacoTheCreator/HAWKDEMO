import { useState, useEffect, useMemo } from 'react';
import { Jugador, SanJoseJugador } from '@/types/jugador';
import { PerfilPFI, metricasClavesPorPerfil } from '@/data/metricas-perfiles';

export const usePlayerData = (perfil: PerfilPFI | null) => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache para evitar recargas innecesarias
  const [dataCache, setDataCache] = useState<Record<string, Jugador[]>>({});

  // Mapeo de perfiles a nombres de archivos y campos PFI - ahora apuntando a public
  const fileMapping: Record<PerfilPFI, { file: string; pfiField: string }> = useMemo(() => ({
    "Delantero (A)": { file: "/pfi_a_125_normalizado.json", pfiField: "PFI_A" },
    "Extremo (EX)": { file: "/pfi_ex_125_normalizado.json", pfiField: "PFI_EX" },
    "Mediapunta (M)": { file: "/pfi_m_125_normalizado.json", pfiField: "PFI_M" },
    "Mediocentro Defensivo (MCD)": { file: "/pfi_mcd_125_normalizado.json", pfiField: "PFI_MCD" },
    "Lateral Izquierdo (LI)": { file: "/pfi_li_125_normalizado.json", pfiField: "PFI_LI" },
    "Lateral Derecho (LD)": { file: "/pfi_ld_125_normalizado.json", pfiField: "PFI_LD" },
    "Defensa Central (DC)": { file: "/pfi_dc_125_normalizado.json", pfiField: "PFI_DC" },
    "Arquero (GK)": { file: "/pfi_gk_100_normalizado.json", pfiField: "PFI_GK" }
  }), []);

  // Función para limpiar valores inválidos del JSON
  const cleanJsonData = (jsonString: string): string => {
    return jsonString
      .replace(/:\s*NaN/g, ': null')
      .replace(/:\s*Infinity/g, ': null')
      .replace(/:\s*-Infinity/g, ': null')
      .replace(/:\s*undefined/g, ': null');
  };

  // Función para validar y normalizar los datos de un jugador
  const validateAndNormalizePlayer = (item: any, config: { pfiField: string }, perfil: PerfilPFI): Jugador | null => {
    try {
      // Validar campos requeridos
      if (!item.Jugador) {
        console.warn('[Validate] Jugador sin nombre:', item);
        return null;
      }

      // Función helper para obtener valores seguros
      const getSafeValue = (value: any, defaultValue: any = null) => {
        if (value === null || value === undefined || 
            (typeof value === 'number' && (isNaN(value) || !isFinite(value)))) {
          return defaultValue;
        }
        return value;
      };

      // Extraer edad del campo "Edad" 
      let edad = 25; // valor por defecto
      const edadValue = getSafeValue(item.Edad);
      if (edadValue) {
        if (edadValue === "Joven") {
          edad = 22;
        } else if (typeof edadValue === 'number') {
          edad = Math.max(16, Math.min(45, edadValue)); // Limitar edad entre 16 y 45
        }
      }

      // Determinar la fuente/competición
      const competicion = getSafeValue(item.Fuente) || 
                          getSafeValue(item.Procedencia) || 
                          getSafeValue(item.Liga) || 
                          getSafeValue(item.Campeonato) || 
                          'No especificada';

      // Validar y normalizar el valor PFI
      const pfiValue = getSafeValue(item[config.pfiField]);
      if (pfiValue === null || pfiValue === undefined) {
        console.warn(`[Validate] Jugador sin valor PFI: ${item.Jugador}`);
        return null;
      }

      // Convertir PFI a escala 0-100 si está en escala 0-1
      const normalizedPfi = typeof pfiValue === 'number' && pfiValue <= 1 ? pfiValue * 100 : pfiValue;

      // Agregar métricas normalizadas bajo los nombres del mapeo explícito
      const metricasMapeo = metricasClavesPorPerfil[perfil] || {};
      const metricasRadar: Record<string, number | null> = {};
      Object.entries(metricasMapeo).forEach(([nombreVisible, claveJson]) => {
        const valor = getSafeValue(item[claveJson], null);
        // Solo convertir a número si el valor existe y es válido
        metricasRadar[nombreVisible] = valor === null ? null :
          typeof valor === 'number' ? valor :
          !isNaN(parseFloat(valor)) ? parseFloat(valor) : null;
      });

      // También incluir las métricas visibles como propiedades directas
      const jugador: Jugador = {
        nombre: getSafeValue(item.Jugador) || 'Sin nombre',
        edad: edad,
        valor_mercado: getSafeValue(item['Valor de mercado (Transfermarkt)']) || 
                      getSafeValue(item.valor_mercado) || 'No disponible',
        club: getSafeValue(item.Equipo) || getSafeValue(item.club) || 'Sin club',
        competicion: competicion,
        posicion: perfil,
        pfi: normalizedPfi,
        ...metricasRadar,
        // Copiar todas las métricas adicionales con valores limpios
        ...Object.fromEntries(
          Object.entries(item)
            .filter(([key]) => 
              key !== 'Jugador' && 
              key !== 'Edad' && 
              key !== 'Equipo' && 
              key !== 'Valor de mercado (Transfermarkt)' &&
              key !== 'Procedencia' &&
              key !== 'Fuente' &&
              key !== config.pfiField
            )
            .map(([key, value]) => [key, getSafeValue(value, null)])
        ),
        // Incluir explícitamente todos los campos norm_ (métricas normalizadas)
        ...Object.fromEntries(
          Object.entries(item)
            .filter(([key]) => key.startsWith('norm_'))
            .map(([key, value]) => [key, getSafeValue(value, null)])
        )
      };

      // Validar que el jugador tenga al menos un valor PFI válido
      if (jugador.pfi <= 0) {
        console.warn(`[Validate] Jugador con PFI inválido: ${jugador.nombre} (${jugador.pfi})`);
        return null;
      }

      return jugador;
    } catch (error) {
      console.error('[Validate] Error validando jugador:', error, item);
      return null;
    }
  };

  useEffect(() => {
    if (!perfil) {
      console.log('[Cache] Limpiando jugadores - no hay perfil seleccionado');
      setJugadores([]);
      return;
    }

    // Verificar si ya tenemos los datos en cache
    if (dataCache[perfil]) {
      const cachedData = dataCache[perfil];
      console.log(`[Cache] Datos encontrados para ${perfil}:`, {
        cantidad: cachedData.length,
        primerJugador: cachedData[0]?.nombre,
        ultimoJugador: cachedData[cachedData.length - 1]?.nombre,
        pfiPromedio: cachedData.reduce((sum, j) => sum + j.pfi, 0) / cachedData.length
      });
      setJugadores(cachedData);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[Load] Iniciando carga para perfil: ${perfil}`);
        const config = fileMapping[perfil];
        console.log(`[Load] Configuración:`, config);
        
        // Agregar timestamp para evitar cache del navegador
        const cacheBuster = `?t=${Date.now()}`;
        const response = await fetch(config.file + cacheBuster, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Obtener el texto crudo y limpiarlo antes de parsearlo
        const rawText = await response.text();
        console.log(`[Load] Tamaño del archivo: ${rawText.length} bytes`);
        
        const cleanedText = cleanJsonData(rawText);
        const rawData = JSON.parse(cleanedText);
        
        console.log(`[Load] Datos crudos cargados:`, {
          cantidad: rawData.length,
          primerJugador: rawData[0]?.Jugador,
          camposDisponibles: Object.keys(rawData[0] || {}),
          campoPFI: config.pfiField,
          valorPFI: rawData[0]?.[config.pfiField]
        });
        
        // Transformar y validar los datos
        const jugadoresData: Jugador[] = rawData
          .map((item: any, index: number) => {
            const jugador = validateAndNormalizePlayer(item, config, perfil);
            
            // Log para el primer jugador y algunos aleatorios para debug
            if (index === 0 || index % 50 === 0) {
              console.log(`[Transform] Jugador ${index}:`, {
                nombre: item.Jugador,
                pfiOriginal: item[config.pfiField],
                pfiFinal: jugador?.pfi,
                edad: jugador?.edad,
                competicion: jugador?.competicion,
                valido: jugador !== null
              });
            }
            
            return jugador;
          })
          .filter((jugador): jugador is Jugador => jugador !== null);
        
        console.log(`[Transform] Resumen de transformación:`, {
          cantidadOriginal: rawData.length,
          cantidadFinal: jugadoresData.length,
          jugadoresFiltrados: rawData.length - jugadoresData.length,
          primerJugador: jugadoresData[0],
          ultimoJugador: jugadoresData[jugadoresData.length - 1],
          pfiPromedio: jugadoresData.reduce((sum, j) => sum + j.pfi, 0) / jugadoresData.length
        });

        if (jugadoresData.length === 0) {
          throw new Error('No se encontraron jugadores válidos después de la transformación');
        }
        
        // Guardar en cache
        setDataCache(prev => {
          const newCache = {
            ...prev,
            [perfil]: jugadoresData
          };
          console.log(`[Cache] Actualizando cache para ${perfil}:`, {
            perfilesEnCache: Object.keys(newCache),
            cantidadJugadores: jugadoresData.length
          });
          return newCache;
        });
        
        setJugadores(jugadoresData);
      } catch (err) {
        console.error('[Error] Error cargando datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setJugadores([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [perfil, fileMapping]);

  return { jugadores, loading, error };
};

// Hook para cargar datos de San José Earthquakes
export const useSanJoseData = () => {
  const [jugadores, setJugadores] = useState<SanJoseJugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSanJoseData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/PFI_SJE_M_HAWKVIEW_FINAL_CON_POBLETE.json');
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos de San José');
        }
        
        // Corregir el JSON si es necesario y luego parsear
        let text = await response.text();
        if (text.startsWith('perdo ')) {
          text = text.substring(6);
        }
        const data = JSON.parse(text);

        // Transformar los datos y eliminar duplicados por nombre de jugador
        const uniquePlayers = new Map<string, SanJoseJugador>();
        data.forEach((item: any) => {
          if (!uniquePlayers.has(item.Jugador)) {
            uniquePlayers.set(item.Jugador, {
              Jugador: item.Jugador,
              Edad: item.Edad,
              Equipo: item.Equipo,
              Nacionalidad: item.Nacionalidad,
              Posición: item.Posición,
              'Valor de mercado': item['Valor de mercado'],
              PFI_SJE_M: item.PFI_SJE_M,
              'Pases progresivos/90': item['Pases progresivos/90'],
              'Carreras en progresión/90': item['Carreras en progresión/90'],
              'Pases en el último tercio/90': item['Pases en el último tercio/90'],
              'Remates/90': item['Remates/90'],
              'xG/90': item['xG/90'],
              'Acciones defensivas realizadas/90': item['Acciones defensivas realizadas/90'],
              'Duelos defensivos/90': item['Duelos defensivos/90'],
              'Duelos/90': item['Duelos/90'],
              'Faltas recibidas/90': item['Faltas recibidas/90'],
              'Pases progresivos/90_score': item['Pases progresivos/90_score'],
              'Carreras en progresión/90_score': item['Carreras en progresión/90_score'],
              'Pases en el último tercio/90_score': item['Pases en el último tercio/90_score'],
              'Remates/90_score': item['Remates/90_score'],
              'xG/90_score': item['xG/90_score'],
              'Acciones defensivas realizadas/90_score': item['Acciones defensivas realizadas/90_score'],
              'Duelos defensivos/90_score': item['Duelos defensivos/90_score'],
              'Duelos/90_score': item['Duelos/90_score'],
              'Faltas recibidas/90_score': item['Faltas recibidas/90_score']
            });
          }
        });

        // Filtrar por posiciones válidas
        const POSICIONES_VALIDAS = ['DMF', 'AMF', 'LCMF', 'RCMF', 'LDMF', 'RWB'];
        const jugadoresFiltrados = Array.from(uniquePlayers.values()).filter(jugador => {
          const posiciones = jugador.Posición?.split(',').map(p => p.trim()) || [];
          return posiciones.some(pos => POSICIONES_VALIDAS.includes(pos));
        });

        setJugadores(jugadoresFiltrados);
        setError(null);
      } catch (err) {
        console.error('Error cargando datos de San José:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadSanJoseData();
  }, []);

  return { jugadores, loading, error };
};
