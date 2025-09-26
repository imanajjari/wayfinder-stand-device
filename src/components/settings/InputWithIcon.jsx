import React, { forwardRef } from "react";

const InputWithIcon = forwardRef(
  ({ label, type = "text", placeholder, Icon, error, ...rest }, ref) => {
    return (
      <div>
        <label className="block text-white mb-2 lg:text-3xl lg:py-2 xl:text-xl xl:py-1">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute right-3 top-3 lg:text-4xl xl:text-lg text-gray-400" />
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full px-5 py-2.5 pr-10 lg:px-8 lg:py-5 lg:pr-16 
                       lg:text-2xl xl:pr-10 xl:py-2.5 xl:text-xl
                       bg-[#324154] placeholder-[#F9F5F1] text-white 
                       rounded-lg lg:rounded-2xl focus:ring-2 outline-none
                       ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
            {...rest}
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default InputWithIcon;
