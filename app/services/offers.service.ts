import type { 
    MobileApiResponse, 
    BoxApiResponse, 
    MobileFilterRequest, 
    BoxFilterRequest,
    PaginatedResponse,
    MobileOffer,
    BoxOffer
  } from '@/app/types/bemove';
  
  /**
   * Service pour gérer les appels API des offres
   */
  export class OffersService {
    private static async handleResponse<T>(response: Response): Promise<T> {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    }
  
    /**
     * Récupérer toutes les offres mobiles
     */
    static async getMobileOffers(): Promise<MobileApiResponse> {
      const response = await fetch('/api/offers/mobile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 300 // Cache pour 5 minutes
        }
      });
      
      return this.handleResponse<MobileApiResponse>(response);
    }
  
    /**
     * Récupérer les offres mobiles avec filtres et pagination
     */
    static async getMobileOffersWithFilters(
      params: MobileFilterRequest
    ): Promise<MobileApiResponse> {
      const response = await fetch('/api/offers/mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      
      return this.handleResponse<MobileApiResponse>(response);
    }
  
    /**
     * Récupérer toutes les offres box
     */
    static async getBoxOffers(): Promise<BoxApiResponse> {
      const response = await fetch('/api/offers/box', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 300 // Cache pour 5 minutes
        }
      });
      
      return this.handleResponse<BoxApiResponse>(response);
    }
  
    /**
     * Récupérer les offres box avec filtres et pagination
     */
    static async getBoxOffersWithFilters(
      params: BoxFilterRequest
    ): Promise<BoxApiResponse> {
      const response = await fetch('/api/offers/box', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      
      return this.handleResponse<BoxApiResponse>(response);
    }
  }
  
  /**
   * Fonctions utilitaires pour le formatage des données
   */
  export class OffersFormatter {
    /**
     * Formater le prix d'une offre
     */
    static formatPrice(price: number | string): string {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(numPrice);
    }
  
    /**
     * Formater la data mobile
     */
    static formatData(quotaData?: number): string {
      if (!quotaData) return 'Illimité';
      if (quotaData >= 1000) {
        return `${quotaData / 1000} To`;
      }
      return `${quotaData} Go`;
    }
  
    /**
     * Formater le débit box
     */
    static formatSpeed(vitesse?: number | string): string {
      if (!vitesse) return 'Non spécifié';
      const speed = typeof vitesse === 'string' ? parseInt(vitesse) : vitesse;
      if (speed >= 1000) {
        return `${speed / 1000} Gb/s`;
      }
      return `${speed} Mb/s`;
    }
  
    /**
     * Obtenir le texte de la promo
     */
    static getPromoText(offer: MobileOffer | BoxOffer): string | null {
      if (!offer.promo) return null;
  
      switch (offer.promo.type) {
        case 'mensuel':
          return `${this.formatPrice(offer.promo.prix!)} pendant ${offer.promo.duree} mois`;
        case 'permanente':
          return `${this.formatPrice(offer.promo.prix!)} à vie`;
        case 'lancement':
          return `${offer.promo.nbMoisOfferts} mois offerts`;
        default:
          return null;
      }
    }
  
    /**
     * Obtenir le badge de réseau pour mobile
     */
    static getNetworkBadge(reseaux: string[]): string {
      if (reseaux.includes('Free')) return 'Réseau Free';
      if (reseaux.includes('Orange')) return 'Réseau Orange';
      if (reseaux.includes('SFR')) return 'Réseau SFR';
      if (reseaux.includes('Bouygues')) return 'Réseau Bouygues';
      return reseaux[0] || '';
    }
  
    /**
     * Obtenir le badge de technologie pour box
     */
    static getTechnoBadge(typeTechno: string): {
      label: string;
      color: string;
    } {
      const technoMap: Record<string, { label: string; color: string }> = {
        'fibre': { label: 'Fibre', color: 'bg-green-100 text-green-800' },
        'ADSL': { label: 'ADSL', color: 'bg-blue-100 text-blue-800' },
        'satellite': { label: 'Satellite', color: 'bg-purple-100 text-purple-800' },
        'cable': { label: 'Câble', color: 'bg-orange-100 text-orange-800' },
        '4gbox': { label: '4G Box', color: 'bg-pink-100 text-pink-800' }
      };
  
      return technoMap[typeTechno] || { label: typeTechno, color: 'bg-gray-100 text-gray-800' };
    }
  }
  
  /**
   * Fonctions de tri et filtrage
   */
  export class OffersFilter {
    /**
     * Trier les offres mobiles
     */
    static sortMobileOffers(
      offers: MobileOffer[], 
      sort: MobileFilterRequest['sort']
    ): MobileOffer[] {
      const sorted = [...offers];
      
      switch (sort) {
        case 'price-asc':
          return sorted.sort((a, b) => a.prix - b.prix);
        case 'price-desc':
          return sorted.sort((a, b) => b.prix - a.prix);
        case 'data-desc':
          return sorted.sort((a, b) => (b.quotaData || 0) - (a.quotaData || 0));
        default:
          return sorted;
      }
    }
  
    /**
     * Trier les offres box
     */
    static sortBoxOffers(
      offers: BoxOffer[], 
      sort: BoxFilterRequest['sort']
    ): BoxOffer[] {
      const sorted = [...offers];
      
      switch (sort) {
        case 'price-asc':
          return sorted.sort((a, b) => parseFloat(String(a.prix)) - parseFloat(String(b.prix)));
        case 'price-desc':
          return sorted.sort((a, b) => parseFloat(String(b.prix)) - parseFloat(String(a.prix)));
        case 'vitesse-desc':
          return sorted.sort((a, b) => (b.vitesse || 0) - (a.vitesse || 0));
        default:
          return sorted;
      }
    }
  }