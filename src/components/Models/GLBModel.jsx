import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function GLBModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      // چرخش برای هم‌راستاسازی با مدل STL قبلی
      modelRef.current.rotation.x = Math.PI / 2;
    }
  }, [gltf]);

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      position={position}
      rotation={rotation} // rotation prop رو همچنان نگه‌می‌داریم برای کنترل دستی
    />
  );
}
