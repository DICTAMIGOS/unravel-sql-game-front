export const challengesData = {
  "levels": [
    {
      "id": 1,
      "name": "FBI",
      "description": "Ayuda al FBI a resolver un caso",
      "storySteps": [
        {
          "type": "image",
          "order": 1,
          "data": {
            "id": "img-1-1",
            "url": "https://placehold.co/800x400/1f2937/ffffff/png?text=Escena+1:+La+Oficina+del+FBI",
            "caption": "La oficina del FBI recibe una llamada anónima sobre actividades sospechosas",
            "order": 1
          }
        },
        {
          "type": "sequence",
          "order": 3,
          "data": {
            "id": "seq-1-1",
            "title": "Secuencia 1: Identificación del Sospechoso Principal",
            "description": "Analiza la base de datos para encontrar al sospechoso principal",
            "order": 3,
            "challenges": [
              {
                "id": "1-1",
                "title": "Caso FBI - Pista 1",
                "description": "Encuentra el nombre del sospechoso principal en la base de datos",
                "level": 1,
                "template": "SELECT ___ FROM sospechosos WHERE tipo = 'principal'",
                "solution": "SELECT nombre FROM sospechosos WHERE tipo = 'principal'"
              },
              {
                "id": "1-2",
                "title": "Caso FBI - Pista 2",
                "description": "Obtén el nombre del sospechoso y la fecha de su último movimiento",
                "level": 1,
                "template": "SELECT s.nombre, m.fecha FROM sospechosos s ___ JOIN movimientos m ON s.id = m.sospechoso_id WHERE s.tipo = 'principal'",
                "solution": "SELECT s.nombre, m.fecha FROM sospechosos s INNER JOIN movimientos m ON s.id = m.sospechoso_id WHERE s.tipo = 'principal'"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 4,
          "data": {
            "id": "img-1-3",
            "url": "https://placehold.co/800x400/1f2937/ffffff/png?text=Escena+3:+Análisis+de+Patrones",
            "caption": "El agente analiza los patrones de movimiento de los sospechosos",
            "order": 4
          }
        },
        {
          "type": "sequence",
          "order": 5,
          "data": {
            "id": "seq-1-2",
            "title": "Secuencia 2: Análisis de Patrones Sospechosos",
            "description": "Identifica patrones anómalos en los movimientos de los sospechosos",
            "order": 5,
            "challenges": [
              {
                "id": "1-3",
                "title": "Caso FBI - Pista 3",
                "description": "Encuentra sospechosos que tienen más movimientos que el promedio",
                "level": 1,
                "template": "SELECT s.nombre, COUNT(m.id) as total_movimientos FROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id GROUP BY s.id, s.nombre ___ COUNT(m.id) > (SELECT ___(*) FROM movimientos)",
                "solution": "SELECT s.nombre, COUNT(m.id) as total_movimientos FROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id GROUP BY s.id, s.nombre HAVING COUNT(m.id) > (SELECT AVG(*) FROM movimientos)"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 6,
          "data": {
            "id": "img-1-2",
            "url": "https://placehold.co/800x400/1f2937/ffffff/png?text=Escena+4:+Caso+Resuelto",
            "caption": "¡Caso resuelto! El agente ha identificado al culpable",
            "order": 6
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 2",
      "storySteps": []
    },
    {
      "id": 3,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 3",
      "storySteps": []
    }
  ]
} as const;
