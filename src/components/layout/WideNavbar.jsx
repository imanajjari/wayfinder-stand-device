import React, { useEffect, useState } from 'react';
import { getMyStand } from '../../services/floorService';

export default function WideNavbar() {
  const [time, setTime] = useState(new Date());
  const [myPosition, setMyPosition] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const myStand = getMyStand();
    if (myStand?.info) {
      setMyPosition(myStand.info);
    }
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="hidden bg-black/40 backdrop-blur-md border border-gray-500 rounded-2xl text-white px-8 py-6 z-[999] shadow-xl tall:block">
      <div className="flex justify-between items-center w-full relative min-h-[160px]">
        
        {/* سمت چپ: موقعیت */}
        {myPosition && (
          <div className="hidden text-base md:text-lg text-gray-300 w-[220px] text-right md:block">
            <span className="font-bold text-white">موقعیت:</span> {myPosition}
          </div>
        )}

        {/* وسط: لوگو و اطلاعات (در مرکز واقعی) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <img  src="/images/shiva-logo.png" alt="logo" className="w-24 md:w-40 text-gray-700 flex items-center justify-center text-2xl font-bold shadow-md mb-2" />

          <div className="text-sm text-gray-200">
            قدرت، <span className="text-blue-300">دقت</span>، <span className="text-blue-300">اطمینان</span> در دستان شما
          </div>
          <div className="text-lg font-extrabold text-white mt-1">
            شرکت فنی مهندسی شتاب‌ساز
          </div>
        </div>

        {/* سمت راست: ساعت */}
        <div className="text-3xl font-mono text-blue-300 tracking-widest w-[220px] text-left tall:hidden">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
}
