import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ModalManagerContext = createContext();

export function ModalManagerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const showModal = useCallback((modalContent) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      content,
      showModal,
      hideModal,
    }),
    [isOpen, content, showModal, hideModal]
  );

  return (
    <ModalManagerContext.Provider value={value}>
      {children}
    </ModalManagerContext.Provider>
  );
}

export function useModalManager() {
  const ctx = useContext(ModalManagerContext);
  if (!ctx) throw new Error("useModalManager must be used inside ModalManagerProvider");
  return ctx;
}
