import React, { useMemo, useState, useEffect } from 'react';
import { Vector3, Color } from 'three';

export default function DottedStraightPath({ points, spacing = 0.05, size = 0.01, animate = true }) {
  const dots = useMemo(() => {
    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = new Vector3(points[i].x, points[i].y, points[i].z);
      const end = new Vector3(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      const dir = new Vector3().subVectors(end, start);
      const length = dir.length();
      dir.normalize();
      const count = Math.floor(length / spacing);
      for (let j = 0; j <= count; j++) {
        result.push(new Vector3().addVectors(start, dir.clone().multiplyScalar(j * spacing)));
      }
    }
    return result;
  }, [points, spacing]);

  const [headIndices, setHeadIndices] = useState([0, 20, 80]); // چند هد با فاصله

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setHeadIndices(prev =>
        prev.map(i => (i + 1) % dots.length)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [dots.length, animate]);

  const maxEffectDistance = 20; // چند نقطه عقب‌تر هم اثر بگیرند

  const getDotProps = (index) => {
    let maxInfluence = 0;

    for (let h of headIndices) {
      let d = h - index;
      if (d >= 0 && d <= maxEffectDistance) {
        const influence = 1 - d / maxEffectDistance;
        if (influence > maxInfluence) maxInfluence = influence;
      }
    }

    if (maxInfluence > 0) {
      const color = new Color().lerpColors(
        new Color('#fff'),
        new Color('red'),
        maxInfluence
      );
      const scale = size + (size * 0 * maxInfluence); // سایز از size تا 2.5 برابر
      return { color: color.getStyle(), scale };
    }

    return { color: '#fff', scale: size };
  };

  return (
    <>
      {dots.map((pos, index) => {
        const { color, scale } = getDotProps(index);
        return (
          <mesh key={index} position={pos.toArray()}>
            <sphereGeometry args={[scale, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </>
  );
}
