import { useCallback, useEffect } from "react";
import * as THREE from "three";

export const useScreenshot = ({ gl, scene, size, onCapture }) => {
  const captureScreenshot = useCallback(() => {
    if (!scene || !gl) return;

    const modelRoot = scene.children.find((child) => child.isGroup);
    if (!modelRoot) return;

    const box = new THREE.Box3().setFromObject(modelRoot);
    const center = new THREE.Vector3();
    const sizeVec = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(sizeVec);

    const aspect = size.width / size.height;
    const maxSize = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 0.5;

    const orthoCamera = new THREE.OrthographicCamera(
      -maxSize * aspect,
      maxSize * aspect,
      maxSize,
      -maxSize,
      0.1,
      5000
    );
    orthoCamera.position.set(center.x, center.y, center.z + maxSize);
    orthoCamera.lookAt(center);
    orthoCamera.updateProjectionMatrix();

    // 📌 ذخیره سایز اصلی رندرر
    const originalSize = gl.getSize(new THREE.Vector2());
    const originalPixelRatio = gl.getPixelRatio();

    // 📌 اینجا رزولوشن رو به FullHD یا بیشتر تغییر می‌دیم
    gl.setSize(3840, 2160, false);   // میتونی بگی 3840x2160 برای 4K
    gl.setPixelRatio(1);            // برای جلوگیری از اسکیل شدن روی مانیتور

    // رندر نهایی
    gl.render(scene, orthoCamera);

    // گرفتن عکس
    const screenshot = gl.domElement.toDataURL("image/png");

    if (onCapture) {
      onCapture(screenshot);
    }

    // 📌 برگردوندن سایز اصلی
    gl.setSize(originalSize.x, originalSize.y, false);
    gl.setPixelRatio(originalPixelRatio);
    gl.render(scene, orthoCamera);

  }, [gl, scene, size, onCapture]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.captureScreenshot = captureScreenshot;
    }
    return () => {
      delete window.captureScreenshot;
    };
  }, [captureScreenshot]);

  return captureScreenshot;
};
