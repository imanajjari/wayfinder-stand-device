import React from 'react'
import { MdGpsFixed } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LocationButton() {

  const navigate = useNavigate();
const location = useLocation();

const refreshPage = () => {
  navigate(0); // رفرش کل صفحه (معادل window.location.reload)
};

  return (
    <button
    onClick={refreshPage}
    className={`px-2 py-1 md:px-4 md:py-2 rounded-xl border border-gray-500 transition text-sm bg-blue-600 text-white`}
  >
    <MdGpsFixed size={24}  />
  </button>
  )
}
