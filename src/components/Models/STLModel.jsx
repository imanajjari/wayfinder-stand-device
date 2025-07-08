import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { MeshStandardMaterial } from "three";

export default function STLModel({ url, scale = 1, color = "gray", position = [0, 0, 0] }) {
  const geometry = useLoader(STLLoader, url);
  const materialRef = useRef();

  return (
    <mesh geometry={geometry} scale={[scale, scale, scale]} position={position}>
      <meshStandardMaterial ref={materialRef} color={color} />
    </mesh>
  );
}
