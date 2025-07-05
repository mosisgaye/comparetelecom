// Types pour les offres mobiles
export interface MobileOffer {
    id: number;
    nom: string;
    url: string;
    operateur: {
      id: number;
      nom: string;
      url?: string;
      slugOperateur?: string;
      slug?: string;
      logo: string;
      revendu: boolean;
      rang?: number;
      rangTelephone?: number;
    };
    slugOffre: string;
    prix: number;
    typeTechno: string;
    dureeEngagement: number;
    reseaux: string[];
    services: {
      appelsIllimites: boolean;
      smsMmsIllimites: boolean;
      internetIllimite: boolean;
      compatible5G: boolean;
    };
    quotaData?: number;
    isIllimiteData?: boolean;
    dureeAppel?: string;
    isIllimiteFrance?: boolean;
    nbSMS?: number;
    isIllimiteSMS?: boolean;
    nbMMS?: number;
    isIllimiteMMS?: boolean;
    isTelephoneInclus: boolean;
    description?: string;
    descriptionCourte?: string;
    isSponsored?: boolean;
    isStar?: boolean;
    isSelection?: boolean;
    dateMAJ?: string;
    promo?: {
      type: 'mensuel' | 'lancement' | 'permanente';
      prix?: number;
      duree?: number;
      nbMoisOfferts?: number;
    } | null;
  }
  
  // Types pour les offres box
  export interface BoxOffer {
    id: number;
    nom: string;
    description: string;
    dateMAJ: string;
    url: string;
    urlDetail?: string;
    slugOffre: string;
    operateur: {
      id: number;
      nom: string;
      url?: string;
      logo: string;
    };
    prix: string | number;
    dureeEngagement: number;
    promo?: {
      type: 'mensuel' | 'lancement' | 'permanente';
      prix?: number;
      duree?: number;
      nbMoisOfferts?: number;
    } | null;
    vitesse?: number;
    vitesseFormatee?: string;
    fraisResiliation?: number;
    isStar: boolean;
    isSelection?: boolean;
    isSponsored?: boolean;
    typeTechno: string;
    techno?: string;
    nbDestinationsFixesInternational?: number;
    nbDestinationsMobilesInternational?: number;
    options?: any[];
    services: {
      tv?: boolean;
      telephone?: boolean;
      appelsVersMobileInclus?: boolean;
      forfaitMobileInclus?: boolean;
    };
  }
  
  // Types pour les filtres
  export interface MobileFilters {
    operateurs: Array<{
      id: number;
      nom: string;
      slug: string;
      active: boolean;
      selected: boolean;
    }>;
    services: {
      appelsIllimites?: { active: boolean; selected: boolean };
      smsMmsIllimites?: { active: boolean; selected: boolean };
      internetIllimite?: { active: boolean; selected: boolean };
      compatible5G?: { active: boolean; selected: boolean };
    };
    typeForfaits?: {
      pasCher?: { active: boolean; selected: boolean };
      MoinsDe5Euros?: { active: boolean; selected: boolean };
      SansEngagement?: { active: boolean; selected: boolean };
      AvecMobile?: { active: boolean; selected: boolean };
    };
    reseauxOperateurs?: Record<string, { active: boolean; selected: boolean }>;
    nbOffreMatching: number;
  }
  
  export interface BoxFilters {
    operateurs: Array<{
      id: number;
      nom: string;
      url?: string;
      logo?: string;
    }>;
    services: {
      tv?: boolean;
      telephone?: boolean;
      appelsVersMobileInclus?: boolean;
      forfaitMobileInclus?: boolean;
    };
    typeTechnos: {
      ADSL?: boolean;
      satellite?: boolean;
      fibre?: boolean;
      cable?: boolean;
      '4gbox'?: boolean;
    };
  }
  
  // Types pour les réponses API
  export interface MobileApiResponse {
    commercial: {
      offres: MobileOffer[];
      filtres: MobileFilters;
    };
    _meta?: {
      fetchedAt: string;
      totalOffers: number;
      cacheUntil: string;
    };
  }
  
  export interface BoxApiResponse {
    commercial: {
      offres: BoxOffer[];
      filtres: BoxFilters;
    };
    _meta?: {
      fetchedAt: string;
      totalOffers: number;
      cacheUntil: string;
    };
  }
  
  // Types pour les requêtes API avec filtres
  export interface MobileFilterRequest {
    filters?: {
      operateur?: string;
      minPrice?: number;
      maxPrice?: number;
      data?: number;
      engagement?: boolean;
      reseau?: string;
      compatible5G?: boolean;
    };
    sort?: 'price-asc' | 'price-desc' | 'data-desc';
    page?: number;
    limit?: number;
  }
  
  export interface BoxFilterRequest {
    filters?: {
      operateur?: string;
      typeTechno?: string;
      minPrice?: number;
      maxPrice?: number;
      vitesse?: number;
      tv?: boolean;
      telephone?: boolean;
    };
    sort?: 'price-asc' | 'price-desc' | 'vitesse-desc';
    page?: number;
    limit?: number;
  }
  
  // Type pour la réponse paginée
  export interface PaginatedResponse<T> {
    offers: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasMore: boolean;
    };
    filters: MobileFilters | BoxFilters;
  }