import { createContext, useContext, useState } from 'react';

const SearchResultsContext = createContext();

export function SearchResultsProvider({ children }) {
  const [results, setResults] = useState([]);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('نتایج');
  const [loading, setLoading] = useState(false);

  const showResults = (resultsData, title = 'نتایج') => {
    setResults(resultsData);
    setModalTitle(title);
    setIsResultsModalOpen(true);
  };

  const hideResults = () => {
    setIsResultsModalOpen(false);
    // کمی تأخیر برای انیمیشن خروج
    setTimeout(() => {
      setResults([]);
      setModalTitle('نتایج');
    }, 300);
  };

  const clearResults = () => {
    setResults([]);
    setIsResultsModalOpen(false);
    setModalTitle('نتایج');
  };

  return (
    <SearchResultsContext.Provider
      value={{
        results,
        isResultsModalOpen,
        modalTitle,
        loading,
        showResults,
        hideResults,
        clearResults,
        setLoading,
      }}
    >
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