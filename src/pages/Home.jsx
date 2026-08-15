import { useState } from 'react';
import { useEspacios } from '../hooks/useEspacios';
import { useHistorialEspacio } from '../hooks/useHistorialEspacio';
import { ref, set, push } from 'firebase/database';
import { database } from '../services/firebase';
import { generar80Espacios } from '../services/parkingGenerator';

export const Home = () => {
  const { espacios, cargando } = useEspacios();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [columnaFiltro, setColumnaFiltro] = useState('Todas');
  const [seleccionadoId, setSeleccionadoId] = useState('A01');
  const [pestanaActiva, setPestanaActiva] = useState('resumen');

  // Asigna el espacio seleccionado asegurando un valor inicial
  const seleccionado = espacios.find(e => e.id === seleccionadoId) || espacios[0] || {};
  const currentId = seleccionado.id || 'A01';

  // Hook para el historial acumulado
  const { historial } = useHistorialEspacio();

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel UTEQ Smart Parking...</div>;

  const colLetras = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };

  const total = espacios.length;
  const libres = espacios.filter(e => e.estado === 'libre').length;
  const ocupados = espacios.filter(e => e.estado === 'ocupado').length;
  const pctLibres = total > 0 ? Math.round((libres / total) * 100) : 0;
  const pctOcupados = total > 0 ? Math.round((ocupados / total) * 100) : 0;

  const simularCambioEstado = async () => {
    if (!seleccionado.id) return;
    const nuevoEstado = seleccionado.estado === 'libre' ? 'ocupado' : 'libre';
    const nuevaDistancia = nuevoEstado === 'ocupado' 
      ? Math.floor(Math.random() * 40 + 10) 
      : Math.floor(Math.random() * 100 + 110);
    const timestamp = Date.now();

    await set(ref(database, `espacios/${seleccionado.id}/estado`), nuevoEstado);
    await set(ref(database, `espacios/${seleccionado.id}/distanciaDetectada`), nuevaDistancia);
    await set(ref(database, `espacios/${seleccionado.id}/fechaHora`), timestamp);

    const historialRef = ref(database, `historial/${seleccionado.id}`);
    await push(historialRef, {
      estado: nuevoEstado,
      distancia: nuevaDistancia,
      fechaHora: timestamp
    });
  };

  const formatearFecha = (ts) => {
    if (!ts) return '--';
    const d = new Date(ts);
    return `${d.getDate()}-ago, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  // Función para determinar el color de cada tarjeta
  const obtenerColorEstado = (estado) => {
    if (estado === 'libre') return '#15803d'; // Verde
    if (estado === 'ocupado') return '#b91c1c'; // Rojo
    return '#475569'; // Gris (sin información)
  };

  const latitudMapa = seleccionado?.ubicacion?.latitud || -1.012269;
  const longitudMapa = seleccionado?.ubicacion?.longitud || -79.468195;

  return (
    <div style={{ backgroundColor: '#f4f7f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#1a2e22' }}>
      
      {/* HEADER SUPERIOR */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#0f5b38', color: '#ffffff', fontWeight: 'bold', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>U</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>UTEQ Smart Parking</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Monitoreo telemático del parqueadero</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '500' }}>
          <span 
            onClick={() => setPestanaActiva('resumen')} 
            style={{ color: pestanaActiva === 'resumen' ? '#0f5b38' : '#64748b', fontWeight: pestanaActiva === 'resumen' ? 'bold' : 'normal', cursor: 'pointer' }}
          >
            Resumen
          </span>
          <span 
            onClick={() => setPestanaActiva('mapa')} 
            style={{ color: pestanaActiva === 'mapa' ? '#0f5b38' : '#64748b', fontWeight: pestanaActiva === 'mapa' ? 'bold' : 'normal', cursor: 'pointer' }}
          >
            Mapa Geográfico
          </span>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>● RTDB en vivo</span>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* BANNER PRINCIPAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f5b38', letterSpacing: '1px', marginBottom: '6px' }}>CAMPUS UTEQ • QUEVEDO</div>
            <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: '800' }}>Parqueadero inteligente</h1>
            <p style={{ color: '#475569', fontSize: '14px', maxWidth: '600px', margin: 0, lineHeight: '1.5' }}>
              Simulación de 80 sensores ultrasónicos organizados en cuatro columnas. Cada cuadro representa una plaza y se actualiza en tiempo real desde Firebase.
            </p>
          </div>
          <button 
            onClick={() => set(ref(database, 'espacios'), generar80Espacios())}
            style={{ backgroundColor: '#0f5b38', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
          >
            Re-generar 80 Espacios
          </button>
        </div>

        {/* METRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>TOTAL</div>
            <div style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0' }}>{total}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>espacios monitoreados</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a' }}>DISPONIBLES</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#16a34a', margin: '4px 0' }}>{libres}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{pctLibres}% del parqueadero</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#dc2626' }}>OCUPADOS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626', margin: '4px 0' }}>{ocupados}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{pctOcupados}% del parqueadero</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>DISTRIBUCIÓN</div>
            <div style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0' }}>4 × 20</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>columnas × espacios</div>
          </div>
        </div>

        {/* CONTENIDO SEGÚN LA PESTAÑA */}
        {pestanaActiva === 'mapa' ? (
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#0f5b38' }}>UBICACIÓN EN TIEMPO REAL</div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '18px' }}>Mapa de Coordenadas del Parqueadero</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Coordenadas actuales ({currentId}): Latitud {latitudMapa}, Longitud {longitudMapa}
              </p>
            </div>
            <div style={{ width: '100%', height: '450px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <iframe
                title="Mapa Parqueadero UTEQ"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${latitudMapa},${longitudMapa}&z=18&output=embed`}
              ></iframe>
            </div>
          </div>
        ) : (
          /* CONTENIDO PRINCIPAL: CUADRÍCULA Y DETALLES */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            
            {/* PANEL IZQUIERDO: CUADRÍCULA SOLO CON EL ID DE CADA CASILLA */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#0f5b38' }}>VISTA OPERATIVA</div>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '18px' }}>Disponibilidad por espacio</h3>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#15803d', fontWeight: 'bold' }}>● Libre</span>
                  <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>● Ocupado</span>
                  <span style={{ color: '#475569', fontWeight: 'bold' }}>● Sin Info</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '5px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
                  {['Todos', 'Libres', 'Ocupados'].map(f => (
                    <button key={f} onClick={() => setFiltroEstado(f)} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', backgroundColor: filtroEstado === f ? '#ffffff' : 'transparent', fontWeight: filtroEstado === f ? 'bold' : 'normal', cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '5px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
                  {['Todas', 'A', 'B', 'C', 'D'].map(c => (
                    <button key={c} onClick={() => setColumnaFiltro(c)} style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', border: 'none', backgroundColor: columnaFiltro === c ? '#ffffff' : 'transparent', fontWeight: columnaFiltro === c ? 'bold' : 'normal', cursor: 'pointer' }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '15px', color: '#ffffff' }}>
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', letterSpacing: '2px', marginBottom: '10px' }}>--- ENTRADA ---</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[1, 2, 3, 4].map(cNum => {
                    const cLetra = colLetras[cNum];
                    if (columnaFiltro !== 'Todas' && columnaFiltro !== cLetra) return <div key={cNum}></div>;

                    return (
                      <div key={cNum}>
                        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>COLUMNA {cLetra}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Array.from({ length: 20 }, (_, i) => i + 1).map(nNum => {
                            const idStr = `${cLetra}${String(nNum).padStart(2, '0')}`;
                            const esp = espacios.find(e => e.id === idStr);
                            if (!esp) return null;

                            if (filtroEstado === 'Libres' && esp.estado !== 'libre') return null;
                            if (filtroEstado === 'Ocupados' && esp.estado !== 'ocupado') return null;

                            const esSel = esp.id === currentId;
                            const colorFondo = obtenerColorEstado(esp.estado);

                            return (
                              <div
                                key={esp.id}
                                onClick={() => setSeleccionadoId(esp.id)}
                                style={{
                                  backgroundColor: colorFondo,
                                  borderRadius: '6px',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  border: esSel ? '2px solid #ffffff' : '1px solid transparent',
                                  boxShadow: esSel ? '0 0 0 2px #38bdf8' : 'none',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '28px'
                                }}
                              >
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff' }}>{idStr}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* PANEL DERECHO: DETALLES DEL SENSOR Y HISTORIAL GENERAL */}
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#0f5b38' }}>SENSOR SELECCIONADO</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '15px' }}>
                  <h2 style={{ fontSize: '32px', margin: 0, fontWeight: '800' }}>
                    {currentId}
                  </h2>
                  <span style={{ backgroundColor: seleccionado?.estado === 'libre' ? '#dcfce7' : (seleccionado?.estado === 'ocupado' ? '#fee2e2' : '#f1f5f9'), color: seleccionado?.estado === 'libre' ? '#15803d' : (seleccionado?.estado === 'ocupado' ? '#b91c1c' : '#475569'), padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                    {seleccionado?.estado ? seleccionado.estado.toUpperCase() : 'SIN INFO'}
                  </span>
                </div>

                {/* BARRA DE DISTANCIA */}
                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Distancia detectada</div>
                  <div style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0' }}>
                    {seleccionado?.distanciaDetectada ?? '--'} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>cm</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                    <div style={{ width: `${Math.min(100, ((seleccionado?.distanciaDetectada || 0) / 200) * 100)}%`, height: '100%', backgroundColor: obtenerColorEstado(seleccionado?.estado) }}></div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>Umbral del sensor: 50 cm</div>
                </div>

                {/* DETALLES TÉCNICOS */}
                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>ID RTDB</div>
                    <div style={{ fontFamily: 'monospace' }}>{currentId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>COLUMNA / NÚMERO</div>
                    <div>{colLetras[seleccionado?.columna] || '--'} / {seleccionado?.numero || '--'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>CENTRO GEOGRÁFICO</div>
                    <div>{seleccionado?.ubicacion?.latitud?.toFixed(6) || '--'}, {seleccionado?.ubicacion?.longitud?.toFixed(6) || '--'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>ÚLTIMA ACTUALIZACIÓN</div>
                    <div>{formatearFecha(seleccionado?.fechaHora)}</div>
                  </div>
                </div>

                {/* SECCIÓN DE HISTORIAL GENERAL */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>Historial general</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{historial.length} eventos</span>
                  </div>

                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                    {historial.length === 0 ? (
                      <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', padding: '10px 0' }}>
                        Sin eventos registrados.
                      </div>
                    ) : (
                      historial.map((ev) => (
                        <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderBottom: '1px solid #f8fafc', paddingBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 'bold', padding: '2px 5px', borderRadius: '4px', marginRight: '6px', fontSize: '10px' }}>
                              {ev.espacioId}
                            </span>
                            <span style={{ color: ev.estado === 'libre' ? '#16a34a' : '#dc2626', fontWeight: 'bold', marginRight: '6px' }}>
                              ● {ev.estado === 'libre' ? 'Libre' : 'Ocupado'}
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: '10px' }}>{formatearFecha(ev.fechaHora)}</span>
                          </div>
                          <span style={{ fontWeight: 'bold', color: '#334155' }}>{ev.distancia} cm</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              <button
                onClick={simularCambioEstado}
                style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #0f5b38', color: '#0f5b38', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', marginTop: '15px' }}
              >
                Simular cambio de estado
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};