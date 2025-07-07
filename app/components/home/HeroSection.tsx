'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, MessageSquare, Zap, Shield, Star, ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  const stats = [
    { 
      icon: MessageSquare, 
      number: "10M+", 
      label: "Messages traités" 
    },
    { 
      icon: Zap, 
      number: "99.9%", 
      label: "Temps de disponibilité" 
    },
    { 
      icon: Shield, 
      number: "500+", 
      label: "Entreprises clientes" 
    },
    { 
      icon: Star, 
      number: "4.9/5", 
      label: "Satisfaction client" 
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-6 py-3 text-sm font-semibold mb-8">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Propulsé par GPT-4 Turbo & Claude AI</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 tracking-tight">
            Support Client
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Révolutionnaire
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal mt-4 text-gray-300">
              avec l'Intelligence Artificielle
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transformez votre support client avec notre plateforme SaaS innovante. 
            Chat IA intelligent, automatisation avancée et insights en temps réel 
            pour une expérience client exceptionnelle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-200">
              <Play className="w-5 h-5" />
              <span>Voir la démo</span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mb-16">
            <p className="text-gray-400 text-sm mb-6">Ils nous font confiance</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {/* Mock company logos */}
              <div className="w-24 h-8 bg-white/20 rounded"></div>
              <div className="w-24 h-8 bg-white/20 rounded"></div>
              <div className="w-24 h-8 bg-white/20 rounded"></div>
              <div className="w-24 h-8 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}