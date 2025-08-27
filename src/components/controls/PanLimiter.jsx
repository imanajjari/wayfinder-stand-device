// src/pages/navigator/components/controls/PanLimiter.jsx
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function PanLimiter({ controls, isPortrait }) {
  const { camera } = useThree();

  useEffect(() => {
    const ctrl = controls.current;
    if (!ctrl) return;

    // باکس محدودیت؛ بسته به پرتره/لنداسکیپ
    const limit = isPortrait
      ? { minX: -5, maxX: 30, minY: 0 , maxY: 30, minZ: -25, maxZ: 45 } //استند
      : { minX: -10, maxX: 40, minY: 0, maxY: 30, minZ: -30, maxZ: 50 };

    const clampTargetAndKeepOffset = () => {
      if (!controls.current) return;

      // offset بین position و target را ثابت نگه‌دار
      const offset = camera.position.clone().sub(ctrl.target);

      // clamp روی هر سه محور
      const clampedX = THREE.MathUtils.clamp(ctrl.target.x, limit.minX, limit.maxX);
      const clampedY = THREE.MathUtils.clamp(ctrl.target.y, limit.minY, limit.maxY);
      const clampedZ = THREE.MathUtils.clamp(ctrl.target.z, limit.minZ, limit.maxZ);

      if (clampedX !== ctrl.target.x || clampedY !== ctrl.target.y || clampedZ !== ctrl.target.z) {
        ctrl.target.set(clampedX, clampedY, clampedZ);
        camera.position.copy(ctrl.target).add(offset); // زاویه حفظ می‌شود
        ctrl.update();
      }
    };

    // یک‌بار در شروع هم اعمال شود
    clampTargetAndKeepOffset();

    ctrl.addEventListener('change', clampTargetAndKeepOffset);
    return () => ctrl.removeEventListener('change', clampTargetAndKeepOffset);
  }, [camera, controls, isPortrait]);

  return null;
}
