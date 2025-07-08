// components/map/GpsTracker.jsx

import { useState, useCallback } from 'react';
import GpsSimulator from './GpsSimulator';
import { gpsToModel } from './gpsToModel';
import Point from '../paths/Point';

export default function GpsTracker({ color = 'blue', isDev = true }) {
  const [location, setLocation] = useState(null);

  const handleUpdate = useCallback((loc) => {
    setLocation(loc);
  }, []);

  return (
    <>
      <GpsSimulator isDev={isDev} onUpdate={handleUpdate} />
      {location && <Point position={gpsToModel(location.lat, location.lon)} color={color} />}
    </>
  );
}
