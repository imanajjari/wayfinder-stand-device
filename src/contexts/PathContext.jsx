import { createContext, useContext, useState } from 'react';
import { findOnePath } from '../services/pathService';
import { getStandData } from '../services/floorService';
import { findFloorOfDestination } from '../lib/floorUtils';

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
            console.log('====================================');
      console.log("currentStand :",currentStand);
      console.log('====================================');
      setPath({
        "message": "Path posted",
        "id": 18,
        "path": [
            {
                "x": currentStand.x/100,
                "y": currentStand.y/100,
                "z": currentStand.z
            }
        ],
        "type": "path"
    })
      // const currentStand = getCurrentStandPosition();
      // console.log('====================================');
      // console.log("currentStand :",currentStand);
      // console.log('====================================');
      //           if (currentStand) {
      //             navigateToDestination({
      //               ...currentStand,
      //               floorNumber: currentFloorNumber
      //             },currentFloorNumber);
      //           }
      // markFloorChange(destination, startFloor, endFloor);
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
    console.log('====================================');
    console.log('standData :',standData);
    console.log('currentFloorNumber :',currentFloorNumber);

    console.log('====================================');
    const standOnFloor = standData?.stands.find(s => s.floorNum === currentFloorNumber);
    
    if (standOnFloor) {
      return {
        x: standOnFloor.entrance.x,
        y: standOnFloor.entrance.y,
        z: 1,
        floorNumber: standOnFloor.floorNum,
        floorId:findFloorOfDestination(standOnFloor).floorId
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
        const standOnCurrentFloor = standData?.stands.find(s => s.floorNum === currentFloorNumber);

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
      

      const fixedStart = {
        x: start.x,
        y: start.y,
        z: start.z ?? 1
      };
      
      const fixedEnd = {
        x: end.x,
        y: end.y,
        z: end.z ?? 1
      };
      
      // گرفتن فقط floorId عددی:
      const floorId = typeof end.floorId === 'object' ? end.floorId : end.floorId;
console.log('====================================');
console.log('fixedStart:',fixedStart);
console.log('====================================');
      const res = await findOnePath({
        start: fixedStart,
        end: fixedEnd,
        skip: 100,
        mapId,
        floorId 
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
