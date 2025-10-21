// utils/useScreenshot.js
import { useCallback, useEffect } from "react";
import * as THREE from "three";

/**
 * useScreenshot({ gl, scene, size, onCapture, options })
 * options:
 *   maxLongSide   : طولِ بلندِ خروجی (px). پیش‌فرض 2160
 *   padding       : حاشیهٔ قاب. پیش‌فرض 1.15
 *   zoomFactor    : 1 یعنی فیت دقیق، >1 یعنی دوربین عقب‌تر. پیش‌فرض 1.0
 *   fixedAspect   : نسبت ثابت (مثلاً 16/9). اگر ندی، از نسبت فعلی بوم استفاده می‌شود.
 *   toneMapping   : پیش‌فرض همان gl.toneMapping (اگر خواستی override کنی).
 *   exposure      : پیش‌فرض همان gl.toneMappingExposure
 *   colorSpace    : پیش‌فرض THREE.SRGBColorSpace
 */
export const useScreenshot = ({
  gl,
  scene,
  size,
  onCapture,
  options = {},
}) => {
  const captureScreenshot = useCallback(() => {
    if (!gl || !scene) return;

    // 1) روت مدل
    const modelRoot = scene.children.find((c) => c.isGroup) || scene;
    scene.updateMatrixWorld(true);

    // 2) نسبت هدف
    const currentAspect = size?.width && size?.height ? (size.width / size.height) : 1;
    const targetAspect = typeof options.fixedAspect === "number"
      ? options.fixedAspect
      : currentAspect;

    // 3) ابعاد خروجی
    const maxLongSide = options.maxLongSide ?? 2160;
    let targetW, targetH;
    if (targetAspect >= 1) {
      targetW = maxLongSide;
      targetH = Math.round(targetW / targetAspect);
    } else {
      targetH = maxLongSide;
      targetW = Math.round(targetH * targetAspect);
    }

    // 4) باکس مدل + قاب ارتو
    const box = new THREE.Box3().setFromObject(modelRoot);
    const center = new THREE.Vector3();
    const sizeVec = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(sizeVec);

    const padding   = options.padding ?? 1.15;
    const zoomFactor= options.zoomFactor ?? 1.0;

    let halfW = (sizeVec.x * padding * zoomFactor) / 2;
    let halfH = (sizeVec.y * padding * zoomFactor) / 2;

    const boxAspect = halfW / halfH;
    if (boxAspect > targetAspect) {
      halfH = halfW / targetAspect;
    } else {
      halfW = halfH * targetAspect;
    }

    const orthoCamera = new THREE.OrthographicCamera(
      -halfW, +halfW, +halfH, -halfH, 0.1, 100000
    );
    const marginZ = (sizeVec.z * padding * zoomFactor) / 2 + 1;
    orthoCamera.position.set(center.x, center.y, center.z + marginZ);
    orthoCamera.lookAt(center);
    orthoCamera.updateProjectionMatrix();

    // 5) همسان‌سازی ToneMapping/Exposure/ColorSpace با رندر اصلی
    const toneMapping = options.toneMapping ?? gl.toneMapping ?? THREE.ACESFilmicToneMapping;
    const exposure    = options.exposure ?? gl.toneMappingExposure ?? 1.0;
    const colorSpace  = options.colorSpace ?? THREE.SRGBColorSpace;

    const originalTone = gl.toneMapping;
    const originalExpo = gl.toneMappingExposure;
    // outputColorSpace در سه‌جی جدید:
    const hasOutputColorSpace = "outputColorSpace" in gl;
    const originalOCS = hasOutputColorSpace ? gl.outputColorSpace : undefined;
    // پُشتیبانی از نسخه‌های قدیمی‌تر سه‌جی (outputEncoding):
    const hasOutputEncoding = "outputEncoding" in gl;
    const originalOE = hasOutputEncoding ? gl.outputEncoding : undefined;

    gl.toneMapping = toneMapping;
    gl.toneMappingExposure = exposure;
    if (hasOutputColorSpace) {
      gl.outputColorSpace = colorSpace;
    } else if (hasOutputEncoding) {
      // سازگاری قدیمی: sRGBEncoding
      gl.outputEncoding = THREE.sRGBEncoding;
    }

    // 6) RenderTarget با sRGB
    const rt = new THREE.WebGLRenderTarget(targetW, targetH, {
      depthBuffer: true,
      stencilBuffer: false,
      // samples: 4, // اگر MSAA لازم بود و پشتیبانی شد
    });
    // بسیار مهم: بگو خروجی این تکسچر sRGB باشد تا encode شود
    rt.texture.colorSpace = colorSpace; // در نسخه‌های قدیمی‌تر: rt.texture.encoding = THREE.sRGBEncoding;

    const originalRT = gl.getRenderTarget();
    gl.setRenderTarget(rt);
    gl.clear(true, true, true);
    gl.render(scene, orthoCamera);

    // 7) خواندن پیکسل‌ها (الان پیکسل‌ها sRGB-encoded هستند)
    const pixels = new Uint8Array(targetW * targetH * 4);
    gl.readRenderTargetPixels(rt, 0, 0, targetW, targetH, pixels);

    // 8) ساخت PNG با وارونه‌سازی عمودی
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");

    const imageData = ctx.createImageData(targetW, targetH);
    const rowBytes = targetW * 4;
    for (let y = 0; y < targetH; y++) {
      const srcStart = (targetH - 1 - y) * rowBytes;
      const dstStart = y * rowBytes;
      imageData.data.set(pixels.subarray(srcStart, srcStart + rowBytes), dstStart);
    }
    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL("image/png");
    onCapture?.(dataURL);

    // 9) بازگردانی وضعیت
    gl.setRenderTarget(originalRT);
    rt.dispose();

    gl.toneMapping = originalTone;
    gl.toneMappingExposure = originalExpo;
    if (hasOutputColorSpace) {
      gl.outputColorSpace = originalOCS;
    } else if (hasOutputEncoding) {
      gl.outputEncoding = originalOE;
    }
  }, [gl, scene, size, onCapture, options]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.captureScreenshot = captureScreenshot;
    }
    return () => { delete window.captureScreenshot; };
  }, [captureScreenshot]);

  return captureScreenshot;
};
