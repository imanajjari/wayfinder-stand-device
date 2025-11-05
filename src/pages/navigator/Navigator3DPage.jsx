// src/pages/navigator/Navigator3DPage.jsx
import { useMemo } from "react";
import TopNav from "../../components/layout/TopNav";
import BottomNav from "../../components/layout/BottomNav";
import FloorSelectorColumn from "../../components/common/FloorSelectorColumn";
import { usePath } from "../../contexts/PathContext";
import { useFloors } from "../../hooks/useFloors";
import useTheme from "../../hooks/useTheme";

import useOrientation from "../../hooks/navigator/useOrientation";
import useFloorInit from "../../hooks/navigator/useFloorInit";
import usePathPoints from "../../hooks/navigator/usePathPoints";
import Navigator3DScene from "./Navigator3DScene";
import PageLoader from "../../components/scene/PageLoader";
import NavigatorSearchResultsModal from "../../components/Modal/NavigatorSearchResultsModal";
import useCheckStandAndCompany from "../../hooks/useCheckStandAndCompany"
import NavigatorShopDetailsModal from "../../components/Modal/NavigatorShopDetailsModal";
import BackgroundLightsScene from "../../components/scene/BackgroundLightsScene";

const BASE_OFFSET = 0;

export default function Navigator3DPage() {
  const { floors, hasFloors, getFloorByName } = useFloors();
  const { path, updateCurrentFloorNumber } = usePath();
  const { colors } = useTheme();

  // برای وقتی که اطلاعات استند ها و طبقات رو نداشته باشه ؛ می ره برای لاگین
  useCheckStandAndCompany();

  const { isPortrait, verticalOffset } = useOrientation(BASE_OFFSET);
  const { activeFloor, currentModelFile, floorDestinations, handleFloorSelect } =
    useFloorInit({ floors, hasFloors, updateCurrentFloorNumber });


  return (
    <div className="overflow-hidden" style={{ width: "100%", height: "100vh", position: "relative", background: colors.background }}>
      <TopNav />
      <Navigator3DScene
        colors={colors}
        currentModelFile={currentModelFile}
        verticalOffset={verticalOffset}
        floorDestinations={floorDestinations}
        isPortrait={isPortrait}
        activeFloor={activeFloor}
      />
      <BottomNav />
      <FloorSelectorColumn
        floors={floors}
        onSelect={(f) => handleFloorSelect(f, getFloorByName)}
        activeFloor={activeFloor}
      />
      {/* ⬅️ لودرِ سراسری، خارج از Canvas تا پرش اولیه نداشته باشیم */}
      <PageLoader />
      <BackgroundLightsScene />
      {/* Navigator Specific Modals */}
      <NavigatorShopDetailsModal />
    </div>
  );
}
