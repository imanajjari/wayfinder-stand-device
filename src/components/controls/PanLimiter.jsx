// src/pages/navigator/components/controls/PanLimiter.jsx
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * رفتار: Hard-Stop
 * - اگر پَن به بیرون از باکس بره، هم target و هم camera.position به مقدار قبلی برگردونده می‌شن.
 * - هیچ ctrl.update() داخل لیسنر زده نمی‌شه تا با damping تداخل نکنه.
 * - فقط وقتی target واقعاً تغییر کرده (پَن) مداخله می‌کنیم؛ زوم/چرخش بی‌اثر روی limiter هستند.
 */
export default function PanLimiter({ controls, isPortrait, margin = 1e-3, epsilon = 1e-6 }) {
  const { camera } = useThree();
  const prevTarget = useRef(new THREE.Vector3());
  const prevCamPos = useRef(new THREE.Vector3());

  useEffect(() => {
    const ctrl = controls.current;
    if (!ctrl) return;

    // محدوده‌ی مجاز پَن
    const limit = isPortrait
      ? { minX: -5,  maxX: 30, minY: 0, maxY: 30, minZ: -25, maxZ: 45 }
      : { minX: -10, maxX: 40, minY: 0, maxY: 30, minZ: -30, maxZ: 50 };

    const inside = (x, min, max) => x >= (min + margin) && x <= (max - margin);

    const clampInit = () => {
      // اطمینان از شروع داخل باکس
      ctrl.target.x = THREE.MathUtils.clamp(ctrl.target.x, limit.minX + margin, limit.maxX - margin);
      ctrl.target.y = THREE.MathUtils.clamp(ctrl.target.y, limit.minY + margin, limit.maxY - margin);
      ctrl.target.z = THREE.MathUtils.clamp(ctrl.target.z, limit.minZ + margin, limit.maxZ - margin);
      prevTarget.current.copy(ctrl.target);
      prevCamPos.current.copy(camera.position);
    };

    const onChange = () => {
      // فقط وقتی پَن شده (تغییر محسوسی در target) بررسی کن
      const currT = ctrl.target;
      if (currT.distanceToSquared(prevTarget.current) <= epsilon) {
        // زوم/چرخش یا تغییر ناچیز → فقط مرجع دوربین را به‌روز کن
        prevCamPos.current.copy(camera.position);
        return;
      }

      // مقصد جدید کاربر
      const want = currT;

      // اگر هر محور از باکس خارج شد (و در همان جهت از حد عبور می‌کند) → کامل بلاک کن
      const outX = (!inside(want.x, limit.minX, limit.maxX) &&
                   ((want.x > prevTarget.current.x && want.x > limit.maxX - margin) ||
                    (want.x < prevTarget.current.x && want.x < limit.minX + margin)));

      const outY = (!inside(want.y, limit.minY, limit.maxY) &&
                   ((want.y > prevTarget.current.y && want.y > limit.maxY - margin) ||
                    (want.y < prevTarget.current.y && want.y < limit.minY + margin)));

      const outZ = (!inside(want.z, limit.minZ, limit.maxZ) &&
                   ((want.z > prevTarget.current.z && want.z > limit.maxZ - margin) ||
                    (want.z < prevTarget.current.z && want.z < limit.minZ + margin)));

      if (outX || outY || outZ) {
        // حرکت نامجاز → دقیقاً به حالت قبل برگردون (Hard Stop)
        ctrl.target.copy(prevTarget.current);
        camera.position.copy(prevCamPos.current);
        // توجه: ctrl.update() نزن؛ باعث لرزش/سرخوردن می‌شود.
        return;
      }

      // حرکت مجاز بوده → مرجع را به‌روز کن
      prevTarget.current.copy(ctrl.target);
      prevCamPos.current.copy(camera.position);
    };

    // مقدار اولیه
    clampInit();

    ctrl.addEventListener('change', onChange);
    return () => ctrl.removeEventListener('change', onChange);
  }, [camera, controls, isPortrait, margin, epsilon]);

  return null;
}
