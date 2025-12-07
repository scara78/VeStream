/**
 * Performance Monitoring Utilities for VeStream
 * Tracks Web Vitals and custom metrics
 */

/**
 * Report Web Vitals to analytics
 * @param {Object} metric - Web Vital metric
 */
export function reportWebVitals(metric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Example: Send to custom analytics endpoint
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        id: metric.id,
        rating: metric.rating,
      }),
    }).catch(console.error);
    */
  }
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  /**
   * Start timing a custom metric
   * @param {string} name - Metric name
   */
  startMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * End timing and record a custom metric
   * @param {string} name - Metric name
   */
  endMeasure(name) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-end`);

      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];

        this.metrics[name] = {
          duration: measure.duration,
          timestamp: Date.now(),
        };

        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
        }

        // Clean up marks and measures
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);

        return measure.duration;
      } catch (error) {
        console.error('Performance measurement error:', error);
      }
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics() {
    return this.metrics;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = {};
  }
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];

      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domInteractive: perfData.domInteractive - perfData.responseEnd,
          domComplete: perfData.domComplete - perfData.responseEnd,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        };

        if (process.env.NODE_ENV === 'development') {
          console.table(metrics);
        }

        return metrics;
      }
    });
  }
}

/**
 * Measure API call performance
 * @param {string} endpoint - API endpoint name
 * @param {Function} apiCall - Async function to measure
 */
export async function measureApiCall(endpoint, apiCall) {
  const monitor = new PerformanceMonitor();
  monitor.startMeasure(`api-${endpoint}`);

  try {
    const result = await apiCall();
    monitor.endMeasure(`api-${endpoint}`);
    return result;
  } catch (error) {
    monitor.endMeasure(`api-${endpoint}`);
    throw error;
  }
}

/**
 * Image loading performance tracker
 */
export function trackImageLoad(imageSrc) {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === imageSrc) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Image loaded: ${imageSrc} in ${entry.duration.toFixed(2)}ms`);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Component render time tracker (for dev mode)
 */
export function useRenderTracking(componentName) {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const renderStart = performance.now();

    return () => {
      const renderTime = performance.now() - renderStart;
      if (renderTime > 16) { // Flag renders slower than 60fps
        console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  }

  return () => {};
}

export default {
  reportWebVitals,
  PerformanceMonitor,
  trackPageLoad,
  measureApiCall,
  trackImageLoad,
  useRenderTracking,
};
