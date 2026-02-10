// src/components/Models/GLBModel.jsx
import { useRef, useEffect, forwardRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { loadGLBWithCache } from "../../utils/decompressor";

const GLBModel = forwardRef(function GLBModel(
  { url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onLoaded },
  ref
) {
  const modelRef = ref || useRef();
  const [processedUrl, setProcessedUrl] = useState(null);
  const [loadInfo, setLoadInfo] = useState(null);
  const hasCalledOnLoaded = useRef(false);

  useEffect(() => {
    let mounted = true;
    let blobUrl = null;

    const loadModel = async () => {
      try {
        const startTime = performance.now();

        // 🚀 بارگذاری با Cache
        const result = await loadGLBWithCache(url);
        blobUrl = result.blobUrl;

        const loadTime = performance.now() - startTime;

        if (mounted) {
          setProcessedUrl(blobUrl);
          setLoadInfo({
            fromCache: result.fromCache,
            size: result.size,
            compressed: result.compressed,
            loadTime: loadTime.toFixed(2),
          });

          // لاگ اطلاعات بارگذاری
          if (result.fromCache) {
            console.log(`⚡ مدل از Cache بارگذاری شد در ${loadTime.toFixed(2)}ms`);
          } else {
            console.log(`🌐 مدل از شبکه دانلود شد در ${loadTime.toFixed(2)}ms`);
            console.log(`📦 حجم: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
            if (result.compressed) {
              console.log('🗜️ فایل فشرده بود و باز شد');
            }
          }
        }
      } catch (error) {
        console.error('❌ خطا در بارگذاری مدل:', error);
        
        // در صورت خطا، سعی کن مستقیم بارگذاری کنی (fallback)
        if (mounted) {
          console.log('🔄 تلاش برای بارگذاری مستقیم...');
          setProcessedUrl(url);
        }
      }
    };

    loadModel();

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
      
      // ارسال اطلاعات بارگذاری به callback
      const loadData = {
        scene: gltf.scene,
        ...loadInfo,
      };
      
      onLoaded(loadData);
    }
  }, [gltf, onLoaded, loadInfo]);
  
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