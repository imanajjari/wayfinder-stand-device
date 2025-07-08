// components/map/gpsToModel.js

export function gpsToModel(lat, lon) {
    const minLat = 35.6800, maxLat = 35.7000;
    const minLon = 51.3800, maxLon = 51.4000;
    const minX = -1, maxX = 1;
    const minY = -1, maxY = 1;
  
    const x = ((lon - minLon) / (maxLon - minLon)) * (maxX - minX) + minX;
    const y = ((lat - minLat) / (maxLat - minLat)) * (maxY - minY) + minY;
    return { x, y, z: 0.1 };
  }
  