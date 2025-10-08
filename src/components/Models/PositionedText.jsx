import React from "react";
import { Html } from "@react-three/drei";


export default function PositionedText({ position, text, onClick = null, color = 'white', background = 'rgba(0,0,0,0.5)', opacity = 1 }) {

  return (
    <Html position={position} center zIndexRange={[0, 0]}>

      <div
        className="rounded-md text-[10px] px-1 py-0 sm:text-base lg:text-xl xl:text-sm  whitespace-nowrap transition-opacity duration-100 transform -translate-x-[-100px] xl:translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{
          background,
          color,
          opacity
        }}
        onClick={onClick}
      >
        {text}
      </div>

    </Html>
  );
}
