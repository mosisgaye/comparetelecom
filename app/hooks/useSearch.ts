import { useState, useEffect } from 'react';

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedTerm: string;
  clearSearch: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

export function useSearch(initialValue = '', debounceDelay = 500): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedTerm('');
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    clearSearch,
    isSearchOpen,
    openSearch,
    closeSearch
  };
}

// Hook pour la recherche avec suggestions
export function useSearchWithSuggestions(
  initialValue = '',
  getSuggestions?: (term: string) => string[]
) {
  const search = useSearch(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (search.debouncedTerm && getSuggestions) {
      const newSuggestions = getSuggestions(search.debouncedTerm);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search.debouncedTerm, getSuggestions]);

  return {
    ...search,
    suggestions
  };
}