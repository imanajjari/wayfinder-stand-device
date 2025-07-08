import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function FloorSelectorColumn({ floors = [], onSelect, activeFloor }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 flex flex-col items-center z-50">
      <FaArrowUp className="text-gray-300 mb-2" />

      {floors.map((floor, index) => {
        const isActive = activeFloor === floor;
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
            {floor}
          </button>
        );
      })}

      <FaArrowDown className="text-gray-300 mt-2" />
    </div>
  );
}
