import { createContext, useContext, useState } from "react";
import { findOnePath, findOnePathMulityfloorV2 } from "../services/pathService";
import { getStandData } from "../storage/floorStorage";
import { findFloorOfDestination } from "../lib/floorUtils";
import { getMyStand } from "../storage/floorStorage";
import { getCompanyData } from '../storage/companyStorage';

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
    const standOnFloor = standData?.stands.find(
      (s) => s.floorNum === floorNumber
    );
    setCurrentStand(standOnFloor);
  };


    const fetchPathV2 = async ({start, end}) => {
      console.log("🚀 fetchPathV2 called with:", { start, end });
      setLastDestination(end)
      
    setLoading(true);
    const myStand = getMyStand();
    const companyData = getCompanyData();
    try {
      if (!start) {
        start = myStand.id;
      }

      const res = await findOnePathMulityfloorV2({
      start,
      end:end.id,
      userId: companyData?.id,
      skip: 100,
      });
      
      
        const normalized = normalizePathResponse(res);
    if (!normalized || normalized.paths.every(p => p.path.length === 0)) {
      throw new Error("مسیر یافت نشد");
    }

console.log('normalized: ',normalized);

    // اگر چند طبقه‌ای می‌خواهی نگه داری:
    setPath(normalized);
    } catch (err) {
      console.error("خطا در دریافت مسیر:", err);
      setPath(null);
    } finally {
      setLoading(false);
    }
  };

  // p می‌تونه [x,y] یا {x,y} باشه
const toMeters = (p) => {
  const x = (p?.x ?? p?.[0]);
  const y = (p?.y ?? p?.[1]);
  if (typeof x !== "number" || typeof y !== "number") {
    throw new Error("مختصات نامعتبر است");
  }
  return { x: x / 100, y: y / 100, z: 0.8 };
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
        fetchPathV2
      }}
    >
      {children}
    </PathContext.Provider>
  );
}

export function usePath() {
  return useContext(PathContext);
}
