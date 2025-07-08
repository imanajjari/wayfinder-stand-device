// components/paths/ConvertedPathDisplay.jsx
import React from "react";
import DottedStraightPath from "./DottedStraightPath";
import Point from "./Point";
import useTheme from "../../hooks/useTheme";


export default function ConvertedPathDisplay({ path2D = [] }) {
  const { colors } = useTheme();

  if (!path2D.length) return null;

  const points3D = path2D.map(([x, y]) => ({ x, y, z: 1 }));

  return (
    <>
      <DottedStraightPath
        points={points3D}
        spacing={0.03}
        size={0.01}
        animate={true}
      />
      <Point position={points3D[0]} color={colors.pointStart} />
      <Point position={points3D[points3D.length - 1]} color={colors.pointEnd} />
    </>
  );
}
