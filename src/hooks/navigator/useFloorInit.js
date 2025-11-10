// src/pages/navigator/hooks/useFloorInit.js
import { useEffect, useState, useCallback } from "react";
import { getMyStand, getDestinations } from "../../storage/floorStorage";

export default function useFloorInit({ floors, hasFloors, updateCurrentFloorNumber }) {
  const [activeFloor, setActiveFloor] = useState(null);
  const [currentModelFile, setCurrentModelFile] = useState("/models/iranmall4.glb");
  const [floorDestinations, setFloorDestinations] = useState([]);

  const fetchFloorDestinations = useCallback((floorNumber) => {
    const all = getDestinations();
    setFloorDestinations(all.filter(d => d.floorNum === floorNumber));
  }, []);

  useEffect(() => {
    if (!hasFloors || floors.length === 0) return;
    const myStand = getMyStand();
    let initialFloor = myStand ? floors.find(f => f.number === myStand.floorNum) : floors[0];
    if (!initialFloor) initialFloor = floors[0];

    if (initialFloor?.file) {
      setCurrentModelFile(`/models/${initialFloor.file}`);
      setActiveFloor(initialFloor);
      updateCurrentFloorNumber(initialFloor.number);
      fetchFloorDestinations(initialFloor.number);
    }
  }, [hasFloors, floors]);

  const handleFloorSelect = useCallback((floor, getFloorByName) => {
    const floorData = typeof floor === "object" ? floor : getFloorByName(floor);
    if (!floorData?.file) return;
    fetchFloorDestinations(floorData.number ?? 0);
    setCurrentModelFile(`/models/${floorData.file}`);
    setActiveFloor(floorData);
    updateCurrentFloorNumber(floorData.number ?? 0);
  }, [fetchFloorDestinations]);

  return { activeFloor, currentModelFile, floorDestinations, handleFloorSelect };
}
