// Navigator3DScene.jsx
import { Perf } from "r3f-perf";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import GLBModel from "../../components/Models/GLBModel";
import LightsRig from "../../components/scene/LightsRig";
import ControlsRig from "../../components/scene/ControlsRig";
import PathOverlay from "../../components/scene/PathOverlay";
import LabelsLayer from "../../components/scene/LabelsLayer";
import PanLimiter from "../../components/controls/PanLimiter";
import FitCameraToObject from "../../components/scene/FitCameraToObject";
import { useScreenshot } from "../../utils/useScreenshot";
import { QRCodeCanvas } from "qrcode.react";
import { useQrCodeUpload } from "../../hooks/QrCode/useQrCodeUpload";


import { MdOutlineScreenshot } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import ScreenshotQrOverlay from "../../components/scene/ScreenshotQrOverlay";

function SceneCore({
  colors,
  currentModelFile,
  verticalOffset,
  floorDestinations,
  pathPoints,
  lastPoint,
  labelText,
  isPortrait,
  onCapture,
}) {
  const { gl, scene, size } = useThree();
  const modelRoot = useRef();
  const controlsRef = useRef();
  const [loadedTick, setLoadedTick] = useState(0);

  const minZoom = isPortrait ? 20 : 20;
  const maxZoom = isPortrait ? 80 : 80;

  const handleModelLoaded = useCallback(() => {
    setLoadedTick((t) => t + 1);
  }, []);

  const fitDeps = useMemo(
    () => [currentModelFile, verticalOffset, loadedTick],
    [currentModelFile, verticalOffset, loadedTick]
  );

  // Use the screenshot hook
  useScreenshot({ gl, scene, size, onCapture });

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
        </Suspense>
        <LabelsLayer
          floorDestinations={floorDestinations}
          lastPoint={lastPoint}
          verticalOffset={verticalOffset}
          maxVisibleDistance={maxZoom}
          fadeStartDistance={maxZoom - 15}
        />
        <PathOverlay
          points={pathPoints}
          colors={colors}
          labelText={labelText}
          maxZoomDistance={maxZoom}
        />
      </group>
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
  // const { colors } = props;
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { handleUploadQr } = useQrCodeUpload();

  const handlerefreshQRUrl =() =>{
setQrUrl(null)
  }
  const handleCapture = useCallback(
    async (screenshot) => {
      setLoading(true)
      // 1️⃣ تبدیل Base64 به فایل برای آپلود
      const res = await fetch(screenshot);
      const blob = await res.blob();
      const file = new File([blob], "aojbsvasdv.png", { type: "image/png" });

      try {
        const uploaded = await handleUploadQr(file);
        console.log('uploaded:',uploaded);
        
        // 2️⃣ ساخت URL نهایی فایل برای QR
        setQrUrl(`http://45.159.150.16:3000/api/file/5/${uploaded.name}`); // assuming backend returns { url: '...' }
      } catch (err) {
        console.error("خطا در آپلود عکس:", err);
      }
      setLoading(false)
    },
    [handleUploadQr]
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        style={{ background: "#000",backgroundImage: "url('/images/bg-scene.png')",backgroundRepeat: "repeat",backgroundSize: "100px", transition: "0.5s" }}
        camera={{ position: [0, 60, 60],fov: 50 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
         {/* <Perf position="top-left" /> */}
        <SceneCore {...props} onCapture={handleCapture} />
      </Canvas>
<ScreenshotQrOverlay qrUrl={qrUrl} handlerefreshQRUrl={handlerefreshQRUrl}  loading={loading}/>
    </div>
  );
}
