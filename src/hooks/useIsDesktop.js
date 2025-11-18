import { useEffect, useState } from "react";

/**
 * Hook: useIsDesktop
 * بررسی می‌کند که آیا عرض صفحه بزرگ‌تر از breakpoint داده‌شده است یا نه
 * @param {number} breakpoint - مقدار پیکسل مورد نظر (پیش‌فرض 768 برای md)
 * @returns {boolean} true اگر دسکتاپ، false اگر موبایل
 */
export function useIsDesktop(breakpoint = 640) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isDesktop;
}
