// src/layouts/SettingsLayout.jsx
import React from "react";
import BackgroundImage from "../components/settings/BackgroundImage";
import BackgroundLights from "../components/settings/BackgroundLights";

export default function SettingsLayout({ children }) {
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <BackgroundImage />
      <BackgroundLights />

      <div className="relative z-10 flex items-center justify-center h-full w-full p-3">
        <div className="w-full sm:max-w-lg lg:max-w-3xl xl:max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
