import React from 'react';

export default function Point({ position, color = "blue", size = 0.3 }) {
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}