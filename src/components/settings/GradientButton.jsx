import React from "react";
import { IoReload } from "react-icons/io5";

export default function GradientButton({ text, isLoading, ...props }) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className="w-full mt-10 lg:mt-20 lg:text-2xl flex justify-center
                 bg-gradient-to-r from-[#008AFF] to-[#00FFAB] 
                 hover:from-[#00FFAB] hover:to-[#008AFF]
                 disabled:opacity-50 text-[#10172A] font-semibold 
                 py-3 lg:py-6 rounded-xl lg:rounded-2xl 
                 transition-transform transform hover:scale-105 active:scale-95
                 shadow-[0_0_20px_#00FFAA8D]"
    >
      {isLoading ? (
        <>
          <IoReload className="animate-spin w-6 h-6 text-blue-500" />
          <span className="px-1">در حال پردازش</span>
        </>
      ) : (
        text
      )}
    </button>
  );
}
