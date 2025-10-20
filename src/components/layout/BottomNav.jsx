import React, { useEffect, useState } from 'react';
import StickyPanels from '../common/StickyPanels';
import AdBanner from '../common/Ads/AdBanner';
import { fetchAds } from '../../services/adsService';
import NavigatorSearchResultsModal from '../Modal/NavigatorSearchResultsModal';


export default function BottomNav() {
  const [visiblePanel, setVisiblePanel] = useState(null);
  const [ad, setAd] = useState(null);
  
    useEffect(() => {
      const loadAd = async () => {
        try {
          const adsResponse = await fetchAds(2);

          if (adsResponse.data?.length > 0) {
            setAd(adsResponse.data[0].data); // اولین تبلیغ
          }
        } catch (err) {
          console.error('خطا در دریافت تبلیغات', err);
        }
      };
  
      loadAd();
    }, []);

  const togglePanel = (panelName) => {
    setVisiblePanel((prev) => (prev === panelName ? null : panelName));
  };

  return (
    <>
<div className=' fixed bottom-[10px] left-[10px] right-[10px] flex flex-col z-50 '>
<div className="mx-auto w-full max-w-screen-xl flex flex-col">
        {/* Navigator Specific Modals */}
        <NavigatorSearchResultsModal />
      {/* کامپوننت یکپارچه پنل‌ها */}
      <StickyPanels />
      <div className='hidden sm:block mt-2'>

      <AdBanner content={ad} />
      </div>
</div>
      </div>
    </>
  );
}

