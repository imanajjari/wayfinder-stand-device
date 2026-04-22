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
import { useQrCodeUpload } from "../../hooks/QrCode/useQrCodeUpload";


import { useHoldMapCoords } from "../../hooks/navigator/useHoldMapCoords";
import ScreenshotQrOverlay from "../../components/scene/ScreenshotQrOverlay";
import HoldCoordsOverlay from "../../components/scene/HoldCoordsOverlay";
import CustomerClubButton from "../../components/buttons/CustomerClubButton";
import { useGLBSize } from "../../hooks/useGLBSize";
import FeedbackButton from "../../components/Feedback/FeedbackButton";

function SceneCore({
  colors,
  currentModelFile,
  verticalOffset,
  floorDestinations,
  activeFloor,
  isPortrait,
  onCapture,
  onHoldInfo, // هنوز می‌خوای بیرون setState کنی
}) {
  const { gl, scene, size } = useThree();
  const modelRoot = useRef();
  const controlsRef = useRef();
  const [loadedTick, setLoadedTick] = useState(0);

  // const minZoom = isPortrait ? 2 : 2;
  // const maxZoom = isPortrait ? 20 : 20;

  

// ✅ 1. Object map برای مقادیر سفارشی (خارج از هر hook)
  const modelDims = {
    '/models/cemetery.glb.gz': { width: 7.6, height: 5.12, depth: 0.7 },
    '/models/TRY4.glb': {width: 30.71, height: 35.74, depth: 9.42},
  };

  // ✅ 2. Hook در top-level (فقط یکبار)
  const glbSize = useGLBSize(currentModelFile);

  // ✅ 3. ترکیب در useMemo (بدون hook!)
  const dims = useMemo(() => {
    return modelDims[currentModelFile] || glbSize || null;
  }, [currentModelFile, glbSize]);


const minZoom = useMemo(() => {
  if (!dims) return 20;
  return dims.width;
}, [dims]);

const maxZoom = useMemo(() => {
  if (!dims) return 80;
  return dims.width*3;
}, [dims]);

  const handleModelLoaded = useCallback(() => {
    setLoadedTick((t) => t + 1);
  }, []);

  const fitDeps = useMemo(
    () => [currentModelFile, verticalOffset, loadedTick],
    [currentModelFile, verticalOffset, loadedTick]
  );

  useScreenshot({
    gl,
    scene,
    size,
    onCapture,
    options: { maxLongSide: 2160, padding: 1.15, zoomFactor: 1.0 },
  });

  // ✅ hook فقط bind می‌ده
  const { bind, holdInfo } = useHoldMapCoords({
    modelRootRef: modelRoot,
    holdDelay: 250,
    cancelMovePx: 6,
  });

  // اگر می‌خوای state بیرون هم sync بشه:
  // ساده‌ترین راه: هر بار holdInfo عوض شد بفرست بیرون
  // (ولی اگر بیرون فقط برای overlayه، می‌تونی overlay رو همینجا هم رندر کنی و کلاً onHoldInfo رو حذف کنی)
  useMemo(() => {
    onHoldInfo?.(holdInfo);
  }, [holdInfo, onHoldInfo]);

  return (
    <>
      <LightsRig />

      <group ref={modelRoot} position={[0, verticalOffset, 0]} {...bind}>
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
          verticalOffset={verticalOffset}
          maxVisibleDistance={maxZoom}
          fadeStartDistance={maxZoom - 15}
        />

        <PathOverlay colors={colors} activeFloor={activeFloor} maxZoomDistance={maxZoom} scale={dims}/>
      </group>

      <FitCameraToObject objectRef={modelRoot} controlsRef={controlsRef} padding={1.2} deps={fitDeps} />
      <ControlsRig controlsRef={controlsRef} min={minZoom} max={maxZoom} />
      <PanLimiter controls={controlsRef} isPortrait={isPortrait} />
    </>
  );
}



export default function Navigator3DScene(props) {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  // بخش انتخاب نقطه دلخوا
  const [holdInfo, setHoldInfo] = useState(null);

  const { handleUploadQr } = useQrCodeUpload();

  const handlerefreshQRUrl = () => setQrUrl(null);

  const handleCapture = useCallback(async (screenshot) => {
    setLoading(true);
    const res = await fetch(screenshot);
    const blob = await res.blob();
    const file = new File([blob], "aojbsvasdv.png", { type: "image/png" });

    try {
      const uploaded = await handleUploadQr(file);
      setQrUrl(`http://45.159.150.16:4000/SnapShare/${uploaded.name}`);
    } catch (err) {
      console.error("خطا در آپلود عکس:", err);
    }
    setLoading(false);
  }, [handleUploadQr]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        style={{
          background: "#000",
          backgroundImage: "url('/images/bg-scene.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "100px",
          transition: "0.5s",
        }}
        camera={{ position: [0, 60, 60], fov: 50 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <SceneCore
          {...props}
          onCapture={handleCapture}
          // انتخاب ازاد مقصد
          onHoldInfo={setHoldInfo}
        />
      </Canvas>

      {/* ✅ نمایش مختصات هنگام نگه داشتن */}
      <HoldCoordsOverlay info={holdInfo} />
<div className="absolute top-2/3  sm:top-5/8  xl:top-1/3  left-0 flex flex-col gap-4" dir="ltr">
      <ScreenshotQrOverlay
        qrUrl={qrUrl}
        handlerefreshQRUrl={handlerefreshQRUrl}
        loading={loading}
      />
      <CustomerClubButton />
      <FeedbackButton />

      </div>
    </div>
  );
}
