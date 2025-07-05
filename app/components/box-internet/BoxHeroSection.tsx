import React from 'react';
import { Wifi, Home, Tv, Phone } from 'lucide-react';

interface BoxHeroSectionProps {
  totalOffers: number;
  filteredCount: number;
}

export function BoxHeroSection({ totalOffers, filteredCount }: BoxHeroSectionProps) {
  const stats = [
    { 
      icon: Home, 
      number: `${filteredCount}+`, 
      label: "Offres disponibles" 
    },
    { 
      icon: Tv, 
      number: "200+", 
      label: "Chaînes TV incluses" 
    },
    { 
      icon: Phone, 
      number: "110", 
      label: "Pays en illimité" 
    }
  ];

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Container avec design épuré */}
        <div className="text-center">
          {/* Badge distinctif */}
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-5 py-2 text-sm font-semibold mb-8 shadow-lg">
            <Wifi className="w-4 h-4" />
            <span>Fibre jusqu'à 8 Gb/s disponible</span>
          </div>

          {/* Titre avec hiérarchie claire */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Box Internet
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal mt-2 text-gray-600">
              Fibre, ADSL et 4G Box
            </span>
          </h1>
          
          {/* Description professionnelle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            La box internet idéale pour votre foyer. 
            Internet très haut débit, TV haute définition et téléphone fixe illimité.
          </p>

          {/* Stats avec design minimaliste */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 border border-gray-200"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <stat.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Ligne de séparation élégante */}
          <div className="mt-16 flex items-center justify-center">
            <div className="h-px bg-gray-200 w-24"></div>
            <div className="mx-4 text-gray-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="h-px bg-gray-200 w-24"></div>
          </div>
        </div>
      </div>
    </section>
  );
}