import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function PanLimiter({ controls, isPortrait }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!controls.current) return;

    const limit = isPortrait
    ? { minX: -20, maxX: 30, minY: -10, maxY: 40 }
    :{ minX: -25, maxX: 50, minY: -10, maxY: 40 };

    const clampPositionAndTarget = () => {
      if (!controls.current) return;

      controls.current.target.x = THREE.MathUtils.clamp(controls.current.target.x, limit.minX, limit.maxX);
      controls.current.target.y = THREE.MathUtils.clamp(controls.current.target.y, limit.minY, limit.maxY);

    //   camera.position.x = THREE.MathUtils.clamp(camera.position.x, limit.minX, limit.maxX);
    //   camera.position.y = THREE.MathUtils.clamp(camera.position.y, limit.minY, limit.maxY);
    };

    controls.current.addEventListener('change', clampPositionAndTarget);

    return () => {
      controls.current?.removeEventListener('change', clampPositionAndTarget);
    };
  }, [camera, controls, isPortrait]);

  return null;
}
