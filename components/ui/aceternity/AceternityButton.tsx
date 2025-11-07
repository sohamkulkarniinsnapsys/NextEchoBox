'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AceternityButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * AceternityButton - Enhanced button with hover border gradient and micro-interactions
 * 
 * @example
 * ```tsx
 * <AceternityButton variant="gradient" size="lg" loading={isLoading}>
 *   Click Me
 * </AceternityButton>
 * ```
 */
export const AceternityButton = React.forwardRef<HTMLButtonElement, AceternityButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    className, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const variantClasses: Record<string, string> = {
      primary: 'bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white shadow-lg hover:shadow-xl',
      outline: 'border-2 border-[var(--color-primary-mid)] text-[var(--color-primary-mid)] hover:bg-[var(--color-primary-mid)] hover:text-white',
      ghost: 'text-[var(--primary)] hover:bg-[var(--muted)]',
      gradient: 'relative bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white overflow-hidden',
      neon: 'relative bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white shadow-[var(--shadow-neon)]',
    };

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

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] font-medium transition-all duration-[var(--motion-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'hover-lift',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        disabled={disabled || loading}
        {...motionProps}
      >
        {/* Gradient border effect for outline variant */}
        {variant === 'outline' && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-[var(--radius-lg)] bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] p-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full rounded-[calc(var(--radius-lg)-2px)] bg-background" />
          </motion.div>
        )}

        {/* Shimmer effect for gradient variant */}
        {variant === 'gradient' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '200%' : '-100%' }}
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
          />
        )}

        {/* Icon */}
        {icon && !loading && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

AceternityButton.displayName = 'AceternityButton';
