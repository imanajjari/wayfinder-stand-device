import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReloadPage() {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  const handleConfirm = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 max-w-md text-center space-y-6 border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          آیا از پاک کردن حافظه اطمینان دارید؟
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          با انجام این کار، تمام اطلاعات ذخیره‌شده در حافظه حذف می‌شود و به صفحه ورود یا تنظیمات بازمی‌گردید.
        </p>

        <div className={`flex justify-center gap-4 mt-6 ${canGoBack ? '' : 'justify-center'}`}>
          <button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            بله، پاک کن
          </button>

          {canGoBack && (
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            >
              خیر، بازگشت
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
