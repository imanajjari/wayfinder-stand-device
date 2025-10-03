// CaptureHook.jsx
import { forwardRef, useImperativeHandle } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const CaptureHook = forwardRef(({ objectRef, padding = 1.2 }, ref) => {
  const { gl, camera, scene } = useThree();

  useImperativeHandle(ref, () => ({
    capture: (filename = "scene.png") => {
      if (!objectRef?.current) {
        console.warn("⚠️ objectRef خالیه!");
        return;
      }

      // محاسبه باکس مدل
      const box = new THREE.Box3().setFromObject(objectRef.current);
      if (box.isEmpty()) {
        console.warn("⚠️ مدل هنوز لود نشده!");
        return;
      }

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      // انتخاب بزرگ‌ترین بعد
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera.fov * Math.PI) / 180;
      const aspect = gl.domElement.width / gl.domElement.height;
      const distance = (maxDim / (2 * Math.tan(fov / 2))) * padding;

      // ذخیره موقعیت قبلی
      const prevPos = camera.position.clone();

      // بذار دوربین روبه‌روی مدل (محور Z منفی)
      camera.position.set(center.x, center.y, center.z + distance);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      // رندر و خروجی
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL("image/png");

      // برگردوندن دوربین
      camera.position.copy(prevPos);
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      // دانلود
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = filename;
      link.click();

      console.log("✅ اسکرین‌شات گرفته شد!");
    },
  }));

  return null;
});

export default CaptureHook;