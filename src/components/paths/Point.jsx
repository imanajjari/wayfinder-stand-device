import React from 'react';

const Point = React.forwardRef(({ 
  position, 
  color = "blue", 
  size = 0.1,
  transparent = false,
  opacity = 1 
}, ref) => {
  return (
    <mesh 
      ref={ref}
      position={[position.x, position.y, position.z]}
    >
      <sphereGeometry args={[size, 16, 16]} /> {/* کمتر segment = سریع‌تر */}
      <meshBasicMaterial 
        color={color}
        transparent={transparent}
        opacity={opacity}
        toneMapped={false} // برای neon effect بهتر
      />
    </mesh>
  );
});

Point.displayName = 'Point';

export default Point;
