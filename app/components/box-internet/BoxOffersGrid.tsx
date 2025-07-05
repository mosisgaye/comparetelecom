import React from 'react';
import { BoxOfferCard } from './BoxOfferCard';
import { OffersGridSkeleton } from '@/app/components/shared/OfferSkeleton';
import { LoadMoreButton } from '@/app/components/shared/LoadMoreButton';
import { Wifi } from 'lucide-react';
import type { BoxOffer } from '@/app/types/bemove';

interface BoxOffersGridProps {
  offers: BoxOffer[];
  displayedCount: number;
  loading: boolean;
  onLoadMore: () => void;
  onSelectOffer: (offer: BoxOffer) => void;
}

export function BoxOffersGrid({
  offers,
  displayedCount,
  loading,
  onLoadMore,
  onSelectOffer
}: BoxOffersGridProps) {
  if (loading) {
    return <OffersGridSkeleton count={6} />;
  }

  if (offers.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
          <Wifi className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune offre trouvée
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Modifiez vos critères de recherche pour découvrir plus d'offres internet
        </p>
      </div>
    );
  }

  const displayedOffers = offers.slice(0, displayedCount);
  const hasMore = displayedCount < offers.length;

  return (
    <div className="space-y-8">
      {/* Info bar */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {offers.length} offre{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}
        </span>
        <span className="text-sm font-medium text-gray-900">
          Affichage : {displayedOffers.length} sur {offers.length}
        </span>
      </div>

      {/* Grille d'offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedOffers.map((offer) => (
          <BoxOfferCard
            key={offer.id}
            offer={offer}
            onSelect={onSelectOffer}
          />
        ))}
      </div>

      {/* Pagination */}
      {offers.length > 0 && (
        <LoadMoreButton
          onClick={onLoadMore}
          loading={false}
          hasMore={hasMore}
          currentCount={displayedOffers.length}
          totalCount={offers.length}
        />
      )}
    </div>
  );
}