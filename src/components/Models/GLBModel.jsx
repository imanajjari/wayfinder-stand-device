// src/components/Models/GLBModel.jsx
import React, { useRef, useEffect, forwardRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GLBModel = forwardRef(function GLBModel(
  { url, scale = 1, position = [0,0,0], rotation = [0,0,0], onLoaded },
  ref
) {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = ref || useRef();

  useEffect(() => {
    if (!modelRef.current) return;
    // اگر هم‌راستاسازی با STL لازم داری، بهتره از prop rotation استفاده کنی
    // و این بخش رو حذف کنی تا روی Bounds/Box3 اثر نذاره.
    modelRef.current.rotation.x = Math.PI / 2;

    onLoaded?.(gltf.scene);  // ← سیگنال لود
  }, [gltf, onLoaded]);

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      position={position}
      rotation={rotation}
    />
  );
});

export default GLBModel;
