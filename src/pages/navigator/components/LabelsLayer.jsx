// src/pages/navigator/components/LabelsLayer.jsx
import DestinationsLabels from "../../../components/Models/DestinationsLabels";

export default function LabelsLayer({ floorDestinations, lastPoint, verticalOffset, maxZoomDistance }) {
  return (
    <DestinationsLabels
      destinations={floorDestinations}
      z={2}
      verticalOffset={verticalOffset}
      hiddenPositions={lastPoint ? [lastPoint] : []}
      fadeStartDistance={maxZoomDistance - 15}
      maxVisibleDistance={maxZoomDistance}
    />
  );
}
