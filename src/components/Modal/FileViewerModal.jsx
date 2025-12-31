import { useModalManager } from "../../contexts/ModalManagerContext";
import { useShopDetails } from "../../contexts/ShopDetailsContext";
import { getFileUrl } from "../../services/fileService";


export default function FileViewerModal({ fileName, shop }) {
  const fileUrl = getFileUrl(fileName);  // گرفتن URL فایل
  
  const fileExtension = fileName.split('.').pop().toLowerCase();  // گرفتن پسوند فایل
const { showShopDetails } = useShopDetails();
const { hideModal } = useModalManager();
  // تابع بازگشت به صفحه اصلی (جزئیات فروشگاه)
  const goBackToShopDetails = () => {
    hideModal()
    showShopDetails(shop);  // نمایش جزئیات فروشگاه با استفاده از context
  };

  return (
    <div className="w-[90vw] h-[80vh] bg-black rounded-xl overflow-hidden shadow-xl relative">
      {/* دکمه بازگشت */}
      <button
        onClick={goBackToShopDetails}
        className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-xl shadow-lg"
      >
        بازگشت
      </button>

      {/* نمایش محتوا بر اساس نوع فایل */}
      {fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png" || fileExtension === "gif" ? (
        <img src={fileUrl} alt="File" className="w-full h-full object-contain rounded-xl" />
      ) : fileExtension === "mp4" || fileExtension === "avi" || fileExtension === "mov" ? (
        <video controls className="w-full h-full rounded-xl">
          <source src={fileUrl} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      ) : fileExtension === "pdf" ? (
        <iframe src={fileUrl} title="PDF Document" className="w-full h-full rounded-xl border-0" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">نوع فایل پشتیبانی نمی‌شود</div>
      )}
    </div>
  );
}
