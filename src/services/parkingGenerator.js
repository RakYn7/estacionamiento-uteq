export const generar80Espacios = () => {
  const espacios = {};
  const colLetras = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

  // Bounding box UTEQ
  const latMin = -1.012586, latMax = -1.012269;
  const lngMin = -79.468237, lngMax = -79.467776;

  const numCols = 4;
  const numFilas = 20;

  const dLat = (latMax - latMin) / numFilas;
  const dLng = (lngMax - lngMin) / numCols;

  for (let c = 1; c <= numCols; c++) {
    const letra = colLetras[c];
    for (let f = 1; f <= numFilas; f++) {
      // Formato A01, A02 ... D20
      const id = `${letra}${String(f).padStart(2, '0')}`;
      
      const latCentro = latMin + (f - 0.5) * dLat;
      const lngCentro = lngMin + (c - 0.5) * dLng;

      espacios[id] = {
        columna: c,
        numero: f,
        estado: 'libre',
        distanciaDetectada: Math.floor(Math.random() * 100 + 110),
        fechaHora: Date.now(),
        ubicacion: {
          latitud: latCentro,
          longitud: lngCentro
        }
      };
    }
  }

  return espacios;
};