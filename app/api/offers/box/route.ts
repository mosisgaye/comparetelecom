import { NextRequest, NextResponse } from 'next/server';

// Types
interface CacheEntry {
  data: any;
  timestamp: number;
}

// Cache en mémoire partagé
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting partagé
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 30;

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(key) || [];
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
    const cacheKey = 'box-offers';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }

    // Essayons d'abord avec l'URL de la doc Bemove mobile adaptée pour box
    const apiUrl = new URL('https://telecom.bemove.fr/api/v1/flux-offres/box/compare/all');
    apiUrl.searchParams.append('partner', 'ARIASE');

    console.log('Calling Box API:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ComparePrix/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });

    console.log('Box API Response status:', response.status);

    if (!response.ok) {
      // Si l'URL principale échoue, essayons l'URL alternative
      console.log('Trying alternative Box API URL...');
      
      const altResponse = await fetch('https://telecom.bemove.fr/api/v1/flux-offres/box/all?partner=ARIASE', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ComparePrix/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!altResponse.ok) {
        throw new Error(`Bemove Box API error: ${altResponse.status}`);
      }

      const data = await altResponse.json();
      
      // Transformer pour garder la compatibilité
      const transformedData = {
        commercial: {
          offres: Array.isArray(data) ? data : (data.offres || data.commercial?.offres || []),
          filtres: data.filtres || data.commercial?.filtres || {
            operateurs: [],
            services: {},
            typeTechnos: {},
            nbOffreMatching: 0
          }
        },
        _meta: {
          fetchedAt: new Date().toISOString(),
          totalOffers: Array.isArray(data) ? data.length : (data.offres?.length || data.commercial?.offres?.length || 0),
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
    }

    const data = await response.json();

    // Transformer pour garder la compatibilité avec votre structure actuelle
    const transformedData = {
      commercial: {
        offres: data.offres || data.commercial?.offres || [],
        filtres: data.filtres || data.commercial?.filtres || {
          operateurs: [],
          services: {},
          typeTechnos: {},
          nbOffreMatching: data.offres?.length || 0
        }
      },
      _meta: {
        fetchedAt: new Date().toISOString(),
        totalOffers: data.offres?.length || data.commercial?.offres?.length || 0,
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
    console.error('Error fetching box offers:', error);
    
    // Servir depuis le cache expiré si disponible
    const cacheKey = 'box-offers';
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
        error: 'Unable to fetch box offers',
        message: error instanceof Error ? error.message : 'Please try again later'
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

// POST pour les filtres et la pagination (reste identique)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, page = 1, limit = 12 } = body;

    // Récupérer toutes les offres via GET
    const getResponse = await GET(request);
    const data = await getResponse.json();

    if (!data.commercial?.offres) {
      return NextResponse.json(
        { error: 'No offers available' },
        { status: 404 }
      );
    }

    let filteredOffers = [...data.commercial.offres];

    // Appliquer les filtres
    if (filters) {
      if (filters.operateur) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.operateur?.nom === filters.operateur
        );
      }

      if (filters.techno || filters.typeTechno) {
        const technoFilter = filters.techno || filters.typeTechno;
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.typeTechno === technoFilter || offer.techno === technoFilter
        );
      }

      if (filters.minPrice !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          parseFloat(offer.prix) >= filters.minPrice
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          parseFloat(offer.prix) <= filters.maxPrice
        );
      }

      if (filters.debit !== undefined) {
        filteredOffers = filteredOffers.filter((offer: any) => {
          const debitValue = parseInt(offer.debitMontant || offer.vitesse) || 0;
          return debitValue >= filters.debit;
        });
      }

      // Filtres services
      if (filters.tv !== undefined && filters.tv) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.services?.tv === true
        );
      }

      if (filters.telephone !== undefined && filters.telephone) {
        filteredOffers = filteredOffers.filter((offer: any) => 
          offer.services?.telephone === true
        );
      }
    }

    // Tri
    if (body.sort) {
      filteredOffers.sort((a: any, b: any) => {
        switch (body.sort) {
          case 'price-asc':
            return parseFloat(a.prix) - parseFloat(b.prix);
          case 'price-desc':
            return parseFloat(b.prix) - parseFloat(a.prix);
          case 'debit-desc':
            const aDebit = parseInt(a.debitMontant || a.vitesse) || 0;
            const bDebit = parseInt(b.debitMontant || b.vitesse) || 0;
            return bDebit - aDebit;
          default:
            return 0;
        }
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedOffers = filteredOffers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      commercial: {
        offres: paginatedOffers,
        filtres: data.commercial.filtres
      },
      meta: {
        total: filteredOffers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOffers.length / limit),
        hasMore: startIndex + limit < filteredOffers.length
      }
    }, {
      headers: {
        'Cache-Control': 'private, no-cache',
        'X-Total-Results': String(filteredOffers.length)
      }
    });

  } catch (error) {
    console.error('Error processing box filters:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}