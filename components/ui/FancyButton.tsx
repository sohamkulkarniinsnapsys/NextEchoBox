'use client';

import React, { useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const fancyButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-[var(--radius-lg)] font-medium',
    'transition-all duration-[var(--motion-fast)] ease-[var(--ease-smooth)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--ring)] focus-visible:ring-offset-[var(--background)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    'hover-lift',
  ],
  {
    variants: {
      variant: {
        solid: [
          'bg-gradient-to-br from-[var(--color-primary-start)] via-[var(--color-primary-mid)] to-[var(--color-primary-end)]',
          'text-white shadow-[var(--shadow-elev-2)]',
          'hover:shadow-[var(--shadow-button-hover)] hover:shadow-[var(--shadow-glow)]',
          'active:scale-[0.98]',
        ],
        outline: [
          'border-2 border-[var(--color-primary-mid)]',
          'bg-transparent text-[var(--foreground)]',
          'hover:bg-[var(--color-primary-mid)]/10 hover:border-[var(--color-primary-end)]',
          'active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-[var(--foreground)]',
          'hover:bg-[var(--muted)] hover:backdrop-blur-[8px]',
          'active:scale-[0.98]',
        ],
        warm: [
          'bg-gradient-to-br from-[var(--color-accent-warm)] to-[var(--color-accent-gold)]',
          'text-white shadow-[var(--shadow-elev-2)]',
          'hover:shadow-[var(--shadow-button-hover)] hover:shadow-[var(--shadow-glow-warm)]',
          'active:scale-[0.98]',
        ],
        neon: [
          'bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)]',
          'text-white shadow-[var(--shadow-neon)]',
          'hover:shadow-[var(--shadow-neon)] hover:scale-[1.02]',
          'active:scale-[0.98]',
        ],
        gradient: [
          'relative bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)]',
          'text-white shadow-[var(--shadow-elev-2)]',
          'hover:shadow-[var(--shadow-button-hover)]',
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
 * FancyButton - Premium button with Aceternity-inspired effects and micro-interactions
 * 
 * @example
 * ```tsx
 * <FancyButton variant="gradient" size="lg" loading>
 *   Click Me
 * </FancyButton>
 * 
 * <FancyButton variant="neon" className="animate-shimmer">
 *   Neon Button
 * </FancyButton>
 * ```
 */
export const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const Comp = asChild ? Slot : 'button';
    
    // Filter out conflicting Framer Motion props
    const { 
      onAnimationStart, 
      onAnimationEnd, 
      onAnimationIteration,
      onDragStart,
      onDragEnd,
      onDrag,
      ...motionProps 
    } = props;

    const ButtonContent = (
      <>
        {/* Shimmer effect for gradient variant */}
        {variant === 'gradient' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Neon glow pulse */}
        {variant === 'neon' && (
          <motion.div
            className="absolute inset-0 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] blur-xl opacity-50"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        )}

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </>
    );
    
    if (asChild) {
      return (
        <Comp
          className={cn(fancyButtonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          {ButtonContent}
        </Comp>
      );
    }
    
    return (
      <motion.button
        className={cn(fancyButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...motionProps}
      >
        {ButtonContent}
      </motion.button>
    );
  }
);

FancyButton.displayName = 'FancyButton';
