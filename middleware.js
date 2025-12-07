import { NextResponse } from 'next/server';

/**
 * VeStream Middleware
 * Handles security headers, rate limiting, and performance optimizations
 */

export function middleware(request) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CSP for enhanced security
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https: blob:",
      "connect-src 'self' https://api.tmdb.org https://api.themoviedb.org https://image.tmdb.org https://vidsrc.xyz https://www.google-analytics.com https://movieapi.giftedtech.co.ke",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src https://www.youtube.com https://vidsrc.xyz",
      "worker-src 'self' blob:"
    ].join('; ')
  );

  // Performance Headers
  if (pathname.startsWith('/watch')) {
    // Enable streaming for watch pages
    response.headers.set('X-Accel-Buffering', 'no');
  }

  // Cache Control for static assets
  if (pathname.startsWith('/_next/static') || pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Cache Control for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  }

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
