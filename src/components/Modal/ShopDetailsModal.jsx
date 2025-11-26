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
  const { theme, colors } = useTheme();
  const { fetchPathV2 } = usePath();
  const { hideResults } = useSearchResults();

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
      fetchPathV2({end:shop})
      hideResults(); // بستن مودال نتایج
      onClose(); // بستن همین مودال
    }
  };

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

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center pt-8 pb-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[calc(100vh-4rem)] overflow-hidden transition-all duration-300 ease-out mx-4 rounded-2xl shadow-2xl ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ backgroundColor: colors.background }}
        role="dialog"
        aria-modal="true"
        aria-label={shop.fullName || shop.shortName || "Shop details"}
      >
        {/* Header */}
        <div
          className="relative h-64 overflow-hidden"
          style={{ background: headerGradient }}
        >
          {shop.icon && (
            <img
              src={getFileUrl(shop.icon)}
              alt={shop.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.3 }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
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
                  ? "linear-gradient(90deg, #2563eb, #7c3aed)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              color: "#fff",
            }}
            title={t('ShopDetailsModal.start_navigation')}
          >
            <IoNavigate className="w-5 h-5" />
            <span className="text-sm font-medium">{t('ShopDetailsModal.show_route')}</span>
          </button>

          {/* Identity */}
          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            {shop.icon ? (
              <img
                src={getFileUrl(shop.icon)}
                alt={shop.name}
                className="w-20 h-20 rounded-xl object-cover border-2"
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

            <div className="pb-2">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: colors.textSecondary }}
              >
                {shop.fullName || shop.shortName}
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {t('ShopDetailsModal.floor')}{shop.floorNum === 0 ? t('ShopDetailsModal.ground') : shop.floorNum}
                {shop.buildingNumber && ` ${t('ShopDetailsModal.building')} ${shop.buildingNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(100vh-20rem)]"
          style={{ color: colors.textPrimary }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <IoInformation className="w-5 h-5" style={{ color: colors.textSecondary }} />
                <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                 {t('ShopDetailsModal.shop_info')}
                </h2>
              </div>

              {shop.desc && (
                <div style={sectionCardStyle} className="p-4">
                  <h3
                    className="font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    {t('ShopDetailsModal.Description')}
                  </h3>
                  <p className="leading-relaxed">{shop.desc}</p>
                </div>
              )}

              {shop.categories?.length > 0 && (
                <div style={sectionCardStyle} className="p-4">
                  <h3
                    className="font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    {t('ShopDetailsModal.shop_category')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.categories.map((category, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 rounded-full text-sm"
                        style={{
                          background:
                            theme === "dark"
                              ? hexToRgba(colors.modelColor, 0.18)
                              : hexToRgba(colors.modelColor, 0.12),
                          color: colors.textPrimary,
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {shop.tags?.length > 0 && (
                <div style={sectionCardStyle} className="p-4">
                  <h3
                    className="font-medium mb-2"
                    style={{ color: colors.textSecondary }}
                  >
                    {t('ShopDetailsModal.Tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {shop.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          background:
                            theme === "dark"
                              ? hexToRgba("#7c3aed", 0.18)
                              : hexToRgba("#7c3aed", 0.12),
                          color: colors.textPrimary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <IoCall className="w-5 h-5" style={{ color: colors.textSecondary }} />
                <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                  {t('ShopDetailsModal.contact_info')}
                </h2>
              </div>

              {shop.phone && (
                <div style={sectionCardStyle} className="p-4">
                  <div className="flex items-center gap-3">
                    <IoCall className="w-4 h-4" style={{ color: colors.pointStart }} />
                    <div>
                      <h3
                        className="font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        {t('ShopDetailsModal.phone_number')}
                      </h3>
                      <p>{shop.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {shop.workingHours && (
                <div style={sectionCardStyle} className="p-4">
                  <div className="flex items-center gap-3">
                    <IoTime className="w-4 h-4" style={{ color: colors.pointEnd }} />
                    <div>
                      <h3
                        className="font-medium"
                        style={{ color: colors.textSecondary }}
                      >
                        {t('ShopDetailsModal.working_hours')}
                      </h3>
                      <p>{shop.workingHours}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              <div style={sectionCardStyle} className="p-4">
                <div className="flex items-center gap-3">
                  <IoLocation className="w-4 h-4" style={{ color: "#ef4444" }} />
                  <div>
                    <h3
                      className="font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('ShopDetailsModal.location')}
                    </h3>
                    <p  style={{ color: colors.textSecondary }}>
                      طبقه {shop.floorNum === 0 ? "همکف" : shop.floorNum}
                      {shop.buildingNumber && `، ساختمان ${shop.buildingNumber}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              {shop.gallery?.length > 0 && (
                <div style={sectionCardStyle} className="p-4">
                  <h3
                    className="font-medium mb-3"
                    style={{ color: colors.textSecondary }}
                  >
                    {t('ShopDetailsModal.Gallery')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shop.gallery.map((image, i) => (
                      <img
                        key={i}
                        src={getFileUrl(image)}
                        alt={`${shop.name} - تصویر ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                        style={{ border: `1px solid ${hexToRgba(colors.textMuted, 0.12)}` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extra */}
          {(shop.id || shop.fullName || shop.website || shop.email || shop.specialOffers) && (
            <div
              className="mt-6 pt-6"
              style={{ borderTop: `1px solid ${hexToRgba(colors.textMuted, 0.12)}` }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                {t('ShopDetailsModal.additional_info')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {shop.fullName && shop.fullName !== shop.shortName && (
                  <div style={sectionCardStyle} className="p-4">
                    <h3
                      className="font-medium mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('ShopDetailsModal.full_name')}
                    </h3>
                    <p className="text-sm">{shop.fullName}</p>
                  </div>
                )}

                {shop.website && (
                  <div style={sectionCardStyle} className="p-4">
                    <h3
                      className="font-medium mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('ShopDetailsModal.website')}
                    </h3>
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                      style={{ color: colors.textLink }}
                    >
                      {t('ShopDetailsModal.visit_website')}
                    </a>
                  </div>
                )}

                {shop.email && (
                  <div style={sectionCardStyle} className="p-4">
                    <h3
                      className="font-medium mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('ShopDetailsModal.email_address')}
                    </h3>
                    <a
                      href={`mailto:${shop.email}`}
                      className="text-sm underline break-all"
                      style={{ color: colors.textLink }}
                    >
                      {shop.email}
                    </a>
                  </div>
                )}
              </div>

              {shop.specialOffers && (
                <div className="mt-4">
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(90deg, rgba(234,179,8,0.15), rgba(234,88,12,0.15))"
                          : "linear-gradient(90deg, rgba(234,179,8,0.25), rgba(234,88,12,0.25))",
                      border: `1px solid ${hexToRgba("#eab308", 0.35)}`,
                      color: theme === "dark" ? "#fde68a" : "#92400e",
                    }}
                  >
                    <h3 className="font-medium mb-2">پیشنهاد ویژه</h3>
                    <p className="text-sm">{shop.specialOffers}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div
          className="sticky bottom-0 p-6 pt-8"
          style={{
            background: `linear-gradient(to top, ${hexToRgba(
              colors.background,
              0.95
            )}, ${hexToRgba(colors.background, 0)})`,
          }}
        >
          <button
            onClick={handleNavigateToShop}
            className="w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(90deg, #2563eb, #7c3aed)"
                  : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              color: "#fff",
            }}
          >
            <IoNavigate className="w-6 h-6" />
            <span className="text-lg font-semibold">{t('ShopDetailsModal.start_navigation')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
