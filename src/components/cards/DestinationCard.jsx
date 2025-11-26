// components/cards/DestinationCard.jsx
import React, { useCallback } from "react";
import { usePath } from "../../contexts/PathContext";
import { useShopDetails } from "../../contexts/ShopDetailsContext";
import { getFileUrl } from "../../services/fileService";
import { IoHelpCircleOutline } from 'react-icons/io5';

function DestinationCard({ shop, onClick, myStand }) {
  const { showShopDetails } = useShopDetails();

  const handleDetailsClick = useCallback((e) => {
    e.stopPropagation(); // جلوگیری از فعال شدن onClick کارت
    showShopDetails(shop);
  }, [shop, showShopDetails]);

  const isOnSameFloor = myStand.floorNum === shop.floorNum;

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl border ${
        isOnSameFloor 
          ? 'border-[#00FFAB] bg-[#2e463e]' 
          : 'border-gray-600 bg-neutral-800'
      } cursor-pointer`}
      onClick={onClick}
    >
      {shop.icon ? (
        <img
          src={getFileUrl(shop.icon)}
          alt={shop.name}
          className="w-20 h-20 rounded-xl bg-neutral-600 object-cover"
          loading="lazy" // Lazy load images for better performance
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center text-white text-lg font-bold">
          {shop.shortName?.[0] || "?"}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{shop.shortName}</h3>
        <p className="text-sm text-gray-300">{shop.desc}</p>
        <p className="text-sm text-gray-400">
          طبقه {shop.floorNum === 0 ? 'همکف' : shop.floorNum} 
          {shop.buildingNumber && ` - ساختمان ${shop.buildingNumber}`}
          {isOnSameFloor && " در این طبقه قرار دارد"}
        </p>
      </div>
      
      {/* Question Mark Icon for Details */}
      <button
        onClick={handleDetailsClick}
        className="absolute top-3 left-3 w-8 h-8 bg-[#00FFAB] hover:bg-[#59ffc8] rounded-full flex items-center justify-center transition-colors group"
        title="مشاهده جزئیات فروشگاه"
        aria-label="مشاهده جزئیات فروشگاه"
      >
        <IoHelpCircleOutline className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(DestinationCard, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.shop.id === nextProps.shop.id &&
    prevProps.myStand.floorNum === nextProps.myStand.floorNum &&
    prevProps.onClick === nextProps.onClick
  );
});
