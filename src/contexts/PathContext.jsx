import { createContext, useContext, useEffect, useState } from "react";
import { findManyPathsV2, findOnePath, findOnePathMulityfloorV2 } from "../services/pathService";
import { getFloors, getStandData } from "../storage/floorStorage";
import { findFloorOfDestination } from "../lib/floorUtils";
import { getMyStand } from "../storage/floorStorage";
import { getCompanyData } from '../storage/companyStorage';

const PathContext = createContext();

export function PathProvider({ children }) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentFloorNumber, setCurrentFloorNumber] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [currentStand, setCurrentStand] = useState(null);
  const [lastDestination, setLastDestination] = useState(null);

  const updateCurrentFloorNumber = (floorNumber) => {
    setCurrentFloorNumber(floorNumber);

    const floors = getFloors();
    const floorId = floors?.find(
      (s) => s.number === floorNumber
    );

    const standData = getStandData();
    const standOnFloor = standData?.stands.find(
      (s) => s.floorNum === floorNumber
    );

    setCurrentStand(standOnFloor);
    setCurrentFloor(floorId);

    
  };


    const fetchPathV2 = async ({start, end}) => {
      setLastDestination(end)
      
    setLoading(true);
    const myStand = getMyStand();
    const companyData = getCompanyData();
    try {
      if (!start) {
        start = myStand.id;
      }

    const normalizedEnd = getNormalizedEndForPath(end);

      const res = await findOnePathMulityfloorV2({
      start,
      end:normalizedEnd,
      userId: companyData?.id,
      skip: 100,
      });
      
      
        const normalized = normalizePathResponse(res);
    if (!normalized || normalized.paths.every(p => p.path.length === 0)) {
      throw new Error("مسیر یافت نشد");
    }



    // اگر چند طبقه‌ای می‌خواهی نگه داری:
    setPath(normalized);
    console.log('setPath :',normalized);
    
    } catch (err) {
      console.error("خطا در دریافت مسیر:", err);
      setPath(null);
    } finally {
      setLoading(false);
    }
  };


  const fetchManyPathsV2 = async ({ start, ends }) => {
  setLastDestination(ends);
  setLoading(true);
  const myStand = getMyStand();
  const companyData = getCompanyData();

  try {
    if (!start) {
      start = myStand.id;
    }

    const res = await findManyPathsV2({
      start,
      ends,
      userId: companyData?.id,
      skip: 100,
    });

  

    setPath(res);
    console.log("multi-path result:", res);
  } catch (err) {
    console.error("خطا در گرفتن مسیرهای چندگانه:", err);
    setPath(null);
  } finally {
    setLoading(false);
  }
};


//  این تابع مسئول کنترل محتوای مقصد ارسالی قبل از در خواست مسیر از سروره . که شناسه بفرسته یا مختصات
const getNormalizedEndForPath = (end) => {
  // اگر ششناسه داشت شناسه رو بفرست
if(end.id){
  return {end:end.id}
} else {
  // در غیر این صورت مختصات و شناسه طبقه رو به عنوان اطلاعات مقصد ارسال  کن 
      return {
        end:{
          x: parseInt(end.entrance.x),
          y: parseInt(end.entrance.y),
        },
      floorId: currentFloor.id,
    };
}
};


const normalizeManyPathsResponse = (res) => {
  const data = res?.data ?? res;
  if (!Array.isArray(data?.pathsList ?? data)) return [];

  // فرض می‌کنیم هر آیتم معادل مسیر بین start و هر end است
  const result = (data.pathsList ?? data).map((pathBlock) => {
    const floors = pathBlock?.paths ?? [];
    return {
      floorDiff: pathBlock?.floorDiff ?? 0,
      paths: floors.map((f) => ({
        floorId: f.floorId,
        path: (f.path ?? []).map(toMeters),
        floorNum: f.floorNum,
      })),
    };
  });

  return result;
};


  // p می‌تونه [x,y] یا {x,y} باشه
const toMeters = (p) => {
  const x = (p?.x ?? p?.[0]);
  const y = (p?.y ?? p?.[1]);
  if (typeof x !== "number" || typeof y !== "number") {
    throw new Error("مختصات نامعتبر است");
  }
  return { x: x / 100, y: y / 100, z: 0.2 };
};

// خروجی API را به ساختار یکسان و قابل‌استفاده تبدیل می‌کند
const normalizePathResponse = (res) => {
  const data = res?.data ?? res; // اگر مستقیم برگشت
  const floors = data?.paths;
  if (!Array.isArray(floors) || floors.length === 0) return null;

  const paths = floors.map((f) => ({
    floorId: f.floorId,
    path: (f.path ?? []).map(toMeters),
    floorNum: f.floorNum,
  }));

  return {
    floorDiff: data?.floorDiff ?? 0,
    paths,               // [{ floorId, path:[{x,y,z}, ...] }, ...]
    type: "path",
  };
};

  return (
    <PathContext.Provider
      value={{
        path,
        loading,
        updateCurrentFloorNumber,
        currentFloorNumber,
        currentStand,
        lastDestination,
        fetchPathV2,
        fetchManyPathsV2
      }}
    >
      {children}
    </PathContext.Provider>
  );
}

export function usePath() {
  return useContext(PathContext);
}
