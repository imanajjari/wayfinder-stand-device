import React, { useRef, useState, useEffect } from "react"; 
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

  // ⭐ برای fade تدریجی لیبل (اختیاری اما توصیه‌شده برای همخوانی با Point)
  const [textOpacity, setTextOpacity] = useState(1);

  useFrame(() => {
    if (!pointRef.current) return;

    const distance = camera.position.distanceTo(pointRef.current.position);
    
    let opacity = 1;
    if (distance > fadeStartDistance) {
      opacity = Math.max(0, 1 - (distance - fadeStartDistance) / fadeRange);
    }

    if (Math.abs(opacity - lastOpacity.current) > 0.01) {
      lastOpacity.current = opacity;
      
      // برای Point
      if (pointRef.current) {
        pointRef.current.material.opacity = opacity;
        pointRef.current.material.transparent = true;
        pointRef.current.visible = opacity > 0;
      }
      
      // برای Text: setState فقط وقتی تغییر کنه (برای عملکرد بهتر)
      setTextOpacity(opacity);
      if (textRef.current) {
        textRef.current.visible = opacity > 0; // on/off سریع
      }
    }
  });

  const pointSize = scale ? scale.width / 70 : 1;

  // ⭐ موقعیت متن مستقیم محاسبه‌شده (بدون ref و useEffect)
  const textPos = [
    position.x,
    position.y + textHeightOffset,
    position.z
  ];

  return (
    <group>
      <Point 
        ref={pointRef}
        position={position} 
        color={pointColor} 
        size={pointSize}
        transparent={true}
      />

      <PositionedText
        ref={textRef}
        position={textPos} 
        text={label}
        color={textColor}
        background={background}
        opacity={textOpacity} 
      />
    </group>
  );
}