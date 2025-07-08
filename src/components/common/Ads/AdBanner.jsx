import React from 'react';
import { MdCampaign } from 'react-icons/md';

export default function AdBanner({
  content,       // متن یا JSX یا عکس یا گیف
  className = '', // استایل بیرونی
  style = {},     // style inline
  onClick = null  // تابع کلیک اختیاری
}) {
  // اگر چیزی برای نمایش نیومده بود
  const isEmpty = !content;

  return (
    <div
      onClick={() => onClick?.()}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shadow-lg overflow-hidden my-4 cursor-pointer transition hover:scale-[1.01] ${className}`}
      style={style}
    >
      <div className="flex items-center gap-3 rtl:space-x-reverse animate-marquee whitespace-nowrap">
        {isEmpty ? (
          <span className="text-lg font-bold text-gray-300">
            📢 محل درج تبلیغ شما
          </span>
        ) : (
          typeof content === 'string' ? (
            <span className="text-base font-medium tracking-wide">{content}</span>
          ) : (
            <div className="flex items-center gap-2">{content}</div>
          )
        )}
      </div>
    </div>
  );
}
