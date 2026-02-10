// src/components/Models/GLBModel.jsx
import { useRef, useEffect, forwardRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { isGzipCompressed, decompressGzip, createBlobURL } from "../../utils/decompressor";

const GLBModel = forwardRef(function GLBModel(
  { url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onLoaded },
  ref
) {
  const modelRef = ref || useRef();
  const [processedUrl, setProcessedUrl] = useState(null);
  const hasCalledOnLoaded = useRef(false);


  useEffect(() => {
    let mounted = true;
    let blobUrl = null;

    const processUrl = async () => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        if (!mounted) return;

        // چک کردن فشردگی
        if (isGzipCompressed(arrayBuffer)) {
          console.log('🔓 فایل فشرده است، در حال باز کردن...');
          const decompressed = decompressGzip(arrayBuffer);
          blobUrl = createBlobURL(decompressed);
        } else {
          console.log('✅ فایل فشرده نیست');
          blobUrl = createBlobURL(arrayBuffer);
        }

        if (mounted) {
          setProcessedUrl(blobUrl);
        }
      } catch (error) {
        console.error('❌ خطا در پردازش فایل:', error);
      }
    };

    processUrl();

    return () => {
      mounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [url]);

  const gltf = processedUrl ? useLoader(GLTFLoader, processedUrl) : null;

  useEffect(() => {
    if (!gltf || !modelRef.current || hasCalledOnLoaded.current) return;

    modelRef.current.rotation.x = Math.PI / 2;

    if (onLoaded) {
      hasCalledOnLoaded.current = true;
      onLoaded(gltf.scene);
    }
  }, [gltf, onLoaded]);


  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.rotation.x = Math.PI / 2;

    onLoaded?.(gltf.scene); 
  }, [gltf, onLoaded]);



  if (!gltf) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" wireframe opacity={0.5} transparent />
      </mesh>
    );
  }

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      position={position}
      rotation={rotation}
    />
  );
});

export default GLBModel;
