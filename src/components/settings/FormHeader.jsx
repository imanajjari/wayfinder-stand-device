import React from "react";

export default function FormHeader() {
  return (
    <div
      className="rounded-3xl flex items-center gap-3 p-3 sm:p-6 lg:p-10 xl:p-6 
                 border border-[#324154] sm:rounded-[44px] mb-2 sm:mb-4 
                 bg-[#10172A70]/40 backdrop-blur-lg shadow-lg"
    >
      <img
        src="/images/settings/wayfinding-logo-green.png"
        alt="لوگو"
        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 lg:mr-4"
      />
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl lg:text-4xl xl:text-2xl text-white mb-1 lg:pb-3">
          تنظیمات استند
        </h1>
        <p className="text-white text-base font-thin">
          اطلاعات خود را وارد کنید
        </p>
      </div>
    </div>
  );
}
