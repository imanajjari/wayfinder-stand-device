// src/hooks/navigator/useHoldMapCoords.js
import { useCallback, useMemo, useRef, useState } from "react";
import { usePath } from "../../contexts/PathContext";


export function useHoldMapCoords({ modelRootRef, holdDelay = 250, cancelMovePx = 6 } = {}) {
  const [holdInfo, setHoldInfo] = useState(null);
const { fetchPathV2 } = usePath();
  const holdTimer = useRef(null);
  const holdingRef = useRef(false);
  const selectedLocalRef = useRef(null);
  const holdStart = useRef({ x: 0, y: 0 });

  const clearHold = useCallback(() => {
    holdingRef.current = false;

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    selectedLocalRef.current = null;
    setHoldInfo(null);
  }, []);

  const fmt = (v) => (typeof v === "number" && Number.isFinite(v) ? v.toFixed(2) : "—");

  const pushInfoFromLocal = useCallback(
    (localPoint, screenX, screenY, objName = "mesh") => {
      setHoldInfo({
        screenX,
        screenY,
        objectName: objName,

        // ✅ مختصات پایدار برای مسیر‌یابی
        mapX: localPoint.x,
        mapY: localPoint.z,

        // Local (برای دیباگ/نمایش)
        localX: localPoint.x,
        localY: localPoint.y,
        localZ: localPoint.z,
      });
      
      
    },
    []
  );

  const onPointerDown = useCallback(
    (e) => {
       
      if (e.button != null && e.button !== 0) return;

      holdStart.current = { x: e.clientX, y: e.clientY };

      if (holdTimer.current) clearTimeout(holdTimer.current);

      holdTimer.current = setTimeout(() => {
        holdingRef.current = true;

        const worldP = e.point.clone();
        const lp = worldP.clone();

        const root = modelRootRef?.current;
        if (root) root.worldToLocal(lp);

        selectedLocalRef.current = lp;

        const objName = e.object?.name || e.object?.parent?.name || "mesh";
        pushInfoFromLocal(lp, e.clientX, e.clientY, objName);
        fetchPathV2({end:{entrance: {x: fmt(lp.x)*100, y: fmt(lp.y)*100}}})
      }, holdDelay);
      // console.log('x:', e.clientX); 
      // console.log('y:',  e.clientY); 
      
      // console.log('lp:',  lp); 
    },
    [holdDelay, modelRootRef, pushInfoFromLocal]
  );

  const onPointerMove = useCallback(
    (e) => {
      // قبل از فعال شدن hold: اگر حرکت زیاد بود، کنسل کن تا با pan اشتباه نشه
      if (!holdingRef.current) {
        const dx = e.clientX - holdStart.current.x;
        const dy = e.clientY - holdStart.current.y;

        if (Math.hypot(dx, dy) > cancelMovePx) {
          if (holdTimer.current) clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
        return;
      }

      // بعد از فعال شدن hold: مختصات ثابت، فقط جای overlay آپدیت می‌شه
      const lp = selectedLocalRef.current;
      
      
      if (!lp) return;

      pushInfoFromLocal(lp, e.clientX, e.clientY);
    },
    [cancelMovePx, pushInfoFromLocal]
  );

  const onPointerUp = useCallback(() => clearHold(), [clearHold]);
  const onPointerLeave = useCallback(() => clearHold(), [clearHold]);

  // ✅ یک آبجکت آماده برای spread روی group
  const bind = useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerOut: onPointerLeave,
      onPointerLeave,
    }),
    [onPointerDown, onPointerMove, onPointerUp, onPointerLeave]
  );

  return { holdInfo, bind, clearHold, setHoldInfo };
}
