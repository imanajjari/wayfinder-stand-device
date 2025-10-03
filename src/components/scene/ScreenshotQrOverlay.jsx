// src\components\scene\ScreenshotQrOverlay.jsx
import { useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ImSpinner8 } from "react-icons/im";
import { MdOutlineScreenshot } from "react-icons/md";
import { useQrCodeUpload } from "../../hooks/QrCode/useQrCodeUpload";


export default function ScreenshotQrOverlay({qrUrl, loading}) {

  return (
<div className="absolute top-1/3 left-2 flex flex-col gap-4" dir="ltr">
  {qrUrl && (
    <div className="backdrop-blur-md border border-gray-300 rounded-4xl shadow-md p-4 text-xl bg-white">
      <QRCodeCanvas value={qrUrl} size={128} />
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
