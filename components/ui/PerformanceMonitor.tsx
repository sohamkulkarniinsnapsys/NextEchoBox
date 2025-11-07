'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Time to First Byte
      const ttfb = navigation.responseStart - navigation.requestStart;
      
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      const fcp = fcpEntry ? fcpEntry.startTime : 0;

      setMetrics({
        fcp: Math.round(fcp),
        lcp: 0, // Will be updated by observer
        fid: 0, // Will be updated by observer
        cls: 0, // Will be updated by observer
        ttfb: Math.round(ttfb),
      });

      // Set up observers for other metrics
      observeLCP();
      observeFID();
      observeCLS();
    };

    const observeLCP = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    };

    const observeFID = () => {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          setMetrics(prev => ({ 
            ...prev, 
            fid: Math.round((entry as any).processingStart - entry.startTime) 
          }));
        }
      }).observe({ entryTypes: ['first-input'] });
    };

    const observeCLS = () => {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Delay measurement to ensure page is loaded
    setTimeout(measurePerformance, 1000);

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => setIsVisible(true)}
          className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
          title="Show Performance Monitor (Ctrl+Shift+P)"
        >
          <Activity className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  const getMetricColor = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'text-green-500';
    if (value <= threshold.poor) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricIcon = (metric: keyof PerformanceMetrics) => {
    const icons = {
      fcp: Clock,
      lcp: Activity,
      fid: Zap,
      cls: TrendingUp,
      ttfb: Activity,
    };
    return icons[metric];
  };

  const formatMetric = (metric: keyof PerformanceMetrics, value: number) => {
    if (metric === 'cls') return value.toFixed(3);
    return `${value}ms`;
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AceternityCard variant="glass" className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gradient">Performance Metrics</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          {(Object.keys(metrics) as Array<keyof PerformanceMetrics>).map((metric) => {
            const Icon = getMetricIcon(metric);
            return (
              <motion.div
                key={metric}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className={`text-sm font-mono ${getMetricColor(metric, metrics[metric])}`}>
                  {formatMetric(metric, metrics[metric])}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Press Ctrl+Shift+P to toggle
          </p>
        </div>
      </AceternityCard>
    </motion.div>
  );
}
