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
  const { floors, hasFloors, getFloorByName } = useFloors();
  
  const { path } = usePath();
  const { colors } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
  
    handleResize(); // در بارگذاری اول بررسی شود
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تنظیم فایل مدل پیش‌فرض در ابتدای بارگذاری
  useEffect(() => {
    console.log("Path3D: hasFloors:", hasFloors, "floors:", floors);
    if (hasFloors && floors.length > 0) {
      // اگر floors موجود باشد، طبقه اول را به عنوان پیش‌فرض انتخاب کن
      const firstFloor = floors[0];
      console.log("Path3D: Setting first floor as default:", firstFloor);
      if (firstFloor && firstFloor.file) {
        setCurrentModelFile(`/models/${firstFloor.file}`);
        setActiveFloor(firstFloor);
      }
    }
  }, [hasFloors, floors]);

  const handleFloorSelect = (floor) => {
    console.log("Path3D: Floor selected:", floor);
    setActiveFloor(floor);
    
    // اگر floor یک object باشد، فایل مربوط به آن را دریافت کن
    if (typeof floor === 'object' && floor.file) {
      console.log("Path3D: Setting model file from object:", floor.file);
      setCurrentModelFile(`/models/${floor.file}`);
    } else if (typeof floor === 'string') {
      // اگر floor یک string باشد، سعی کن floor object مربوط به آن را پیدا کنی
      const floorData = getFloorByName(floor);
      console.log("Path3D: Found floor data for string:", floorData);
      if (floorData && floorData.file) {
        setCurrentModelFile(`/models/${floorData.file}`);
      }
    }
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
            url={currentModelFile}
            scale={1}
            position={isPortrait ? [0, 0, 0] : [0, 10, 0]}
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
        floors={[]}
        onSelect={handleFloorSelect}
        activeFloor={activeFloor}
      />
    </div>
  );
}
