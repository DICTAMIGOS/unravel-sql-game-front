export const challengesData = {
  "levels": [
    {
      "id": 1,
      "name": "Nivel 1 – Memoria Corrupta",
      "description": "Introducción al caso. Decodifica la memoria y arma la base de datos inicial.",
      "storySteps": [
        {
          "type": "image",
          "order": 1,
          "data": {
            "id": "img-1-1",
            "url": "./images/escena_1_horizontal.png",
            "caption": "Una lápida cubierta por lluvia; el nombre es ilegible.",
            "order": 1,
            "dialogs": [
              { "text": "En una línea de trabajo como la nuestra, vemos al abismo directamente..." },
              { "text": "A veces el abismo nos regresa la mirada." },
              { "text": "Muchos imaginan atrapar a los malos, tener revelaciones de último minuto, disparar un arma..." },
              { "text": "Pero pocos imaginan lo que realmente vivimos: ver al diablo a los ojos y seguir siendo tú." }
            ]
          }
        },
        {
          "type": "image",
          "order": 2,
          "data": {
            "id": "img-1-2",
            "url": "./images/escena_2_horizontal.png",
            "caption": "En el desierto, una mujer arrodillada; la lluvia no cesa.",
            "order": 2,
            "dialogs": [
              { "text": "Siempre creemos que hemos visto lo más bajo de la humanidad..." },
              { "text": "Luego llega algo como esto y tenemos que volver a cuestionarlo todo." }
            ]
          }
        },
        {
          "type": "image",
          "order": 3,
          "data": {
            "id": "img-1-3",
            "url": "./images/escena_3_vertical.png",
            "caption": "Mark Thompson y Daniel Miller observan el cuerpo.",
            "order": 3,
            "dialogs": [
              { "text": "Mark: La encontramos así, esto no es normal." },
              { "text": "Daniel: Nada en este trabajo lo es. ¿Qué diablos le pasó?" }
            ]
          }
        },
        {
          "type": "image",
          "order": 4,
          "data": {
            "id": "img-1-4",
            "url": "./images/escena_4.png",
            "caption": "El estado del cuerpo se revela en fragmentos con alto contraste.",
            "order": 4,
            "dialogs": [
              { "text": "Mark: Tres días. La ató, golpeó, le sacó los ojos y... la cosió, para dejarla así." },
              { "text": "Daniel: ¿Y para qué me necesitas a mí?" }
            ]
          }
        },
        {
          "type": "image",
          "order": 5,
          "data": {
            "id": "img-1-5",
            "url": "./images/escena_5.png",
            "caption": "La mano de Mark sostiene un collar ensangrentado: 'Para Daniel Miller'.",
            "order": 5,
            "dialogs": []
          }
        },
        {
          "type": "sequence",
          "order": 6,
          "data": {
            "id": "seq-1-1",
            "title": "Secuencia 1: Inicialización y Reconstrucción",
            "description": "Decodifica la memoria y crea la base para iniciar las consultas.",
            "order": 6,
            "dialogs": [
              { "text": "“Los datos aparecen corruptos... tengo que intentar recuperar lo más que pueda.”" },
              { "text": "“Los datos parecen ser aleatorios...”" }
            ],
            "challenges": [
              {
                "id": "1-0",
                "title": "Crear tablas base",
                "description": "Prepara el esquema mínimo para cargar datos de la memoria.",
                "level": 1,
                "template": "CREATE TABLE sospechosos ( ... );\nCREATE TABLE movimientos ( ... );",
                "solution": "CREATE TABLE sospechosos (id INT PRIMARY KEY, nombre VARCHAR(100), tipo VARCHAR(50));\nCREATE TABLE movimientos (id INT PRIMARY KEY, sospechoso_id INT, fecha DATE, detalle TEXT,\n  FOREIGN KEY (sospechoso_id) REFERENCES sospechosos(id));"
              }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 7,
          "data": {
            "id": "seq-1-2",
            "title": "Secuencia 2: Identificación del Sospechoso Principal",
            "description": "Analiza la base de datos para encontrar y perfilar al principal.",
            "order": 7,
            "dialogs": [
              { "text": "“Creo que puedo meterlos a una base.”" },
              { "text": "“Parece una copia rústica de nuestros casos.”" },
              { "text": "“No puedo hacer nada más sin más información... eso me preocupa.”" }
            ],
            "challenges": [
              {
                "id": "1-1",
                "title": "Caso FBI - Pista 1",
                "description": "Encuentra el nombre del sospechoso principal en la base de datos.",
                "level": 1,
                "template": "SELECT ___ FROM sospechosos WHERE tipo = 'principal'",
                "solution": "SELECT nombre FROM sospechosos WHERE tipo = 'principal'"
              },
              {
                "id": "1-2",
                "title": "Caso FBI - Pista 2",
                "description": "Obtén el nombre del sospechoso y la fecha de su último movimiento.",
                "level": 1,
                "template": "SELECT s.nombre, m.fecha FROM sospechosos s ___ JOIN movimientos m ON s.id = m.sospechoso_id WHERE s.tipo = 'principal'",
                "solution": "SELECT s.nombre, m.fecha FROM sospechosos s INNER JOIN movimientos m ON s.id = m.sospechoso_id WHERE s.tipo = 'principal'"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 8,
          "data": {
            "id": "img-1-6",
            "url": "./images/escena_6.png",
            "caption": "El tablero muestra patrones de movimiento.",
            "order": 8,
            "dialogs": [
              { "text": "El tablero muestra patrones de movimiento. Pero aún faltan piezas..." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 9,
          "data": {
            "id": "seq-1-3",
            "title": "Secuencia 3: Patrones Sospechosos",
            "description": "Identifica sospechosos con actividad fuera de lo normal.",
            "order": 9,
            "dialogs": [],
            "challenges": [
              {
                "id": "1-3",
                "title": "Caso FBI - Pista 3",
                "description": "Encuentra sospechosos que tienen más movimientos que el promedio.",
                "level": 1,
                "template": "SELECT s.nombre, COUNT(m.id) AS total_movimientos\nFROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id\nGROUP BY s.id, s.nombre ___ COUNT(m.id) > (SELECT ___ FROM (SELECT COUNT(*) AS cnt FROM movimientos GROUP BY sospechoso_id) t)",
                "solution": "SELECT s.nombre, COUNT(m.id) AS total_movimientos\nFROM sospechosos s JOIN movimientos m ON s.id = m.sospechoso_id\nGROUP BY s.id, s.nombre\nHAVING COUNT(m.id) > (SELECT AVG(cnt) FROM (SELECT COUNT(*) AS cnt FROM movimientos GROUP BY sospechoso_id) t)"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 10,
          "data": {
            "id": "img-1-7",
            "url": "./images/escena_7.png",
            "caption": "“No puedo hacer nada más sin tener más información… y eso preocupa.”",
            "order": 10,
            "dialogs": [
              { "text": "“No puedo hacer nada más sin tener más información… y eso preocupa.”" }
            ]
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Nivel 2 – El Caso Scottie Reacher",
      "description": "Briefing del equipo, tutorial de búsquedas y filtrados. Primer objetivo: Gus Fring.",
      "storySteps": [
        {
          "type": "image",
          "order": 1,
          "data": {
            "id": "img-2-1",
            "url": "./images/escena_6.png",
            "caption": "En la pantalla, Scottie Reacher con 'Mentiras' cortado en el pecho.",
            "order": 1,
            "dialogs": [
              { "text": "Dwight: Scottie Reacher fue hallado anoche en Hell’s Kitchen, NYC." },
              { "text": "Es la tercera víctima; todos estafadores: ‘seguros’ e ‘inversiones’ fraudulentas." }
            ]
          }
        },
        {
          "type": "image",
          "order": 2,
          "data": {
            "id": "img-2-2",
            "url": "./images/escena_7.png",
            "caption": "Mark, Daniel y Ava se presentan y trazan el plan.",
            "order": 2,
            "dialogs": [
              { "text": "Mark: El móvil parece personal. ¿Qué sabemos de estafadores en NYC?" },
              { "text": "Daniel: Abundan. El FBI guarda datos de algunos… quizá parte de algo mayor." },
              { "text": "Ava: Filtra víctimas con fraudes reportados. Quien pierde demasiado, explota." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 3,
          "data": {
            "id": "seq-2-1",
            "title": "Tutorial: Conexión y Consulta Inicial",
            "description": "Conéctate a NYPD y extrae estafadores e informes.",
            "order": 3,
            "dialogs": [
              { "text": "“Tengo que entrar a la base de datos de la policía de Nueva York.”" },
              { "text": "“Bien, ahora la información de los estafadores de Nueva York.”" },
              { "text": "“No fue mucho, pero podrá servir. Ahora, los informes de fraude.”" }
            ],
            "challenges": [
              {
                "id": "2-1",
                "title": "Conectar a NYPD_DB",
                "description": "Simula el acceso a la base de datos de NYPD.",
                "level": 2,
                "template": "CONNECT NYPD_DB; -- simulado",
                "solution": "OK"
              },
              {
                "id": "2-2",
                "title": "Estafadores en NYC",
                "description": "Obtén estafadores activos en NYC.",
                "level": 2,
                "template": "SELECT nombre, esquema, zona FROM estafadores WHERE zona = 'NYC';",
                "solution": "SELECT nombre, esquema, zona FROM estafadores WHERE zona = 'NYC';"
              },
              {
                "id": "2-3",
                "title": "Informes de fraude en Nueva York",
                "description": "Lista reportes con víctima, monto, fecha y estafador sospechado.",
                "level": 2,
                "template": "SELECT victima_id, monto, fecha, estafador_sospechado FROM reportes_fraude WHERE ciudad = 'New York';",
                "solution": "SELECT victima_id, monto, fecha, estafador_sospechoso FROM reportes_fraude WHERE ciudad = 'New York';"
              }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 4,
          "data": {
            "id": "seq-2-2",
            "title": "Filtro de Víctimas con Factores de Riesgo",
            "description": "Cruza víctimas con ciudadanos y filtra por duelo/divorcio y recencia.",
            "order": 4,
            "dialogs": [
              { "text": "Ava: Danny, necesitamos un filtrado de víctimas de fraudes. Cruza con ciudadanos." },
              { "text": "“Necesitamos quienes pasaron por divorcio o fallecimiento familiar.”" },
              { "text": "“Ahora, los más recientes: últimos 2 meses.”" },
              { "text": "“Danos la dirección, Danny.”" }
            ],
            "challenges": [
              {
                "id": "2-4",
                "title": "Filtrado prioritario",
                "description": "Últimos 2 meses, con divorcio o fallecimiento familiar.",
                "level": 2,
                "template": "SELECT c.nombre, r.monto, r.fecha, c.direccion\nFROM reportes_fraude r\nJOIN ciudadanos c ON c.id = r.victima_id\nWHERE (c.divorciado = TRUE OR c.fallecimiento_familiar = TRUE)\n  AND r.fecha BETWEEN DATEADD(MONTH, -2, CURRENT_DATE) AND CURRENT_DATE\nORDER BY r.monto DESC;",
                "solution": "SELECT c.nombre, r.monto, r.fecha, c.direccion\nFROM reportes_fraude r\nJOIN ciudadanos c ON c.id = r.victima_id\nWHERE (c.divorciado = TRUE OR c.fallecimiento_familiar = TRUE)\n  AND r.fecha BETWEEN DATEADD(MONTH, -2, CURRENT_DATE) AND CURRENT_DATE\nORDER BY r.monto DESC;"
              },
              {
                "id": "2-5",
                "title": "Dirección de Gus Fring",
                "description": "Obtén la dirección cuando el nombre sea 'Gus Fring'.",
                "level": 2,
                "template": "SELECT c.direccion FROM ciudadanos c WHERE c.nombre = 'Gus Fring';",
                "solution": "SELECT c.direccion FROM ciudadanos c WHERE c.nombre = 'Gus Fring';"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 5,
          "data": {
            "id": "img-2-3",
            "url": "./images/escena_9.png",
            "caption": "El equipo irrumpe en la casa de Gus.",
            "order": 5,
            "dialogs": [
              { "text": "Redada en la casa de Gus Fring. Silencio... hasta que algo suena al fondo." }
            ]
          }
        },
        {
          "type": "image",
          "order": 6,
          "data": {
            "id": "img-2-4",
            "url": "./images/escena10.png",
            "caption": "Comienza la persecución nocturna por la ciudad.",
            "order": 6,
            "dialogs": [
              { "text": "La persecución comienza. La ciudad, la lluvia y los focos recortan sombras." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 7,
          "data": {
            "id": "seq-2-3",
            "title": "Interrogatorio y Propiedades",
            "description": "Consulta antecedentes abiertos y propiedades vinculadas a 'Fring'.",
            "order": 7,
            "dialogs": [
              { "text": "“Necesitamos sus antecedentes. Seguramente hay violencia no resuelta.”" },
              { "text": "“Busca propiedades del núcleo familiar; alguna bodega o casa.”" }
            ],
            "challenges": [
              {
                "id": "2-6",
                "title": "Antecedentes abiertos",
                "description": "Une antecedentes con el sospechoso 'Gus Fring'.",
                "level": 2,
                "template": "SELECT a.*\nFROM antecedentes a\nJOIN sospechosos s ON s.id = a.sospechoso_id\nWHERE s.nombre = 'Gus Fring' AND a.abierto = TRUE;",
                "solution": "SELECT a.*\nFROM antecedentes a\nJOIN sospechosos s ON s.id = a.sospechoso_id\nWHERE s.nombre = 'Gus Fring' AND a.abierto = TRUE;"
              },
              {
                "id": "2-7",
                "title": "Propiedades del núcleo familiar",
                "description": "Busca bodegas/casas cuya cadena de propietario contenga 'Fring'.",
                "level": 2,
                "template": "SELECT p.* FROM propiedades p WHERE p.propietario LIKE '%Fring%';",
                "solution": "SELECT p.* FROM propiedades p WHERE p.propietario LIKE '%Fring%';"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 8,
          "data": {
            "id": "img-2-5",
            "url": "./images/escena_12.png",
            "caption": "Redada en una bodega; la víctima no logra ser salvada.",
            "order": 8,
            "dialogs": [
              { "text": "Llegamos tarde. La víctima no logró ser salvada." }
            ]
          }
        },
        {
          "type": "image",
          "order": 9,
          "data": {
            "id": "img-2-6",
            "url": "./images/escena_13.png",
            "caption": "Gus es ingresado en custodia policial.",
            "order": 9,
            "dialogs": [
              { "text": "Gus es ingresado en custodia. Algo no encaja del todo." }
            ]
          }
        }
      ]
    },
    {
      "id": 3,
      "name": "Nivel 3 – Los Ciegos Ven",
      "description": "Gus escapa. Nueva memoria con un código. Crea vistas y relaciona culpables con víctimas.",
      "storySteps": [
        {
          "type": "image",
          "order": 1,
          "data": {
            "id": "img-3-1",
            "url": "./images/escena_14.png",
            "caption": "La pantalla revela que Gus escapó de custodia.",
            "order": 1,
            "dialogs": [
              { "text": "Gus escapó de custodia. Alguien abrió la puerta… o lo dejó pasar." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 2,
          "data": {
            "id": "seq-3-1",
            "title": "Desencriptación de la Memoria",
            "description": "Decodifica el mensaje: 'Los ciegos ven lo que el ojo ignora…'",
            "order": 2,
            "dialogs": [
              { "text": "“Otra memoria... esto no me gusta nada.”" },
              { "text": "“Esto parece ser una especie de código.”" },
              { "text": "“Los ciegos ven lo que el ojo ignora. Busca la verdad en las sombras de los que fallaron...”" }
            ],
            "challenges": [
              {
                "id": "3-1",
                "title": "Decodificar mensaje",
                "description": "Recupera el texto completo del enigma.",
                "level": 3,
                "template": "DECODE('Los ciegos ven lo que el ojo ignora...') -- minijuego simulado",
                "solution": "Los ciegos ven lo que el ojo ignora. Busca la verdad en las sombras de los que fallaron..."
              }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 3,
          "data": {
            "id": "seq-3-2",
            "title": "Identificar a 'los que escaparon'",
            "description": "Filtra casos sin custodia o abiertos.",
            "order": 3,
            "dialogs": [
              { "text": "“La respuesta debe estar por aquí... ‘los que escaparon’.”" },
              { "text": "“Filtra: en custodia = FALSE o cerrado = FALSE.”" }
            ],
            "challenges": [
              {
                "id": "3-2",
                "title": "Filtrado de escapados",
                "description": "Obtén ID y nombre de sospechosos con casos sin cerrar o sin custodia.",
                "level": 3,
                "template": "SELECT s.id, s.nombre\nFROM casos c\nJOIN sospechosos s ON s.id = c.sospechoso_id\nWHERE c.en_custodia = FALSE OR c.cerrado = FALSE;",
                "solution": "SELECT s.id, s.nombre\nFROM casos c\nJOIN sospechosos s ON s.id = c.sospechoso_id\nWHERE c.en_custodia = FALSE OR c.cerrado = FALSE;"
              }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 4,
          "data": {
            "id": "seq-3-3",
            "title": "Une culpables con víctimas",
            "description": "Relaciona 'vw_escapados' con víctimas de casos abiertos.",
            "order": 4,
            "dialogs": [
              { "text": "“Lo guardaré en una vista para que sea más rápido.”" },
              { "text": "“Ahí guardaré la lista de sospechosos.”" }
            ],
            "challenges": [
              {
                "id": "3-4",
                "title": "Join culpables-víctimas",
                "description": "Construye la red de relaciones principal.",
                "level": 3,
                "template": "SELECT e.nombre AS sospechoso, v.nombre AS victima, ca.id AS caso\nFROM vw_escapados e\nJOIN casos ca ON ca.sospechoso_id = e.id AND ca.cerrado = FALSE\nJOIN victimas v ON v.id = ca.victima_id;",
                "solution": "SELECT e.nombre AS sospechoso, v.nombre AS victima, ca.id AS caso\nFROM vw_escapados e\nJOIN casos ca ON ca.sospechoso_id = e.id AND ca.cerrado = FALSE\nJOIN victimas v ON v.id = ca.victima_id;"
              },
              {
                "id": "3-5",
                "title": "Patrones en evidencias",
                "description": "Busca marcas como 'Mentiras' para detectar coincidencias.",
                "level": 3,
                "template": "SELECT e.nombre AS sospechoso, COUNT(*) AS coincidencias\nFROM vw_escapados e\nJOIN evidencias ev ON ev.sospechoso_id = e.id\nWHERE LOWER(ev.marca) LIKE '%mentiras%'\nGROUP BY e.nombre\nHAVING COUNT(*) >= 1;",
                "solution": "SELECT e.nombre AS sospechoso, COUNT(*) AS coincidencias\nFROM vw_escapados e\nJOIN evidencias ev ON ev.sospechoso_id = e.id\nWHERE LOWER(ev.marca) LIKE '%mentiras%'\nGROUP BY e.nombre\nHAVING COUNT(*) >= 1;"
              }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 5,
          "data": {
            "id": "seq-3-4",
            "title": "Cruce temporal y geoespacial",
            "description": "Relaciona movimientos con lugar/fecha de víctimas.",
            "order": 5,
            "dialogs": [],
            "challenges": [
              {
                "id": "3-6",
                "title": "Match espacio-tiempo",
                "description": "Une movimientos ±3 días con el lugar del crimen.",
                "level": 3,
                "template": "SELECT e.nombre AS sospechoso, v.nombre AS victima, v.lugar, v.fecha\nFROM vw_escapados e\nJOIN movimientos m ON m.sospechoso_id = e.id\nJOIN victimas v ON v.fecha BETWEEN DATEADD(DAY,-3,m.fecha) AND DATEADD(DAY,3,m.fecha)\n  AND v.lugar = m.lugar;",
                "solution": "SELECT e.nombre AS sospechoso, v.nombre AS victima, v.lugar, v.fecha\nFROM vw_escapados e\nJOIN movimientos m ON m.sospechoso_id = e.id\nJOIN victimas v ON v.fecha BETWEEN DATEADD(DAY,-3,m.fecha) AND DATEADD(DAY,3,m.fecha)\n  AND v.lugar = m.lugar;"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 6,
          "data": {
            "id": "img-3-2",
            "url": "./images/escena_14.png",
            "caption": "Reporte final: 'Que la luz del sol no los toque'.",
            "order": 6,
            "dialogs": [
              { "text": "Reporte final: ‘Que la luz del sol no los toque’…" }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 7,
          "data": {
            "id": "seq-3-5",
            "title": "Reporte Final",
            "description": "Expón a culpables y víctimas en un resumen ordenado.",
            "order": 7,
            "dialogs": [],
            "challenges": [
              {
                "id": "3-7",
                "title": "Generar reporte",
                "description": "Listado final de sospechosos, víctimas y estado del caso.",
                "level": 3,
                "template": "SELECT e.nombre AS sospechoso, v.nombre AS victima, ca.id AS caso, ca.estado\nFROM vw_escapados e\nJOIN casos ca ON ca.sospechoso_id = e.id\nJOIN victimas v ON v.id = ca.victima_id\nORDER BY sospechoso, victima;",
                "solution": "SELECT e.nombre AS sospechoso, v.nombre AS victima, ca.id AS caso, ca.estado\nFROM vw_escapados e\nJOIN casos ca ON ca.sospechoso_id = e.id\nJOIN victimas v ON v.id = ca.victima_id\nORDER BY sospechoso, victima;"
              }
            ]
          }
        }
      ]
    }
  ]
} as const;
