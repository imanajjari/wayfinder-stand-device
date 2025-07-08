// components/map/GpsSimulator.jsx

import { useEffect, useState } from 'react';

export default function GpsSimulator({ isDev = true, onUpdate }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (isDev) {
      const initial = { lat: 35.6892, lon: 51.3890 };
      setLocation(initial);
      onUpdate(initial);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const real = { lat: latitude, lon: longitude };
          setLocation(real);
          onUpdate(real);
        },
        (err) => console.error('GPS Error:', err)
      );
    }
  }, [isDev, onUpdate]);

  useEffect(() => {
    if (!isDev || !location) return;

    const interval = setInterval(() => {
      const offsetLat = (Math.random() - 0.5) * 0.0005;
      const offsetLon = (Math.random() - 0.5) * 0.0005;
      const next = {
        lat: location.lat + offsetLat,
        lon: location.lon + offsetLon,
      };
      setLocation(next);
      onUpdate(next);
    }, 1000);

    return () => clearInterval(interval);
  }, [isDev, location, onUpdate]);

  return null;
}
