// src/pages/navigator/components/ControlsRig.jsx
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function ControlsRig({ controlsRef, min, max }) {
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan
      enableRotate
      enableZoom
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
      }}
      touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }}
      minDistance={min}
      maxDistance={max}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 1.4}
      minAzimuthAngle={-Math.PI / 5}
      maxAzimuthAngle={Math.PI / 5}
    />
  );
}
