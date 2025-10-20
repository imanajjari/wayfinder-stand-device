import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 *  - src: string (image url)
 *  - bgColor: string (hex, default "#000000") -> background color to trim
 *  - tolerance: number (0-255) -> how close to bgColor counts as background (default 16)
 *  - sampling: number -> sample step for scanning (1 = full scan, 2 = every 2px, etc) default 4 (faster)
 *  - alt, className: passthrough
 */
export default function AutoCropImage({
  src,
  bgColor = "#000000",
  tolerance = 16,
  sampling = 4,
  alt = "",
  className = "",
  maxWidth = 800,
}) {
  const [croppedSrc, setCroppedSrc] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // برای تصاویر سروری که اجازه بده
    img.src = src;

    const hexToRgb = (hex) => {
      const h = hex.replace("#", "");
      const bigint = parseInt(h.length === 3 ? h.split("").map(c=>c+c).join("") : h, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    img.onload = () => {
      if (!mountedRef.current) return;

      // اندازه canvas رو اندازه تصویر قرار می‌دیم
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // CORS یا خطا -> در این حالت کراپ نمی‌کنیم، فقط اصل رو نشان می‌دهیم
        console.warn("AutoCropImage: couldn't access image data (possible CORS). Using original src.");
        setCroppedSrc(src);
        return;
      }

      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      const bg = hexToRgb(bgColor);
      const tol = Math.max(0, Math.min(255, tolerance));

      // bounding box init
      let top = height, left = width, right = 0, bottom = 0;
      let foundAny = false;

      const sample = Math.max(1, Math.floor(sampling));

      // helper: check if pixel at (x,y) is background-ish
      const isBg = (x, y) => {
        const idx = (y * width + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
        if (a === 0) return true; // fully transparent -> treat as background
        return (
          Math.abs(r - bg.r) <= tol &&
          Math.abs(g - bg.g) <= tol &&
          Math.abs(b - bg.b) <= tol
        );
      };

      // scan: sample rows and cols
      for (let y = 0; y < height; y += sample) {
        for (let x = 0; x < width; x += sample) {
          if (!isBg(x, y)) {
            foundAny = true;
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
      }

      if (!foundAny) {
        // همه پس‌زمینه بودند — هیچ کراپی انجام نمی‌دهیم
        setCroppedSrc(src);
        return;
      }

      // افزایش بافر کوچک برای جلوگیری از بریدن خیلی نزدیک
      const pad = Math.ceil(Math.max(2, Math.min(width, height) * 0.01)); // 1% padding
      left = Math.max(0, left - pad);
      top = Math.max(0, top - pad);
      right = Math.min(width - 1, right + pad);
      bottom = Math.min(height - 1, bottom + pad);

      const cropW = right - left + 1;
      const cropH = bottom - top + 1;

      // draw cropped into new canvas
      const out = document.createElement("canvas");
      out.width = cropW;
      out.height = cropH;
      const outCtx = out.getContext("2d");
      outCtx.drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH);

      // تبدیل به dataURL
      const dataUrl = out.toDataURL("image/png");
      if (mountedRef.current) setCroppedSrc(dataUrl);
    };

    img.onerror = () => {
      // fallback
      setCroppedSrc(src);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, bgColor, tolerance, sampling]);

  // اگر هنوز کراپ نشده، تا لود کامل از تصویر اصلی استفاده کن
  const finalSrc = croppedSrc || src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={`${className}`}
      style={{ width: "100%", maxWidth: `${maxWidth}px`, height: "auto" }}
    />
  );
}
