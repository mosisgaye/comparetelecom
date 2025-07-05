import React from 'react';

export function OfferSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* En-tête */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="w-24 h-12 bg-gray-200 rounded" />
          <div className="w-16 h-6 bg-gray-200 rounded-full" />
        </div>

        {/* Titre */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

        {/* Services */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-1" />
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-1" />
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-1" />
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
          </div>
        </div>

        {/* Info supplémentaire */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Prix et CTA */}
      <div className="bg-gray-50 p-6 pt-4">
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-12 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export function OffersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <OfferSkeleton key={index} />
      ))}
    </div>
  );
}