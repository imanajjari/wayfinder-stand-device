import React, { useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Point from "../paths/Point";
import PositionedText from "./PositionedText";

export default function LabeledPoint({
  position,
  label,
  pointColor = "red",
  textColor = "white",
  background = "rgba(0,0,0,0.5)",
  textHeightOffset = 1,
  maxVisibleDistance = 40,
  fadeStartDistance = 40, // فاصله‌ای که محو شدن شروع می‌شود
}) {
  const { camera } = useThree();
  const [opacity, setOpacity] = useState(1);

  useFrame(() => {
    const distance = camera.position.distanceTo({
      x: position.x,
      y: position.y,
      z: position.z,
    });

    let newOpacity = 1;
    if (distance > fadeStartDistance) {
      const fadeRange = maxVisibleDistance - fadeStartDistance;
      newOpacity = 1 - (distance - fadeStartDistance) / fadeRange;
      newOpacity = Math.max(0, Math.min(1, newOpacity));
    }

    // فقط اگر مقدار جدید با قبلی فرق داشت، ست کن تا از رندر اضافه جلوگیری بشه
    if (newOpacity !== opacity) {
      setOpacity(newOpacity);
    }
  });

  return (
    <>
      <Point position={position} color={pointColor} />

      {opacity > 0 && (
        <PositionedText
          position={[position.x, position.y + textHeightOffset, position.z]}
          text={label}
          color={textColor}
          background={background}
          opacity={opacity}
        />
      )}
    </>
  );
}
