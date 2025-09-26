import React from "react";

export default function BackgroundImage() {
  return (
    <img
      src="/images/settings/bg-settings.jpg"
      alt="background setting"
      className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-full 
                 sm:h-5/6 lg:h-7/8 xl:h-full sm:w-3/4 xl:w-3/5 
                 object-cover sm:rounded-r-[150px]"
      style={{ objectPosition: "60% center" }}
    />
  );
}
