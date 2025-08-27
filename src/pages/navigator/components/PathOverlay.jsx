// src/pages/navigator/components/PathOverlay.jsx
import DottedStraightPath from "../../../components/paths/DottedStraightPath";
import LabeledPoint from "../../../components/Models/LabeledPoint";
import ArrowStraightPath from "../../../components/paths/ArrowStraightPath";

export default function PathOverlay({ points, colors, labelText, maxZoomDistance }) {
  if (!points?.length) return null;

  const start = points[0];
  const end = points[points.length - 1];

  return (
    <>
      {/* <DottedStraightPath points={points} spacing={1} size={0.1} animate /> */}
       <ArrowStraightPath
     points={points}
      spacing={0.7}     
      size={0.12}        
      animate={true}     
      yawOffset={0}      
    />
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
