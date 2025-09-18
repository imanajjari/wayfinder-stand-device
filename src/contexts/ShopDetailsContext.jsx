import { createContext, useContext, useState } from 'react';

const ShopDetailsContext = createContext();

export function ShopDetailsProvider({ children }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const showShopDetails = (shop) => {
    setSelectedShop(shop);
    setIsDetailsModalOpen(true);
  };

  const hideShopDetails = () => {
    setIsDetailsModalOpen(false);
    // کمی تأخیر برای انیمیشن خروج
    setTimeout(() => setSelectedShop(null), 300);
  };

  return (
    <ShopDetailsContext.Provider
      value={{
        selectedShop,
        isDetailsModalOpen,
        showShopDetails,
        hideShopDetails,
      }}
    >
      {children}
    </ShopDetailsContext.Provider>
  );
}

export function useShopDetails() {
  const context = useContext(ShopDetailsContext);
  if (!context) {
    throw new Error('useShopDetails must be used within a ShopDetailsProvider');
  }
  return context;
} 