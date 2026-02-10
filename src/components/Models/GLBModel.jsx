// src/components/Models/GLBModel.jsx
import { useRef, useEffect, forwardRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { loadGLBWithCache } from "../../utils/decompressor";

const GLBModel = forwardRef(function GLBModel(
  { url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], onLoaded },
  ref
) {
  const modelRef = ref || useRef();
  const [gltf, setGltf] = useState(null);
  const [loadInfo, setLoadInfo] = useState(null);
  const hasCalledOnLoaded = useRef(false);

  useEffect(() => {
    let mounted = true;
    let blobUrl = null;

    const loadModel = async () => {
      try {
        const startTime = performance.now();

        // بارگذاری با Cache
        const result = await loadGLBWithCache(url);
        blobUrl = result.blobUrl;

        const loadTime = performance.now() - startTime;

        if (mounted) {
          setLoadInfo({
            fromCache: result.fromCache,
            size: result.size,
            compressed: result.compressed,
            loadTime: loadTime.toFixed(2),
          });

          console.log(
            result.fromCache
              ? `⚡ مدل از Cache بارگذاری شد در ${loadTime.toFixed(2)}ms`
              : `🌐 مدل از شبکه دانلود شد در ${loadTime.toFixed(2)}ms - حجم: ${(result.size / 1024 / 1024).toFixed(2)} MB`
          );
          if (result.compressed) console.log('🗜️ فایل فشرده بود و باز شد');
        }

        // fetch blob و parse دستی
        const response = await fetch(blobUrl);
        if (!response.ok) throw new Error(`Blob fetch failed: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();

        const loader = new GLTFLoader();
        // اگر draco یا ktx2 یا meshopt استفاده می‌کنی، اینجا ست کن:
        // loader.setDRACOLoader(dracoLoader);
        // loader.setKTX2Loader(ktx2Loader);
        // loader.setMeshoptDecoder(meshoptDecoder);

        loader.parse(
          arrayBuffer,
          '', // path خالی چون blob محلی است
          (parsedGltf) => {
            if (mounted) {
              setGltf(parsedGltf);

              if (onLoaded && !hasCalledOnLoaded.current) {
                hasCalledOnLoaded.current = true;
                const loadData = {
                  scene: parsedGltf.scene,
                  ...loadInfo, // loadInfo الان ست شده
                };
                onLoaded(loadData);
              }
            }
          },
          (error) => {
            console.error("❌ خطا در parse GLTF:", error);
          }
        );
      } catch (error) {
        console.error('❌ خطا در بارگذاری مدل:', error);

        if (mounted) {
          console.log('🔄 fallback: استفاده مستقیم از url اصلی');
          // fallback ساده (اگر خواستی می‌تونی حذف کنی)
          const loader = new GLTFLoader();
          loader.load(
            url,
            (parsedGltf) => {
              if (mounted) {
                setGltf(parsedGltf);
                if (onLoaded && !hasCalledOnLoaded.current) {
                  hasCalledOnLoaded.current = true;
                  onLoaded({ scene: parsedGltf.scene, ...loadInfo });
                }
              }
            },
            undefined,
            (err) => console.error("Fallback هم شکست خورد:", err)
          );
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
  }, [url, onLoaded]); // loadInfo رو از deps برداشتم چون داخل callback استفاده می‌شه

  useEffect(() => {
    if (!gltf || !modelRef.current) return;

    // اعمال rotation روی گروه اصلی مدل
    modelRef.current.rotation.x = Math.PI / 2;
  }, [gltf]);

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
      rotation={rotation} // اگر rotation از بیرون می‌خوای، این رو نگه دار
    />
  );
});

export default GLBModel;