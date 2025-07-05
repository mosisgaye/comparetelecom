import React from 'react';
import Link from 'next/link';
import { Wifi, Tv, Phone, ArrowRight, Check, Zap } from 'lucide-react';

export function BoxSection() {
  const features = [
    "Fibre jusqu'à 8 Gb/s",
    "TV haute définition", 
    "Téléphone fixe illimité",
    "Installation gratuite",
    "WiFi 6 dernière génération"
  ];

  const highlights = [
    { label: "À partir de", value: "15€/mois", color: "text-green-600" },
    { label: "Jusqu'à", value: "8 Gb/s", color: "text-blue-600" },
    { label: "Chaînes TV", value: "200+", color: "text-purple-600" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 gap-6">
                {/* Mock box cards */}
                <div className="bg-white rounded-xl shadow-lg p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-8 bg-blue-600 rounded"></div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Fibre</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Box Fibre 1 Gb/s</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <Tv className="w-4 h-4 text-green-600" />
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">29€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-8 bg-red-600 rounded"></div>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">8 Gb/s</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Box Ultra Fibre</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <Tv className="w-4 h-4 text-green-600" />
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">45€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Wifi className="w-4 h-4" />
              <span>Box Internet</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Internet ultra-rapide
              <span className="block text-green-600">pour toute la famille</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Découvrez les meilleures offres box internet. 
              Fibre optique jusqu'à 8 Gb/s, TV haute définition et téléphone fixe illimité. 
              L'internet parfait pour votre foyer.
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
              href="/box-internet"
              className="group inline-flex items-center gap-3 bg-green-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
            >
              <span>Comparer les box</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}