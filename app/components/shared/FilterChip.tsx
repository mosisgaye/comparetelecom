import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string | number;
  onRemove: () => void;
  count?: number;
}

export function FilterChip({ label, value, onRemove, count }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
      <span className="text-gray-900">{label}:</span>
      <span className="text-gray-600">{value}</span>
      {count !== undefined && (
        <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">
          {count}
        </span>
      )}
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

interface FilterChipGroupProps {
  filters: Array<{
    id: string;
    label: string;
    value: string | number;
    count?: number;
  }>;
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export function FilterChipGroup({ filters, onRemove, onClearAll }: FilterChipGroupProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-sm font-medium text-gray-700 mr-2">Filtres actifs:</span>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            value={filter.value}
            count={filter.count}
            onRemove={() => onRemove(filter.id)}
          />
        ))}
      </div>
      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="ml-auto text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
}

// Composant pour un groupe de filtres type checkbox
interface FilterOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
  disabled?: boolean;
}

export function FilterOption({ id, label, checked, onChange, count, disabled }: FilterOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        checked 
          ? 'border-gray-900 bg-gray-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
        />
        <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          checked 
            ? 'bg-gray-200 text-gray-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </label>
  );
}

// Composant pour un slider de prix
interface PriceRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  format?: (value: number) => string;
}

export function PriceRange({ min, max, value, onChange, step = 1, format = (v) => `${v}€` }: PriceRangeProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Prix mensuel</span>
        <span className="text-sm text-gray-600">
          {format(value[0])} - {format(value[1])}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([parseInt(e.target.value) || min, value[1]])}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          placeholder="Min"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value) || max])}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          placeholder="Max"
        />
      </div>
    </div>
  );
}