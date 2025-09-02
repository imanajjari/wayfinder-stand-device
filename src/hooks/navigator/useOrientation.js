// src/pages/navigator/hooks/useOrientation.js
import { useEffect, useState } from "react";

export default function useOrientation(baseOffset = 10) {
  const [isPortrait, setIsPortrait] = useState(true);
  const [verticalOffset, setVerticalOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      setVerticalOffset(portrait ? 0 : baseOffset);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [baseOffset]);

  return { isPortrait, verticalOffset };
}
