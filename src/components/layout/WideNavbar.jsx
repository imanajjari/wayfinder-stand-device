import React, { useEffect, useState } from 'react';
import { getMyStand } from '../../storage/floorStorage';
import { getCompanyData } from '../../storage/companyStorage';
import { getFileUrl } from '../../services/fileService';

export default function WideNavbar() {
  const [time, setTime] = useState(new Date());
  const [myPosition, setMyPosition] = useState("");
  const [company, setCompany] = useState(null);
  
  useEffect(() => {
    // ساعت
    const interval = setInterval(() => setTime(new Date()), 1000);
  
    // دریافت استند من
    const myStand = getMyStand();
    if (myStand?.info) {
      setMyPosition(myStand.info);
    }
  
    // دریافت اطلاعات کمپانی
    const companyData = getCompanyData();
    if (companyData) {
      setCompany(companyData);
    }
  
    // پاکسازی تایمر
    return () => clearInterval(interval);
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
        {company?.logoBase64 ? (
              <img
                src={company.logoBase64}
                alt="company logo"
                className="w-24 md:w-40 text-gray-700 flex items-center justify-center text-2xl font-bold shadow-md mb-2"
              />
            ) : company?.icon ? (
              <img
                src={getFileUrl(company.icon)}
                alt="company logo"
                className="w-24 md:w-40 text-gray-700 flex items-center justify-center text-2xl font-bold shadow-md mb-2"
              />
            ) : null}

          <div className="text-sm text-gray-200">
          {company?.info || 'قدرت، دقت، اطمینان در دستان شما'}
          </div>
          <div className="text-lg font-extrabold text-white mt-1">
          {company?.fullName || 'شرکت فنی مهندسی شتاب‌ساز'}
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
