import React from "react";

export default function BackgroundLightsScene() {
  return (
    <>
      <div className="absolute right-[-250px] bottom-0 sm:w-[350px] sm:h-[250px] bg-[#008AFF] blur-[200px]" />
      <div className="absolute left-[-350px] bottom-0 sm:w-[350px] sm:h-[250px] bg-[#00FFAB] blur-[200px]" />
      <div className="absolute left-1/2 top-[-400px] w-[700px] h-[250px] bg-[#b5beca] translate-x-[-50%] blur-[200px]" />
    </>
  );
}
