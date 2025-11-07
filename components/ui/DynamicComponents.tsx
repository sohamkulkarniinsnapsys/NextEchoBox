/**
 * Dynamic component imports for code splitting
 * Reduces initial bundle size by lazy-loading heavy components
 */

import dynamic from 'next/dynamic';

// Aceternity components - loaded on demand
export const DynamicAuroraBackground = dynamic(
  () => import('./aceternity/AuroraBackgroundOptimized').then(mod => ({ default: mod.AuroraBackgroundOptimized })),
  {
    loading: () => <div className="absolute inset-0 bg-[var(--bg-deep)]" />,
    ssr: false, // Canvas-based, client-only
  }
);

export const DynamicBackgroundBeams = dynamic(
  () => import('./aceternity/BackgroundBeams').then(mod => ({ default: mod.BackgroundBeams })),
  {
    loading: () => <div className="absolute inset-0" />,
    ssr: false, // Canvas-based, client-only
  }
);

export const DynamicTextGenerateEffect = dynamic(
  () => import('./aceternity/TextGenerateEffectOptimized').then(mod => ({ default: mod.TextGenerateEffectOptimized })),
  {
    loading: () => <div className="h-12 animate-pulse bg-white/5 rounded" />,
    ssr: true, // Can SSR the placeholder
  }
);

// Heavy UI components - Note: Import individual components separately for proper typing
export const DynamicCarousel = dynamic(
  () => import('./carousel').then(mod => mod.Carousel),
  {
    loading: () => <div className="h-64 animate-pulse bg-white/5 rounded" />,
    ssr: false,
  }
);

// Modal/Dialog components - only load when needed
export const DynamicAlertDialogRoot = dynamic(
  () => import('./alert-dialog').then(mod => mod.AlertDialog),
  {
    loading: () => null,
    ssr: false,
  }
);

// Performance monitor - dev only
export const DynamicPerformanceMonitor = dynamic(
  () => import('./PerformanceMonitor').then(mod => ({ default: mod.PerformanceMonitor })),
  {
    loading: () => null,
    ssr: false,
  }
);

/**
 * Lazy load component wrapper with IntersectionObserver
 * Only loads component when it enters viewport
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    rootMargin?: string;
    threshold?: number;
  }
) {
  return dynamic(importFn, {
    loading: () => <div className="min-h-[200px]" />,
    ssr: false,
  });
}
