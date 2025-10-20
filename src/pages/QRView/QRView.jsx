import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getFileUrl } from "../../services/fileService";
import BackgroundLightsQRView from "../../components/QRView/BackgroundLightsQRView";
import TopNav from "../../components/layout/TopNav";
import AdBanner from "../../components/common/Ads/AdBanner";
import AutoCropImage from "../../components/QRView/AutoCropImage";
import GradientButton from "../../components/buttons/GradientButton";


const QRView = () => {
    const { slug } = useParams();
    const [ad, setAd] = useState(null);

    return (
        <div
            className="relative overflow-hidden flex flex-col justify-between items-center min-h-screen px-6 py-3 text-center"
            style={{
                background: "#000",
                backgroundImage: "url('/images/bg-scene.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "100px",
            }}
        >
            <AdBanner
                content={
                    ad ? (
                        <img src={getFileUrl(ad.file)} alt={ad.name} className="w-full" />
                    ) : (
                        <img src="/gift/6831618277c514f21f69a714dfd8a21dc58938dc_1748446476.gif"  />
                    )
                }
                onClick={() => alert("بنر کلیک شد!")}
                className=" 2xl:hidden"
            />
            <BackgroundLightsQRView />

            {/* تصویر اصلی */}
            <AutoCropImage
                // src={"/images/snapshotfack.png"} // یا getFileUrl(slug)
                src={"/images/snapshotfack.png"} // یا getFileUrl(slug)
                bgColor="#000000"   // رنگ پس‌زمینه‌ای که باید حذف بشه
                tolerance={20}      // افزایش می‌ده حساسیت (برای اختلاف‌های کوچک)
                sampling={4}        // 1 = دقیق‌ترین، مقادیر بزرگتر سریع‌ترند
                alt="Shared Snapshot"
                className="rounded-2xl mb-8 z-10"
                maxWidth={800}
            />

            {/* متن اصلی */}
            <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-4 z-10">
                This is a test text
            </h1>

            {/* متن توضیحی */}
            <p className="text-gray-200 text-base sm:text-lg max-w-[700px] mb-2 z-10 leading-relaxed">
                This is a test text this is a test text this is a test text
            </p>

            {/* Gradient Button */}
            <GradientButton cssClass="text-white">
                Lantern Website
            </GradientButton>
        </div>
    );
};

export default QRView;
