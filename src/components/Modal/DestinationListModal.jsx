// components/modals/DestinationListModal.jsx
import { getMyStand } from "../../storage/floorStorage";
import PanelModal from "../Modal/PanelModal";
import DestinationCard from "../cards/DestinationCard";

export default function DestinationListModal({
  isOpen,
  onClose,
  title = "نتایج",
  destinations = [],
  onSelect
}) {
    const myStand = getMyStand();
  return (
    <PanelModal isOpen={isOpen} onClose={onClose} title={title}>
      {destinations.length === 0 ? (
        <p className="text-center text-gray-300">نتیجه‌ای یافت نشد.</p>
      ) : (
        destinations.map((item, i) => (
          <DestinationCard
            key={i}
            shop={item}
            onClick={() => onSelect(item)}
            myStand = {myStand}
          />
        ))
      )}
    </PanelModal>
  );
}
