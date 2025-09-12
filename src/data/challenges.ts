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
            "url": "./public/images/escena_1_horizontal.png",
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
            "url": "./public/images/escena_2_horizontal.png",
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
            "url": "./public/images/escena_3_vertical.png",
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
            "url": "./public/images/escena_4.png",
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
            "url": "./public/images/escena_5.png",
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
            "title": "Secuencia 1: Configuración de la Base de Datos",
            "description": "Configura la base de datos para el caso Redentor",
            "order": 6,
            "challenges": [
              {
                "id": "1-1",
                "title": "Crear Base de Datos",
                "description": "Crea la base de datos para el caso Redentor",
                "level": 1,
                "template": "CREATE DATABASE ___;",
                "solution": "CREATE DATABASE Caso_Redentor;"
              },
              {
                "id": "1-2",
                "title": "Mostrar Tablas",
                "description": "Muestra las tablas de la base de datos Caso_Redentor",
                "level": 1,
                "template": "SHOW TABLES FROM ___;",
                "solution": "SHOW TABLES FROM Caso_Redentor;"
              },
              {
                "id": "1-3",
                "title": "Usar Base de Datos",
                "description": "Selecciona la base de datos Caso_Redentor para trabajar",
                "level": 1,
                "template": "USE ___;",
                "solution": "USE Caso_Redentor;"
              },
              {
                "id": "1-4",
                "title": "Consultar Tabla Casos",
                "description": "Selecciona todos los registros de la tabla Casos",
                "level": 1,
                "template": "SELECT ___ FROM ___;",
                "solution": "SELECT * FROM Casos;"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 7,
          "data": {
            "id": "img-1-6",
            "url": "./public/images/escena_6.png",
            "caption": "El tablero muestra patrones de movimiento.",
            "order": 7,
            "dialogs": [
              { "text": "El tablero muestra patrones de movimiento. Pero aún faltan piezas..." }
            ]
          }
        },
        {
          "type": "image",
          "order": 8,
          "data": {
            "id": "img-1-7",
            "url": "./public/images/escena_7.png",
            "caption": "No puedo hacer nada más sin tener más información… y eso preocupa.",
            "order": 8,
            "dialogs": [
              { "text": "No puedo hacer nada más sin tener más información… y eso preocupa." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 9,
          "data": {
            "id": "seq-1-2",
            "title": "Secuencia 2: Investigación NYPD",
            "description": "Investiga los operativos de estafa en la base de datos de la NYPD",
            "order": 9,
            "challenges": [
              {
                "id": "1-5",
                "title": "Usar Base de Datos NYPD",
                "description": "Selecciona la base de datos NYPD_DB",
                "level": 1,
                "template": "USE ___;",
                "solution": "USE NYPD_DB;"
              },
              {
                "id": "1-6",
                "title": "Consultar Operativos de Estafa",
                "description": "Selecciona todos los registros de la tabla Operativos_Estafa",
                "level": 1,
                "template": "SELECT ___ FROM ___;",
                "solution": "SELECT * FROM Operativos_Estafa;"
              },
              {
                "id": "1-7",
                "title": "Filtrar Incidentes de Estafa y Fraude",
                "description": "Encuentra incidentes de tipo estafa o fraude",
                "level": 1,
                "template": "SELECT ___ FROM ___ WHERE ___ =  \"estafa\" or ___ = \"fraude\";",
                "solution": "SELECT * FROM Incidentes WHERE Tipo_Incidente =  \"estafa\" or Tipo_Incidente = \"fraude\";"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 10,
          "data": {
            "id": "img-1-8",
            "url": "./public/images/escena_8.png",
            "caption": "Escena 8 - Continuación de la investigación.",
            "order": 10,
            "dialogs": [
              { "text": "La investigación continúa con nuevas pistas." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 11,
          "data": {
            "id": "seq-1-3",
            "title": "Secuencia 3: Análisis de Ciudadanos y Incidentes",
            "description": "Realiza análisis complejos combinando datos de ciudadanos e incidentes",
            "order": 11,
            "challenges": [
              {
                "id": "1-8",
                "title": "JOIN de Ciudadanos e Incidentes",
                "description": "Combina datos de ciudadanos e incidentes para casos de estafa y fraude",
                "level": 1,
                "template": "SELECT ___ FROM Ciudadanos \nLEFT JOIN Incidentes \nON ___.ID_Victima = ___.ID\nWHERE ___ = \"estafa\" OR ___ = \"fraude\";",
                "solution": "SELECT * FROM Ciudadanos \nLEFT JOIN Incidentes \nON Incidentes.ID_Victima = Ciudadanos.ID\nWHERE Tipo_Incidente = \"estafa\" OR Tipo_Incidente = \"fraude\";"
              },
              {
                "id": "1-9",
                "title": "Filtrar por Estado Civil y Familia",
                "description": "Encuentra ciudadanos divorciados o con familiares fallecidos involucrados en estafas",
                "level": 1,
                "template": "SELECT * FROM Ciudadanos \nLEFT JOIN Incidentes \nON Incidentes.ID_Victima = Ciudadanos.ID\nWHERE (Tipo_Incidente = \"estafa\" OR Tipo_Incidente = \"fraude\")\nAND (Divorciado = ___ OR Familiar_Fallecido = ___);",
                "solution": "SELECT * FROM Ciudadanos \nLEFT JOIN Incidentes \nON Incidentes.ID_Victima = Ciudadanos.ID\nWHERE (Tipo_Incidente = \"estafa\" OR Tipo_Incidente = \"fraude\")\nAND (Divorciado = TRUE OR Familiar_Fallecido = TRUE);"
              },
              {
                "id": "1-10",
                "title": "Filtrar por Fecha y Ordenar",
                "description": "Encuentra incidentes recientes (últimos 2 días) ordenados por fecha",
                "level": 1,
                "template": "SELECT * FROM Ciudadanos\nLEFT JOIN Incidentes\nON Incidentes.ID_Victima = Ciudadanos.ID\nWHERE \n    (Tipo_Incidente = \"estafa\" OR Tipo_Incidente = \"fraude\") \n    AND (Divorciado = TRUE OR Familiar_Fallecido = TRUE)\n    AND ___.Fecha_Incidente BETWEEN curdate()-2 AND curdate()\nORDER BY \n    Incidentes.___ DESC;",
                "solution": "SELECT * FROM Ciudadanos\nLEFT JOIN Incidentes\nON Incidentes.ID_Victima = Ciudadanos.ID\nWHERE \n    (Tipo_Incidente = \"estafa\" OR Tipo_Incidente = \"fraude\") \n    AND (Divorciado = TRUE OR Familiar_Fallecido = TRUE)\n    AND Incidentes.Fecha_Incidente BETWEEN curdate()-2 AND curdate()\nORDER BY \n    Incidentes.Fecha_Incidente DESC;"
              },
              {
                "id": "1-11",
                "title": "Buscar Dirección de Propiedad",
                "description": "Encuentra la dirección de la propiedad de Gus Fring",
                "level": 1,
                "template": "SELECT Direccion FROM Propiedades WHERE ___ = \"Gus Fring\";",
                "solution": "SELECT Direccion FROM Propiedades WHERE Propietario = \"Gus Fring\";"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 12,
          "data": {
            "id": "img-1-9",
            "url": "./public/images/escena_9.png",
            "caption": "Escena 9 - Nuevas revelaciones.",
            "order": 12,
            "dialogs": [
              { "text": "Nuevas revelaciones surgen en el caso." }
            ]
          }
        },
        {
          "type": "image",
          "order": 13,
          "data": {
            "id": "img-1-10",
            "url": "./public/images/escena_10.png",
            "caption": "Escena 10 - El caso se complica.",
            "order": 13,
            "dialogs": [
              { "text": "El caso se complica con cada nueva pista." }
            ]
          }
        },
        {
          "type": "image",
          "order": 14,
          "data": {
            "id": "img-1-11",
            "url": "./public/images/escena_11.png",
            "caption": "Escena 11 - Acercándose a la verdad.",
            "order": 14,
            "dialogs": [
              { "text": "Nos acercamos a la verdad del caso." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 15,
          "data": {
            "id": "seq-1-4",
            "title": "Secuencia 4: Investigación Avanzada",
            "description": "Realiza consultas más complejas para encontrar pistas adicionales",
            "order": 15,
            "challenges": [
              {
                "id": "1-12",
                "title": "INNER JOIN con Condiciones",
                "description": "Combina incidentes y ciudadanos con condiciones específicas",
                "level": 1,
                "template": "select * from Incidentes \ninner join Ciudadanos \nwhere ___.nombre = \"Gus Fring\" or ___.Cerrado = ___;",
                "solution": "select * from Incidentes \ninner join Ciudadanos \nwhere Ciudadanos.nombre = \"Gus Fring\" or Incidentes.Cerrado = false;"
              },
              {
                "id": "1-13",
                "title": "Búsqueda con LIKE",
                "description": "Busca propiedades cuyo propietario tenga apellido Fring",
                "level": 1,
                "template": "select * from ___ where Propietario like '% Fring';",
                "solution": "select * from Propiedades where Propietario like '% Fring';"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 16,
          "data": {
            "id": "img-1-12",
            "url": "./public/images/escena_12.png",
            "caption": "Escena 12 - La verdad se revela.",
            "order": 16,
            "dialogs": [
              { "text": "La verdad finalmente se revela." }
            ]
          }
        },
        {
          "type": "image",
          "order": 17,
          "data": {
            "id": "img-1-13",
            "url": "./public/images/escena_13.png",
            "caption": "Escena 13 - El desenlace se acerca.",
            "order": 17,
            "dialogs": [
              { "text": "El desenlace del caso se acerca." }
            ]
          }
        },
        {
          "type": "image",
          "order": 18,
          "data": {
            "id": "img-1-14",
            "url": "./public/images/escena_14.png",
            "caption": "Escena 14 - El final del caso.",
            "order": 18,
            "dialogs": [
              { "text": "El caso llega a su conclusión." }
            ]
          }
        },
        {
          "type": "sequence",
          "order": 19,
          "data": {
            "id": "seq-1-5",
            "title": "Secuencia 5: Análisis Final de Casos",
            "description": "Realiza el análisis final para identificar casos activos y sospechosos",
            "order": 19,
            "challenges": [
              {
                "id": "1-14",
                "title": "Casos Activos",
                "description": "Encuentra casos que no están en custodia o no están cerrados",
                "level": 1,
                "template": "select ___ from Casos where Custodia = ___ ___ cerrado = ___;",
                "solution": "select * from Casos where Custodia = false or cerrado = false;"
              },
              {
                "id": "1-15",
                "title": "Sospechosos Distintos",
                "description": "Encuentra sospechosos únicos de casos activos",
                "level": 1,
                "template": "select distinct Sospechoso from ___ where (Custodia = ___ ___ Cerrado = ___);",
                "solution": "select distinct Sospechoso from Casos where (Custodia = false or Cerrado = false);"
              }
            ]
          }
        },
        {
          "type": "image",
          "order": 20,
          "data": {
            "id": "img-1-15",
            "url": "./public/images/escena_final.png",
            "caption": "Fin - El caso ha sido resuelto.",
            "order": 20,
            "dialogs": [
              { "text": "El caso ha sido resuelto. La justicia prevalece." }
            ]
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 2",
      "locked": true,
      "storySteps": []
    },
    {
      "id": 3,
      "name": "Próximamente...",
      "description": "Espera a que se publique el capítulo 3",
      "locked": true,
      "storySteps": []
    }
  ]
} as const;
