import { getFloors } from "../storage/floorStorage";

  export function findFloorOfDestination(destination) {
    const floors = getFloors();
    const match = floors.find(floor => floor.number === destination.floorNum);
    if (match) {
      return {
        found: true,
        floorId: match.id,
        floorName: match.name,
        floorFile: match.file,
      };
    } else {
      return {
        found: false,
        message: `No floor found for floorNum=${destination.floorNum}`,
      };
    }
  }
  