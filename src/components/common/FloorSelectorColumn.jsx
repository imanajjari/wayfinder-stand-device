import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useFloors } from '../../hooks/useFloors';

export default function FloorSelectorColumn({ floors = [], onSelect, activeFloor }) {
  const { floors: savedFloors, loading } = useFloors();

  // استفاده از floors پاس شده یا floors از localStorage
  const displayFloors = floors.length > 0 ? floors : savedFloors;

  if (loading || displayFloors.length === 0) {
    return null;
  }

  // مرتب سازی طبقات از بالا به پایین (بزرگترین عدد بالاتر)
  const sortedFloors = [...displayFloors].sort((a, b) => b.number - a.number);

  const currentIndex = sortedFloors.findIndex(
    f => f.number === activeFloor?.number
  );

  const goToNextFloor = () => {
    if (currentIndex > 0) {
      onSelect?.(sortedFloors[currentIndex - 1]);
    }
  };

  const goToPrevFloor = () => {
    if (currentIndex < sortedFloors.length - 1) {
      onSelect?.(sortedFloors[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 flex flex-col items-center ">
      <FaArrowUp
        className="text-gray-300 mb-2 cursor-pointer hover:text-white"
        onClick={goToNextFloor}
      />

      {sortedFloors.map((floor, index) => {
        const floorName = typeof floor === 'object' ? floor.name : floor;

        const isActive =
          activeFloor?.number === floor.number ||
          activeFloor?.name === floor.name;

        return (
          <button
            key={index}
            onClick={() => {console.log("floor select:",floor) ;onSelect?.(floor)}}
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

      <FaArrowDown
        className="text-gray-300 mt-2 cursor-pointer hover:text-white"
        onClick={goToPrevFloor}
      />
    </div>
  );
}
