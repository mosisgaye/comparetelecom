import { useState, useEffect, useCallback } from 'react';
import { OffersService } from '@/app/services/offers.service';
import type { 
  MobileApiResponse, 
  BoxApiResponse, 
  MobileFilterRequest, 
  BoxFilterRequest,
  MobileOffer,
  BoxOffer
} from '@/app/types/bemove';

interface UseOffersState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour gérer les offres mobiles
 */
export function useMobileOffers(
  initialFilters?: MobileFilterRequest
): UseOffersState<MobileApiResponse> & {
  filters: MobileFilterRequest;
  updateFilters: (filters: MobileFilterRequest) => void;
  loadMore: () => void;
} {
  const [data, setData] = useState<MobileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MobileFilterRequest>(initialFilters || {
    page: 1,
    limit: 12
  });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = Object.keys(filters).length > 2 // Plus que page et limit
        ? await OffersService.getMobileOffersWithFilters(filters)
        : await OffersService.getMobileOffers();
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des offres');
      console.error('Error fetching mobile offers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const updateFilters = useCallback((newFilters: MobileFilterRequest) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  }, []);

  const loadMore = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    refetch: fetchOffers,
    updateFilters,
    loadMore
  };
}

/**
 * Hook pour gérer les offres box
 */
export function useBoxOffers(
  initialFilters?: BoxFilterRequest
): UseOffersState<BoxApiResponse> & {
  filters: BoxFilterRequest;
  updateFilters: (filters: BoxFilterRequest) => void;
  loadMore: () => void;
} {
  const [data, setData] = useState<BoxApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BoxFilterRequest>(initialFilters || {
    page: 1,
    limit: 12
  });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = Object.keys(filters).length > 2 // Plus que page et limit
        ? await OffersService.getBoxOffersWithFilters(filters)
        : await OffersService.getBoxOffers();
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des offres');
      console.error('Error fetching box offers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const updateFilters = useCallback((newFilters: BoxFilterRequest) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  }, []);

  const loadMore = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    refetch: fetchOffers,
    updateFilters,
    loadMore
  };
}

/**
 * Hook pour gérer la pagination locale
 */
export function usePaginatedOffers<T extends MobileOffer | BoxOffer>(
  offers: T[],
  itemsPerPage = 12
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedOffers, setDisplayedOffers] = useState<T[]>([]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedOffers(offers.slice(startIndex, endIndex));
  }, [offers, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const hasMore = displayedOffers.length < offers.length;

  return {
    displayedOffers,
    loadMore,
    hasMore,
    currentPage,
    totalPages: Math.ceil(offers.length / itemsPerPage)
  };
}

/**
 * Hook pour gérer les filtres actifs
 */
export function useActiveFilters() {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const addFilter = useCallback((key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return {
    activeFilters,
    addFilter,
    removeFilter,
    clearFilters,
    hasActiveFilters
  };
}

/**
 * Hook pour gérer le tri
 */
export function useSort<T extends 'mobile' | 'box'>(type: T) {
  type SortOption = T extends 'mobile' 
    ? MobileFilterRequest['sort'] 
    : BoxFilterRequest['sort'];

  const [sortBy, setSortBy] = useState<SortOption>();

  const sortOptions = type === 'mobile' ? [
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'data-desc', label: 'Data décroissant' }
  ] : [
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'vitesse-desc', label: 'Débit décroissant' }
  ];

  return {
    sortBy,
    setSortBy,
    sortOptions
  };
}

/**
 * Hook pour la recherche avec debounce
 */
export function useDebounceSearch(delay = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm
  };
}