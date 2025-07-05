import type { MobileOffer, MobileApiResponse } from '@/app/types/bemove';

export class MobileService {
  /**
   * Formater le texte de data pour mobile
   */
  static formatDataText(offer: MobileOffer): string {
    if (offer.services.internetIllimite) {
      return 'Internet illimité';
    }
    if (!offer.quotaData) {
      return 'Sans internet';
    }
    if (offer.quotaData >= 1000) {
      return `${offer.quotaData / 1000} To`;
    }
    return `${offer.quotaData} Go`;
  }

  /**
   * Obtenir le badge réseau
   */
  static getNetworkBadge(reseaux: string[]): string {
    const networkMap: Record<string, string> = {
      'Free': 'Réseau Free',
      'Orange': 'Réseau Orange', 
      'SFR': 'Réseau SFR',
      'Bouygues': 'Réseau Bouygues'
    };

    for (const reseau of reseaux) {
      if (networkMap[reseau]) {
        return networkMap[reseau];
      }
    }
    return reseaux[0] || 'Réseau MVNO';
  }

  /**
   * Calculer l'économie potentielle
   */
  static calculateSavings(offer: MobileOffer): number | null {
    if (!offer.promo || offer.promo.type !== 'mensuel') {
      return null;
    }
    
    const savings = (offer.prix - (offer.promo.prix || 0)) * (offer.promo.duree || 0);
    return savings > 0 ? savings : null;
  }

  /**
   * Vérifier si l'offre est premium
   */
  static isPremiumOffer(offer: MobileOffer): boolean {
    return (
      offer.services.compatible5G &&
      offer.services.internetIllimite &&
      offer.prix > 30
    );
  }

  /**
   * Obtenir les points forts de l'offre
   */
  static getOfferHighlights(offer: MobileOffer): string[] {
    const highlights: string[] = [];

    if (offer.services.compatible5G) {
      highlights.push('5G incluse');
    }
    if (offer.dureeEngagement === 0) {
      highlights.push('Sans engagement');
    }
    if (offer.services.internetIllimite) {
      highlights.push('Data illimitée');
    } else if (offer.quotaData && offer.quotaData >= 100) {
      highlights.push(`${offer.quotaData} Go de data`);
    }
    if (offer.isStar) {
      highlights.push('Offre star');
    }
    if (offer.promo) {
      highlights.push('En promotion');
    }

    return highlights;
  }

  /**
   * Trier les offres par popularité
   */
  static sortByPopularity(offers: MobileOffer[]): MobileOffer[] {
    return [...offers].sort((a, b) => {
      // Priorité aux offres star
      if (a.isStar && !b.isStar) return -1;
      if (!a.isStar && b.isStar) return 1;
      
      // Puis par sélection
      if (a.isSelection && !b.isSelection) return -1;
      if (!a.isSelection && b.isSelection) return 1;
      
      // Puis par prix
      return a.prix - b.prix;
    });
  }

  /**
   * Grouper les offres par opérateur
   */
  static groupByOperator(offers: MobileOffer[]): Record<string, MobileOffer[]> {
    return offers.reduce((groups, offer) => {
      const operator = offer.operateur.nom;
      if (!groups[operator]) {
        groups[operator] = [];
      }
      groups[operator].push(offer);
      return groups;
    }, {} as Record<string, MobileOffer[]>);
  }

  /**
   * Obtenir les statistiques des offres
   */
  static getOffersStats(offers: MobileOffer[]) {
    if (offers.length === 0) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        with5G: 0,
        withoutCommitment: 0,
        withUnlimitedData: 0
      };
    }

    const prices = offers.map(o => o.prix);
    return {
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      with5G: offers.filter(o => o.services.compatible5G).length,
      withoutCommitment: offers.filter(o => o.dureeEngagement === 0).length,
      withUnlimitedData: offers.filter(o => o.services.internetIllimite).length
    };
  }
}