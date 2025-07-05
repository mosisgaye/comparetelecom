import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher...', 
  onClear,
  debounceMs = 300,
  className = '',
  autoFocus = false
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  // Sync avec la valeur externe
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="block w-full pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors"
      />
      
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Effacer la recherche"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}

// Version compacte pour mobile
export function MobileSearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher...', 
  onFocus,
  className = ''
}: SearchBarProps & { onFocus?: () => void }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="block w-full pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-500 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
      />
    </div>
  );
}

// Composant de recherche en plein écran pour mobile
interface FullScreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

export function FullScreenSearch({
  isOpen,
  onClose,
  value,
  onChange,
  placeholder = 'Rechercher une offre...',
  suggestions = [],
  onSelectSuggestion
}: FullScreenSearchProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 md:hidden">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Fermer la recherche"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="flex-1">
          <SearchBar
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoFocus
            className="border-0"
          />
        </div>
      </div>

      {/* Suggestions de recherche */}
      {suggestions.length > 0 && (
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Suggestions
          </h3>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectSuggestion?.(suggestion);
                  onChange(suggestion);
                }}
                className="flex items-center gap-3 w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recherches récentes (optionnel) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Recherches récentes
          </h3>
          <button className="text-xs text-gray-500 hover:text-gray-700">
            Effacer
          </button>
        </div>
        <div className="text-sm text-gray-500 text-center py-8">
          Aucune recherche récente
        </div>
      </div>
    </div>
  );
}

// Hook pour gérer l'état de recherche
export function useSearch(initialValue = '') {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const clearSearch = () => {
    setSearchTerm('');
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
    clearSearch,
    isSearchOpen,
    openSearch,
    closeSearch
  };
}