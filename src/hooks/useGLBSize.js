import { useEffect, useMemo, useState } from "react";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * @param {string} url - path to glb file
 * @returns {{width:number,height:number,depth:number}|null}
 */
export function useGLBSize(url) {
  const [sceneObj, setSceneObj] = useState(null);

  // load model
  useEffect(() => {
    if (!url) return;

    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        setSceneObj(gltf.scene);
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );
  }, [url]);

  // calculate dimensions (memoized)
  const dimensions = useMemo(() => {
    if (!sceneObj) return null;

    const box = new Box3().setFromObject(sceneObj);
    const size = new Vector3();
    box.getSize(size);

    return {
      width: Number(size.x.toFixed(2)),
      height:Number(size.z.toFixed(2)),
      depth:  Number(size.y.toFixed(2)) ,
    };
  }, [sceneObj]);

  return dimensions;
}
