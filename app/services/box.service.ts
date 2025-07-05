import type { BoxOffer } from '@/app/types/bemove';

export class BoxService {
  /**
   * Formater la vitesse de connexion
   */
  static formatSpeed(offer: BoxOffer): string {
    const speed = offer.vitesse || offer.vitesseFormatee;
    
    if (!speed) return 'Débit non spécifié';
    
    if (typeof speed === 'string') {
      return speed;
    }
    
    if (speed >= 1000) {
      return `${speed / 1000} Gb/s`;
    }
    return `${speed} Mb/s`;
  }

  /**
   * Obtenir le badge technologie avec couleur
   */
  static getTechnoBadge(typeTechno: string): {
    label: string;
    color: string;
    priority: number;
  } {
    const technoMap: Record<string, { label: string; color: string; priority: number }> = {
      'fibre': { 
        label: 'Fibre', 
        color: 'text-green-700 bg-green-50 border-green-200',
        priority: 1
      },
      'ADSL': { 
        label: 'ADSL', 
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        priority: 3
      },
      'satellite': { 
        label: 'Satellite', 
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        priority: 4
      },
      'cable': { 
        label: 'Câble', 
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        priority: 2
      },
      '4gbox': { 
        label: '4G Box', 
        color: 'text-pink-700 bg-pink-50 border-pink-200',
        priority: 5
      }
    };

    return technoMap[typeTechno] || { 
      label: typeTechno, 
      color: 'text-gray-700 bg-gray-50 border-gray-200',
      priority: 99
    };
  }

  /**
   * Compter les services inclus
   */
  static countIncludedServices(offer: BoxOffer): number {
    let count = 1; // Internet toujours inclus
    
    if (offer.services.tv) count++;
    if (offer.services.telephone) count++;
    if (offer.services.forfaitMobileInclus) count++;
    
    return count;
  }

  /**
   * Obtenir la description des services
   */
  static getServicesDescription(offer: BoxOffer): string {
    const services: string[] = ['Internet'];
    
    if (offer.services.tv) {
      services.push('TV');
    }
    if (offer.services.telephone) {
      services.push('Téléphone');
    }
    if (offer.services.forfaitMobileInclus) {
      services.push('Mobile');
    }
    
    if (services.length === 1) {
      return 'Internet seul';
    }
    
    return services.join(' + ');
  }

  /**
   * Vérifier si c'est une offre complète
   */
  static isCompleteOffer(offer: BoxOffer): boolean {
    return offer.services.tv === true && 
           offer.services.telephone === true;
  }

  /**
   * Calculer le score de valeur
   */
  static calculateValueScore(offer: BoxOffer): number {
    let score = 0;
    const price = typeof offer.prix === 'string' ? parseFloat(offer.prix) : offer.prix;
    
    // Score basé sur le débit/prix
    if (offer.vitesse) {
      score += (offer.vitesse / price) * 10;
    }
    
    // Bonus pour les services
    if (offer.services.tv) score += 20;
    if (offer.services.telephone) score += 10;
    if (offer.services.forfaitMobileInclus) score += 30;
    
    // Bonus pour la fibre
    if (offer.typeTechno === 'fibre') score += 50;
    
    // Pénalité pour l'engagement
    if (offer.dureeEngagement > 0) {
      score -= offer.dureeEngagement * 2;
    }
    
    return Math.round(score);
  }

  /**
   * Obtenir les points forts
   */
  static getOfferHighlights(offer: BoxOffer): string[] {
    const highlights: string[] = [];
    
    const techno = this.getTechnoBadge(offer.typeTechno);
    highlights.push(techno.label);
    
    if (offer.vitesse && offer.vitesse >= 1000) {
      highlights.push('Très haut débit');
    }
    
    if (offer.services.tv) {
      highlights.push('TV incluse');
    }
    
    if (offer.dureeEngagement === 0) {
      highlights.push('Sans engagement');
    }
    
    if (offer.services.forfaitMobileInclus) {
      highlights.push('Mobile inclus');
    }
    
    if (offer.isStar) {
      highlights.push('Offre star');
    }
    
    return highlights;
  }

  /**
   * Trier par technologie
   */
  static sortByTechnology(offers: BoxOffer[]): BoxOffer[] {
    return [...offers].sort((a, b) => {
      const technoA = this.getTechnoBadge(a.typeTechno);
      const technoB = this.getTechnoBadge(b.typeTechno);
      
      return technoA.priority - technoB.priority;
    });
  }

  /**
   * Obtenir les statistiques
   */
  static getOffersStats(offers: BoxOffer[]) {
    if (offers.length === 0) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        withFiber: 0,
        withTV: 0,
        withoutCommitment: 0
      };
    }

    const prices = offers.map(o => {
      const price = typeof o.prix === 'string' ? parseFloat(o.prix) : o.prix;
      return price;
    });

    return {
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      withFiber: offers.filter(o => o.typeTechno === 'fibre').length,
      withTV: offers.filter(o => o.services.tv).length,
      withoutCommitment: offers.filter(o => o.dureeEngagement === 0).length
    };
  }
}