import type { MobileOffer, MobileFilters } from './bemove';

// Types pour les filtres de la page mobile
export interface MobilePageFilters {
  operateur?: string;
  priceRange?: [number, number];
  minData?: number;
  compatible5G?: boolean;
  sansEngagement?: boolean;
}

// Types pour le tri mobile
export type MobileSortOption = 'price-asc' | 'price-desc' | 'data-desc';

// Interface pour les options de tri avec métadonnées
export interface MobileSortConfig {
  value: MobileSortOption;
  label: string;
  icon?: React.ReactNode;
}

// État de la page mobile
export interface MobilePageState {
  loading: boolean;
  error: string | null;
  filterLoading: boolean;
  filteredOffers: MobileOffer[];
  displayedCount: number;
  activeFilters: MobilePageFilters;
  sortBy: MobileSortOption | '';
  searchTerm: string;
}

// Props des composants mobile
export interface MobileHeroProps {
  totalOffers: number;
  filteredCount: number;
}

export interface MobileFiltersProps {
  filters: MobileFilters;
  activeFilters: MobilePageFilters;
  onFilterChange: (filterType: string, value: any) => void;
  onClearAll: () => void;
  offersCount: number;
}

export interface MobileOffersGridProps {
  offers: MobileOffer[];
  displayedCount: number;
  loading: boolean;
  onLoadMore: () => void;
  onSelectOffer: (offer: MobileOffer) => void;
}

// Types pour les statistiques mobile
export interface MobileStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  with5G: number;
  withoutCommitment: number;
  withUnlimitedData: number;
}

// Configuration des filtres de data
export interface DataFilterOption {
  value: number;
  label: string;
  description?: string;
}

export const DATA_FILTER_OPTIONS: DataFilterOption[] = [
  { value: 10, label: '10 Go et plus', description: 'Pour une utilisation modérée' },
  { value: 50, label: '50 Go et plus', description: 'Pour une utilisation régulière' },
  { value: 100, label: '100 Go et plus', description: 'Pour une utilisation intensive' },
  { value: 200, label: '200 Go et plus', description: 'Pour les gros consommateurs' },
  { value: -1, label: 'Internet illimité', description: 'Sans limite de data' }
];

// Types pour les highlights d'offre
export interface OfferHighlight {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

// Enum pour les réseaux
export enum MobileNetwork {
  ORANGE = 'Orange',
  SFR = 'SFR',
  BOUYGUES = 'Bouygues',
  FREE = 'Free'
}

// Type pour les badges promo
export interface PromoBadge {
  text: string;
  color: string;
  type: 'mensuel' | 'permanente' | 'lancement';
}