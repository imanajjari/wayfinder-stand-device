import React from 'react';
import { MdCampaign } from 'react-icons/md';

export default function AdBanner({
  content,
  className = '',
  style = {},
  onClick = null
}) {
  const isEmpty = !content;

  return (
    <div
      onClick={() => onClick?.()}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shadow-lg overflow-hidden my-4 p-2 cursor-pointer transition hover:scale-[1.01] ${className}`}
      style={style}
    >
      {isEmpty ? (
        <div className="flex items-center gap-3 rtl:space-x-reverse animate-marquee whitespace-nowrap">
          <span className="text-lg font-bold text-gray-300">
            📢 محل درج تبلیغ شما
          </span>
        </div>
      ) : typeof content === 'string' ? (
        <div className="flex items-center justify-center gap-3 rtl:space-x-reverse animate-marquee whitespace-nowrap text-center">

          <span className="text-base font-medium tracking-wide ">{content}</span>
        </div>
      ) : (
        // اگر content عکس یا jsx هست
        <div className="w-full text-center">{content}</div>
      )}
    </div>
  );
}
