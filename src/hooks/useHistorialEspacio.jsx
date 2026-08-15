import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../services/firebase';

export const useHistorialEspacio = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const historialRef = ref(database, 'historial');

    const unsubscribe = onValue(historialRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setHistorial([]);
        return;
      }

      const listaEventos = [];

      // Recorrer cada ID de espacio (A01, D04, D05, etc.)
      Object.keys(data).forEach((espacioId) => {
        const eventosEspacio = data[espacioId];
        Object.keys(eventosEspacio).forEach((eventId) => {
          listaEventos.push({
            id: eventId,
            espacioId, // Guarda qué espacio fue (ej. D04)
            ...eventosEspacio[eventId]
          });
        });
      });

      // Ordenar cronológicamente: el evento más reciente primero
      listaEventos.sort((a, b) => b.fechaHora - a.fechaHora);

      setHistorial(listaEventos);
    });

    return () => unsubscribe();
  }, []);

  return { historial };
};