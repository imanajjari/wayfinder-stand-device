import React, { useMemo } from 'react';
import { Vector3, CatmullRomCurve3, TubeGeometry } from 'three';

export default function TubePath({ points, radius = 0.02 }) {
  const curve = useMemo(() => {
    const vectors = points.map(p => new Vector3(p.x, p.y, p.z));
    return new CatmullRomCurve3(vectors);
  }, [points]);

  const geometry = useMemo(() => new TubeGeometry(curve, 100, radius, 8, false), [curve, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}