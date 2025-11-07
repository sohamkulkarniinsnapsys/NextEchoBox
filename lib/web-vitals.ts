/**
 * Web Vitals tracking for performance monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
 */

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Send metrics to analytics endpoint
 * Replace with your analytics provider (e.g., Google Analytics, Vercel Analytics)
 */
function sendToAnalytics(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      });
    }

    // Example: Send to custom endpoint
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Use sendBeacon if available (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', body);
    } else {
      fetch('/api/analytics/web-vitals', {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(console.error);
    }
  }
}

/**
 * Report Web Vitals
 * Call this from _app.tsx or layout.tsx
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  sendToAnalytics(metric);
}

/**
 * Get performance thresholds for each metric
 */
export const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

/**
 * Get rating for a metric value
 */
export function getRating(
  name: WebVitalsMetric['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  private constructor() {
    if (typeof window === 'undefined') return;
    this.initObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initObservers() {
    // Observe long tasks (> 50ms)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn('[Long Task]', {
                duration: Math.round(entry.duration),
                startTime: Math.round(entry.startTime),
              });
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }

      // Observe layout shifts
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            const value = (entry as any).value;
            if (value > 0.1) {
              console.warn('[Layout Shift]', {
                value: value.toFixed(4),
                sources: (entry as any).sources,
              });
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout shift API not supported
      }
    }
  }

  /**
   * Mark a custom performance metric
   */
  mark(name: string) {
    if (typeof window === 'undefined') return;
    performance.mark(name);
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window === 'undefined') return;
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      const measure = performance.getEntriesByName(name)[0];
      this.metrics.set(name, measure.duration);
      return measure.duration;
    } catch (e) {
      console.error('Performance measure failed:', e);
    }
  }

  /**
   * Get all custom metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Clear all marks and measures
   */
  clear() {
    if (typeof window === 'undefined') return;
    performance.clearMarks();
    performance.clearMeasures();
    this.metrics.clear();
  }
}
