// src/pages/navigator/Navigator3DScene.jsx
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import GLBModel from "../../components/Models/GLBModel";
import LightsRig from "./components/LightsRig";
import ControlsRig from "./components/ControlsRig";
import PathOverlay from "./components/PathOverlay";
import LabelsLayer from "./components/LabelsLayer";
import PanLimiter from "../../components/controls/PanLimiter";

/** این کامپوننت فقط داخل Canvas استفاده می‌شود */
function FitCameraToObject({ objectRef, controlsRef, padding = 1.2, deps = [] }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const root = objectRef.current;
    const controls = controlsRef.current;
    if (!root || !controls) return;

    let attempts = 0;
    const fit = () => {
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) {
        if (attempts++ < 5) requestAnimationFrame(fit);
        return;
      }

      const center = new THREE.Vector3();
      const sizeVec = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(sizeVec);

      const maxHalf = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 0.5;
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const aspect = size.width / size.height;
      const vDist = maxHalf / Math.tan(fov / 2);
      const hDist = (maxHalf / aspect) / Math.tan(fov / 2);
      const distance = padding * Math.max(vDist, hDist);

      controls.target.copy(center);

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      camera.position.copy(center.clone().sub(dir.multiplyScalar(distance)));

      camera.near = Math.max(0.1, distance / 1000);
      camera.far = Math.max(camera.far, distance * 1000);
      camera.updateProjectionMatrix();
      controls.update();
    };

    requestAnimationFrame(fit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectRef, controlsRef, size.width, size.height, ...deps]);

  return null;
}

function SceneCore({
  colors, currentModelFile, verticalOffset,
  floorDestinations, pathPoints, lastPoint,
  labelText, isPortrait
}) {
  const modelRoot = useRef();     // ریشهٔ مدل (مدل تکان داده نمی‌شود)
  const controlsRef = useRef();
  const [loadedTick, setLoadedTick] = useState(0);

  const minZoom = isPortrait ? 20 : 20;
  const maxZoom = isPortrait ? 60 : 40;

  const handleModelLoaded = useCallback(() => {
    setLoadedTick(t => t + 1);
  }, []);

  const fitDeps = useMemo(
    () => [currentModelFile, verticalOffset, loadedTick],
    [currentModelFile, verticalOffset, loadedTick]
  );

  return (
    <>
      <LightsRig />

      <group ref={modelRoot} position={[0, verticalOffset, 0]}>
        <Suspense fallback={null}>
          <GLBModel
            url={currentModelFile}
            scale={1}
            rotation={[0, 0, 0]}
            onLoaded={handleModelLoaded}
          />
          {/* <GLBModel
            url={'./public/models/arrow.glb'}
            scale={1}
            rotation={[0, 0, 0]}
            onLoaded={handleModelLoaded}
          /> */}
          <LabelsLayer
            floorDestinations={floorDestinations}
            lastPoint={lastPoint}
            verticalOffset={verticalOffset}
            maxVisibleDistance={maxZoom}
            fadeStartDistance={maxZoom - 15}
          />
        </Suspense>

        <PathOverlay
          points={pathPoints}
          colors={colors}
          labelText={labelText}
          maxZoomDistance={maxZoom}
        />
        
      </group>

      {/* فیت دوربین داخل Canvas */}
      <FitCameraToObject
        objectRef={modelRoot}
        controlsRef={controlsRef}
        padding={1.2}
        deps={fitDeps}
      />

      <ControlsRig controlsRef={controlsRef} min={minZoom} max={maxZoom} />
      <PanLimiter controls={controlsRef} isPortrait={isPortrait} />
    </>
  );
}

export default function Navigator3DScene(props) {
  const { colors } = props;
  return (
    <Canvas
      style={{ background: colors.canvasBackground }}
      camera={{ position: [0, 0, 60], fov: 50 }}
      dpr={[1, 2]}
      shadows
    >
      <SceneCore {...props} />
    </Canvas>
  );
}
