import { useState, useEffect } from 'react';
import { useMobileOffers } from './useOffers';
import { useSearch } from './useSearch';
import type { MobileOffer } from '@/app/types/bemove';

export function useMobilePageData() {
  const [filterLoading, setFilterLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Hook pour les offres
  const mobileOffers = useMobileOffers();
  
  // États pour les filtres
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>('');
  
  // Hook pour la recherche
  const search = useSearch();
  
  // Pagination
  const [displayedCount, setDisplayedCount] = useState(12);
  const [filteredOffers, setFilteredOffers] = useState<MobileOffer[]>([]);

  // Options de tri
  const sortOptions = [
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'data-desc', label: 'Data décroissant' }
  ];

  // Effet pour filtrer les offres avec suspense
  useEffect(() => {
    if (!mobileOffers.data?.commercial.offres) {
      setFilteredOffers([]);
      return;
    }

    setFilterLoading(true);
    
    const timer = setTimeout(() => {
      let filtered = [...(mobileOffers.data?.commercial.offres || [])];
      
      // Recherche
      if (search.searchTerm) {
        const term = search.searchTerm.toLowerCase();
        filtered = filtered.filter(offer => 
          offer.nom.toLowerCase().includes(term) ||
          offer.operateur.nom.toLowerCase().includes(term) ||
          offer.description?.toLowerCase().includes(term)
        );
      }
      
      // Filtres
      if (activeFilters.operateur) {
        filtered = filtered.filter(offer => 
          offer.operateur.slug === activeFilters.operateur ||
          offer.operateur.slugOperateur === activeFilters.operateur
        );
      }
      
      if (activeFilters.priceRange) {
        const [min, max] = activeFilters.priceRange;
        filtered = filtered.filter(offer => 
          offer.prix >= min && offer.prix <= max
        );
      }
      
      if (activeFilters.minData) {
        if (activeFilters.minData === -1) {
          filtered = filtered.filter(offer => offer.services.internetIllimite);
        } else {
          filtered = filtered.filter(offer => 
            (offer.quotaData || 0) >= activeFilters.minData
          );
        }
      }
      
      if (activeFilters.compatible5G) {
        filtered = filtered.filter(offer => offer.services.compatible5G);
      }
      
      if (activeFilters.sansEngagement) {
        filtered = filtered.filter(offer => offer.dureeEngagement === 0);
      }
      
      // Tri
      if (sortBy) {
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'price-asc':
              return a.prix - b.prix;
            case 'price-desc':
              return b.prix - a.prix;
            case 'data-desc':
              return (b.quotaData || 0) - (a.quotaData || 0);
            default:
              return 0;
          }
        });
      }
      
      setFilteredOffers(filtered);
      setFilterLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [mobileOffers.data, search.searchTerm, activeFilters, sortBy]);

  // Gestion des filtres
  const handleFilterChange = (filterType: string, value: any) => {
    if (value === null || value === undefined) {
      const newFilters = { ...activeFilters };
      delete newFilters[filterType];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
    setDisplayedCount(12);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSortBy('');
    search.clearSearch();
  };

  // Convertir les filtres pour l'affichage
  const getFilterChips = () => {
    const chips = Object.entries(activeFilters).map(([key, value]) => {
      let label = key;
      let displayValue = value;
      
      switch (key) {
        case 'operateur':
          label = 'Opérateur';
          displayValue = mobileOffers.data?.commercial.filtres.operateurs
            .find(op => op.slug === value)?.nom || value;
          break;
        case 'priceRange':
          label = 'Prix';
          displayValue = `${value[0]}€ - ${value[1]}€`;
          break;
        case 'minData':
          label = 'Data';
          displayValue = value === -1 ? 'Illimité' : `${value} Go+`;
          break;
        case 'compatible5G':
          label = '5G';
          displayValue = 'Oui';
          break;
        case 'sansEngagement':
          label = 'Engagement';
          displayValue = 'Sans';
          break;
      }
      
      return { id: key, label, value: displayValue };
    });

    if (search.searchTerm) {
      chips.unshift({
        id: 'search',
        label: 'Recherche',
        value: search.searchTerm
      });
    }

    return chips;
  };

  const handleSelectOffer = (offer: MobileOffer) => {
    window.open(offer.url, '_blank');
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 12);
  };

  const activeFilterCount = Object.keys(activeFilters).length + 
    (search.searchTerm ? 1 : 0) + 
    (sortBy ? 1 : 0);

  return {
    // États
    loading: mobileOffers.loading,
    error: mobileOffers.error,
    filterLoading,
    filteredOffers,
    displayedCount,
    
    // Données
    data: mobileOffers.data,
    filterChips: getFilterChips(),
    activeFilterCount,
    sortOptions,
    
    // Actions
    refetch: mobileOffers.refetch,
    handleFilterChange,
    clearAllFilters,
    handleSelectOffer,
    handleLoadMore,
    
    // Filtres et recherche
    activeFilters,
    sortBy,
    setSortBy,
    search,
    
    // Drawer mobile
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
  };
}