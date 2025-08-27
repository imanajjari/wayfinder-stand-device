import React, { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Vector3, Color } from "three";
import { useGLTF } from "@react-three/drei";

export default function ArrowStraightPath({
  points,
  spacing = 0.2,
  size = 0.3,
  animate = true,
  yawOffset = 0,
}) {
  const { scene } = useGLTF("/models/arrow.glb");

  // نمونه‌برداری یکنواخت روی مسیر (بدون تکرار مرزی)
  const dots = useMemo(() => {
    if (!points || points.length < 2) return [];
    const res = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = new Vector3(points[i].x, points[i].y, points[i].z);
      const b = new Vector3(points[i + 1].x, points[i + 1].y, points[i + 1].z);
      const seg = new Vector3().subVectors(b, a);
      const len = seg.length();
      if (len === 0) continue;
      const dir = seg.clone().normalize();
      const count = Math.floor(len / spacing);
      for (let j = 0; j < count; j++) {
        const pos = a.clone().add(dir.clone().multiplyScalar(j * spacing));
        res.push({ pos });
      }
      if (i === points.length - 2) res.push({ pos: b.clone() }); // انتهای مسیر
    }
    return res;
  }, [points, spacing]);

  // افکت موجی (اختیاری)
  const [heads, setHeads] = useState([0, 20, 80]);
  useEffect(() => {
    if (!animate || dots.length === 0) return;
    setHeads(h => h.map(i => (dots.length ? i % dots.length : 0)));
    const id = setInterval(() => {
      setHeads(h => h.map(i => (i + 1) % dots.length));
    }, 50);
    return () => clearInterval(id);
  }, [dots.length, animate]);

  const maxD = 20;
  const getVisualProps = (idx) => {
    let w = 0;
    for (const h of heads) {
      const d = h - idx;
      if (d >= 0 && d <= maxD) w = Math.max(w, 1 - d / maxD);
    }
    const s = size + size * 0.5 * w;
    const c = new Color("#ffffff").lerp(new Color("#FF0000"), w);
    return { scale: s, color: c };
  };

  // کلون با متریال مستقل و رنگ سفارشی
  const cloneWithColor = (root, color) => {
    const c = root.clone(true);
    c.traverse((o) => {
      if (o.isMesh) {
        o.material = o.material.clone();
        if (o.material.color) o.material.color = new THREE.Color(color);
      }
    });
    return c;
  };

  // جهت: فقط به سمت نقطه‌ی بعدی (برای آخرین، به سمت قبلی)
  const dirToNext = (i) => {
    if (dots.length === 1) return new Vector3(1, 0, 0);
    const cur = dots[i].pos;
    const nxt = i < dots.length - 1 ? dots[i + 1].pos : dots[i - 1].pos; // <- نکته
    const v = new Vector3().subVectors(nxt, cur);
    if (v.lengthSq() === 0) return new Vector3(1, 0, 0);
    return v.normalize();
  };

  return (
    <>
      {dots.map((d, idx) => {
        const { scale, color } = getVisualProps(idx);
        const dir = dirToNext(idx);

        // زاویه‌ی حول Y روی صفحه‌ی XY (طبق نیاز تو)
        const yaw = -Math.atan2(dir.x, dir.y) + yawOffset;

        return (
          <primitive
            key={idx}
            object={cloneWithColor(scene, color)}
            position={d.pos.toArray()}
            rotation={[1.5, yaw, 0]}   // X=1.5 ثابت، Y=زاویه مسیر، Z=0
            scale={[scale, scale, scale]}
          />
        );
      })}
    </>
  );
}

useGLTF.preload?.("/models/arrow.glb");
