import React from 'react';
import Link from 'next/link';
import { Smartphone, Wifi, TrendingDown, Shield, Star, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const stats = [
    { 
      icon: Smartphone, 
      number: "500+", 
      label: "Forfaits mobiles" 
    },
    { 
      icon: Wifi, 
      number: "200+", 
      label: "Offres box internet" 
    },
    { 
      icon: TrendingDown, 
      number: "300€", 
      label: "Économies moyennes/an" 
    },
    { 
      icon: Shield, 
      number: "100%", 
      label: "Gratuit et fiable" 
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-6 py-3 text-sm font-semibold mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Comparateur n°1 en France</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 tracking-tight">
            Trouvez la meilleure
            <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              offre telecom
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Comparez gratuitement tous les forfaits mobiles et box internet. 
            Trouvez l'offre parfaite en quelques clics et économisez jusqu'à 300€ par an.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/forfait-mobile"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <Smartphone className="w-5 h-5" />
              <span>Forfaits Mobile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/box-internet"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <Wifi className="w-5 h-5" />
              <span>Box Internet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
  );
}