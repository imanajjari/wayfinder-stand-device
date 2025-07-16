import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useFloors } from '../../hooks/useFloors';

export default function FloorSelectorColumn({ floors = [], onSelect, activeFloor }) {
  const { floors: savedFloors, loading } = useFloors();

  // استفاده از floors پاس شده یا floors از localStorage
  const displayFloors = floors.length > 0 ? floors : savedFloors;

  // console.log("FloorSelectorColumn: floors prop:", floors);
  // console.log("FloorSelectorColumn: savedFloors:", savedFloors);
  // console.log("FloorSelectorColumn: displayFloors:", displayFloors);
  // console.log("FloorSelectorColumn: activeFloor:", activeFloor);

  if (loading) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 flex flex-col items-center z-50">
        <div className="text-white text-sm">در حال بارگذاری...</div>
      </div>
    );
  }

  // اگر هیچ floors موجود نباشد، کامپوننت را نمایش نده
  if (displayFloors.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 flex flex-col items-center z-50">
      <FaArrowUp className="text-gray-300 mb-2" />

      {displayFloors.map((floor, index) => {
        // اگر floor یک object باشد، از name استفاده کن، در غیر این صورت خود floor رو نمایش بده
        const floorName = typeof floor === 'object' ? floor.name : floor;
        
        // تشخیص اینکه آیا این floor فعال است یا نه
        const isActive = 
          activeFloor === floor ||
          (typeof activeFloor === 'object' && typeof floor === 'object' && activeFloor.name === floor.name) ||
          (typeof activeFloor === 'object' && typeof floor === 'string' && activeFloor.name === floor) ||
          (typeof activeFloor === 'string' && typeof floor === 'object' && activeFloor === floor.name) ||
          (typeof activeFloor === 'string' && typeof floor === 'string' && activeFloor === floor);
        

        
        return (
          <button
            key={index}
            onClick={() => onSelect?.(floor)}
            className={`font-semibold my-1 transition-all duration-200 ${
              isActive
                ? 'text-yellow-300 text-xl scale-110'
                : 'text-white hover:text-blue-600'
            }`}
          >
            {floorName}
          </button>
        );
      })}

      <FaArrowDown className="text-gray-300 mt-2" />
    </div>
  );
}
