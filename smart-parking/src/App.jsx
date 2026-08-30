import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [vehiculos, setVehiculos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false); // Para deshabilitar botones en guardado/edición/eliminación

  // Paginación (5 elementos por página)
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Modales y Estados
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);

  // Formulario de creación
  const [nuevoForm, setNuevoForm] = useState({
    placa: '', vehiculo: '', anio_color: '', propietario: '',
    cedula: '', correo: '', foto_vehiculo: '', foto_propietario: '', estado: 'Autorizado'
  });

  // Mensajes de alerta/feedback
  const [alerta, setAlerta] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    obtenerVehiculos();
  }, []);

  const mostrarMensaje = (tipo, texto) => {
    setAlerta({ tipo, texto });
    setTimeout(() => setAlerta({ tipo: '', texto: '' }), 4000);
  };

  const obtenerVehiculos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .order('propietario', { ascending: true });

    if (error) {
      mostrarMensaje('error', 'Error al cargar los vehículos: ' + error.message);
    } else {
      setVehiculos(data || []);
    }
    setCargando(false);
  };

  const validarFormulario = (form) => {
    if (!form.placa || !form.vehiculo || !form.propietario || !form.cedula || !form.correo) {
      mostrarMensaje('error', 'Por favor, completa todos los campos obligatorios.');
      return false;
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(form.correo)) {
      mostrarMensaje('error', 'Por favor, ingresa un correo institucional válido.');
      return false;
    }
    return true;
  };

  const handleCrearVehiculo = async (e) => {
    e.preventDefault();
    if (!validarFormulario(nuevoForm)) return;

    setGuardando(true);
    const { error } = await supabase.from('vehiculos').insert([nuevoForm]);

    if (error) {
      mostrarMensaje('error', 'Error al guardar el vehículo: ' + error.message);
    } else {
      mostrarMensaje('exito', '¡Vehículo registrado correctamente!');
      setMostrarModalNuevo(false);
      setNuevoForm({
        placa: '', vehiculo: '', anio_color: '', propietario: '',
        cedula: '', correo: '', foto_vehiculo: '', foto_propietario: '', estado: 'Autorizado'
      });
      obtenerVehiculos();
    }
    setGuardando(false);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    if (!validarFormulario(vehiculoEditando)) return;

    setGuardando(true);
    const { error } = await supabase
      .from('vehiculos')
      .update(vehiculoEditando)
      .eq('placa', vehiculoEditando.placa);

    if (error) {
      mostrarMensaje('error', 'Error al actualizar: ' + error.message);
    } else {
      mostrarMensaje('exito', '¡Registro actualizado exitosamente!');
      setVehiculoEditando(null);
      obtenerVehiculos();
    }
    setGuardando(false);
  };

  const handleEliminar = async (placa, e) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el vehículo con placa ${placa}?`)) {
      setGuardando(true);
      const { error } = await supabase.from('vehiculos').delete().eq('placa', placa);
      if (error) {
        mostrarMensaje('error', 'Error al eliminar: ' + error.message);
      } else {
        mostrarMensaje('exito', `El vehículo con placa ${placa} ha sido eliminado.`);
        obtenerVehiculos();
      }
      setGuardando(false);
    }
  };

  // Filtro de búsqueda
  const vehiculosFiltrados = vehiculos.filter((item) => {
    const termino = busqueda.toLowerCase();
    return (
      item.placa?.toLowerCase().includes(termino) ||
      item.propietario?.toLowerCase().includes(termino) ||
      item.vehiculo?.toLowerCase().includes(termino) ||
      item.cedula?.includes(termino)
    );
  });

  // Cálculo de paginación
  const totalPaginas = Math.ceil(vehiculosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const vehiculosPaginados = vehiculosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', backgroundColor: '#1e293b', color: '#fff', padding: '20px 10px' }}>
        <h2 style={{ fontSize: '18px', color: '#38bdf8', marginBottom: '30px', textAlign: 'center' }}>
          🅿️ SMART PARKING
        </h2>
        <nav>
          <button style={{ width: '100%', padding: '10px', textAlign: 'left', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🚘 Vehículos y propietarios
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f8fafc' }}>
        
        {/* Banner de Mensajes (Éxito / Error) */}
        {alerta.texto && (
          <div style={{
            padding: '12px 20px',
            marginBottom: '20px',
            borderRadius: '6px',
            color: '#fff',
            backgroundColor: alerta.tipo === 'exito' ? '#16a34a' : '#dc2626',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {alerta.texto}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>Vehículos y propietarios</h1>
            <p style={{ margin: '5px 0 0', color: '#64748b' }}>Vehículos autorizados en UTEQ Smart Parking</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setMostrarModalNuevo(true)} 
              disabled={guardando}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: guardando ? 0.6 : 1 }}
            >
              + Nuevo Vehículo
            </button>
            <button 
              onClick={obtenerVehiculos} 
              disabled={guardando || cargando}
              style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: guardando ? 0.6 : 1 }}
            >
              {cargando ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Buscar placa, vehículo o propietario..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            style={{ width: '350px', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
          />
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            Total: <b>{vehiculosFiltrados.length}</b> vehículos
          </span>
        </div>

        {/* Tabla */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>⏳ Cargando datos de Supabase...</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                    <th style={{ padding: '12px' }}>Foto vehículo</th>
                    <th style={{ padding: '12px' }}>Placa</th>
                    <th style={{ padding: '12px' }}>Vehículo</th>
                    <th style={{ padding: '12px' }}>Año / color</th>
                    <th style={{ padding: '12px' }}>Foto propietario</th>
                    <th style={{ padding: '12px' }}>Propietario</th>
                    <th style={{ padding: '12px' }}>Cédula</th>
                    <th style={{ padding: '12px' }}>Correo</th>
                    <th style={{ padding: '12px' }}>Estado</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                        No se encontraron registros.
                      </td>
                    </tr>
                  ) : (
                    vehiculosPaginados.map((item) => (
                      <tr 
                        key={item.placa} 
                        onClick={() => setVehiculoSeleccionado(item)}
                        style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
                      >
                        <td style={{ padding: '10px' }}>
                          <img src={item.foto_vehiculo || 'https://via.placeholder.com/60x40'} alt="Vehículo" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                            {item.placa}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>{item.vehiculo}</td>
                        <td style={{ padding: '10px' }}>{item.anio_color}</td>
                        <td style={{ padding: '10px' }}>
                          <img src={item.foto_propietario || 'https://via.placeholder.com/50x50'} alt={item.propietario} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.propietario}</td>
                        <td style={{ padding: '10px' }}>{item.cedula}</td>
                        <td style={{ padding: '10px', color: '#0284c7' }}>{item.correo}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ backgroundColor: '#16a34a', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                            {item.estado}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setVehiculoEditando(item)}
                            disabled={guardando}
                            style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px', opacity: guardando ? 0.5 : 1 }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={(e) => handleEliminar(item.placa, e)}
                            disabled={guardando}
                            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', opacity: guardando ? 0.5 : 1 }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                Página <b>{paginaActual}</b> de <b>{totalPaginas}</b>
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  disabled={paginaActual === 1 || guardando}
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', opacity: paginaActual === 1 ? 0.5 : 1 }}
                >
                  Anterior
                </button>
                <button
                  disabled={paginaActual === totalPaginas || guardando}
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', opacity: paginaActual === totalPaginas ? 0.5 : 1 }}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}

        {/* Modal Detalle */}
        {vehiculoSeleccionado && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '450px', maxWidth: '90%' }}>
              <h2 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a' }}>Detalle del Vehículo</h2>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b' }}>Propietario</p>
                  <img src={vehiculoSeleccionado.foto_propietario} alt="Propietario" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#64748b' }}>Vehículo</p>
                  <img src={vehiculoSeleccionado.foto_vehiculo} alt="Vehículo" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                </div>
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155' }}>
                <p style={{ margin: '4px 0' }}><b>Propietario:</b> {vehiculoSeleccionado.propietario}</p>
                <p style={{ margin: '4px 0' }}><b>Cédula:</b> {vehiculoSeleccionado.cedula}</p>
                <p style={{ margin: '4px 0' }}><b>Correo:</b> {vehiculoSeleccionado.correo}</p>
                <p style={{ margin: '4px 0' }}><b>Placa:</b> <span style={{ background: '#0f172a', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{vehiculoSeleccionado.placa}</span></p>
                <p style={{ margin: '4px 0' }}><b>Vehículo:</b> {vehiculoSeleccionado.vehiculo} ({vehiculoSeleccionado.anio_color})</p>
                <p style={{ margin: '4px 0' }}><b>Estado:</b> <span style={{ backgroundColor: '#16a34a', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>{vehiculoSeleccionado.estado}</span></p>
              </div>
              <button onClick={() => setVehiculoSeleccionado(null)} style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal Nuevo Vehículo */}
        {mostrarModalNuevo && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '500px', maxWidth: '90%' }}>
              <h2 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a', marginBottom: '15px' }}>Registrar Nuevo Vehículo</h2>
              <form onSubmit={handleCrearVehiculo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input required placeholder="Placa (ej: RBM-1039)" value={nuevoForm.placa} onChange={(e) => setNuevoForm({...nuevoForm, placa: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Vehículo (ej: Kia Picanto)" value={nuevoForm.vehiculo} onChange={(e) => setNuevoForm({...nuevoForm, vehiculo: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Año / Color (ej: 2023 Blanco)" value={nuevoForm.anio_color} onChange={(e) => setNuevoForm({...nuevoForm, anio_color: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Cédula (ej: ******1234)" value={nuevoForm.cedula} onChange={(e) => setNuevoForm({...nuevoForm, cedula: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Nombre del Propietario" value={nuevoForm.propietario} onChange={(e) => setNuevoForm({...nuevoForm, propietario: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required type="email" placeholder="Correo institucional" value={nuevoForm.correo} onChange={(e) => setNuevoForm({...nuevoForm, correo: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input placeholder="URL Foto Vehículo" value={nuevoForm.foto_vehiculo} onChange={(e) => setNuevoForm({...nuevoForm, foto_vehiculo: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input placeholder="URL Foto Propietario" value={nuevoForm.foto_propietario} onChange={(e) => setNuevoForm({...nuevoForm, foto_propietario: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={guardando} style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', opacity: guardando ? 0.6 : 1 }}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button type="button" onClick={() => setMostrarModalNuevo(false)} disabled={guardando} style={{ flex: 1, padding: '10px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Vehículo */}
        {vehiculoEditando && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '500px', maxWidth: '90%' }}>
              <h2 style={{ marginTop: 0, fontSize: '20px', color: '#0f172a', marginBottom: '15px' }}>Editar Vehículo ({vehiculoEditando.placa})</h2>
              <form onSubmit={handleGuardarEdicion} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input required placeholder="Vehículo" value={vehiculoEditando.vehiculo || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, vehiculo: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Año / Color" value={vehiculoEditando.anio_color || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, anio_color: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Cédula" value={vehiculoEditando.cedula || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, cedula: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Estado" value={vehiculoEditando.estado || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, estado: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required placeholder="Propietario" value={vehiculoEditando.propietario || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, propietario: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input required type="email" placeholder="Correo" value={vehiculoEditando.correo || ''} onChange={(e) => setVehiculoEditando({...vehiculoEditando, correo: e.target.value})} style={{ gridColumn: 'span 2', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={guardando} style={{ flex: 1, padding: '10px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', opacity: guardando ? 0.6 : 1 }}>
                    {guardando ? 'Actualizando...' : 'Actualizar'}
                  </button>
                  <button type="button" onClick={() => setVehiculoEditando(null)} disabled={guardando} style={{ flex: 1, padding: '10px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;