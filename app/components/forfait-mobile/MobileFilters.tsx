import React, { useState } from 'react';
import { Filter, X, ChevronRight } from 'lucide-react';
import { FilterOption, PriceRange, FilterChipGroup } from '@/app/components/shared/FilterChip';
import type { MobileFilters as MobileFiltersType } from '@/app/types/bemove';

interface MobileFiltersProps {
  filters: MobileFiltersType;
  activeFilters: Record<string, any>;
  onFilterChange: (filterType: string, value: any) => void;
  onClearAll: () => void;
  offersCount: number;
}

export function MobileFilters({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  offersCount
}: MobileFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    operateurs: true,
    prix: false,
    data: false,
    services: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Convertir les filtres actifs en tableau pour FilterChipGroup
  const activeFilterChips = Object.entries(activeFilters).map(([key, value]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: typeof value === 'object' ? `${value[0]}€ - ${value[1]}€` : String(value)
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          <span className="text-sm text-gray-500">{offersCount} offres</span>
        </div>
      </div>

      {/* Filtres actifs */}
      {activeFilterChips.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <FilterChipGroup
            filters={activeFilterChips}
            onRemove={(id) => onFilterChange(id, null)}
            onClearAll={onClearAll}
          />
        </div>
      )}

      {/* Sections de filtres */}
      <div className="divide-y divide-gray-100">
        {/* Opérateurs */}
        <div>
          <button
            onClick={() => toggleSection('operateurs')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Opérateurs</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.operateurs ? 'rotate-90' : ''
            }`} />
          </button>
          
          {expandedSections.operateurs && (
            <div className="p-4 pt-0 space-y-2">
              {filters.operateurs.map((operateur) => (
                <FilterOption
                  key={operateur.id}
                  id={`op-${operateur.id}`}
                  label={operateur.nom}
                  checked={activeFilters.operateur === operateur.slug}
                  onChange={(checked) => 
                    onFilterChange('operateur', checked ? operateur.slug : null)
                  }
                  disabled={!operateur.active}
                />
              ))}
            </div>
          )}
        </div>

        {/* Prix */}
        <div>
          <button
            onClick={() => toggleSection('prix')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Prix mensuel</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.prix ? 'rotate-90' : ''
            }`} />
          </button>
          
          {expandedSections.prix && (
            <div className="p-4 pt-0">
              <PriceRange
                min={0}
                max={100}
                value={activeFilters.priceRange || [0, 100]}
                onChange={(value) => onFilterChange('priceRange', value)}
              />
            </div>
          )}
        </div>

        {/* Data */}
        <div>
          <button
            onClick={() => toggleSection('data')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Internet mobile</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.data ? 'rotate-90' : ''
            }`} />
          </button>
          
          {expandedSections.data && (
            <div className="p-4 pt-0 space-y-2">
              {[
                { value: 10, label: '10 Go et plus' },
                { value: 50, label: '50 Go et plus' },
                { value: 100, label: '100 Go et plus' },
                { value: 200, label: '200 Go et plus' },
                { value: -1, label: 'Internet illimité' }
              ].map((option) => (
                <FilterOption
                  key={option.value}
                  id={`data-${option.value}`}
                  label={option.label}
                  checked={activeFilters.minData === option.value}
                  onChange={(checked) => 
                    onFilterChange('minData', checked ? option.value : null)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <button
            onClick={() => toggleSection('services')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Services inclus</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.services ? 'rotate-90' : ''
            }`} />
          </button>
          
          {expandedSections.services && (
            <div className="p-4 pt-0 space-y-2">
              <FilterOption
                id="5g"
                label="Compatible 5G"
                checked={activeFilters.compatible5G || false}
                onChange={(checked) => onFilterChange('compatible5G', checked)}
                disabled={!filters.services.compatible5G?.active}
              />
              <FilterOption
                id="engagement"
                label="Sans engagement"
                checked={activeFilters.sansEngagement || false}
                onChange={(checked) => onFilterChange('sansEngagement', checked)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Drawer mobile pour les filtres
interface MobileFilterDrawerProps extends MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  ...filterProps
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu des filtres */}
        <div className="p-4">
          <MobileFilters {...filterProps} />
        </div>

        {/* Footer avec bouton appliquer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Voir {filterProps.offersCount} offres
          </button>
        </div>
      </div>
    </>
  );
}

// Bouton flottant pour ouvrir les filtres sur mobile
export function FilterFloatingButton({ onClick, activeCount }: { onClick: () => void; activeCount: number }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors p-4 flex items-center gap-2 z-30"
    >
      <Filter className="w-5 h-5" />
      <span className="font-medium">Filtres</span>
      {activeCount > 0 && (
        <span className="bg-white text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}