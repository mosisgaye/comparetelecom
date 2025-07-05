import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { FilterOption, PriceRange, FilterChipGroup } from '@/app/components/shared/FilterChip';
import type { BoxFilters as BoxFiltersType } from '@/app/types/bemove';

interface BoxFiltersProps {
  filters: BoxFiltersType;
  activeFilters: Record<string, any>;
  onFilterChange: (filterType: string, value: any) => void;
  onClearAll: () => void;
  offersCount: number;
}

export function BoxFilters({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  offersCount
}: BoxFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    operateurs: true,
    prix: false,
    techno: false,
    services: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFilterChips = Object.entries(activeFilters).map(([key, value]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: typeof value === 'object' ? `${value[0]}€ - ${value[1]}€` : String(value)
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          <span className="text-sm text-gray-500">{offersCount} offres</span>
        </div>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <FilterChipGroup
            filters={activeFilterChips}
            onRemove={(id) => onFilterChange(id, null)}
            onClearAll={onClearAll}
          />
        </div>
      )}

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
                  checked={activeFilters.operateur === operateur.nom}
                  onChange={(checked) => 
                    onFilterChange('operateur', checked ? operateur.nom : null)
                  }
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
                max={200}
                value={activeFilters.priceRange || [0, 200]}
                onChange={(value) => onFilterChange('priceRange', value)}
              />
            </div>
          )}
        </div>

        {/* Technologies */}
        <div>
          <button
            onClick={() => toggleSection('techno')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Technologie</span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSections.techno ? 'rotate-90' : ''
            }`} />
          </button>
          
          {expandedSections.techno && (
            <div className="p-4 pt-0 space-y-2">
              {Object.entries(filters.typeTechnos).map(([key, value]) => {
                if (value) {
                  const label = key === '4gbox' ? '4G Box' : key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <FilterOption
                      key={key}
                      id={`tech-${key}`}
                      label={label}
                      checked={activeFilters.typeTechno === key}
                      onChange={(checked) => 
                        onFilterChange('typeTechno', checked ? key : null)
                      }
                    />
                  );
                }
                return null;
              })}
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
                id="tv"
                label="TV incluse"
                checked={activeFilters.tv || false}
                onChange={(checked) => onFilterChange('tv', checked)}
              />
              <FilterOption
                id="telephone"
                label="Téléphone fixe"
                checked={activeFilters.telephone || false}
                onChange={(checked) => onFilterChange('telephone', checked)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}