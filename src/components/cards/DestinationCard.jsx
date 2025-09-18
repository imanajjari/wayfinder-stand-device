// components/cards/DestinationCard.jsx
import { usePath } from "../../contexts/PathContext";
import { useShopDetails } from "../../contexts/ShopDetailsContext";
import { getFileUrl } from "../../services/fileService";
import { IoHelpCircleOutline } from 'react-icons/io5';

export default function DestinationCard({ shop, onClick, myStand }) {
    const { currentFloorNumber } = usePath();
    const { showShopDetails } = useShopDetails();
  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl border ${myStand.floorNum===shop.floorNum?'border-yellow-300 bg-yellow-800':'border-gray-600 bg-neutral-800'} cursor-pointer`}
      onClick={onClick}
    >
      {shop.icon ? (
        <img
          src={getFileUrl(shop.icon)}
          alt={shop.name}
          className="w-20 h-20 rounded-xl bg-neutral-600 object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-neutral-600 flex items-center justify-center text-white text-lg font-bold">
          {shop.shortName?.[0] || "?"}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{shop.shortName}</h3>
        <p className="text-sm text-gray-300">{shop.description}</p>
        <p className="text-sm text-gray-400">
          طبقه {shop.floorNum==0 ? 'همکف': shop.floorNum} - ساختمان {shop.buildingNumber} {myStand.floorNum===shop.floorNum && "در این طبقه قرار دارد"}
        </p>
      </div>
      
      {/* Question Mark Icon for Details */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // جلوگیری از فعال شدن onClick کارت
          showShopDetails(shop);
        }}
        className={`absolute top-3 left-3 w-8 h-8 border ${myStand.floorNum===shop.floorNum?'border-yellow-300 bg-yellow-800':'border-gray-600 bg-neutral-800'} rounded-full flex items-center justify-center transition-colors group`}
        title="مشاهده جزئیات فروشگاه"
      >
        <IoHelpCircleOutline className={`w-5 h-5 ${myStand.floorNum===shop.floorNum?'text-yellow-300 ':'text-gray-600 '} group-hover:scale-110 transition-transform`} />
      </button>
    </div>
  );
}
