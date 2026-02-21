import DottedStraightPath from "../paths/DottedStraightPath";
import LabeledPoint from "../Models/LabeledPoint";
import ArrowStraightPath from "../paths/ArrowStraightPath";
import { usePath } from "../../contexts/PathContext";
import { useMemo } from "react";
import { t } from "i18next";
import multiPaths from "../../../multiPaths";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const SCALE_FACTOR = 100;
const DEFAULT_Z = 0.8;

// -----------------------------------------
// حالت جدید: استخراج سگمنت‌های هر مسیر
// -----------------------------------------
function getMultiFloorSegments(multiPaths, activeFloorNumber) {
  if (!Array.isArray(multiPaths)) return [];

  return multiPaths
    .map(route => {
      const index = route.segments.findIndex(
        s => s.floorNum === activeFloorNumber
      );

      if (index === -1) return null;

      const seg = route.segments[index];

      return {
        destId: route.destId,
        isNearest: route.isNearest,
        currentFloor: seg.floorNum,
        nextFloor: route.segments[index + 1]?.floorNum ?? null,
        points: seg.path.map(([x, y]) => ({
          x: x / SCALE_FACTOR,
          y: y / SCALE_FACTOR,
          z: DEFAULT_Z
        }))
      };
    })
    .filter(Boolean);
}

// -----------------------------------------
// کامپوننت اصلی
// -----------------------------------------
export default function PathOverlay({ colors, activeFloor, maxZoomDistance, scale }) {
  const { path } = usePath();

  let segments = [];
  let singlePoints = [];

  let ArrowSize = scale?.width/23 ?? 0.2;
  let ArrowSpacing = scale?.width/50 ?? 0.2;
  
  // -----------------------------
  // حالت قدیمی
  // -----------------------------
  if (isPlainObject(path)) {
    singlePoints =
      path?.paths?.find(p => p.floorNum === activeFloor.number)?.path || [];
  }

  // -----------------------------
  // حالت جدید
  // -----------------------------
  if (Array.isArray(path)) {
    segments = getMultiFloorSegments(path, activeFloor.number);
  }

  // ✅ همه hooks اول - بدون شرط!
  const hasMulti = segments.length > 0;
  const hasSingle = singlePoints.length > 0;

  // ✅ HOOKS همیشه صدا میشن
  const transitionPoints = useMemo(() => {
    if (!hasMulti) return [];
    const points = [];
    segments.forEach(seg => {
      if (seg.nextFloor !== null && seg.nextFloor !== seg.currentFloor) {
        const point = seg.points[seg.points.length - 1];
        points.push({
          position: point,
          direction: seg.nextFloor > seg.currentFloor ? "up" : "down",
          destId: seg.destId,
        });
      }
    });
    return points;
  }, [segments, hasMulti]);

  const groupedTransitions = useMemo(() => {
    if (!transitionPoints.length) return [];
    const groups = {};
    transitionPoints.forEach(tp => {
      const key = `${Math.round(tp.position.x * 100)}_${Math.round(tp.position.y * 100)}`;
      if (!groups[key]) groups[key] = { points: [], directions: [] };
      groups[key].points.push(tp);
      groups[key].directions.push(tp.direction);
    });
    return Object.values(groups);
  }, [transitionPoints]);

  const finalLabels = useMemo(() => {
    if (!groupedTransitions.length) return [];
    return groupedTransitions.map(group => {
      const directions = group.directions;
      const isUp = directions.includes("up");
      const isDown = directions.includes("down");

      let label = "";
      let position = group.points[0].position;

      if (isUp && isDown) {
        label = "رفتم به طبقه بعد 🔼🔽";
      } else if (isUp) {
        label = "رفتم به طبقه بالا 🔼";
      } else if (isDown) {
        label = "رفتم به طبقه پایین 🔽";
      }

      return { position, label };
    });
  }, [groupedTransitions]);

  const { startLabel, endLabel, startPos, endPos } = useMemo(() => {
  if (hasSingle) {
    const pts = singlePoints;
    const end = pts[pts.length - 1];

    const allFloors = path?.paths || [];
    const currentIndex = allFloors.findIndex(p => p.floorNum === activeFloor.number);
    const nextFloor = allFloors[currentIndex + 1] ?? null;

    let endLabel;
    if (!nextFloor) {
      endLabel = t("Navigator3DPage.arrived_at_destination");
    } else if (nextFloor.floorNum > activeFloor.number) {
      endLabel = t("Navigator3DPage.navigate_to_upstairs");
    } else {
      endLabel = t("Navigator3DPage.navigate_to_downstairs");
    }

    const startPos = pts.length > 1 ? pts[0] : undefined;

    // اگه طبقه اول مسیره → مکان فعلی، وگرنه → ادامه مسیر
    const startLabel = startPos
      ? (currentIndex === 0
          ? t("Navigator3DPage.current_location")
          : t("Navigator3DPage.continue_route"))
      : undefined;

    return { startLabel, endLabel, startPos, endPos: end };
  }

  if (hasMulti) {
    const arrived = segments.some(s => s.nextFloor === null);
    const hasUp = segments.some(s => s.nextFloor > activeFloor.number);
    const hasDown = segments.some(s => s.nextFloor < activeFloor.number);

    let endLabel = t("Navigator3DPage.continue_route");
    if (arrived) endLabel = t("Navigator3DPage.arrived_at_destination");
    else if (hasUp) endLabel = t("Navigator3DPage.navigate_to_upstairs");
    else if (hasDown) endLabel = t("Navigator3DPage.navigate_to_downstairs");

    const nearest = segments.find(s => s.isNearest) || segments[0];
    const start = nearest.points[0];
    const end = nearest.points[nearest.points.length - 1];

    return {
      startLabel: t("Navigator3DPage.current_location"),
      endLabel,
      startPos: start,
      endPos: end
    };
  }

  return {};
}, [segments, singlePoints, activeFloor.number, path, t]);

  // ✅ فقط render conditional
  if (!hasMulti && !hasSingle) return null;

  console.log('PathOverlay');

  return (
    <>
      {/* Multi-path */}
      {hasMulti &&
        segments.map(seg => (
          <ArrowStraightPath
            key={seg.destId}
            points={seg.points}
            color={seg.isNearest ? colors.active : colors.inactive}
            spacing={0.2}
            size={0.3}
            animate
            yawOffset={0}
          />
        ))}

      {/* Transition Labels */}
      {finalLabels.map((label, i) => (
        <LabeledPoint
          key={`transition-${i}`}
          scale={scale}
          position={label.position}
          label={label.label}
          pointColor={colors.pointEnd}
          textColor={colors.pointEnd}
          textHeightOffset={0}
          fadeStartDistance={maxZoomDistance - 10}
          maxVisibleDistance={maxZoomDistance}
        />
      ))}

      {/* Single Path */}
      {hasSingle && singlePoints.length > 1 && (
        <ArrowStraightPath 
          points={singlePoints} 
          color={colors.active}
          spacing={ArrowSpacing}
          size={ArrowSize}
          animate
          yawOffset={0}
        />
      )}

      {/* Start Label */}
      {startPos && (
        <LabeledPoint
          scale={scale}
          position={startPos}
          label={startLabel}
          pointColor={colors.pointStart}
          textColor={colors.pointStart}
          textHeightOffset={0}
          fadeStartDistance={maxZoomDistance - 10}
          maxVisibleDistance={maxZoomDistance}
        />
      )}

      {/* End Label */}
      {endPos && (
        <LabeledPoint
          scale={scale}
          position={endPos}
          label={endLabel}
          pointColor={colors.pointEnd}
          textColor={colors.pointEnd}
          textHeightOffset={0}
          fadeStartDistance={maxZoomDistance - 10}
          maxVisibleDistance={maxZoomDistance}
        />
      )}
    </>
  );
}

