import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { getMyStand } from "../../services/floorService";
import PositionedText from "./PositionedText";
import { getDestinations } from "../../services/floorService";
import DestinationsLabels from "./DestinationsLabels";
import LabeledPoint from "./LabeledPoint";
import useCheckStandAndCompany from "../../hooks/useCheckStandAndCompany";
import * as THREE from "three";
import PanLimiter from "../controls/PanLimiter";
export default function Path3D() {
  const [activeFloor, setActiveFloor] = useState("g");
  const [isPortrait, setIsPortrait] = useState(true);
  const [currentModelFile, setCurrentModelFile] = useState(
    "/models/iranmall4.glb"
  );
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [floorDestinations, setFloorDestinations] = useState([]);

  const { floors, hasFloors, getFloorByName } = useFloors();

  const {
    path,
    updateCurrentFloorNumber,
    refreshLastDestination,
    lastDestination,
  } = usePath();
  const { colors } = useTheme();
  const controlsRef = useRef();

  // useCheckStandAndCompany();

  const currentFloorNumber = activeFloor?.number ?? 0;
  const destinationFloorNumber = lastDestination?.floorNumber ?? null;

  const labelText = useMemo(() => {
    if (!destinationFloorNumber) return "نقطه پایان";

    if (destinationFloorNumber > currentFloorNumber) {
      return "پله برقی  - برو طبقه بالا ";
    } else if (destinationFloorNumber < currentFloorNumber) {
      return "پله برقی - برو طبقه پایین ";
    } else {
      return "نقطه پایان";
    }
  }, [destinationFloorNumber, currentFloorNumber]);

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
      const myStand = getMyStand();
      let initialFloor = null;

      if (myStand) {
        initialFloor = floors.find((f) => f.number === myStand.floorNumber);
      }

      // اگر استند نبود یا طبقه‌اش یافت نشد، برو سراغ اولین طبقه
      if (!initialFloor) {
        initialFloor = floors[0];
      }

      if (initialFloor?.file) {
        setCurrentModelFile(`/models/${initialFloor.file}`);
        setActiveFloor(initialFloor);
        updateCurrentFloorNumber(initialFloor.number);
        fetchFloorDestinations(initialFloor.number);
      }
    }
  }, [hasFloors, floors]);

  const fetchFloorDestinations = (floorNumber) => {
    const allDestinations = getDestinations();
    const destinationsForFloor = allDestinations.filter(
      (dest) => dest.floorNum === floorNumber
    );

    setFloorDestinations(destinationsForFloor);
  };

  const handleFloorSelect = (floor) => {
    const floorData = typeof floor === "object" ? floor : getFloorByName(floor);

    if (floorData?.file) {
      fetchFloorDestinations(floorData.number ?? 0);
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
  const adjustedPathPoints = path?.path?.map((p) => ({
    x: p.x,
    y: p.y + verticalOffset,
    z: p.z,
  }));

  const lastPoint =
    adjustedPathPoints?.length > 0
      ? [
          adjustedPathPoints[adjustedPathPoints.length - 1].x,
          adjustedPathPoints[adjustedPathPoints.length - 1].y,
          adjustedPathPoints[adjustedPathPoints.length - 1].z,
        ]
      : null;

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

        <Bounds fit clip observe={false} margin={1.2}>
          <GLBModel
            url={currentModelFile}
            scale={1}
            position={[0, verticalOffset, 0]}
            rotation={[0, 0, 0]}
          />
          <DestinationsLabels
            destinations={floorDestinations}
            z={2}
            verticalOffset={verticalOffset}
            hiddenPositions={lastPoint ? [lastPoint] : []}
            fadeStartDistance={maxZoomDistance - 15}
            maxVisibleDistance={maxZoomDistance}
          />
          {path && (
            <>
              {path.type === "path" && path.path?.length > 0 && (
                <>

                  <DottedStraightPath
                    points={adjustedPathPoints}
                    spacing={1}
                    size={0.1}
                    animate={true}
                  />
                  {adjustedPathPoints.length > 1 ? (
                    <>
                      <LabeledPoint
                        position={{
                          x: adjustedPathPoints[0].x,
                          y: adjustedPathPoints[0].y,
                          z: adjustedPathPoints[0].z,
                        }}
                        label="نقطه شروع"
                        pointColor={colors.pointStart}
                        textColor={colors.pointStart}
                        textHeightOffset={1}
                        fadeStartDistance={maxZoomDistance - 10}
                        maxVisibleDistance={maxZoomDistance}
                      />

                      <LabeledPoint
                        position={{
                          x: adjustedPathPoints[adjustedPathPoints.length - 1]
                            .x,
                          y: adjustedPathPoints[adjustedPathPoints.length - 1]
                            .y,
                          z: adjustedPathPoints[adjustedPathPoints.length - 1]
                            .z,
                        }}
                        label="نقطه پایان"
                        pointColor={colors.pointEnd}
                        textColor="red"
                        textHeightOffset={1}
                        fadeStartDistance={maxZoomDistance - 10}
                        maxVisibleDistance={maxZoomDistance}
                      />
                    </>
                  ) : (
                    <LabeledPoint
                      position={{
                        x: adjustedPathPoints[adjustedPathPoints.length - 1].x,
                        y: adjustedPathPoints[adjustedPathPoints.length - 1].y,
                        z: adjustedPathPoints[adjustedPathPoints.length - 1].z,
                      }}
                      label={labelText}
                      pointColor={colors.pointEnd}
                      textColor="red"
                      textHeightOffset={0}
                      fadeStartDistance={maxZoomDistance}
                      maxVisibleDistance={maxZoomDistance}
                    />
                  )}
                </>
              )}

              {path.type === "floor-change" && <></>}
            </>
          )}
        </Bounds>
        {/*
        <GpsTracker isDev={true} color="blue" />
        */}

        <OrbitControls
          ref={controlsRef}
          target={[13, 13.7, 0]}
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
          }}
          touches={{
            ONE: THREE.TOUCH.PAN, // تک انگشت = جابجایی
            TWO: THREE.TOUCH.DOLLY_ROTATE, // دو انگشت = چرخش
          }}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 1.1}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />

        <PanLimiter controls={controlsRef} isPortrait={isPortrait} />
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
