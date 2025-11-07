'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant controls the visual intensity */
  variant?: 'subtle' | 'medium' | 'strong';
  /** Show gradient accent rib on edge */
  accentEdge?: 'none' | 'left' | 'top' | 'right' | 'bottom';
  /** Accent color theme */
  accentColor?: 'primary' | 'warm' | 'gold' | 'mint';
  /** Enable hover lift effect */
  hoverable?: boolean;
  /** Blur intensity */
  blur?: 'subtle' | 'medium' | 'strong';
  children?: React.ReactNode;
}

const variantStyles = {
  subtle: 'bg-white/[0.05] border-white/[0.08]',
  medium: 'bg-white/[0.08] border-white/[0.12]',
  strong: 'bg-white/[0.12] border-white/[0.15]',
};

const blurStyles = {
  subtle: 'backdrop-blur-[8px]',
  medium: 'backdrop-blur-[16px]',
  strong: 'backdrop-blur-[32px]',
};

const accentGradients = {
  primary: 'from-[oklch(0.65_0.25_280)] via-[oklch(0.70_0.22_260)] to-[oklch(0.75_0.18_220)]',
  warm: 'from-[oklch(0.72_0.20_35)] to-[oklch(0.80_0.15_85)]',
  gold: 'from-[oklch(0.80_0.15_85)] to-[oklch(0.85_0.12_75)]',
  mint: 'from-[oklch(0.78_0.16_165)] to-[oklch(0.75_0.18_180)]',
};

const accentPositions = {
  none: '',
  left: 'before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-l-[inherit]',
  top: 'before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-[inherit]',
  right: 'before:right-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-r-[inherit]',
  bottom: 'before:bottom-0 before:left-0 before:right-0 before:h-[3px] before:rounded-b-[inherit]',
};

/**
 * GlassCard - A semi-transparent, blurred surface with optional gradient accent
 * 
 * @example
 * ```tsx
 * <GlassCard variant="medium" accentEdge="left" accentColor="primary">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */
export function GlassCard({
  variant = 'medium',
  accentEdge = 'none',
  accentColor = 'primary',
  hoverable = false,
  blur = 'medium',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'relative rounded-[var(--ui-radius-lg)] border',
        'transition-all duration-[var(--motion-medium)] ease-[var(--ease-smooth)]',
        
        // Variant styles
        variantStyles[variant],
        blurStyles[blur],
        
        // Inner glow
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
        
        // Hover effect
        hoverable && [
          'hover:scale-[1.02] hover:shadow-[var(--shadow-elev-2)]',
          'hover:bg-white/[0.12] hover:border-white/[0.18]',
          'cursor-pointer',
        ],
        
        // Accent edge positioning
        accentEdge !== 'none' && [
          'before:absolute before:content-[""]',
          'before:bg-gradient-to-br',
          accentPositions[accentEdge],
          accentGradients[accentColor],
          'before:opacity-80',
        ],
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
