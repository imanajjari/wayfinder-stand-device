import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsLayout from "../../layouts/SettingsLayout";
import { toast } from "react-toastify";

export default function ReloadPage() {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  const handleConfirm = () => {
    localStorage.clear();
    toast.success("خروج از حساب");
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <SettingsLayout>
      <div className="bg-[#10172A70]/40 backdrop-blur-lg shadow-lg rounded-xl p-6 md:p-10 max-w-md text-white text-center space-y-6 border border-[#525f8170]">
        <h2 className="text-2xl md:text-3xl font-bold text-white ">
          آیا از پاک کردن حافظه اطمینان دارید؟
        </h2>
        <p className="text-gray-300 text-sm md:text-base">
          با انجام این کار، تمام اطلاعات ذخیره‌شده در حافظه حذف می‌شود و به صفحه
          ورود یا تنظیمات بازمی‌گردید.
        </p>

        <div
          className={`flex justify-center gap-4 mt-6 ${
            canGoBack ? "" : "justify-center"
          }`}
        >
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
    </SettingsLayout>
  );
}
