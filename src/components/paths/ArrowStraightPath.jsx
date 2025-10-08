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
  headCount = 3,        // تعداد هدها
  headIntervalMs = 50,  // سرعت حرکت
  maxD = 20,            // طول دُم موج
}) {
  const { scene } = useGLTF("/models/arrow.glb");

  // ----------------- نمونه‌برداری مسیر -----------------
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

  const N = dots.length;
  if (N === 0) return null;

  // ----------------- هدها با فاصله‌ی مساوی -----------------
  const gap = useMemo(() => {
    if (!N || headCount <= 0) return 1;
    return Math.floor(N / headCount) || 1;
  }, [N, headCount]);

  const [base, setBase] = useState(0);
  useEffect(() => {
    setBase(0); // با تغییر مسیر از 0 شروع
  }, [N]);

  useEffect(() => {
    if (!animate || N === 0) return;
    const id = setInterval(() => {
      setBase((b) => (b + 1) % N);
    }, headIntervalMs);
    return () => clearInterval(id);
  }, [animate, N, headIntervalMs]);

  // پس از اینکه همه هدها وارد شدند، دیگر ریست نشوند
  const [allEntered, setAllEntered] = useState(false);
  useEffect(() => {
    setAllEntered(false);
  }, [N]);

  useEffect(() => {
    if (!N || headCount <= 0 || gap === 0) return;
    if (!allEntered && base >= (headCount - 1) * gap) {
      setAllEntered(true);
    }
  }, [base, gap, headCount, N, allEntered]);

  const activeCount = useMemo(() => {
    if (!N || headCount <= 0 || gap === 0) return 1;
    if (allEntered) return headCount;
    return Math.min(headCount, Math.floor(base / gap) + 1);
  }, [base, gap, headCount, N, allEntered]);

  const heads = useMemo(() => {
    const arr = [];
    for (let k = 0; k < activeCount; k++) {
      const h = (base - k * gap + N) % N;
      arr.push(h);
    }
    return arr;
  }, [base, gap, activeCount, N]);

  // ----------------- Intro فقط بار اول -----------------
  const [intro, setIntro] = useState(true);
  const [activated, setActivated] = useState([]);

  useEffect(() => {
    setIntro(true);
    setActivated(new Array(N).fill(false));
  }, [N]);

  useEffect(() => {
    if (!intro || N === 0) return;
    setActivated((prev) => {
      if (prev.length !== N) return new Array(N).fill(false);
      const next = prev.slice();
      for (const h of heads) {
        const start = Math.max(0, h - maxD);
        const end = Math.min(N - 1, h);
        for (let i = start; i <= end; i++) next[i] = true;
      }
      return next;
    });
  }, [heads, intro, N, maxD]);

  useEffect(() => {
    if (!intro) return;
    if (activated.length === N && activated.every(Boolean)) {
      setIntro(false);
    }
  }, [activated, intro, N]);

  // ----------------- ظاهر بصری هر فلش -----------------
  const getVisualProps = (idx) => {
    let w = 0;
    for (const h of heads) {
      const d = h - idx;
      if (d >= 0 && d <= maxD) w = Math.max(w, 1 - d / maxD);
      // اگر wrap هم بخوای: فاصله‌ی مدولویی را هم حساب کن
      // const wrapD = (idx - h + N) % N;
      // if (wrapD <= maxD) w = Math.max(w, 1 - wrapD / maxD);
    }

    if (intro && !activated[idx]) {
      return { scale: 0, color: new Color("#000000") };
    }

    const s = size + size * 0.5 * w;
    const c = new Color("#ffffff").lerp(new Color("#00FFAB"), w);
    return { scale: s, color: c };
  };

  // ----------------- utilities -----------------
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

  const dirToNext = (i) => {
    if (N <= 1) return new Vector3(1, 0, 0);
    const cur = dots[i].pos;
    const nxt = i < N - 1 ? dots[i + 1].pos : dots[i - 1].pos;
    const v = new Vector3().subVectors(nxt, cur);
    if (v.lengthSq() === 0) return new Vector3(1, 0, 0);
    return v.normalize();
  };

  return (
    <>
      {dots.map((d, idx) => {
        const { scale, color } = getVisualProps(idx);
        const dir = dirToNext(idx);
        const yaw = -Math.atan2(dir.x, dir.y) + yawOffset; // مسیر روی صفحه XY
        return (
          <primitive
            key={idx}
            object={cloneWithColor(scene, color)}
            position={d.pos.toArray()}
            rotation={[1.5, yaw, 0]}
            scale={[scale, scale, scale]}
          />
        );
      })}
    </>
  );
}

useGLTF.preload?.("/models/arrow.glb");
