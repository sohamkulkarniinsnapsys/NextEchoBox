'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

/**
 * AuroraBackground - Animated aurora background effect
 * 
 * @example
 * ```tsx
 * <AuroraBackground showRadialGradient>
 *   <div>Content</div>
 * </AuroraBackground>
 * ```
 */
export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className,
  children,
  showRadialGradient = true,
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col h-[100vh] items-center justify-center overflow-hidden bg-[var(--bg-deep)]',
        className
      )}
    >
      {/* Aurora gradient layers */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, oklch(0.65 0.25 280 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, oklch(0.75 0.18 220 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 50%, oklch(0.72 0.20 35 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 60% 50%, oklch(0.65 0.25 280 / 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 80% 80%, oklch(0.78 0.16 165 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, oklch(0.80 0.15 85 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, oklch(0.65 0.25 280 / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, oklch(0.75 0.18 220 / 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Moving aurora bands */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            'linear-gradient(135deg, transparent 25%, oklch(0.65 0.25 280 / 0.2) 50%, transparent 75%)',
            'linear-gradient(225deg, transparent 25%, oklch(0.75 0.18 220 / 0.2) 50%, transparent 75%)',
            'linear-gradient(315deg, transparent 25%, oklch(0.72 0.20 35 / 0.2) 50%, transparent 75%)',
            'linear-gradient(45deg, transparent 25%, oklch(0.78 0.16 165 / 0.2) 50%, transparent 75%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Radial gradient overlay */}
      {showRadialGradient && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[var(--bg-deep)]/80 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.98 0.01 265) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};
