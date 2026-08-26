import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { colors } from 'styles/tokens';

/* The venue pin for the acknowledgements' address slide — the /fests
   directory map's grammar at street zoom: OpenStreetMap tiles and the
   same square brand marker. Same custom divIcon reasoning as there:
   Leaflet's bundled marker images are a well-known Next.js asset-pipeline
   breakage, and the square is already the site's own mark. */
const venueIcon = L.divIcon({
  className: 'venue-map-marker',
  html: `<span style="display:block;width:14px;height:14px;background:${colors.orange};border:2px solid ${colors.ink};"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/* Street level: close enough to tell the right block from the wrong one,
   wide enough to keep a landmark or two for orientation. */
const VENUE_ZOOM = 16;

const VenueMap = ({ latitude, longitude }) => (
  <MapContainer
    center={[latitude, longitude]}
    zoom={VENUE_ZOOM}
    scrollWheelZoom={false}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[latitude, longitude]} icon={venueIcon} />
  </MapContainer>
);

export default VenueMap;
