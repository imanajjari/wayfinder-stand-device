// src/components/effects/PointerGlow.jsx
import React, { useEffect, useRef } from "react";

/**
 * PointerGlow: یک درخشش نرم که موس را دنبال می‌کند.
 *
 * Props:
 * - color: رنگ درخشش (rgba یا hsl). پیش‌فرض: "rgba(239, 64, 86, 0.35)" (قرمز-صورتی ملایم)
 * - size: قطر درخشش به پیکسل. پیش‌فرض: 280
 * - softness: میزان بلور (px). پیش‌فرض: 60
 * - follow: ضریب دنبال‌کردن (0..1)؛ هرچه بزرگ‌تر، سریع‌تر. پیش‌فرض: 0.25
 * - blendMode: حالت blend (e.g., "screen", "lighten", "normal"). پیش‌فرض: "screen"
 * - zIndex: پیش‌فرض: 50
 * - enabled: فعال/غیرفعال. پیش‌فرض: true
 * - className: کلاس اضافی اختیاری
 */
export default function PointerGlow({
  color = "rgba(239, 64, 86, 0.35)",   // مشابه accent دیجی‌کالا
  size = 280,
  softness = 60,
  follow = 0.25,
  blendMode = "screen",
  zIndex = 50,
  enabled = true,
  className = "",
}) {
  const el = useRef(null);
  const pos = useRef({ x: 0, y: 0 });       // موقعیت نمایشی (smoothed)
  const target = useRef({ x: 0, y: 0 });    // موقعیت هدف (موس)
  const rafId = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // مقداردهی اولیه وسط صفحه
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    pos.current.x = initX;
    pos.current.y = initY;
    target.current.x = initX;
    target.current.y = initY;
    if (el.current) {
      el.current.style.transform = `translate(${initX - size / 2}px, ${initY - size / 2}px)`;
    }

    const onMove = (e) => {
      const isTouch = e.touches && e.touches[0];
      const x = isTouch ? isTouch.clientX : e.clientX;
      const y = isTouch ? isTouch.clientY : e.clientY;
      target.current.x = x;
      target.current.y = y;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });

    const loop = () => {
      // lerp
      pos.current.x += (target.current.x - pos.current.x) * follow;
      pos.current.y += (target.current.y - pos.current.y) * follow;
      if (el.current) {
        el.current.style.transform = `translate(${pos.current.x - size / 2}px, ${pos.current.y - size / 2}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, size, follow]);

  if (!enabled) return null;

  const style = {
    position: "fixed",
    left: 0,
    top: 0,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: "none",
    zIndex,
    mixBlendMode: blendMode,
    filter: `blur(${softness}px)`,
    borderRadius: "9999px",
    background: color, // ساده، سریع. می‌تونی radial-gradient هم بدهی
    // برای موبایل که موس نیست، کمی مات کنیم:
    opacity: 1,
    transition: "opacity 200ms ease",
  };

  return <div ref={el} style={style} className={className} aria-hidden="true" />;
}
