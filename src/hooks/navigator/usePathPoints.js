// src/pages/navigator/hooks/usePathPoints.js
import { useMemo } from "react";

export default function usePathPoints(path, verticalOffset) {
  const points = useMemo(() => (
    path?.path?.map(p => ({ x: p.x, y: p.y + verticalOffset, z: p.z })) ?? []
  ), [path?.path, verticalOffset]);

  const last = points.length ? [points.at(-1).x, points.at(-1).y, points.at(-1).z] : null;

  return { points, last };
}
