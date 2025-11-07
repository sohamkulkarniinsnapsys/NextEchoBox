'use client';

import { ReactNode, useEffect } from 'react';

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Monitor Web Vitals
    if (typeof window !== 'undefined') {
      // Core Web Vitals monitoring
      const observeWebVitals = () => {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const fidEntry = entry as any;
            console.log('FID:', fidEntry.processingStart - entry.startTime);
          }
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      };

      observeWebVitals();
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalFonts = [
        '/fonts/geist-var.woff2',
        '/fonts/geist-mono-var.woff2',
      ];

      criticalFonts.forEach((font) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = font;
        document.head.appendChild(link);
      });
    };

    // Optimize images loading
    const optimizeImageLoading = () => {
      if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach((img) => {
          const imgEl = img as HTMLImageElement;
          imgEl.src = imgEl.dataset.src || '';
          imgEl.classList.add('loaded');
        });
      }
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImageLoading();

    // Cleanup
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return <>{children}</>;
}
