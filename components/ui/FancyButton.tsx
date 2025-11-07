'use client';

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const fancyButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-[var(--ui-radius-md)] font-medium',
    'transition-all duration-[var(--motion-fast)] ease-[var(--ease-smooth)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[oklch(0.70_0.22_260)] focus-visible:ring-offset-[var(--bg-deep)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        solid: [
          'bg-gradient-to-br from-[oklch(0.65_0.25_280)] via-[oklch(0.70_0.22_260)] to-[oklch(0.75_0.18_220)]',
          'text-white shadow-[var(--shadow-elev-2)]',
          'hover:shadow-[var(--shadow-glow)] hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        outline: [
          'border-2 border-[oklch(0.70_0.22_260)]',
          'bg-transparent text-[oklch(0.98_0.01_265)]',
          'hover:bg-[oklch(0.70_0.22_260)]/10 hover:border-[oklch(0.75_0.18_220)]',
          'hover:scale-[1.02] active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-[oklch(0.98_0.01_265)]',
          'hover:bg-white/[0.08] hover:backdrop-blur-[8px]',
          'hover:scale-[1.02] active:scale-[0.98]',
        ],
        warm: [
          'bg-gradient-to-br from-[oklch(0.72_0.20_35)] to-[oklch(0.80_0.15_85)]',
          'text-white shadow-[var(--shadow-elev-2)]',
          'hover:shadow-[var(--shadow-glow-warm)] hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);

export interface FancyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fancyButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * FancyButton - Premium button with gradient backgrounds and smooth interactions
 * 
 * @example
 * ```tsx
 * <FancyButton variant="solid" size="lg">
 *   Click Me
 * </FancyButton>
 * 
 * <FancyButton variant="outline" loading>
 *   Loading...
 * </FancyButton>
 * ```
 */
export const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(fancyButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

FancyButton.displayName = 'FancyButton';
