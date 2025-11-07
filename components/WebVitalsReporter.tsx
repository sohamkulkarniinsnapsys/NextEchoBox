'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/lib/web-vitals';

/**
 * WebVitalsReporter - Client component for tracking Core Web Vitals
 * Automatically reports LCP, FID, CLS, FCP, TTFB, INP to analytics
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric as any);
  });

  useEffect(() => {
    // Log initial page load performance
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance]', {
          pageLoadTime: `${pageLoadTime}ms`,
          connectTime: `${connectTime}ms`,
          renderTime: `${renderTime}ms`,
        });
      }
    }
  }, []);

  return null;
}
