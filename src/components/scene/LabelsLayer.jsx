// src/pages/navigator/components/LabelsLayer.jsx
import { Const } from "three/tsl";
import DestinationsLabels from "../Models/DestinationsLabels";
import { usePath } from "../../contexts/PathContext";

export default function LabelsLayer({ floorDestinations, verticalOffset, maxVisibleDistance }) {
  const { lastDestination } = usePath();
  console.log('lastDestination :',lastDestination);
  console.log('floorDestinations :',floorDestinations);
  const visibleDestinations = lastDestination
    ? floorDestinations.filter(dest => dest.id !== lastDestination.id)
    : floorDestinations;
  
  return (
    <DestinationsLabels
      destinations={visibleDestinations}
      z={2}
      verticalOffset={verticalOffset}
      hiddenPositions={lastDestination ? [lastDestination] : []}
      fadeStartDistance={maxVisibleDistance - 15}
      maxVisibleDistance={maxVisibleDistance}
    />

  );
}
