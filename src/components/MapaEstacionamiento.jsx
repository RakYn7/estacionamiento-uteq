import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const MapaEstacionamiento = ({ espacios, alSeleccionarEspacio }) => {
  // Centro del estacionamiento UTEQ
  const centro = [-1.012416, -79.467881];

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={centro} zoom={18} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {espacios.map((espacio) => {
          const { boundingBox } = espacio.ubicacion;
          const posiciones = [
            [boundingBox.norte, boundingBox.oeste],
            [boundingBox.norte, boundingBox.este],
            [boundingBox.sur, boundingBox.este],
            [boundingBox.sur, boundingBox.oeste]
          ];

          const color = espacio.estado === 'ocupado' ? '#ef4444' : '#22c55e';

          return (
            <Polygon
              key={espacio.id}
              positions={posiciones}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
              eventHandlers={{
                click: () => alSeleccionarEspacio(espacio)
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>{espacio.id}</strong><br />
                  Distancia: {espacio.distanciaDetectada} cm<br />
                  Estado: <b style={{ color }}>{espacio.estado.toUpperCase()}</b>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};