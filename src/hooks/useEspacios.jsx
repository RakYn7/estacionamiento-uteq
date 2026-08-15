import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../services/firebase';
import { generar80Espacios } from '../services/parkingGenerator';

export const useEspacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const espaciosRef = ref(database, 'espacios');

    const unsubscribe = onValue(espaciosRef, (snapshot) => {
      const data = snapshot.val();

      // Si no hay datos o la respuesta es un objeto vacío, forzar la inserción
      if (!data || Object.keys(data).length === 0) {
        const datosIniciales = generar80Espacios();
        set(espaciosRef, datosIniciales);
      } else {
        const arregloEspacios = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setEspacios(arregloEspacios);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return { espacios, cargando };
};
