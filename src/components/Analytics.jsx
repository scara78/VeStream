'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { pageview, initAnalytics, GA_TRACKING_ID } from '@/lib/analytics';
import { reportWebVitals } from '@/lib/performance';

/**
 * Analytics Component
 * Tracks page views and initializes Google Analytics
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics with consent
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  // Don't render GA scripts if no tracking ID or not in production
  if (!GA_TRACKING_ID || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Set consent mode defaults
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'wait_for_update': 500
            });

            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />

      {/* Web Vitals Tracking */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track Web Vitals
            if ('PerformanceObserver' in window) {
              // LCP - Largest Contentful Paint
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'LCP', {
                      value: Math.round(entry.startTime),
                      event_category: 'Web Vitals',
                      non_interaction: true
                    });
                  }
                }
              }).observe({ entryTypes: ['largest-contentful-paint'] });

              // FID - First Input Delay
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'FID', {
                      value: Math.round(entry.processingStart - entry.startTime),
                      event_category: 'Web Vitals',
                      non_interaction: true
                    });
                  }
                }
              }).observe({ entryTypes: ['first-input'] });

              // CLS - Cumulative Layout Shift
              let clsValue = 0;
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'CLS', {
                        value: Math.round(clsValue * 1000),
                        event_category: 'Web Vitals',
                        non_interaction: true
                      });
                    }
                  }
                }
              }).observe({ entryTypes: ['layout-shift'] });
            }
          `,
        }}
      />
    </>
  );
}
