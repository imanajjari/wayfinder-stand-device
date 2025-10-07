// src\components\scene\ScreenshotQrOverlay.jsx
import { useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ImSpinner8 } from "react-icons/im";
import { MdOutlineScreenshot } from "react-icons/md";
import { useQrCodeUpload } from "../../hooks/QrCode/useQrCodeUpload";
import { IoClose } from "react-icons/io5";


export default function ScreenshotQrOverlay({qrUrl,handlerefreshQRUrl, loading}) {

  return (
<div className="absolute top-1/2 xl:top-1/3 sm:top-1/2 left-2 flex flex-col gap-4" dir="ltr">
  {qrUrl && (
    <div className="backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 text-xl bg-white">
      <QRCodeCanvas value={qrUrl} size={128} />
                <button
            className="absolute top-[-10px] right-[-10px] text-red-600 bg-white rounded-full text-3xl hover:text-gray-800"
            onClick={handlerefreshQRUrl}
            aria-label="Close QR Code"
          >
            <IoClose />
          </button>
    </div>
  )}

  <button
    className="bg-black/40 backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 text-xl text-white self-start"
    onClick={() => {
      if (window.captureScreenshot) {
        window.captureScreenshot();
      }
    }}
  >
    {loading ? <ImSpinner8 className="animate-spin" /> : <MdOutlineScreenshot />}
  </button>
</div>
  );
}
