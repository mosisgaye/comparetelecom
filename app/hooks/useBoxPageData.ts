import { useState, useEffect } from 'react';
import { useBoxOffers } from './useOffers';
import { useSearch } from './useSearch';
import type { BoxOffer } from '@/app/types/bemove';

export function useBoxPageData() {
  const [filterLoading, setFilterLoading] = useState(false);
  
  // Hook pour les offres
  const boxOffers = useBoxOffers();
  
  // États pour les filtres
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>('');
  
  // Hook pour la recherche
  const search = useSearch();
  
  // Pagination
  const [displayedCount, setDisplayedCount] = useState(12);
  const [filteredOffers, setFilteredOffers] = useState<BoxOffer[]>([]);

  // Options de tri
  const sortOptions = [
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'vitesse-desc', label: 'Débit décroissant' }
  ];

  // Effet pour filtrer les offres avec suspense
  useEffect(() => {
    if (!boxOffers.data?.commercial.offres) {
      setFilteredOffers([]);
      return;
    }

    setFilterLoading(true);
    
    const timer = setTimeout(() => {
      let filtered = [...(boxOffers.data?.commercial.offres || [])];
      
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
          offer.operateur.nom === activeFilters.operateur
        );
      }
      
      if (activeFilters.priceRange) {
        const [min, max] = activeFilters.priceRange;
        filtered = filtered.filter(offer => {
          const price = typeof offer.prix === 'string' ? parseFloat(offer.prix) : offer.prix;
          return price >= min && price <= max;
        });
      }
      
      if (activeFilters.typeTechno) {
        filtered = filtered.filter(offer => 
          offer.typeTechno === activeFilters.typeTechno
        );
      }
      
      if (activeFilters.tv) {
        filtered = filtered.filter(offer => offer.services.tv === true);
      }
      
      if (activeFilters.telephone) {
        filtered = filtered.filter(offer => offer.services.telephone === true);
      }
      
      // Tri
      if (sortBy) {
        filtered.sort((a, b) => {
          const priceA = typeof a.prix === 'string' ? parseFloat(a.prix) : a.prix;
          const priceB = typeof b.prix === 'string' ? parseFloat(b.prix) : b.prix;
          
          switch (sortBy) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'vitesse-desc':
              return (b.vitesse || 0) - (a.vitesse || 0);
            default:
              return 0;
          }
        });
      }
      
      setFilteredOffers(filtered);
      setFilterLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [boxOffers.data, search.searchTerm, activeFilters, sortBy]);

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
          displayValue = value;
          break;
        case 'priceRange':
          label = 'Prix';
          displayValue = `${value[0]}€ - ${value[1]}€`;
          break;
        case 'typeTechno':
          label = 'Technologie';
          displayValue = value === '4gbox' ? '4G Box' : value.charAt(0).toUpperCase() + value.slice(1);
          break;
        case 'tv':
          label = 'TV';
          displayValue = 'Incluse';
          break;
        case 'telephone':
          label = 'Téléphone';
          displayValue = 'Inclus';
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

  const handleSelectOffer = (offer: BoxOffer) => {
    window.open(offer.url, '_blank');
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + 12);
  };

  return {
    // États
    loading: boxOffers.loading,
    error: boxOffers.error,
    filterLoading,
    filteredOffers,
    displayedCount,
    
    // Données
    data: boxOffers.data,
    filterChips: getFilterChips(),
    sortOptions,
    
    // Actions
    refetch: boxOffers.refetch,
    handleFilterChange,
    clearAllFilters,
    handleSelectOffer,
    handleLoadMore,
    
    // Filtres et recherche
    activeFilters,
    sortBy,
    setSortBy,
    search,
  };
}