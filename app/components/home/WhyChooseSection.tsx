import React from 'react';
import { Shield, Zap, Users, Award, TrendingDown, Clock } from 'lucide-react';

export function WhyChooseSection() {
  const benefits = [
    {
      icon: Shield,
      title: "100% Gratuit et Fiable",
      description: "Comparaison gratuite et transparente de toutes les offres du marché",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Zap,
      title: "Mise à jour en temps réel",
      description: "Toutes les offres et promotions actualisées quotidiennement",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: TrendingDown,
      title: "Économies garanties",
      description: "Jusqu'à 300€ d'économies par an sur vos factures telecom",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Users,
      title: "Conseils d'experts",
      description: "Recommandations personnalisées selon vos besoins",
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: Award,
      title: "Comparateur n°1",
      description: "Reconnu comme le meilleur comparateur telecom en France",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Trouvez votre offre idéale en moins de 5 minutes",
      color: "text-indigo-600 bg-indigo-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir
            <span className="block text-blue-600">CompareTelecom ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La plateforme de référence pour comparer et choisir vos offres telecom en toute confiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}