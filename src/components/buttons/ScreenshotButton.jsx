// components/buttons/ScreenshotButton.jsx
import { useCallback, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ScreenshotButton({ onCapture, style }) {
  const { gl, scene, size } = useThree();

  const captureScreenshot = useCallback(() => {
    // پیدا کردن مدل ریشه (root model)
    const modelRoot = scene.getObjectByName("modelRoot") || scene.children.find(child => child.isGroup);

    if (!modelRoot) return;

    // ایجاد دوربین Orthographic
    const box = new THREE.Box3().setFromObject(modelRoot);
    const center = new THREE.Vector3();
    const sizeVec = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(sizeVec);

    const aspect = size.width / size.height;
    const maxSize = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 1.2; // پدینگ
    const orthoCamera = new THREE.OrthographicCamera(
      -maxSize * aspect,
      maxSize * aspect,
      maxSize,
      -maxSize,
      0.1,
      1000
    );

    // تنظیم موقعیت دوربین برای دید عمود (مثلاً از بالا)
    orthoCamera.position.set(center.x, center.y, center.z + maxSize);
    orthoCamera.lookAt(center);
    orthoCamera.updateProjectionMatrix();

    // رندر با دوربین جدید
    gl.render(scene, orthoCamera);

    // گرفتن تصویر
    const screenshot = gl.domElement.toDataURL("image/png");

    // فراخوانی callback برای ذخیره یا استفاده از تصویر
    if (onCapture) {
      onCapture(screenshot);
    }

    // برگرداندن رندرر به حالت اولیه
    gl.render(scene, gl.camera);
  }, [gl, scene, size, onCapture]);

  // دسترسی به captureScreenshot از طریق دکمه
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.captureScreenshot = captureScreenshot;
    }
    return () => {
      delete window.captureScreenshot;
    };
  }, [captureScreenshot]);

  return (
    <button
      style={{
        padding: "10px 20px",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        ...style, // استایل‌های اضافی که از props دریافت می‌شود
      }}
      onClick={captureScreenshot}
    >
      گرفتن اسکرین‌شات
    </button>
  );
}