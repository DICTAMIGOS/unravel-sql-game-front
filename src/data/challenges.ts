export const challengesData = {
  "levels": [
    {
      "id": 1,
      "name": "FBI",
      "description": "Ayuda al FBI a resolver un caso",
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
        },
        {
          "id": "1-3",
          "title": "Caso FBI - Pista 3",
          "description": "Encuentra sospechosos que tienen más movimientos que el promedio",
          "level": 1,
          "template": "SELECT s.nombre, COUNT(m.id) as total_movimientos FROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id GROUP BY s.id, s.nombre ___ COUNT(m.id) > (SELECT ___(*) FROM movimientos)",
          "solution": "SELECT s.nombre, COUNT(m.id) as total_movimientos FROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id GROUP BY s.id, s.nombre HAVING COUNT(m.id) > (SELECT AVG(*) FROM movimientos)"
        }
      ]
    },
    {
      "id": 2,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 2",
      "challenges": []
    },
    {
      "id": 3,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 3",
      "challenges": []
    }
  ]
} as const;
