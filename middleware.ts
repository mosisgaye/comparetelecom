import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Cache control selon le type de contenu
  const pathname = request.nextUrl.pathname;
  
  // Assets statiques - cache long terme
  if (pathname.match(/\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Pages HTML - cache court terme avec revalidation
  else if (pathname.endsWith('/') || pathname.match(/^\/[^.]*$/)) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  }
  // API routes - pas de cache
  else if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }
  
  // Préconnexion aux domaines externes pour améliorer la performance
  response.headers.set('Link', [
    '<https://telecom.bemove.fr>; rel=preconnect',
    '<https://www.awin1.com>; rel=dns-prefetch',
    '<https://tracking.publicidees.com>; rel=dns-prefetch'
  ].join(', '));
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques Next.js)
     * - _next/image (optimisation d'images Next.js)
     * - favicon.ico, robots.txt, sitemap.xml (fichiers SEO)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};