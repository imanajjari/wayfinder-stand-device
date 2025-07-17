import { createContext, useContext, useState } from 'react';
import { findOnePath } from '../services/pathService';
import { getStandData } from '../services/floorService';

const PathContext = createContext();

export function PathProvider({ children }) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentFloorNumber, setCurrentFloorNumber] = useState(null);
  const [currentStand, setCurrentStand] = useState(null);
  const [lastDestination, setLastDestination] = useState(null);

  const updateCurrentFloorNumber = (floorNumber) => {
    setCurrentFloorNumber(floorNumber);

    const standData = getStandData();
    const standOnFloor = standData?.stands.find(s => s.floorNumber === floorNumber);
    setCurrentStand(standOnFloor);
  };
  const updateDestination = (destination) => {
    setLastDestination(destination);
    navigateToDestination(destination, currentFloorNumber);
  };

  const navigateToDestination = async (destination , currentFloorNumber ) => {
    console.log('🚀 navigateToDestination called with destination:', destination);
    
  
    const startFloor = currentFloorNumber ?? 0;
    const endFloor = destination.floorNumber ?? 0;
  
    console.log('🟩 currentFloorNumber:', currentFloorNumber, 'startFloor:', startFloor, 'endFloor:', endFloor);
  
    if (startFloor === endFloor) {
      console.log('✅ Floors are same, fetching path directly');
      await fetchPath(null, destination);
    } else {
      const currentStand = getCurrentStandPosition();
                if (currentStand) {
                  navigateToDestination({
                    ...currentStand,
                    floorNumber: currentFloorNumber
                  },currentFloorNumber);
                }
      markFloorChange(destination, startFloor, endFloor);
    }
  };
  

  // تابع برای رفرش مسیر قبلی
  const refreshLastDestination = async ({ currentFloorNumber }) => {
    if (lastDestination) {
      console.log('🔄 Refreshing last destination:', lastDestination);
      console.log('🔄 Refreshing last currentFloorNumber:', currentFloorNumber);
  
      // صبر کن تا طبقه تنظیم شود
      await new Promise((resolve) => {
        setCurrentFloorNumber(currentFloorNumber);
        setTimeout(resolve, 0); // صبر کوتاه تا رندر انجام شود
      });
  
      await navigateToDestination(lastDestination, currentFloorNumber);
    }
  };
  
  

  const getCurrentStandPosition = () => {
    const standData = getStandData();
    const standOnFloor = standData?.stands.find(s => s.floorNumber === currentFloorNumber);
    
    if (standOnFloor) {
      return {
        x: standOnFloor.entrance.x,
        y: standOnFloor.entrance.y,
        z: 1,
        floorNumber: standOnFloor.floorNumber
      };
    }
    
    return null;
  };
  

  const markFloorChange = (end, startFloor, endFloor) => {
    console.log('📢 markFloorChange', { startFloor, endFloor, end });
    setPath({
      type: 'floor-change',
      direction: endFloor > startFloor ? 'up' : 'down',
      end,
      path: []   // 👈 اضافه شد
    });
  };
  

  const fetchPath = async (start, end, mapId = 'iranmall') => {
    setLoading(true);
    try {
      if (!start) {
        const standData = getStandData();
        const standOnCurrentFloor = standData?.stands.find(s => s.floorNumber === currentFloorNumber);

        if (standOnCurrentFloor) {
          start = {
            x: standOnCurrentFloor.entrance.x,
            y: standOnCurrentFloor.entrance.y,
            z: 1
          };
        } else {
          start = { x: 58, y: 185, z: 1 };
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

      setPath({ ...res, path: calibratedPath, type: 'path' });

    } catch (err) {
      console.error('خطا در دریافت مسیر:', err);
      setPath(null);
    } finally {
      setLoading(false);
    }
  };

  return (
<PathContext.Provider value={{
  path,
  fetchPath,
  markFloorChange,
  navigateToDestination,
  refreshLastDestination,
  loading,
  updateCurrentFloorNumber,
  currentFloorNumber,
  currentStand,
  getCurrentStandPosition,
  updateDestination,
  lastDestination  
}}>
  {children}
</PathContext.Provider>
  );
}

export function usePath() {
  return useContext(PathContext);
}
