import React, { Suspense } from 'react';
import VeBot from '@/components/VeBot';
import PWAInstall from '@/components/PWAInstall';
import Analytics from '@/components/Analytics';
import OfflineDetector from '@/components/OfflineDetector';
import QueryProvider from '@/providers/QueryProvider';
import SplashScreen from '@/components/SplashScreen';
import { MobileNavigation } from '@/components/Navigation';
import { ToastProvider } from '@/components/ui/Toast';
import '../src/index.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'VeStream - Stream Movies & TV Shows | Powered by TMDB',
    template: '%s | VeStream',
  },
  description: 'Stream unlimited movies and TV shows on VeStream. Discover trending content, watch trailers, and enjoy high-quality streaming powered by TMDB.',
  keywords: ['streaming', 'movies', 'tv shows', 'watch online', 'tmdb', 'entertainment', 'cinema', 'series'],
  authors: [{ name: 'VeStream' }],
  creator: 'VeStream',
  publisher: 'VeStream',

  // PWA
  applicationName: 'VeStream',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VeStream',
  },
  formatDetection: {
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'VeStream - Stream Movies & TV Shows',
    description: 'Stream unlimited movies and TV shows on VeStream. Discover trending content, watch trailers, and enjoy high-quality streaming.',
    siteName: 'VeStream',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VeStream - Stream Movies & TV Shows',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'VeStream - Stream Movies & TV Shows',
    description: 'Stream unlimited movies and TV shows on VeStream. Discover trending content powered by TMDB.',
    images: ['/og-image.png'],
    creator: '@vestream',
  },

  // Icons
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  // Manifest
  manifest: '/manifest.json',

  // Verification
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Other
  category: 'entertainment',

  // OpenSearch
  other: {
    'search-engine': '/opensearch.xml',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#00ff88' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* OpenSearch */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="VeStream Search"
          href="/opensearch.xml"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://api.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://api.tmdb.org" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SplashScreen />
        <OfflineDetector />
        <QueryProvider>
          <ToastProvider>
            {children}
            <MobileNavigation />
            <VeBot />
            <PWAInstall />
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
