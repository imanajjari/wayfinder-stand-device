import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const SearchResultsContext = createContext();

export function SearchResultsProvider({ children }) {
  const [results, setResults] = useState([]);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('نتایج');
  const [loading, setLoading] = useState(false);

  const showResults = useCallback((resultsData, title = 'نتایج') => {
    setResults(resultsData);
    setModalTitle(title);
    setIsResultsModalOpen(true);
  }, []);

  const hideResults = useCallback(() => {
    setIsResultsModalOpen(false);
    // کمی تأخیر برای انیمیشن خروج
    setTimeout(() => {
      setResults([]);
      setModalTitle('نتایج');
    }, 300);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setIsResultsModalOpen(false);
    setModalTitle('نتایج');
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    results,
    isResultsModalOpen,
    modalTitle,
    loading,
    showResults,
    hideResults,
    clearResults,
    setLoading,
  }), [results, isResultsModalOpen, modalTitle, loading, showResults, hideResults, clearResults]);

  return (
    <SearchResultsContext.Provider value={contextValue}>
      {children}
    </SearchResultsContext.Provider>
  );
}

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error('useSearchResults must be used within a SearchResultsProvider');
  }
  return context;
} 