'use client';

import React from 'react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/home/HeroSection';
import { MobileSection } from '@/app/components/home/MobileSection';
import { BoxSection } from '@/app/components/home/BoxSection';
import { WhyChooseSection } from '@/app/components/home/WhyChooseSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <MobileSection />
        <BoxSection />
        <WhyChooseSection />
      </main>
      
      <Footer />
    </div>
  );
}