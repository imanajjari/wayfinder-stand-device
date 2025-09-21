import React from "react";
import DestinationLabel from "./DestinationLabel";

export default function DestinationsLabels({ destinations, z = 2, verticalOffset = 0, hiddenPositions = [] , fadeStartDistance=40 ,maxVisibleDistance=60}) {
  if (!destinations || destinations.length === 0) return null;

  const isHidden = (destPosition) => {
    return hiddenPositions.some(pos => 
      Math.abs(destPosition[0] - pos[0]) < 0.01 &&
      Math.abs(destPosition[1] - pos[1]) < 0.01 &&
      Math.abs(destPosition[2] - pos[2]) < 0.01
    );
  };
console.log('====================================');
console.log('maxVisibleDistance :',maxVisibleDistance);
console.log('fadeStartDistance :',fadeStartDistance);
console.log('====================================');
  return (
    <>
      {destinations.map(dest => {
        const position = [
          dest.entrance.x / 100,
          (dest.entrance.y / 100) + verticalOffset,
          z
        ];

        if (isHidden(position)) {
          return null;
        }

        return (
          <DestinationLabel
          key={dest.id}
          dest={dest}
          position={position}
          maxVisibleDistance={maxVisibleDistance}
          fadeStartDistance={fadeStartDistance}
        />
        );
      })}
    </>
  );
}
