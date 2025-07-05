import React from 'react';
import Image from 'next/image';
import { MobileOffer } from '@/app/types/bemove';
import { OffersFormatter } from '@/app/services/offers.service';
import { Smartphone, Wifi, Phone, MessageSquare, Zap, Star, Clock } from 'lucide-react';

interface MobileOfferCardProps {
  offer: MobileOffer;
  onSelect?: (offer: MobileOffer) => void;
}

export function MobileOfferCard({ offer, onSelect }: MobileOfferCardProps) {
  const promoText = OffersFormatter.getPromoText(offer);
  const dataText = OffersFormatter.formatData(offer.quotaData);
  const networkBadge = OffersFormatter.getNetworkBadge(offer.reseaux);

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
          {offer.isStar && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>Star</span>
            </div>
          )}
        </div>

        {/* Nom de l'offre */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {offer.nom}
        </h3>

        {/* Badge réseau */}
        {networkBadge && (
          <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mb-4">
            {networkBadge}
          </span>
        )}

        {/* Services principaux */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Data */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Wifi className={`w-5 h-5 ${offer.services.internetIllimite ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-xs text-gray-600">{dataText}</p>
          </div>

          {/* Appels */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <Phone className={`w-5 h-5 ${offer.services.appelsIllimites ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-xs text-gray-600">
              {offer.services.appelsIllimites ? 'Illimités' : 'Limités'}
            </p>
          </div>

          {/* SMS/MMS */}
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <MessageSquare className={`w-5 h-5 ${offer.services.smsMmsIllimites ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-xs text-gray-600">
              {offer.services.smsMmsIllimites ? 'Illimités' : 'Limités'}
            </p>
          </div>
        </div>

        {/* 5G et engagement */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          {offer.services.compatible5G && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-600" />
              <span>5G incluse</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{offer.dureeEngagement > 0 ? `${offer.dureeEngagement} mois` : 'Sans engagement'}</span>
          </div>
        </div>
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

        {/* Bouton CTA */}
        <button
          onClick={() => onSelect?.(offer)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
        >
          Voir l'offre
        </button>
      </div>
    </div>
  );
}