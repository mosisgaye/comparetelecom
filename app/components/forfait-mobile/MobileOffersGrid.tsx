import React from 'react';
import { MobileOfferCard } from './MobileOfferCard';
import { OffersGridSkeleton } from '@/app/components/shared/OfferSkeleton';
import { LoadMoreButton } from '@/app/components/shared/LoadMoreButton';
import { Smartphone } from 'lucide-react';
import type { MobileOffer } from '@/app/types/bemove';

interface MobileOffersGridProps {
  offers: MobileOffer[];
  displayedCount: number;
  loading: boolean;
  onLoadMore: () => void;
  onSelectOffer: (offer: MobileOffer) => void;
}

export function MobileOffersGrid({
  offers,
  displayedCount,
  loading,
  onLoadMore,
  onSelectOffer
}: MobileOffersGridProps) {
  if (loading) {
    return <OffersGridSkeleton count={6} />;
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune offre trouvée
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Modifiez vos critères de recherche pour découvrir plus d'offres mobiles
        </p>
      </div>
    );
  }

  const displayedOffers = offers.slice(0, displayedCount);
  const hasMore = displayedCount < offers.length;

  return (
    <div className="space-y-8">
      {/* Grille d'offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedOffers.map((offer) => (
          <MobileOfferCard
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