import React from 'react';
import { Smartphone, Zap, Shield, Star } from 'lucide-react';

interface MobileHeroSectionProps {
  totalOffers: number;
  filteredCount: number;
}

export function MobileHeroSection({ totalOffers, filteredCount }: MobileHeroSectionProps) {
  const stats = [
    { 
      icon: Zap, 
      number: `${filteredCount}+`, 
      label: "Offres disponibles" 
    },
    { 
      icon: Shield, 
      number: "100%", 
      label: "Gratuit et fiable" 
    },
    { 
      icon: Star, 
      number: "4.9/5", 
      label: "Note moyenne" 
    }
  ];

  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Container principal avec bordure subtile */}
        <div className="text-center">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white text-gray-900 rounded-full px-5 py-2 text-sm font-semibold mb-8 shadow-lg">
            <Smartphone className="w-4 h-4" />
            <span>{totalOffers}+ offres comparées en temps réel</span>
          </div>

          {/* Titre avec typographie premium */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Forfaits mobiles
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal mt-2 text-gray-300">
              Les meilleures offres du marché
            </span>
          </h1>
          
          {/* Description élégante */}
          <p className="text-lg sm:text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            Comparez instantanément tous les forfaits mobiles. 
            5G ultra-rapide, data illimitée, sans engagement.
          </p>

          {/* Stats avec design carte premium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white text-gray-900 rounded-xl p-8 shadow-xl"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-gray-900" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}