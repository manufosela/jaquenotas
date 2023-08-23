Teniendo la siguiente entrada de datos:

const entrada = {
  "20": [
    {
      "duracion": "5",
      "fechahora": "2023-08-20T10:00",
      "gradodolor": "D1",
      "medicacion": "Parecetamol 1gr.",
      "molestias": "M2,M8",
      "molestiasGroup": "M8",
      "otros_sintomas": "Mareos\nDificultad para hablar"
    },
    {
      "duracion": "1",
      "fechahora": "2023-08-20T23:00",
      "gradodolor": "D0",
      "medicacion": "Parecetamol 1gr.",
      "molestias": "M2,M8",
      "molestiasGroup": "M8",
      "otros_sintomas": ""
    }
  ],
  "22": [
    {
      "duracion": "",
      "fechahora": "2023-08-22T11:00",
      "gradodolor": "D0",
      "medicacion": "",
      "molestias": "M8",
      "otros_sintomas": ""
    }
  ]
}

Quiero obtener la siguiente salida:

const salida = [
  { "dia":20, "inicio": 10, "duracion": 5, "grado": 2 },
  { "dia":20, "inicio": 23, "duracion": 1, "grado": 1 },
  { "dia":22, "inicio": 11, "grado": 1 },
];

Teniendo en cuenta que:
La clave de salida inicio se obtiene del campo fechahora y es la hora en valor. Si son las 10:30 serian 10.5
La clave de salida dia se obtiene del dia del mes del campo fechahora
La clave de salida grado se obtiene del campo gradodolor, siendo D0 = 1, D1 = 2, D2 = 3, D3 = 4 y sucessivamente
Si la clave de entrada duracion es string vacio, no va ese campo en la salida.

Dame el codigo javascript que convierta la entrada en la salida
