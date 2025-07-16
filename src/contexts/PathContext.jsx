import { createContext, useContext, useState } from 'react';
import { findOnePath } from '../services/pathService';
import { getMyStand } from '../services/floorService';

const PathContext = createContext();

export function PathProvider({ children }) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPath = async (start, end, mapId = 'iranmall') => {
    setLoading(true);
    try {
      // اگر start داده نشده بود، از myStand بگیر
      if (!start) {
        const myStand = getMyStand();
        if (myStand) {
          start = { 
            x: myStand.entrance.x, 
            y: myStand.entrance.y, 
            z: 1 
          };
        } else {
          start = { x: 58, y: 185, z: 1 };  // مقدار پیش‌فرض
        }
      }

      const fixedStart = { ...start, z: start.z ?? 1 };
      const fixedEnd = { ...end, z: end.z ?? 1 };

      const res = await findOnePath({
        start: fixedStart,
        end: fixedEnd,
        skipPoints: 100,
        mapId,
      });

      const calibratedPath = res.path.map(([x, y]) => ({
        x: x / 100,
        y: y / 100,
        z: 2,
      }));

      setPath({ ...res, path: calibratedPath });

    } catch (err) {
      console.error('خطا در دریافت مسیر:', err);
      setPath(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PathContext.Provider value={{ path, fetchPath, loading }}>
      {children}
    </PathContext.Provider>
  );
}

export function usePath() {
  return useContext(PathContext);
}
