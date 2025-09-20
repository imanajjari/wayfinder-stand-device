import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ShopDetailsContext = createContext();

export function ShopDetailsProvider({ children }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const showShopDetails = useCallback((shop) => {
    setSelectedShop(shop);
    setIsDetailsModalOpen(true);
  }, []);

  const hideShopDetails = useCallback(() => {
    setIsDetailsModalOpen(false);
    // کمی تأخیر برای انیمیشن خروج
    setTimeout(() => setSelectedShop(null), 300);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedShop,
    isDetailsModalOpen,
    showShopDetails,
    hideShopDetails,
  }), [selectedShop, isDetailsModalOpen, showShopDetails, hideShopDetails]);

  return (
    <ShopDetailsContext.Provider value={contextValue}>
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