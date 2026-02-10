import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import Point from "../paths/Point";
import PositionedText from "./PositionedText";

export default function LabeledPoint({
  scale,
  position,
  label,
  pointColor = "red",
  textColor = "white",
  background = "rgba(0,0,0,0.5)",
  textHeightOffset = 0,
  maxVisibleDistance = 40,
  fadeStartDistance = 40,
}) {
  const { camera } = useThree();
  const pointRef = useRef();
  const textRef = useRef();
  const lastOpacity = useRef(1);
  const fadeRange = maxVisibleDistance - fadeStartDistance;
  const textPosition = useRef([
    position.x, 
    position.y + textHeightOffset, 
    position.z
  ]);

  // ----------------- بهینه‌سازی Distance + Opacity -----------------
  useFrame(() => {
    if (!pointRef.current) return;

    // Vector3 distance خیلی سریع‌تر از object distance
    const distance = camera.position.distanceTo(pointRef.current.position);
    
    let opacity = 1;
    if (distance > fadeStartDistance) {
      opacity = Math.max(0, 1 - (distance - fadeStartDistance) / fadeRange);
    }

    // فقط اگر تغییر معنادار داشت آپدیت کن
    if (Math.abs(opacity - lastOpacity.current) > 0.01) {
      lastOpacity.current = opacity;
      
      // Batch update هر دو ref
      if (pointRef.current) {
        pointRef.current.material.opacity = opacity;
        pointRef.current.material.transparent = true;
        pointRef.current.visible = opacity > 0;
      }
      
      if (textRef.current) {
        textRef.current.material.opacity = opacity;
        textRef.current.material.transparent = true;
        textRef.current.visible = opacity > 0;
      }
    }
  });

  // Scale محاسبه‌شده
  const pointSize = scale ? scale.width / 70 : 1;

  return (
    <group>
      {/* Point با ref و opacity native */}
      <Point 
        ref={pointRef}
        position={position} 
        color={pointColor} 
        size={pointSize}
        transparent={true}
      />

      {/* Text با ref و conditional render + opacity */}
      <PositionedText
        ref={textRef}
        position={textPosition.current}
        text={label}
        color={textColor}
        background={background}
        transparent={true}
      />
    </group>
  );
}
