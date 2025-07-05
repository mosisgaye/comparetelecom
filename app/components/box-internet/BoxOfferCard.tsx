import React from 'react';
import Image from 'next/image';
import { BoxOffer } from '@/app/types/bemove';
import { OffersFormatter } from '@/app/services/offers.service';
import { Wifi, Tv, Phone, Smartphone, Star, Clock, Zap } from 'lucide-react';

interface BoxOfferCardProps {
  offer: BoxOffer;
  onSelect?: (offer: BoxOffer) => void;
}

export function BoxOfferCard({ offer, onSelect }: BoxOfferCardProps) {
  const promoText = OffersFormatter.getPromoText(offer);
  const speedText = OffersFormatter.formatSpeed(offer.vitesse || offer.vitesseFormatee);
  const technoBadge = OffersFormatter.getTechnoBadge(offer.typeTechno);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* En-tête avec opérateur */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="relative w-24 h-12">
            <Image
              src={offer.operateur.logo}
              alt={offer.operateur.nom}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            {offer.isStar && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>Star</span>
              </div>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${technoBadge.color}`}>
              {technoBadge.label}
            </span>
          </div>
        </div>

        {/* Nom de l'offre */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {offer.nom}
        </h3>

        {/* Débit */}
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Jusqu'à {speedText}
          </span>
        </div>

        {/* Services inclus */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Internet */}
          <div className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              'bg-green-100'
            }`}>
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mt-1">Internet</p>
          </div>

          {/* TV */}
          <div className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              offer.services.tv ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Tv className={`w-5 h-5 ${
                offer.services.tv ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <p className="text-xs text-gray-600 mt-1">TV</p>
          </div>

          {/* Téléphone */}
          <div className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              offer.services.telephone ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Phone className={`w-5 h-5 ${
                offer.services.telephone ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <p className="text-xs text-gray-600 mt-1">Fixe</p>
          </div>

          {/* Mobile inclus */}
          <div className="text-center">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              offer.services.forfaitMobileInclus ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Smartphone className={`w-5 h-5 ${
                offer.services.forfaitMobileInclus ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <p className="text-xs text-gray-600 mt-1">Mobile</p>
          </div>
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{offer.dureeEngagement > 0 ? `Engagement ${offer.dureeEngagement} mois` : 'Sans engagement'}</span>
        </div>

        {/* Description courte si disponible */}
        {offer.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
            {offer.description}
          </p>
        )}
      </div>

      {/* Prix et CTA */}
      <div className="bg-gray-50 p-6 pt-4">
        {/* Prix avec promo */}
        <div className="mb-4">
          {promoText && (
            <div className="text-sm text-green-600 font-medium mb-1">
              {promoText}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {OffersFormatter.formatPrice(offer.promo?.prix || offer.prix)}
            </span>
            <span className="text-gray-500">/mois</span>
          </div>
          {offer.promo && (
            <div className="text-sm text-gray-500 line-through">
              puis {OffersFormatter.formatPrice(offer.prix)}/mois
            </div>
          )}
        </div>

        {/* Frais de résiliation si applicable */}
        {offer.fraisResiliation && offer.fraisResiliation > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            Frais de résiliation : {OffersFormatter.formatPrice(offer.fraisResiliation)}
          </div>
        )}

        {/* Bouton CTA */}
        <button
          onClick={() => onSelect?.(offer)}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
        >
          Voir l'offre
        </button>
      </div>
    </div>
  );
}