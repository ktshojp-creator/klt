declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = (import.meta as any).env.VITE_GA_MEASUREMENT_ID || 'G-9WRGR7YY2V';

/**
 * Initializes Google Analytics (gtag.js) dynamically
 */
export function initGA() {
  if (typeof window === 'undefined') return;
  
  if (!GA_MEASUREMENT_ID) {
    console.log('Google Analytics: VITE_GA_MEASUREMENT_ID is not configured. Tracking is disabled.');
    return;
  }

  if (window.gtag) return;

  try {
    // Dynamic loading of tracking script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (..._args: any[]) {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
    
    console.log(`Google Analytics: Successfully loaded with ID ${GA_MEASUREMENT_ID}`);
  } catch (error) {
    console.error('Google Analytics: Failed to initialize:', error);
  }
}

/**
 * Tracks a virtual page view (since it is a Single Page Application)
 * @param path The URL path (e.g. '/favorites', '/scene/airport')
 * @param title Optional title of the page
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  } catch (error) {
    console.error('Google Analytics: Failed to track page view:', error);
  }
}

/**
 * Tracks a custom event
 * @param action The event name (e.g. 'play_audio', 'quiz_completed')
 * @param params Optional key-value parameters for the event
 */
export function trackEvent(action: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  try {
    window.gtag('event', action, params);
  } catch (error) {
    console.error('Google Analytics: Failed to track event:', error);
  }
}
