import React, { useEffect, useState } from 'react';
import { IoClose, IoLocation, IoCall, IoTime, IoInformation, IoNavigate } from 'react-icons/io5';
import { getFileUrl } from '../../services/fileService';
import useTheme from '../../hooks/useTheme';
import { usePath } from '../../contexts/PathContext';
import { useSearchResults } from '../../contexts/SearchResultsContext';
import { findFloorOfDestination } from '../../lib/floorUtils';

export default function ShopDetailsModal({ isOpen, onClose, shop }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { colors } = useTheme();
  const { updateDestination } = usePath();
  const { hideResults } = useSearchResults();

  const handleNavigateToShop = () => {
    if (shop && shop.entrance) {
      updateDestination({
        x: shop.entrance.x,
        y: shop.entrance.y,
        z: 1,
        floorNumber: shop.floorNum,
        floorId: findFloorOfDestination(shop).floorId,
      });
      
      // بستن هر دو مودال بعد از شروع مسیریابی
      hideResults(); // بستن مودال لیست فروشگاه‌ها
      onClose(); // بستن مودال جزئیات فروشگاه
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول صفحه
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      document.body.style.overflow = 'unset';
      setTimeout(() => setShouldRender(false), 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender || !shop) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center pt-8 pb-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-4rem)] overflow-hidden transition-all duration-300 ease-out mx-4 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
          {shop.icon && (
            <img
              src={getFileUrl(shop.icon)}
              alt={shop.name}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>

          {/* Navigation Button */}
          <button
            onClick={handleNavigateToShop}
            className="absolute top-4 right-16 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-lg"
            title="شروع مسیریابی به این فروشگاه"
          >
            <IoNavigate className="w-5 h-5" />
            <span className="text-sm font-medium">نمایش مسیر</span>
          </button>

          {/* Shop Logo/Icon */}
          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            {shop.icon ? (
              <img
                src={getFileUrl(shop.icon)}
                alt={shop.name}
                className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm object-cover border-2 border-white/20"
              />
            ) : (
                             <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/20">
                 {shop.shortName?.[0] || shop.fullName?.[0] || "?"}
               </div>
            )}
            
            <div className="pb-2">
              <h1 className="text-2xl font-bold mb-1">{shop.fullName || shop.shortName}</h1>
              <p className="text-white/80 text-sm">
                طبقه {shop.floorNum === 0 ? 'همکف' : shop.floorNum}
                {shop.buildingNumber && ` - ساختمان ${shop.buildingNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-20rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shop Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <IoInformation className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">اطلاعات فروشگاه</h2>
              </div>

              {shop.desc && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-gray-300">توضیحات</h3>
                  <p className="text-gray-200 leading-relaxed">{shop.desc}</p>
                </div>
              )}

              {shop.categories && shop.categories.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-gray-300">دسته‌بندی</h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.categories.map((category, index) => (
                      <span key={index} className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {shop.tags && shop.tags.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-gray-300">برچسب‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.tags.map((tag, index) => (
                      <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <IoCall className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold">اطلاعات تماس</h2>
              </div>

              {shop.phone && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <IoCall className="w-4 h-4 text-green-400" />
                    <div>
                      <h3 className="font-medium text-gray-300">تلفن</h3>
                      <p className="text-gray-200">{shop.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {shop.workingHours && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <IoTime className="w-4 h-4 text-orange-400" />
                    <div>
                      <h3 className="font-medium text-gray-300">ساعات کاری</h3>
                      <p className="text-gray-200">{shop.workingHours}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Info */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <IoLocation className="w-4 h-4 text-red-400" />
                  <div>
                    <h3 className="font-medium text-gray-300">موقعیت</h3>
                    <p className="text-gray-200">
                      طبقه {shop.floorNum === 0 ? 'همکف' : shop.floorNum}
                      {shop.buildingNumber && `، ساختمان ${shop.buildingNumber}`}
                    </p>
                    {shop.entrance && (
                      <p className="text-sm text-gray-400 mt-1">
                        مختصات: ({shop.entrance.x}, {shop.entrance.y})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              {shop.gallery && shop.gallery.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-gray-300">گالری تصاویر</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shop.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={getFileUrl(image)}
                        alt={`${shop.name} - تصویر ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information - Show only if we have basic shop info */}
          {shop.id && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h2 className="text-xl font-semibold mb-4">اطلاعات تکمیلی</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Shop ID */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-gray-300">شناسه فروشگاه</h3>
                  <p className="text-gray-200 text-sm">#{shop.id}</p>
                </div>

                {/* Full Name if different from short name */}
                {shop.fullName && shop.fullName !== shop.shortName && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-gray-300">نام کامل</h3>
                    <p className="text-gray-200 text-sm">{shop.fullName}</p>
                  </div>
                )}

                {/* Website if exists */}
                {shop.website && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-gray-300">وب‌سایت</h3>
                    <a 
                      href={shop.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      مشاهده وب‌سایت
                    </a>
                  </div>
                )}

                {/* Email if exists */}
                {shop.email && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-gray-300">ایمیل</h3>
                    <a 
                      href={`mailto:${shop.email}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      {shop.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Special offers if exists */}
              {shop.specialOffers && (
                <div className="mt-4">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 text-center border border-yellow-600/30">
                    <h3 className="font-medium mb-2 text-yellow-300">پیشنهاد ویژه</h3>
                    <p className="text-yellow-200 text-sm">{shop.specialOffers}</p>
                  </div>
                </div>
              )}
            </div>
                      )}
        </div>

        {/* Bottom Navigation Button */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent p-6 pt-8">
          <button
            onClick={handleNavigateToShop}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <IoNavigate className="w-6 h-6" />
            <span className="text-lg font-semibold">شروع مسیریابی</span>
          </button>
        </div>
      </div>
    </div>
  );
} 