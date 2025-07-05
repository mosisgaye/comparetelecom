import React from 'react';
import Link from 'next/link';
import { Smartphone, Zap, Shield, ArrowRight, Check } from 'lucide-react';

export function MobileSection() {
  const features = [
    "5G ultra-rapide incluse",
    "Data illimitée disponible", 
    "Sans engagement possible",
    "Appels/SMS illimités",
    "Roaming Europe inclus"
  ];

  const highlights = [
    { label: "À partir de", value: "2€/mois", color: "text-blue-600" },
    { label: "Jusqu'à", value: "200 Go", color: "text-green-600" },
    { label: "Opérateurs", value: "Tous", color: "text-purple-600" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Smartphone className="w-4 h-4" />
              <span>Forfaits Mobile</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Le forfait mobile
              <span className="block text-blue-600">parfait pour vous</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Comparez instantanément tous les forfaits mobiles du marché. 
              5G ultra-rapide, data illimitée, sans engagement. 
              Trouvez l'offre qui correspond exactement à vos besoins.
            </p>

            {/* Features list */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/forfait-mobile"
              className="group inline-flex items-center gap-3 bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <span>Comparer les forfaits</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 gap-6">
                {/* Mock offer cards */}
                <div className="bg-white rounded-xl shadow-lg p-6 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-8 bg-red-600 rounded"></div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">5G</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Forfait 100 Go</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">15€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-8 bg-orange-500 rounded"></div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Illimité</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Forfait Illimité</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">25€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}