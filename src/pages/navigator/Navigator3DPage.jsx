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
import NavigatorShopDetailsModal from "../../components/Modal/NavigatorShopDetailsModal";

const BASE_OFFSET = 0;

export default function Navigator3DPage() {
  const { floors, hasFloors, getFloorByName } = useFloors();
  const { path, updateCurrentFloorNumber, refreshLastDestination, lastDestination } = usePath();
  const { colors } = useTheme();

  const { isPortrait, verticalOffset } = useOrientation(BASE_OFFSET);
  const { activeFloor, currentModelFile, floorDestinations, handleFloorSelect } =
    useFloorInit({ floors, hasFloors, updateCurrentFloorNumber });

  const { points: pathPoints, last: lastPoint } = usePathPoints(path, verticalOffset);

  const currentFloorNumber = activeFloor?.number ?? 0;
  const destinationFloorNumber = lastDestination?.floorNumber ?? null;

  const labelText = useMemo(() => {

    // if (!destinationFloorNumber) return "نقطه پایان";
    if (destinationFloorNumber > currentFloorNumber) return "پله برقی - برو طبقه بالا";
    if (destinationFloorNumber < currentFloorNumber) return "پله برقی - برو طبقه پایین";
    return "نقطه پایان";
  }, [destinationFloorNumber, currentFloorNumber]);
  console.log('====================================');
  console.log('destinationFloorNumber',destinationFloorNumber);
  console.log('currentFloorNumber',currentFloorNumber);
  console.log('labelText🎄',labelText);
  console.log('====================================');
  return (
    <div style={{ width:"100%", height:"100vh", position:"relative", background: colors.background }}>
      <TopNav />
      <Navigator3DScene
        colors={colors}
        currentModelFile={currentModelFile}
        verticalOffset={verticalOffset}
        floorDestinations={floorDestinations}
        pathPoints={pathPoints}
        lastPoint={lastPoint}
        labelText={labelText}
        isPortrait={isPortrait}
      />
      <BottomNav />
      <FloorSelectorColumn
        floors={floors}
        onSelect={(f) => handleFloorSelect(f, getFloorByName, refreshLastDestination)}
        activeFloor={activeFloor}
      />
      {/* ⬅️ لودرِ سراسری، خارج از Canvas تا پرش اولیه نداشته باشیم */}
      <PageLoader />
      
      {/* Navigator Specific Modals */}
      <NavigatorShopDetailsModal />
    </div>
  );
}
