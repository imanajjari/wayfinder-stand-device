// components/cards/DestinationCard.jsx
import { usePath } from "../../contexts/PathContext";
import { getFileUrl } from "../../services/fileService";

export default function DestinationCard({ shop, onClick, myStand }) {
    const { currentFloorNumber   } = usePath();
  return (
    <div
      className={`flex items-start gap-4  p-4 rounded-xl border ${myStand.floorNum===shop.floorNum?'border-yellow-300 bg-yellow-800':'border-gray-600 bg-neutral-800'}  cursor-pointer`}
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
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{shop.shortName}</h3>
        <p className="text-sm text-gray-300">{shop.description}</p>
        <p className="text-sm text-gray-400">
          طبقه {shop.floorNum==0 ? 'همکف': shop.floorNum} - ساختمان {shop.buildingNumber} {myStand.floorNum===shop.floorNum && "در این طبقه قرار دارد"}
        </p>
      </div>
    </div>
  );
}
