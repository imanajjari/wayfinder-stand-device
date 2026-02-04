import DottedStraightPath from "../paths/DottedStraightPath";
import LabeledPoint from "../Models/LabeledPoint";
import ArrowStraightPath from "../paths/ArrowStraightPath";
import { usePath } from "../../contexts/PathContext";
import { useMemo } from "react";
import { t } from "i18next";
import multiPaths from "../../../multiPaths";


function hasValue(value) {
  if (value === null || value === undefined) return false;

  // string
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  // array
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  // object
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  // number, boolean, function, etc.
  return true;
}


function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const SCALE_FACTOR = 100;
const DEFAULT_Z = 0.8;

function getPointsFromAllPaths(multiPaths, activeFloorNumber) {
  if (!Array.isArray(multiPaths)) return [];

  let allPoints = [];

  multiPaths.forEach(route => {
    const segment = route.segments?.find(s => s.floorNum === activeFloorNumber);
    if (!segment?.path?.length) return;
    const converted = segment.path.map(([x, y]) => ({
      x: x / SCALE_FACTOR,
      y: y / SCALE_FACTOR,
      z: DEFAULT_Z
    }));
    // اضافه‌کردن به مجموعه‌ی کلی
    allPoints.push(...converted);
  });

  return allPoints;
}


export default function PathOverlay({ colors, activeFloor, maxZoomDistance }) {
  // const { path } = usePath();
  let points = [];
  const path = multiPaths

  if (isPlainObject(path)){
    points = path?.paths?.find(p => p.floorNum === activeFloor.number)?.path || [];
  }else{
    points = getPointsFromAllPaths(path, activeFloor.number);

  }
  
if (!points?.length) return null;


  
  const { startLabel, endLabel } = useMemo(() => {    
    if (!path?.paths || !activeFloor) return { startLabel: "", endLabel: "" };
    const floors = path.paths;
    const currentIndex = floors.findIndex(p => p.floorNum === activeFloor.number);
    if (currentIndex === -1) return { startLabel: "", endLabel: "" };
    const nextPath = floors[currentIndex + 1];
    const nextFloorNum = nextPath?.floorNum;
    const currentFloorNum = activeFloor.number;
      

    let endLabel = t('Navigator3DPage.arrived_at_destination');
    if (nextFloorNum) {
      if (nextFloorNum > currentFloorNum) endLabel = t('Navigator3DPage.navigate_to_upstairs');
      else if (nextFloorNum < currentFloorNum) endLabel = t('Navigator3DPage.navigate_to_downstairs');
      else endLabel = t('Navigator3DPage.continue_route');
    }

    const startLabel = currentIndex === 0 ? t('Navigator3DPage.current_location') : t('Navigator3DPage.continue_route');
    return { startLabel, endLabel };
  }, [path, activeFloor?.id]);

  const start = points[0];
  const end = points[points.length - 1];

  return (
    <>
      {points.length > 1 ? (
        <>

           <DottedStraightPath points={points} spacing={1} size={0.1} animate /> 
          {/*
          <ArrowStraightPath
            points={points}
            spacing={0.7}
            size={0.12}
            animate
            yawOffset={0}
          />
           */}

          <LabeledPoint
            position={{ x: start.x, y: start.y, z: start.z }}
            label={startLabel}
            pointColor={colors.pointStart}
            textColor={colors.pointStart}
            textHeightOffset={1}
            fadeStartDistance={maxZoomDistance - 10}
            maxVisibleDistance={maxZoomDistance}
          />

          <LabeledPoint
            position={{ x: end.x, y: end.y, z: end.z }}
            label={endLabel}
            pointColor={colors.pointEnd}
            textColor={colors.pointEnd}
            textHeightOffset={1}
            fadeStartDistance={maxZoomDistance - 10}
            maxVisibleDistance={maxZoomDistance}
          />
        </>
      ) : (
        <LabeledPoint
          position={{ x: end.x, y: end.y, z: end.z }}
          label={ endLabel }
          pointColor={colors.pointEnd}
          textColor="red"
          textHeightOffset={0}
          fadeStartDistance={maxZoomDistance}
          maxVisibleDistance={maxZoomDistance}
        />
      )}
    </>
  );
}
