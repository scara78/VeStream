/**
 * VeStream Analytics
 * Google Analytics 4 integration with privacy-focused tracking
 */

// Initialize Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track video events
export const trackVideoEvent = (action, movieId, title) => {
  event({
    action,
    category: 'Video',
    label: `${title} (ID: ${movieId})`,
  });
};

// Track search events
export const trackSearch = (query, resultsCount) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount,
  });
};

// Track content interactions
export const trackContentClick = (contentType, contentId, title) => {
  event({
    action: 'content_click',
    category: 'Content',
    label: `${contentType}: ${title} (${contentId})`,
  });
};

// Track errors
export const trackError = (errorType, errorMessage) => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorType}: ${errorMessage}`,
  });
};

// Track PWA install
export const trackPWAInstall = () => {
  event({
    action: 'pwa_install',
    category: 'PWA',
    label: 'App Installed',
  });
};

// Track quality selection
export const trackQualityChange = (quality, movieTitle) => {
  event({
    action: 'quality_change',
    category: 'Video',
    label: `${quality} - ${movieTitle}`,
  });
};

// Track user engagement
export const trackEngagement = (action, details) => {
  event({
    action,
    category: 'Engagement',
    label: details,
  });
};

// Custom tracking for VeBot interactions
export const trackVeBotQuery = (query, action) => {
  event({
    action: 'vebot_query',
    category: 'VeBot',
    label: `${query} -> ${action}`,
  });
};

// Track social sharing
export const trackShare = (platform, contentTitle) => {
  event({
    action: 'share',
    category: 'Social',
    label: `${platform}: ${contentTitle}`,
  });
};

// Track performance metrics
export const trackPerformance = (metric, value) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric, {
      value: Math.round(value),
      event_category: 'Web Vitals',
      non_interaction: true,
    });
  }
};

// Consent management for GDPR compliance
export const setAnalyticsConsent = (granted) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });

    // Store consent in localStorage
    localStorage.setItem('analytics_consent', granted ? 'true' : 'false');
  }
};

// Check if user has given consent
export const hasAnalyticsConsent = () => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('analytics_consent');
  return consent === 'true';
};

// Initialize analytics with consent check
export const initAnalytics = () => {
  if (!GA_TRACKING_ID) {
    // Only warn in production, not during development
    if (process.env.NODE_ENV === 'production') {
      console.warn('Google Analytics ID not found');
    }
    return;
  }

  // Check for existing consent
  const hasConsent = hasAnalyticsConsent();

  // Set initial consent state
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'default', {
      analytics_storage: hasConsent ? 'granted' : 'denied',
    });
  }

  return hasConsent;
};

// Offline event queue for PWA
let offlineQueue = [];

export const queueEvent = (eventData) => {
  if (!navigator.onLine) {
    offlineQueue.push(eventData);
    return;
  }

  // If online, process the event immediately
  if (eventData.type === 'pageview') {
    pageview(eventData.url);
  } else if (eventData.type === 'event') {
    event(eventData.data);
  }
};

// Process queued events when back online
export const processQueuedEvents = () => {
  if (!navigator.onLine || offlineQueue.length === 0) return;

  offlineQueue.forEach(queuedEvent => {
    if (queuedEvent.type === 'pageview') {
      pageview(queuedEvent.url);
    } else if (queuedEvent.type === 'event') {
      event(queuedEvent.data);
    }
  });

  offlineQueue = [];
};

// Listen for online event to process queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', processQueuedEvents);
}

export default {
  pageview,
  event,
  trackVideoEvent,
  trackSearch,
  trackContentClick,
  trackError,
  trackPWAInstall,
  trackQualityChange,
  trackEngagement,
  trackVeBotQuery,
  trackShare,
  trackPerformance,
  setAnalyticsConsent,
  hasAnalyticsConsent,
  initAnalytics,
  queueEvent,
  processQueuedEvents,
};
