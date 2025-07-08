import React from 'react'
import { MdGpsFixed } from 'react-icons/md';

export default function LocationButton() {
  return (
    <button
    className={`px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-500 transition text-sm bg-blue-600 text-white`}
  >
    <MdGpsFixed size={24}  />
  </button>
  )
}
