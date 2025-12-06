// src/components/modals/ShopDetailsModal.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  IoClose,
  IoLocation,
  IoCall,
  IoTime,
  IoInformation,
  IoNavigate,
} from "react-icons/io5";
import { getFileUrl } from "../../services/fileService";
import useTheme from "../../hooks/useTheme";
import { usePath } from "../../contexts/PathContext";
import { useSearchResults } from "../../contexts/SearchResultsContext";
import { findFloorOfDestination } from "../../lib/floorUtils";
import { t } from 'i18next';
import { getDestinationById } from "../../services/destinationService";
import CartInfoProfileModal from "../common/CartInfoProfileModal";
import { useModalManager } from "../../contexts/ModalManagerContext";
import { useShopDetails } from "../../contexts/ShopDetailsContext";
import WebViewModal from './../Modal/WebViewModal'

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const bigint = parseInt(c, 16);
  // If 8-digit HEX (AARRGGBB), slice last 6 for RGB
  const hasAlphaInHex = c.length === 8;
  const r = hasAlphaInHex ? (bigint >> 16) & 255 : (bigint >> 16) & 255;
  const g = hasAlphaInHex ? (bigint >> 8) & 255 : (bigint >> 8) & 255;
  const b = hasAlphaInHex ? bigint & 255 : bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ShopDetailsModal({ isOpen, onClose, shop }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [shopData, setShopData] = useState(["hi"]);
  const { theme, colors } = useTheme();
  const { fetchPathV2 } = usePath();
  const { hideResults } = useSearchResults();
  const { showModal } = useModalManager();
  const { hideShopDetails } = useShopDetails();

  const openURL = () => {
    hideShopDetails();     // مودال اصلی بسته می‌شود
    showModal(<WebViewModal url={shopData.url} />);   // سایت نمایش داده می‌شود

  };

  const headerGradient = useMemo(
    () =>
      theme === "dark"
        ? "linear-gradient(90deg, #0f172a, #1f2937)" // slate-900 → gray-800
        : "linear-gradient(90deg, #3b82f6, #8b5cf6)", // blue-500 → purple-500
    [theme]
  );

  const sectionCardStyle = useMemo(
    () => ({
      backgroundColor: hexToRgba(colors.canvasBackground, theme === "dark" ? 0.08 : 0.5),
      border: `1px solid ${hexToRgba(colors.textMuted, 0.18)}`,
      borderRadius: "0.75rem",
    }),
    [colors, theme]
  );

  const softBorder = useMemo(
    () => ({ borderColor: hexToRgba(colors.textMuted, 0.2) }),
    [colors]
  );

  const handleNavigateToShop = () => {
    if (shop && shop.entrance) {
      // CHECK:V1
      // updateDestination({
      //   x: shop.entrance.x,
      //   y: shop.entrance.y,
      //   z: 1,
      //   floorNumber: shop.floorNum,
      //   floorId: findFloorOfDestination(shop).floorId,
      // });
      fetchPathV2({ end: shop })
      hideResults(); // بستن مودال نتایج
      onClose(); // بستن همین مودال
    }
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const data = await getDestinationById(shop.id);
        setShopData(data.data); // داده‌ها را در state ذخیره می‌کنیم
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    };
    fetchShopData();
  }, [isOpen])

  useEffect(() => {

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      document.body.style.overflow = "unset";
      setTimeout(() => setShouldRender(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!shouldRender || !shop) return null;

  console.log("shopData :", shopData);
  console.log("shopData.fullName :", shopData.fullName);



  return (
    <div className="fixed inset-0 z-[9999] flex justify-center pt-8 pb-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
          }`}
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar transition-all duration-300 ease-out mx-4 rounded-2xl shadow-2xl ${animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{ backgroundColor: colors.background }}
        role="dialog"
        aria-modal="true"
        aria-label={shop.fullName || shop.shortName || "Shop details"}
      >
        {/* Header */}
        <div
          className="relative h-64 overflow-hidden "
          style={{ background: headerGradient }}
        >
          {shop.icon && (
            <img
              src={'./images/settings/bg-settings.jpg'}
              alt={shop.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"

          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
            aria-label={t('ShopDetailsModal.close_button')}
            title={t('ShopDetailsModal.close_button')}
          >
            <IoClose className="w-6 h-6" style={{ color: "#fff" }} />
          </button>

          {/* Navigate */}
          <button
            onClick={handleNavigateToShop}
            className="absolute top-4 right-16 px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-lg"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, #008AFF, #00FFAB)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              color: "#fff",
            }}
            title={t('ShopDetailsModal.start_navigation')}
          >
            <IoNavigate className="w-5 h-5" />
            <span className="text-sm font-medium">{t('ShopDetailsModal.show_route')}</span>
          </button>


        </div>

        {/* Body */}
        <div
          className="relative p-6 max-h-[calc(100vh-20rem)] "
          style={{ color: colors.textPrimary }}
        >
          {/* Identity */}
          <div className="absolute top-[-35px] right-6 flex items-end gap-4">
            {shop.icon ? (
              <img
                src={getFileUrl(shop.icon)}
                alt={shop.name}
                className="w-25 h-25 rounded-full object-cover border-2"
                style={{
                  backgroundColor: hexToRgba(colors.canvasBackground, 0.2),
                  ...softBorder,
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold border-2"
                style={{
                  backgroundColor: hexToRgba(colors.canvasBackground, 0.2),
                  color: colors.textPrimary,
                  ...softBorder,
                }}
              >
                {shop.shortName?.[0] || shop.fullName?.[0] || "?"}
              </div>
            )}


          </div>
          {/* name profile */}
          <div className="pb-2 pr-28">
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: colors.textSecondary }}
            >
              {shop.fullName || shop.shortName}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {t('ShopDetailsModal.floor')} {shop.floorNum === 0 ? t('ShopDetailsModal.ground') : shop.floorNum}
              {shop.buildingNumber && ` ${t('ShopDetailsModal.building')}  ${shop.buildingNumber}`}
            </p>
          </div>
          {shopData.fullName &&
<CartInfoProfileModal content={'fullName'}>{shopData.fullName}</CartInfoProfileModal>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          






          
            <div className="flex justify-between">
              <CartInfoProfileModal content={'buildingNum'}>{shopData.buildingNum}</CartInfoProfileModal>
              <CartInfoProfileModal content={'floorNum'}>{shopData.floorNum == 0 ? "همکف" : shopData.floorNum}</CartInfoProfileModal>
              {shopData.uniqueCode &&
                <CartInfoProfileModal content={'uniqueCode'}>{shopData.uniqueCode}</CartInfoProfileModal>
              }
            </div>
         
         <CartInfoProfileModal content={'categories'}>{shopData.categories && shopData.categories.length > 0 ? (
        <ul>
          {shopData.categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      ) : (
        <p>فاقد دسته‌بندی</p>
      )}</CartInfoProfileModal>

  {shopData.relatedPersons && shopData.relatedPersons.length > 0 && 
<CartInfoProfileModal content={'relatedPersons'}>
        <ul className=" flex gap-2">
          {shopData.relatedPersons.map((relatedPerson, index) => (
            <li key={index}>{relatedPerson}</li>
          ))}
        </ul>
      </CartInfoProfileModal>
}

{shopData.url &&
<CartInfoProfileModal content={'url'} className={'text-left'}>
   <button
      className="text-blue-500 underline"
      onClick={openURL}
    >
      {shopData.url}
    </button>
</CartInfoProfileModal>
}
{shopData.desc &&
<CartInfoProfileModal content={'desc'}>
  {shopData.desc}
</CartInfoProfileModal>
}
{shopData.files && shopData.files.length > 0 &&
<CartInfoProfileModal content={'files'}>
       <ul className=" flex gap-2 ">
          {shopData.files.map((file, index) => (
            <li key={index}>
              فایل{index}
            </li>
          ))}
        </ul>
</CartInfoProfileModal>
}

























          </div>

        {/* Bottom CTA */}
        <div
          className="sticky bottom-0 p-6 pt-8"
        >
          <button
            onClick={handleNavigateToShop}
            className="w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg"
            style={{
              background:"linear-gradient(90deg, #008AFF, #00FFAB)",
              color: "#fff",
            }}
          >
            <IoNavigate className="w-6 h-6" />
            <span className="text-lg font-semibold">{t('ShopDetailsModal.start_navigation')}</span>
          </button>
        </div>
        </div>

      </div>
    </div>
  );
}
