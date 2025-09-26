import React, { useEffect, useState } from 'react';
import WideNavbar from './WideNavbar';
import AdBanner from '../common/Ads/AdBanner';
import { fetchAds } from '../../services/adsService';
import { getFileUrl } from '../../services/fileService';

export default function TopNav() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const adsResponse = await fetchAds(1);
        if (adsResponse.data?.length > 0) {
          setAd(adsResponse.data[0]); // اولین تبلیغ
        }
      } catch (err) {
        console.error('خطا در دریافت تبلیغات', err);
      }
    };

    loadAd();
  }, []);

  return (
    <div className='fixed top-[10px] left-[10px] right-[10px] z-[1000] pointer-events-none'>
      <div className="pointer-events-auto">
        <AdBanner
          content={
            ad ? (
              <img src={getFileUrl(ad.file)} alt={ad.name} className="w-full rounded-2xl" />
            ) : (
              <img src="/gift/6831618277c514f21f69a714dfd8a21dc58938dc_1748446476.gif" className="rounded-2xl" />
            )
          }
          onClick={() => alert("بنر کلیک شد!")}
          className=" 2xl:hidden"
        />
        <WideNavbar />
      </div>
    </div>
  );
}
