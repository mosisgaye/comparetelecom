'use client';

import React from 'react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { useBoxPageData } from '@/app/hooks/useBoxPageData';
import { BoxHeroSection } from '@/app/components/box-internet/BoxHeroSection';
import { BoxOffersGrid } from '@/app/components/box-internet/BoxOffersGrid';
import { BoxFilters } from '@/app/components/box-internet/BoxFilters';
import { SearchBar } from '@/app/components/shared/SearchBar';
import { SortDropdown } from '@/app/components/shared/SortDropdown';
import { FilterChipGroup } from '@/app/components/shared/FilterChip';
import { TrendingDown, TrendingUp, Signal } from 'lucide-react';

export default function BoxInternetPage() {
  const {
    // États
    loading,
    error,
    filterLoading,
    filteredOffers,
    displayedCount,
    
    // Données
    data,
    filterChips,
    sortOptions: baseOptions,
    
    // Actions
    refetch,
    handleFilterChange,
    clearAllFilters,
    handleSelectOffer,
    handleLoadMore,
    
    // Filtres et recherche
    activeFilters,
    sortBy,
    setSortBy,
    search,
  } = useBoxPageData();

  // Enrichir les options de tri avec des icônes
  const sortOptions = baseOptions.map(option => ({
    ...option,
    icon: option.value === 'price-asc' ? <TrendingDown className="w-4 h-4" /> :
          option.value === 'price-desc' ? <TrendingUp className="w-4 h-4" /> :
          <Signal className="w-4 h-4" />
  }));

  // Gestion de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center bg-white rounded-xl shadow-lg p-12 max-w-md mx-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalOffers = data?.commercial.offres.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <BoxHeroSection 
        totalOffers={totalOffers}
        filteredCount={filteredOffers.length}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              {data && (
                <BoxFilters
                  filters={data.commercial.filtres}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={clearAllFilters}
                  offersCount={filteredOffers.length}
                />
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre de recherche et tri */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    value={search.searchTerm}
                    onChange={search.setSearchTerm}
                    placeholder="Rechercher une box, un opérateur..."
                    className="w-full"
                  />
                </div>
                <SortDropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Trier par"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

            {/* Filtres actifs */}
            {filterChips.length > 0 && (
              <FilterChipGroup
                filters={filterChips}
                onRemove={(id) => {
                  if (id === 'search') {
                    search.clearSearch();
                  } else {
                    handleFilterChange(id, null);
                  }
                }}
                onClearAll={clearAllFilters}
              />
            )}

            {/* Grille d'offres */}
            <BoxOffersGrid
              offers={filteredOffers}
              displayedCount={displayedCount}
              loading={loading || filterLoading}
              onLoadMore={handleLoadMore}
              onSelectOffer={handleSelectOffer}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}