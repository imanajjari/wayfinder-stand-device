// src/components/scene/HoldCoordsOverlay.jsx
export default function HoldCoordsOverlay({ info }) {
  if (!info) return null;

  const fmt = (v) => (typeof v === "number" && Number.isFinite(v) ? v.toFixed(2) : "—");

  const boxStyle = {
    position: "fixed",
    left: info.screenX ?? 0,
    top: info.screenY ?? 0,
    transform: "translate(-50%, -120%)",
    background: "rgba(0,0,0,0.75)",
    color: "#00ff99",
    padding: "10px 12px",
    borderRadius: 10,
    fontFamily: "monospace",
    fontSize: 12,
    pointerEvents: "none",
    zIndex: 9999,
    whiteSpace: "nowrap",
    border: "1px solid rgba(0,255,153,0.35)",
  };

  return (
    <div style={boxStyle}>
      <div>Object: {info.objectName ?? "mesh"}</div>

      <div>Map XY: x={fmt(info.mapX)} , y={fmt(info.mapY)}</div>

      {/* اگر world رو هم ارسال کردی نمایش می‌ده، اگر نه مشکلی نیست */}
      <div>
        World: x={fmt(info.worldX)} y={fmt(info.worldY)} z={fmt(info.worldZ)}
      </div>

      <div>
        Local: x={fmt(info.localX)} y={fmt(info.localY)} z={fmt(info.localZ)}
      </div>
    </div>
  );
}
