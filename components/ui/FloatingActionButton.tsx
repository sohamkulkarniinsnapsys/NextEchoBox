'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
}

/**
 * FloatingActionButton - Breathing FAB with accessible semantics
 * 
 * @example
 * ```tsx
 * <FloatingActionButton 
 *   onClick={() => console.log('clicked')}
 *   label="Create new"
 * />
 * ```
 */
export function FloatingActionButton({
  icon,
  label = 'Action',
  className,
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'fixed bottom-6 right-6 z-[var(--z-fixed)]',
        'w-14 h-14 rounded-full',
        'bg-gradient-to-br from-[oklch(0.65_0.25_280)] via-[oklch(0.70_0.22_260)] to-[oklch(0.75_0.18_220)]',
        'text-white shadow-[var(--shadow-elev-3)]',
        
        // Breathing animation
        'animate-[breathingFab_3s_ease-in-out_infinite]',
        
        // Interactions
        'hover:scale-110 hover:shadow-[var(--shadow-glow)]',
        'active:scale-95',
        'transition-all duration-[var(--motion-fast)] ease-[var(--ease-smooth)]',
        
        // Focus
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-[oklch(0.70_0.22_260)]/50',
        
        // Disabled
        'disabled:opacity-50 disabled:pointer-events-none',
        
        // Flex center
        'flex items-center justify-center',
        
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon || <Plus className="w-6 h-6" />}
      
      {/* Breathing animation keyframes */}
      <style jsx>{`
        @keyframes breathingFab {
          0%, 100% {
            box-shadow: 0 8px 32px oklch(0 0 0 / 0.16), 0 4px 8px oklch(0 0 0 / 0.20), 0 0 24px oklch(0.65 0.25 280 / 0.3);
          }
          50% {
            box-shadow: 0 12px 40px oklch(0 0 0 / 0.20), 0 6px 12px oklch(0 0 0 / 0.24), 0 0 32px oklch(0.65 0.25 280 / 0.5);
          }
        }
      `}</style>
    </button>
  );
}
