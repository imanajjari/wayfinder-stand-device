import ShopDetailsModal from './ShopDetailsModal';
import { useShopDetails } from '../../contexts/ShopDetailsContext';

export default function NavigatorShopDetailsModal() {
  const { selectedShop, isDetailsModalOpen, hideShopDetails } = useShopDetails();

  return (
    <ShopDetailsModal
      isOpen={isDetailsModalOpen}
      onClose={hideShopDetails}
      shop={selectedShop}
    />
  );
} 