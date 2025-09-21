// src/pages/navigator/components/LabelsLayer.jsx
import { Const } from "three/tsl";
import DestinationsLabels from "../Models/DestinationsLabels";

export default function LabelsLayer({ floorDestinations, lastPoint, verticalOffset, maxVisibleDistance }) {
  return (
    <DestinationsLabels
      destinations={floorDestinations}
      z={2}
      verticalOffset={verticalOffset}
      hiddenPositions={lastPoint ? [lastPoint] : []}
      fadeStartDistance={maxVisibleDistance - 15}
      maxVisibleDistance={maxVisibleDistance}
    />

  );
}
