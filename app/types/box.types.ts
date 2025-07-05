import type { BoxOffer, BoxFilters } from './bemove';

// Types pour les filtres de la page box
export interface BoxPageFilters {
  operateur?: string;
  priceRange?: [number, number];
  typeTechno?: string;
  tv?: boolean;
  telephone?: boolean;
  vitesseMin?: number;
}

// Types pour le tri box
export type BoxSortOption = 'price-asc' | 'price-desc' | 'vitesse-desc';

// Interface pour les options de tri avec métadonnées
export interface BoxSortConfig {
  value: BoxSortOption;
  label: string;
  icon?: React.ReactNode;
}

// État de la page box
export interface BoxPageState {
  loading: boolean;
  error: string | null;
  filterLoading: boolean;
  filteredOffers: BoxOffer[];
  displayedCount: number;
  activeFilters: BoxPageFilters;
  sortBy: BoxSortOption | '';
  searchTerm: string;
}

// Props des composants box
export interface BoxHeroProps {
  totalOffers: number;
  filteredCount: number;
}

export interface BoxFiltersProps {
  filters: BoxFilters;
  activeFilters: BoxPageFilters;
  onFilterChange: (filterType: string, value: any) => void;
  onClearAll: () => void;
  offersCount: number;
}

export interface BoxOffersGridProps {
  offers: BoxOffer[];
  displayedCount: number;
  loading: boolean;
  onLoadMore: () => void;
  onSelectOffer: (offer: BoxOffer) => void;
}

// Types pour les statistiques box
export interface BoxStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  withFiber: number;
  withTV: number;
  withoutCommitment: number;
  avgSpeed?: number;
}

// Configuration des technologies
export interface TechnoConfig {
  value: string;
  label: string;
  color: string;
  priority: number;
  description: string;
}

export const TECHNO_CONFIGS: Record<string, TechnoConfig> = {
  'fibre': {
    value: 'fibre',
    label: 'Fibre optique',
    color: 'text-green-700 bg-green-50 border-green-200',
    priority: 1,
    description: 'Jusqu\'à 8 Gb/s'
  },
  'cable': {
    value: 'cable',
    label: 'Câble',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
    priority: 2,
    description: 'Jusqu\'à 1 Gb/s'
  },
  'ADSL': {
    value: 'ADSL',
    label: 'ADSL/VDSL',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    priority: 3,
    description: 'Jusqu\'à 100 Mb/s'
  },
  'satellite': {
    value: 'satellite',
    label: 'Satellite',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    priority: 4,
    description: 'Partout en France'
  },
  '4gbox': {
    value: '4gbox',
    label: '4G Box',
    color: 'text-pink-700 bg-pink-50 border-pink-200',
    priority: 5,
    description: 'Internet mobile fixe'
  }
};

// Types pour les services inclus
export interface ServiceIcon {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  included: boolean;
}

// Configuration des débits
export interface SpeedTier {
  min: number;
  max: number;
  label: string;
  color: string;
}

export const SPEED_TIERS: SpeedTier[] = [
  { min: 0, max: 100, label: 'Haut débit', color: 'text-blue-600' },
  { min: 100, max: 1000, label: 'Très haut débit', color: 'text-green-600' },
  { min: 1000, max: Infinity, label: 'Ultra haut débit', color: 'text-purple-600' }
];

// Type pour la valeur d'une offre
export interface OfferValue {
  score: number;
  label: 'Excellente' | 'Très bonne' | 'Bonne' | 'Correcte';
  color: string;
}