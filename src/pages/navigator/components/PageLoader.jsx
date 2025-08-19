// src/pages/navigator/components/PageLoader.jsx
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function PageLoader() {
  const { progress, active, item } = useProgress();
  const [visible, setVisible] = useState(true);

  // وقتی لود تموم شد، با یه تاخیر کوتاه فید-اوت شه تا پرش نداشته باشیم
  useEffect(() => {
    let t;
    if (!active && progress === 100) {
      t = setTimeout(() => setVisible(false), 200); // 200ms برای فید
    } else {
      setVisible(true);
    }
    return () => clearTimeout(t);
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        transition: "opacity 200ms ease",
        pointerEvents: "none", // تا کلیک‌ها گیر نکنن (اگه می‌خوای بلاک کنه، بردار)
      }}
    >
      <div
        style={{
          minWidth: 220,
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          pointerEvents: "auto", // روی خود پنل کلیک‌پذیر باشه اگه لازم شد
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>در حال بارگذاری نقشه…</div>

        <div style={{
          height: 8, width: "100%",
          background: "rgba(255,255,255,0.2)",
          borderRadius: 999, overflow: "hidden", marginBottom: 6
        }}>
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress)}%`,
              background: "#fff",
              transition: "width 250ms ease",
            }}
          />
        </div>

        <div style={{ fontSize: 12, opacity: 0.9 }}>
          {Math.round(progress)}%
          {active && item ? ` • ${item.split("/").pop()}` : ""}
        </div>
      </div>
    </div>
  );
}
