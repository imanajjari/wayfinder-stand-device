// src/pages/navigator/hooks/useFloorInit.js
import { useEffect, useState, useCallback } from "react";
import { getMyStand, getDestinations } from "../../services/floorService";

export default function useFloorInit({ floors, hasFloors, updateCurrentFloorNumber }) {
  const [activeFloor, setActiveFloor] = useState(null);
  const [currentModelFile, setCurrentModelFile] = useState("/models/iranmall4.glb");
  const [floorDestinations, setFloorDestinations] = useState([]);

  const fetchFloorDestinations = useCallback((floorNumber) => {
    const all = getDestinations();
    setFloorDestinations(all.filter(d => d.floorNum === floorNumber));
    console.log('====================================');
    console.log('floorNumber :',floorNumber);
    console.log('all.filter(d => d.floorNum === floorNumber) :',all.filter(d => d.floorNum === floorNumber));
    console.log('====================================');
  }, []);

  useEffect(() => {
    console.log('====================================');
    console.log('hi iman');
    console.log('====================================');
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

  const handleFloorSelect = useCallback((floor, getFloorByName, refreshLastDestination) => {
    const floorData = typeof floor === "object" ? floor : getFloorByName(floor);
    console.log('====================================');
    console.log('handleFloorSelect floorData :',floorData);
    console.log('handleFloorSelect floorData.number :',floorData.number);
    console.log('====================================');
    if (!floorData?.file) return;
    fetchFloorDestinations(floorData.number ?? 0);
    setCurrentModelFile(`/models/${floorData.file}`);
    setActiveFloor(floorData);
    updateCurrentFloorNumber(floorData.number ?? 0);
    refreshLastDestination({ currentFloorNumber: floorData.number });
  }, [fetchFloorDestinations]);

  return { activeFloor, currentModelFile, floorDestinations, handleFloorSelect };
}
