// src/pages/navigator/components/PathOverlay.jsx
import DottedStraightPath from "../paths/DottedStraightPath";
import LabeledPoint from "../Models/LabeledPoint";
import ArrowStraightPath from "../paths/ArrowStraightPath";
import { usePath } from "../../contexts/PathContext";
import { useMemo } from "react";
import { t } from "i18next";

export default function PathOverlay({ colors, activeFloor, maxZoomDistance }) {
  const { path } = usePath();
  const points = path?.paths?.find(p => p.floorId === activeFloor.id)?.path || [];
  if (!points?.length) return null;

  const { startLabel, endLabel } = useMemo(() => {
    if (!path?.paths || !activeFloor?.id) return { startLabel: "", endLabel: "" };

    const floors = path.paths;
    const currentIndex = floors.findIndex(p => p.floorId === activeFloor.id);
    if (currentIndex === -1) return { startLabel: "", endLabel: "" };

    const nextPath = floors[currentIndex + 1];
    const nextFloorId = nextPath?.floorId;
    const currentFloorId = activeFloor.id;

    let endLabel = t('Navigator3DPage.arrived_at_destination');
    if (nextFloorId) {
      if (nextFloorId > currentFloorId) endLabel = t('Navigator3DPage.navigate_to_upstairs');
      else if (nextFloorId < currentFloorId) endLabel = t('Navigator3DPage.navigate_to_downstairs');
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
          {/* <DottedStraightPath points={points} spacing={1} size={0.1} animate /> */}
          <ArrowStraightPath
            points={points}
            spacing={0.7}
            size={0.12}
            animate
            yawOffset={0}
          />

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
