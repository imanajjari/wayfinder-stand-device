// src/pages/navigator/components/PathOverlay.jsx
import DottedStraightPath from "../paths/DottedStraightPath";
import LabeledPoint from "../Models/LabeledPoint";
import ArrowStraightPath from "../paths/ArrowStraightPath";
import { usePath } from "../../contexts/PathContext";

export default function PathOverlay({ points, colors, labelText, maxZoomDistance }) {

  const { getCurrentStandPosition} = usePath();
  const CurrentStandPositionStarnd = getCurrentStandPosition();

  if (!points?.length) return null;

  const start = points[0];
  const end = points[points.length - 1];
console.log('====================================');
console.log("points 🧨🎇",points);
console.log('====================================');
  return (
    <>
      {/* <DottedStraightPath points={points} spacing={1} size={0.1} animate /> */}
      {points.length > 1 ? (
        <>
        <ArrowStraightPath
      points={points}
       spacing={0.7}     
       size={0.12}        
       animate={true}     
       yawOffset={0}      
     />
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
