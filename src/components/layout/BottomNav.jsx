import React, { useState } from 'react';
import { MdElectricalServices,
   MdBuild,
   MdPrecisionManufacturing,
   MdSensors,
   MdComputer,
   MdSettingsInputAntenna,
   MdSmartToy,
   MdSettings,
   MdElectricBolt,
   MdCompareArrows,
   MdSchema,
   MdFunctions,
   MdBatteryChargingFull,
   MdSyncAlt,
 } from 'react-icons/md';
import StickyPanels from '../common/StickyPanels';
import AdBanner from '../common/Ads/AdBanner';
import PanelModal from '../Modal/PanelModal';


export default function BottomNav() {
  const [visiblePanel, setVisiblePanel] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultContent, setResultContent] = useState(null);
  
  const showResult = (content) => {
    setResultContent(content);
    setIsResultOpen(true);
  };
  const togglePanel = (panelName) => {
    setVisiblePanel((prev) => (prev === panelName ? null : panelName));
  };

  return (
    <>
<div className=' fixed bottom-[10px] left-[10px] right-[10px] flex flex-col'>

{/* نتایج جست و حو  */}

<PanelModal
  isOpen={isResultOpen}
  onClose={() => setIsResultOpen(false)}
  title="نتایج"
>
  {resultContent}
</PanelModal>

      {/* کامپوننت یکپارچه پنل‌ها */}
      <StickyPanels
  onShowResult={showResult}
  setIsResultOpen={setIsResultOpen}
/>
<AdBanner content="🔥 جشنواره تابستانه! با 40٪ تخفیف در همه خدمات" />
      </div>
    </>
  );
}

