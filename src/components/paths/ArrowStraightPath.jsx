import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Vector3, Color } from "three";
import { useGLTF } from "@react-three/drei";

export default function ArrowStraightPath({
  points,
  spacing = 0.2,
  size = 0.3,
  animate = true,
  yawOffset = 0,
  headCount = 3,
  headIntervalMs = 50,
  maxD = 20,
}) {
  const { scene: originalScene } = useGLTF("/models/arrow2.glb");
  const sceneRef = useRef(null);
  const meshesRef = useRef([]);
  
  // ----------------- نمونه‌برداری مسیر (تغییر نمیشه) -----------------
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
      if (i === points.length - 2) res.push({ pos: b.clone() });
    }
    return res;
  }, [points, spacing]);

  const N = dots.length;
  if (N === 0) return null;

  // ----------------- محاسبه gap و direction ها (یکبار) -----------------
  const gap = useMemo(() => Math.floor(N / headCount) || 1, [N, headCount]);
  const directions = useMemo(() => {
    const dirs = [];
    for (let i = 0; i < N; i++) {
      if (N <= 1) {
        dirs[i] = new Vector3(1, 0, 0);
      } else {
        const cur = dots[i].pos;
        const nxt = i < N - 1 ? dots[i + 1].pos : dots[i - 1].pos;
        const v = new Vector3().subVectors(nxt, cur);
        dirs[i] = v.lengthSq() === 0 ? new Vector3(1, 0, 0) : v.normalize();
      }
    }
    return dirs;
  }, [dots]);

  // ----------------- Animation State -----------------
  const [base, setBase] = useState(0);
  const [allEntered, setAllEntered] = useState(false);
  const [intro, setIntro] = useState(true);
  const [activated, setActivated] = useState([]);

  // Reset on path change
  useEffect(() => {
    setBase(0);
    setAllEntered(false);
    setIntro(true);
    setActivated(new Array(N).fill(false));
  }, [N]);

  // Main animation loop
  useEffect(() => {
    if (!animate || N === 0) return;
    const id = setInterval(() => {
      setBase((b) => (b + 1) % N);
    }, headIntervalMs);
    return () => clearInterval(id);
  }, [animate, N, headIntervalMs]);

  // Check if all heads entered
  useEffect(() => {
    if (!allEntered && base >= (headCount - 1) * gap) {
      setAllEntered(true);
    }
  }, [base, gap, headCount, allEntered]);

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

  // Intro animation
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
    if (!intro || activated.length !== N) return;
    if (activated.every(Boolean)) {
      setIntro(false);
    }
  }, [activated, intro, N]);

  // ----------------- بهینه‌سازی: Update فقط مش‌ها -----------------
  const updateVisuals = useCallback(() => {
    if (!meshesRef.current.length || meshesRef.current.length !== N) return;

    for (let idx = 0; idx < N; idx++) {
      const meshGroup = meshesRef.current[idx];
      if (!meshGroup) continue;

      // محاسبه weight
      let w = 0;
      for (const h of heads) {
        const d = h - idx;
        if (d >= 0 && d <= maxD) {
          w = Math.max(w, 1 - d / maxD);
        }
      }

      // Intro check
      if (intro && !activated[idx]) {
        meshGroup.scale.setScalar(0);
        meshGroup.visible = false;
        continue;
      }

      meshGroup.visible = true;
      const s = size + size * 0.5 * w;
      const c = new Color("#ffffff").lerp(new Color("#00FFAB"), w);
      
      meshGroup.scale.setScalar(s);
      
      // Update color
      meshGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.copy(c);
        }
      });
    }
  }, [heads, intro, activated, N, size, maxD]);

  // Update visuals on state change
  useEffect(() => {
    updateVisuals();
  }, [updateVisuals]);

  // ----------------- یکبار Scene آماده‌سازی -----------------
  useEffect(() => {
    if (!originalScene || N === 0) return;

    const clonedScene = originalScene.clone();
    meshesRef.current = [];

    // Clone برای هر dot
    for (let i = 0; i < N; i++) {
      const meshClone = clonedScene.clone(true);
      meshClone.position.copy(dots[i].pos);
      
      const dir = directions[i];
      const yaw = -Math.atan2(dir.x, dir.y) + yawOffset;
      meshClone.rotation.set(1.5, yaw, 0);
      meshClone.scale.setScalar(0); // شروع مخفی
      meshClone.visible = false;
      
      meshesRef.current[i] = meshClone;
    }

    if (sceneRef.current) {
      // Clear previous
      sceneRef.current.clear();
      // Add new meshes
      meshesRef.current.forEach(mesh => {
        sceneRef.current.add(mesh);
      });
    }

    return () => {
      meshesRef.current = [];
    };
  }, [dots, directions, N, yawOffset, originalScene]);

  return <group ref={sceneRef} />;
}

useGLTF.preload?.("/models/arrow2.glb");
