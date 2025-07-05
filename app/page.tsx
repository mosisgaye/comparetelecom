'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useMobileOffers, useBoxOffers } from '@/app/hooks/useOffers';
import { MobileOfferCard } from '@/app/components/forfait-mobile/MobileOfferCard';
import { BoxOfferCard } from '@/app/components/box-internet/BoxOfferCard';
import { OffersGridSkeleton } from '@/app/components/shared/OfferSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { MobileFilters, MobileFilterDrawer, FilterFloatingButton } from '@/app/components/forfait-mobile/MobileFilters';
import { SearchBar, useSearch } from '@/app/components/shared/SearchBar';
import { SortDropdown } from '@/app/components/shared/SortDropdown';
import { LoadMoreButton } from '@/app/components/shared/LoadMoreButton';
import { FilterChipGroup } from '@/app/components/shared/FilterChip';
import { Smartphone, Wifi, Filter, TrendingDown, TrendingUp, Signal } from 'lucide-react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('mobile');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Hooks pour les offres
  const mobileOffers = useMobileOffers();
  const boxOffers = useBoxOffers();
  
  // États pour les filtres
  const [mobileActiveFilters, setMobileActiveFilters] = useState<Record<string, any>>({});
  const [boxActiveFilters, setBoxActiveFilters] = useState<Record<string, any>>({});
  
  // États pour le tri
  const [mobileSort, setMobileSort] = useState<string>('');
  const [boxSort, setBoxSort] = useState<string>('');
  
  // Hook pour la recherche
  const mobileSearch = useSearch();
  const boxSearch = useSearch();
  
  // Pagination locale
  const [displayedMobileCount, setDisplayedMobileCount] = useState(12);
  const [displayedBoxCount, setDisplayedBoxCount] = useState(12);

  // Options de tri
  const mobileSortOptions = [
    { value: 'price-asc', label: 'Prix croissant', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'price-desc', label: 'Prix décroissant', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'data-desc', label: 'Data décroissant', icon: <Signal className="w-4 h-4" /> }
  ];

  const boxSortOptions = [
    { value: 'price-asc', label: 'Prix croissant', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'price-desc', label: 'Prix décroissant', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'vitesse-desc', label: 'Débit décroissant', icon: <Signal className="w-4 h-4" /> }
  ];

  // Filtrer et trier les offres mobiles
  const filteredMobileOffers = useMemo(() => {
    if (!mobileOffers.data?.commercial.offres) return [];
    
    let filtered = [...mobileOffers.data.commercial.offres];
    
    // Appliquer la recherche
    if (mobileSearch.searchTerm) {
      const term = mobileSearch.searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.nom.toLowerCase().includes(term) ||
        offer.operateur.nom.toLowerCase().includes(term) ||
        offer.description?.toLowerCase().includes(term)
      );
    }
    
    // Appliquer les filtres
    if (mobileActiveFilters.operateur) {
      filtered = filtered.filter(offer => 
        offer.operateur.slug === mobileActiveFilters.operateur ||
        offer.operateur.slugOperateur === mobileActiveFilters.operateur
      );
    }
    
    if (mobileActiveFilters.priceRange) {
      const [min, max] = mobileActiveFilters.priceRange;
      filtered = filtered.filter(offer => 
        offer.prix >= min && offer.prix <= max
      );
    }
    
    if (mobileActiveFilters.minData) {
      if (mobileActiveFilters.minData === -1) {
        filtered = filtered.filter(offer => offer.services.internetIllimite);
      } else {
        filtered = filtered.filter(offer => 
          (offer.quotaData || 0) >= mobileActiveFilters.minData
        );
      }
    }
    
    if (mobileActiveFilters.compatible5G) {
      filtered = filtered.filter(offer => offer.services.compatible5G);
    }
    
    if (mobileActiveFilters.sansEngagement) {
      filtered = filtered.filter(offer => offer.dureeEngagement === 0);
    }
    
    // Appliquer le tri
    if (mobileSort) {
      filtered.sort((a, b) => {
        switch (mobileSort) {
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
    
    return filtered;
  }, [mobileOffers.data, mobileSearch.searchTerm, mobileActiveFilters, mobileSort]);

  // Gestion des filtres
  const handleMobileFilterChange = (filterType: string, value: any) => {
    if (value === null || value === undefined) {
      const newFilters = { ...mobileActiveFilters };
      delete newFilters[filterType];
      setMobileActiveFilters(newFilters);
    } else {
      setMobileActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
    setDisplayedMobileCount(12); // Reset pagination
  };

  const clearAllMobileFilters = () => {
    setMobileActiveFilters({});
    setMobileSort('');
    mobileSearch.clearSearch();
  };

  // Convertir les filtres actifs pour l'affichage
  const mobileFilterChips = Object.entries(mobileActiveFilters).map(([key, value]) => {
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

  // Ajouter la recherche aux chips si active
  if (mobileSearch.searchTerm) {
    mobileFilterChips.unshift({
      id: 'search',
      label: 'Recherche',
      value: mobileSearch.searchTerm
    });
  }

  // Gestion de la sélection d'offre
  const handleSelectOffer = (offer: any) => {
    window.open(offer.url, '_blank');
  };

  // Compter les filtres actifs
  const activeFilterCount = Object.keys(mobileActiveFilters).length + 
    (mobileSearch.searchTerm ? 1 : 0) + 
    (mobileSort ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Comparateur d'offres Telecom
            </h1>
            <p className="mt-1 text-base sm:text-lg text-gray-600">
              Trouvez la meilleure offre mobile ou box internet
            </p>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Forfaits</span> Mobile
              </TabsTrigger>
              <TabsTrigger value="box" className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">Box</span> Internet
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Offers Tab */}
          <TabsContent value="mobile" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtres desktop */}
              <div className="hidden lg:block">
                {mobileOffers.data && (
                  <MobileFilters
                    filters={mobileOffers.data.commercial.filtres}
                    activeFilters={mobileActiveFilters}
                    onFilterChange={handleMobileFilterChange}
                    onClearAll={clearAllMobileFilters}
                    offersCount={filteredMobileOffers.length}
                  />
                )}
              </div>

              {/* Contenu principal */}
              <div className="lg:col-span-3 space-y-6">
                {/* Barre de recherche et tri */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      value={mobileSearch.searchTerm}
                      onChange={mobileSearch.setSearchTerm}
                      placeholder="Rechercher une offre mobile..."
                      className="w-full"
                    />
                  </div>
                  <SortDropdown
                    options={mobileSortOptions}
                    value={mobileSort}
                    onChange={setMobileSort}
                    placeholder="Trier par"
                    className="w-full sm:w-auto"
                  />
                </div>

                {/* Filtres actifs */}
                {mobileFilterChips.length > 0 && (
                  <FilterChipGroup
                    filters={mobileFilterChips}
                    onRemove={(id) => {
                      if (id === 'search') {
                        mobileSearch.clearSearch();
                      } else {
                        handleMobileFilterChange(id, null);
                      }
                    }}
                    onClearAll={clearAllMobileFilters}
                  />
                )}

                {/* Grille d'offres */}
                {mobileOffers.loading ? (
                  <OffersGridSkeleton count={6} />
                ) : mobileOffers.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-700">{mobileOffers.error}</p>
                    <button
                      onClick={() => mobileOffers.refetch()}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : filteredMobileOffers.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 mb-4">Aucune offre ne correspond à vos critères</p>
                    <button
                      onClick={clearAllMobileFilters}
                      className="text-sm text-gray-900 font-medium hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredMobileOffers.slice(0, displayedMobileCount).map((offer) => (
                        <MobileOfferCard
                          key={offer.id}
                          offer={offer}
                          onSelect={handleSelectOffer}
                        />
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    <LoadMoreButton
                      onClick={() => setDisplayedMobileCount(prev => prev + 12)}
                      loading={false}
                      hasMore={displayedMobileCount < filteredMobileOffers.length}
                      currentCount={Math.min(displayedMobileCount, filteredMobileOffers.length)}
                      totalCount={filteredMobileOffers.length}
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Box Offers Tab - Version simplifiée */}
          <TabsContent value="box" className="mt-0">
            <div className="space-y-6">
              {boxOffers.loading ? (
                <OffersGridSkeleton count={6} />
              ) : boxOffers.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700">{boxOffers.error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boxOffers.data?.commercial.offres.slice(0, displayedBoxCount).map((offer) => (
                    <BoxOfferCard
                      key={offer.id}
                      offer={offer}
                      onSelect={handleSelectOffer}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Drawer mobile pour les filtres */}
      {mobileOffers.data && activeTab === 'mobile' && (
        <>
          <MobileFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            filters={mobileOffers.data.commercial.filtres}
            activeFilters={mobileActiveFilters}
            onFilterChange={handleMobileFilterChange}
            onClearAll={clearAllMobileFilters}
            offersCount={filteredMobileOffers.length}
          />
          
          {/* Bouton flottant mobile */}
          <div className="lg:hidden">
            <FilterFloatingButton
              onClick={() => setIsFilterDrawerOpen(true)}
              activeCount={activeFilterCount}
            />
          </div>
        </>
      )}
    </div>
  );
}