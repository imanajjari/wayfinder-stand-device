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

export default function Path3D() {
  const [activeFloor, setActiveFloor] = useState("g");
  const floors = ["f3", "f2", "f1", "g", "p1", "p2"];
  const { path, loading } = usePath();
  const { colors } = useTheme();

  const handleFloorSelect = (floor) => {
    setActiveFloor(floor);
    console.log("Floor selected:", floor);
  };

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
          {/* <STLModel
            url="/models/iranmall3.stl"
            scale={1}
            color={colors.modelColor}
          /> */}
          <GLBModel
            url="/models/iranmall4.glb"
            scale={1}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
          />

          {path?.path?.length > 0 && (
            <>
              <DottedStraightPath
                points={path.path}
                spacing={1}
                size={0.1}
                animate={true}
              />

              {/* <GLBModel
                    url="/models/start_marker.glb"
                    scale={20}
                    position={Object.values(path.path[0])}
                  />
                  <GLBModel
                    url="/models/end_flag.glb"
                    scale={2}
                    position={Object.values(path.path[path.path.length - 1])}
                  /> */}

                  
              {/* <Point position={path.path[0]} color={colors.pointStart} />
                  <Point
                    position={path.path[path.path.length - 1]}
                    color={colors.pointEnd}
                  /> */}
            </>
          )}
        </Bounds>
        {/*
        <GpsTracker isDev={true} color="blue" />
        */}

        <OrbitControls
          target={[13, 13.7, 0]}
          enablePan={false}
          minDistance={2}
          maxDistance={100}
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
