// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation(undefined, { keyPrefix: "notFound" });

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        {t("page_not_found") || "صفحه مورد نظر یافت نشد"}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        {t("back_home") || "بازگشت به صفحه اصلی"}
      </Link>
    </div>
  );
}
