import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";


export default function FitCameraToObject({ objectRef, controlsRef, padding = 1.2, deps = [] }) {
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
  }, [objectRef, controlsRef, size.width, size.height, ...deps]);

  return null;
}