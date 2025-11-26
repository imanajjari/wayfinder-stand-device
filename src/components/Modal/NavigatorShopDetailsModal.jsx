import ShopDetailsModal from './ShopDetailsModal';
import { useShopDetails } from '../../contexts/ShopDetailsContext';
import ModalManager from './ModalManager';
import { useModalManager } from '../../contexts/ModalManagerContext';

export default function NavigatorShopDetailsModal() {
  const { selectedShop, isDetailsModalOpen, hideShopDetails } = useShopDetails();
  const { isOpen, hideServiceModal, content } = useModalManager();
  return (
    <>
    <ShopDetailsModal
      isOpen={isDetailsModalOpen}
      onClose={hideShopDetails}
      shop={selectedShop}
      />
    <ModalManager isOpen={isOpen} onClose={hideServiceModal}>
      {content}
    </ModalManager>
      </>
  );
} 