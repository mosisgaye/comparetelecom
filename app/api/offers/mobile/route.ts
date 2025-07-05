import { NextRequest, NextResponse } from 'next/server';

// Types
interface CacheEntry {
  data: any;
  timestamp: number;
}

// Cache en mémoire simple
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting simple
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requêtes par minute

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(key) || [];
  
  // Nettoyer les anciennes requêtes
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + RATE_LIMIT_WINDOW)
          }
        }
      );
    }

    // Vérifier le cache
    const cacheKey = 'mobile-offers';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }

    // Appel à l'API Bemove avec les bons paramètres
    const apiUrl = new URL('https://telecom.bemove.fr/api/v1/flux-offres/mobile/all');
    apiUrl.searchParams.append('partner', 'ARIASE');
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ComparePrix/1.0'
      },
      // Timeout de 10 secondes
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Bemove API error: ${response.status}`);
    }

    const data = await response.json();

    // Transformer pour garder la compatibilité avec votre structure actuelle
    const transformedData = {
      commercial: {
        offres: Array.isArray(data) ? data : (data.offres || []),
        filtres: data.filtres || {
          operateurs: [],
          services: {},
          typeForfaits: {},
          reseauxOperateurs: {},
          nbOffreMatching: Array.isArray(data) ? data.length : 0
        }
      },
      _meta: {
        fetchedAt: new Date().toISOString(),
        totalOffers: Array.isArray(data) ? data.length : (data.offres?.length || 0),
        cacheUntil: new Date(Date.now() + CACHE_DURATION).toISOString()
      }
    };

    // Mettre en cache
    cache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now()
    });

    return NextResponse.json(transformedData, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Total-Offers': String(transformedData._meta.totalOffers)
      }
    });

  } catch (error) {
    console.error('Error fetching mobile offers:', error);
    
    // Servir depuis le cache même expiré si disponible
    const cacheKey = 'mobile-offers';
    const staleCache = cache.get(cacheKey);
    
    if (staleCache) {
      return NextResponse.json(staleCache.data, {
        headers: {
          'X-Cache': 'STALE',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600'
        }
      });
    }

    return NextResponse.json(
      { 
        error: 'Unable to fetch offers',
        message: 'Please try again later'
      },
      { 
        status: 503,
        headers: {
          'Retry-After': '60'
        }
      }
    );
  }
}

// POST pour les filtres avec pagination
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, page = 1, limit = 12, offset = 0 } = body;

    // Construire l'URL avec les paramètres
    const apiUrl = new URL('https://telecom.bemove.fr/api/v1/flux-offres/mobile/all');
    apiUrl.searchParams.append('partner', 'ARIASE');
    
    // Utiliser offset et length pour la pagination côté API si disponible
    if (body.useApiPagination) {
      apiUrl.searchParams.append('offset', String(offset));
      apiUrl.searchParams.append('length', String(limit));
    }

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ComparePrix/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Bemove API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Les offres sont directement dans un tableau
    let allOffers = Array.isArray(data) ? data : (data.offres || []);
    let filteredOffers = [...allOffers];

    // Appliquer les filtres côté client si pas de pagination API
    if (!body.useApiPagination && filters) {
      if (filters.operateur) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.operateur?.slugOperateur === filters.operateur ||
          offer.operateur?.slug === filters.operateur
        );
      }

      if (filters.minPrice !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.prix >= filters.minPrice
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.prix <= filters.maxPrice
        );
      }

      if (filters.data) {
        filteredOffers = filteredOffers.filter((offer: any) => {
          const dataValue = parseInt(offer.quotaData) || 0;
          return dataValue >= parseInt(filters.data);
        });
      }

      if (filters.engagement !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          filters.engagement ? offer.dureeEngagement > 0 : offer.dureeEngagement === 0
        );
      }
    }

    // Tri
    if (body.sort) {
      filteredOffers.sort((a: any, b: any) => {
        switch (body.sort) {
          case 'price-asc':
            return a.prix - b.prix;
          case 'price-desc':
            return b.prix - a.prix;
          case 'data-desc':
            return (parseInt(b.quotaData) || 0) - (parseInt(a.quotaData) || 0);
          default:
            return 0;
        }
      });
    }

    // Pagination côté client si pas utilisée côté API
    const paginatedOffers = body.useApiPagination 
      ? filteredOffers 
      : filteredOffers.slice((page - 1) * limit, page * limit);

    // Construire la réponse avec la structure attendue
    return NextResponse.json({
      commercial: {
        offres: paginatedOffers,
        filtres: data.filtres || {
          operateurs: [],
          services: {},
          typeForfaits: {},
          reseauxOperateurs: {},
          nbOffreMatching: filteredOffers.length
        }
      },
      meta: {
        total: filteredOffers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOffers.length / limit),
        hasMore: page * limit < filteredOffers.length
      }
    }, {
      headers: {
        'Cache-Control': 'private, no-cache',
        'X-Total-Results': String(filteredOffers.length)
      }
    });

  } catch (error) {
    console.error('Error processing filters:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}