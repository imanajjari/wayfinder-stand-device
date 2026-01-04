import { useMemo } from "react";
import { getDestinations } from "../../storage/floorStorage/destinationStorage";
import { compareDestinations } from "../../services/comparisonService";
import { useModalManager } from "../../contexts/ModalManagerContext";
import DestinationComparisonResultModal from "./DestinationComparisonResultModal";

export default function DestinationCompareSelectModal({ baseDestinationId }) {
  const { showModal } = useModalManager();

  const destinations = useMemo(() => {
    return getDestinations().filter(d => d.id !== baseDestinationId);
  }, [baseDestinationId]);

  const handleCompare = async (targetId) => {
    const result = await compareDestinations({
      desc1: baseDestinationId,
      desc2: targetId,
    });

    showModal(
      <DestinationComparisonResultModal result={result.data} />
    );
  };

  return (
    <div className="w-[420px] bg-[#1e293b] rounded-2xl p-6 text-white">
      <h2 className="text-lg font-bold mb-4 text-center">
        مقایسه با مقصد دیگر
      </h2>

      <ul className="max-h-[300px] overflow-y-auto space-y-2">
        {destinations.map(dest => (
          <li
            key={dest.id}
            onClick={() => handleCompare(dest.id)}
            className="
              cursor-pointer
              bg-[#0f172a]
              hover:bg-[#334155]
              rounded-lg
              px-4 py-3
              transition
              flex justify-between items-center
            "
          >
            <span>{dest.fullName || dest.shortName}</span>
            <span className="text-xs opacity-60">
              طبقه {dest.floorNum}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
