import React, { useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import PositionedText from "./PositionedText";

export default function DestinationLabel({
  dest,
  position,
  maxVisibleDistance = 40,
  fadeStartDistance = 20,
}) {
  const { camera } = useThree();
  const [opacity, setOpacity] = useState(1);

  useFrame(() => {
    const distance = camera.position.distanceTo({
      x: position[0],
      y: position[1],
      z: position[2],
    });

    let newOpacity = 1;
    if (distance > fadeStartDistance) {
      const fadeRange = maxVisibleDistance - fadeStartDistance || 1; // جلوگیری از تقسیم بر صفر
      newOpacity = 1 - (distance - fadeStartDistance) / fadeRange;
      newOpacity = Math.max(0, Math.min(1, newOpacity));
    }

    if (opacity !== newOpacity) {
      setOpacity(newOpacity);
    }
  });

  if (opacity <= 0) return null;

  return (
    <PositionedText
      position={position}
      text={dest.shortName}
      color="white"
      opacity={opacity}
    />
  );
}
