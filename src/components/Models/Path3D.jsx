import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import useTheme from "../../hooks/useTheme";
import Point from "../paths/Point";
import STLModel from "./STLModel";
import DottedStraightPath from "../paths/DottedStraightPath";
import BottomNav from "../layout/BottomNav";
import FloorSelectorColumn from "../common/FloorSelectorColumn";
import TopNav from "../layout/TopNav";
import { usePath } from "../../contexts/PathContext";
import GpsTracker from "../Gps/GpsTracker";
import GLBModel from "./GLBModel";
import { useFloors } from "../../hooks/useFloors";

export default function Path3D() {
  const [activeFloor, setActiveFloor] = useState("g");
  const [isPortrait, setIsPortrait] = useState(true); 
  const [currentModelFile, setCurrentModelFile] = useState("/models/iranmall4.glb");
  const [verticalOffset, setVerticalOffset] = useState(0);

  const { floors, hasFloors, getFloorByName } = useFloors();
  
  const { path, fetchPath, updateCurrentFloorNumber, refreshLastDestination } = usePath();
  const { colors } = useTheme();

  


  useEffect(() => {
  const handleResize = () => {
    const portrait = window.innerHeight > window.innerWidth;
    setIsPortrait(portrait);
    setVerticalOffset(portrait ? 0 : BASE_OFFSET);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    if (hasFloors && floors.length > 0) {
      const firstFloor = floors[0];
      if (firstFloor?.file) {
        setCurrentModelFile(`/models/${firstFloor.file}`);
        setActiveFloor(firstFloor);
        updateCurrentFloorNumber(firstFloor.number);
      }
    }
  }, [hasFloors, floors]);

const handleFloorSelect = (floor) => {
  const floorData = typeof floor === 'object' ? floor : getFloorByName(floor);

  if (floorData?.file) {
    console.log('====================================');
    console.log(' floorData floorData floorData: ',floorData.number);
    console.log('====================================');
    setCurrentModelFile(`/models/${floorData.file}`);
    setActiveFloor(floorData);
    updateCurrentFloorNumber(floorData.number ?? 0);
    refreshLastDestination({ currentFloorNumber: floorData.number });
  }
};
  
const minZoomDistance = isPortrait ? 40 : 30;
const maxZoomDistance = isPortrait ? 60 : 50;
const BASE_OFFSET = 10;

// تبدیل path به آرایه سه‌تایی و اضافه کردن offset
const adjustedPathPoints = path?.path?.map(p => ({
  x: p.x,
  y: p.y + verticalOffset,
  z: p.z
}));


  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: colors.background,
      }}
    >
      <TopNav />
      <Canvas
        style={{ background: colors.canvasBackground }}
        camera={{ position: [0, 0, 60], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <directionalLight position={[0, 0, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-10, 0, 10]} intensity={1.2} castShadow />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <Bounds fit clip observe margin={1.2}>
        <GLBModel
          url={currentModelFile}
          scale={1}
          position={[0, verticalOffset, 0]}
          rotation={[0, 0, 0]}
        />

{path && (
  <>
    {path.type === 'path' && path.path?.length > 0 && (
      <>
        <DottedStraightPath
          points={adjustedPathPoints}
          spacing={1}
          size={0.1}
          animate={true}
        />
        <Point position={{
  "x":adjustedPathPoints[0].x,
  "y":adjustedPathPoints[0].y,
  "z":adjustedPathPoints[0].z
}} color={colors.pointStart} />

<Point position={{
  "x":adjustedPathPoints[adjustedPathPoints.length - 1].x,
  "y":adjustedPathPoints[adjustedPathPoints.length - 1].y,
  "z":adjustedPathPoints[adjustedPathPoints.length - 1].z
}} color={colors.pointEnd} />
      </>
    )}

    {path.type === 'floor-change' && (
      <>

      </>
    )}
  </>
)}

        </Bounds>
        {/*
        <GpsTracker isDev={true} color="blue" />
        */}

        <OrbitControls
          target={[13, 13.7, 0]}
          enablePan={false}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.1}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>

      <BottomNav />
      <FloorSelectorColumn
        floors={floors}
        onSelect={handleFloorSelect}
        activeFloor={activeFloor}
      />
    </div>
  );
}
