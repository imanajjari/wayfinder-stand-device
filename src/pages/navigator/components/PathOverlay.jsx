// src/pages/navigator/components/PathOverlay.jsx
import DottedStraightPath from "../../../components/paths/DottedStraightPath";
import LabeledPoint from "../../../components/Models/LabeledPoint";

export default function PathOverlay({ points, colors, labelText, maxZoomDistance }) {
  if (!points?.length) return null;

  const start = points[0];
  const end = points[points.length - 1];

  return (
    <>
      <DottedStraightPath points={points} spacing={1} size={0.1} animate />
      {points.length > 1 ? (
        <>
          <LabeledPoint
            position={{ x: start.x, y: start.y, z: start.z }}
            label="نقطه شروع"
            pointColor={colors.pointStart}
            textColor={colors.pointStart}
            textHeightOffset={1}
            fadeStartDistance={maxZoomDistance - 10}
            maxVisibleDistance={maxZoomDistance}
          />
          <LabeledPoint
            position={{ x: end.x, y: end.y, z: end.z }}
            label="نقطه پایان"
            pointColor={colors.pointEnd}
            textColor="red"
            textHeightOffset={1}
            fadeStartDistance={maxZoomDistance - 10}
            maxVisibleDistance={maxZoomDistance}
          />
        </>
      ) : (
        <LabeledPoint
          position={{ x: end.x, y: end.y, z: end.z }}
          label={labelText}
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
