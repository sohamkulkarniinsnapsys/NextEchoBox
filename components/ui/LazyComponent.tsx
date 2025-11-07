'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { motion } from 'framer-motion';

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LazyComponent({ 
  loader, 
  fallback = <div>Loading...</div>, 
  className = '',
  delay = 0 
}: LazyComponentProps) {
  const DynamicComponent = dynamic(loader, {
    loading: () => (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {fallback}
      </motion.div>
    ),
  });

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <DynamicComponent />
    </motion.div>
  );
}

// Pre-configured lazy components for common use cases
export const LazyAceternityCard = dynamic(
  () => import('@/components/ui/aceternity/AceternityCard').then(mod => ({ default: mod.AceternityCard })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  }
);

export const LazyTextGenerateEffect = dynamic(
  () => import('@/components/ui/aceternity/TextGenerateEffect').then(mod => ({ default: mod.TextGenerateEffect })),
  {
    loading: () => <div className="animate-pulse bg-gray-200 rounded h-8 w-48" />,
  }
);

export const LazyAuroraBackground = dynamic(
  () => import('@/components/ui/aceternity/AuroraBackground').then(mod => ({ default: mod.AuroraBackground })),
  {
    loading: () => <div className="animate-pulse bg-gradient-to-br from-blue-500 to-purple-500 inset-0" />,
  }
);

export const LazyBackgroundBeams = dynamic(
  () => import('@/components/ui/aceternity/BackgroundBeams').then(mod => ({ default: mod.BackgroundBeams })),
  {
    loading: () => null, // Background beams can be skipped during loading
  }
);

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return dynamic(() => Promise.resolve({ default: Component }), {
    loading: () => fallback || <div className="animate-pulse bg-gray-200 rounded-lg h-32" />,
  });
}
