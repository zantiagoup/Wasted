// SEMADET's register of authorised collection and recycling sites in Jalisco, as GeoJSON.
// The five layers (C601 to C605) come together in one request: 524 points.
const API_URL = 'https://mapa.jalisco.gob.mx/geos/vector/geoserver/vjal/ows?service=WFS&version=1.0.0' +
  '&request=GetFeature&outputFormat=application/json&srsName=EPSG:4326' +
  '&typeName=vjal:C601,vjal:C602,vjal:C603,vjal:C604,vjal:C605';

// Words we look for in each point's "Residuos" text, with and without accents.
const KEYWORDS = {
  PET: ['pet', 'plástico', 'plastico'],
  Glass: ['vidrio'],
  Aluminium: ['aluminio', 'metal'],
  Cardboard: ['cartón', 'carton'],
  Paper: ['papel'],
  Organic: ['orgánico', 'organico'],
  Electronics: ['electrónico', 'electronico', 'electrodoméstico', 'electrodomestico'],
  Hazardous: ['peligroso', 'aceite', 'pila', 'batería', 'bateria']
};

let points = [];

try {
  const response = await fetch(API_URL);
  const data = await response.json();
  points = data.features;
} catch (error) {
  console.log('Could not load the SEMADET points');
}

// Distance in km. Inside one city the earth is close enough to flat, so we
// turn degrees into km (one degree of latitude is about 111 km) and use Pythagoras.
function distanceInKm(lat1, lng1, lat2, lng2) {
  const x = (lng2 - lng1) * 111 * Math.cos(lat1 * Math.PI / 180);
  const y = (lat2 - lat1) * 111;
  return Math.sqrt(x * x + y * y);
}

function acceptsCategory(point, category) {
  const waste = (point.properties.Residuos || '').toLowerCase();
  const words = KEYWORDS[category] || [];

  for (const word of words) {
    if (waste.includes(word)) {
      return true;
    }
  }
  return false;
}

export function findNearestPoint(category, lat, lng) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const point of points) {
    if (!acceptsCategory(point, category)) {
      continue;
    }

    // GeoJSON stores coordinates as [longitude, latitude].
    const pointLng = point.geometry.coordinates[0];
    const pointLat = point.geometry.coordinates[1];
    const distance = distanceInKm(lat, lng, pointLat, pointLng);

    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  }

  if (!nearest) {
    return null;
  }

  return {
    name: nearest.properties.Actividad + ' · ' + nearest.properties.Municipio,
    address: nearest.properties.Domicilio,
    distance: nearestDistance,
    lat: nearest.geometry.coordinates[1],
    lng: nearest.geometry.coordinates[0]
  };
}
