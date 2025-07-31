import React from 'react';
import { MdClose } from 'react-icons/md';

export default function CategoryModal({ categories, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60  flex items-center justify-center">
      <div className="bg-white text-black rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4">سایر دسته‌بندی‌ها</h2>
        <ul className="space-y-2">
          {categories.map((cat, i) => (
            <li key={i} className="border-b pb-1">
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
