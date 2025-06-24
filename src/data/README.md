
# Directorio de Datos - Scout PFI

Este directorio está preparado para recibir los archivos JSON con los datos de jugadores organizados por perfil PFI.

## Estructura de Archivos Esperada

Cada perfil debe tener su propio archivo JSON con el siguiente formato de nombre:
- `delantero_unificado.json`
- `extremo_unificado.json`
- `mediapunta_unificado.json`
- `mediocentro_defensivo_unificado.json`
- `lateral_izquierdo_unificado.json`
- `lateral_derecho_unificado.json`
- `defensa_central_unificado.json`
- `arquero_unificado.json`

## Formato JSON Esperado

Ver `template-ejemplo.json` para la estructura completa. Cada archivo debe contener:

```json
{
  "perfil": "Nombre del Perfil",
  "descripcion": "Descripción opcional del perfil",
  "jugadores": [
    {
      "nombre": "Nombre del Jugador",
      "edad": 25,
      "valor_mercado": "50M€",
      "club": "Nombre del Club",
      "competicion": "Nombre de la Competición",
      "posicion": "Posición",
      "pfi": 85.5,
      // Las 9 métricas específicas del perfil
      "metrica1/90": 0.65,
      "metrica2/90": 3.2,
      // ... resto de métricas según el perfil
    }
  ]
}
```

## Métricas por Perfil

### Delantero (A)
- xG/90
- Tiros/90
- Toques en el área/90
- Goles/90
- Asistencias esperadas (xA)/90
- Pases clave/90
- Duelos ofensivos/90
- Pases progresivos/90
- Precisión tiros, %

### Extremo (EX)
- Aceleraciones/90
- Carreras en progresión/90
- Centros desde la banda/90
- Duelos ofensivos/90
- Pases clave/90
- xA/90
- Regates exitosos/90
- Pases progresivos/90
- Toques en el área/90

### Mediapunta (M)
- xA/90
- Pases clave/90
- Duelos ofensivos/90
- Regates exitosos/90
- Pases al último tercio/90
- Pases progresivos/90
- Tiros/90
- Carreras en progresión/90
- Toques en el área/90

### Mediocentro Defensivo (MCD)
- Intercepciones/90
- Recuperaciones/90
- Acciones defensivas/90
- Pases progresivos/90
- Pases largos/90
- Precisión pases largos, %
- Duelos defensivos ganados, %
- Tiros interceptados/90
- Duelos aéreos en los 90

### Lateral Izquierdo (LI)
- Carreras en progresión/90
- Aceleraciones/90
- Centros desde la banda izquierda/90
- Precisión centros desde la banda izquierda, %
- Intercepciones/90
- Duelos defensivos ganados, %
- Pases progresivos/90
- Acciones defensivas realizadas/90
- Jugadas claves/90

### Lateral Derecho (LD)
- Acciones defensivas realizadas/90
- Interceptaciones/90
- Centros desde la banda derecha/90
- Precisión centros desde la banda derecha, %
- Carreras en progresión/90
- Pases progresivos/90
- Aceleraciones/90
- Duelos defensivos ganados, %
- Jugadas claves/90

### Defensa Central (DC)
- Acciones defensivas realizadas/90
- Duelos defensivos/90
- Duelos defensivos ganados, %
- Duelos aéreos en los 90
- Interceptaciones/90
- Pases progresivos/90
- Pases hacia adelante/90
- Precisión pases largos, %
- Tiros interceptados/90

### Arquero (GK)
- Paradas, %
- Goles evitados/90
- Remates en contra/90
- Porterías imbatidas en los 90
- xG en contra/90
- Pases/90
- Precisión pases, %
- Pases largos/90
- Precisión pases largos, %

## Instrucciones de Carga

1. Coloca tus archivos JSON en esta carpeta (`src/data/`)
2. Asegúrate de que siguen el formato exacto del template
3. Los nombres de archivo deben seguir la convención especificada
4. La aplicación detectará automáticamente los archivos y cargará los datos

## Validación

La aplicación validará automáticamente:
- Estructura del JSON
- Presencia de métricas requeridas por perfil
- Tipos de datos correctos
- Valores numéricos válidos para PFI y métricas
