// 📁 src/components/paths/DottedPath.jsx
import React, { useMemo } from 'react';
import { Vector3, CatmullRomCurve3 } from 'three';

export default function DottedPath({ points, spacing = 0.05, size = 0.01 }) {
  const dots = useMemo(() => {
    const vectors = points.map(p => new Vector3(p.x, p.y, p.z));
    const curve = new CatmullRomCurve3(vectors);
    const length = curve.getLength();
    const count = Math.floor(length / spacing);
    return Array.from({ length: count }, (_, i) => curve.getPoint(i / count));
  }, [points, spacing]);

  return (
    <>
      {dots.map((pos, index) => (
        <mesh key={index} position={pos.toArray()}>
          <sphereGeometry args={[size, 8, 8]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </>
  );
}
