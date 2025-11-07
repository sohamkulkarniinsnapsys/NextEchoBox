'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AceternityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'gradient' | 'neon' | '3d';
  tiltOnHover?: boolean;
  floatOnHover?: boolean;
  accentEdge?: 'top' | 'bottom' | 'left' | 'right' | 'none';
  children: React.ReactNode;
}

/**
 * AceternityCard - Premium card with 3D effects and glassmorphism
 * 
 * @example
 * ```tsx
 * <AceternityCard variant="3d" tiltOnHover accentEdge="top">
 *   Card content
 * </AceternityCard>
 * ```
 */
export const AceternityCard = React.forwardRef<HTMLDivElement, AceternityCardProps>(
  ({ 
    variant = 'glass', 
    tiltOnHover = false, 
    floatOnHover = false,
    accentEdge = 'none',
    className, 
    children, 
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltOnHover) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const variantClasses: Record<string, string> = {
      glass: 'glass backdrop-blur-[var(--blur-medium)] bg-white/[var(--glass-alpha)] border-white/[var(--glass-border-alpha)]',
      solid: 'bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow-elev-2)]',
      gradient: 'bg-gradient-to-br from-[var(--color-primary-start)]/10 to-[var(--color-primary-end)]/10 border-[var(--color-primary-mid)]/20',
      neon: 'bg-[var(--card)] border-[var(--color-primary-mid)]/30 shadow-[var(--shadow-neon)]',
      '3d': 'glass backdrop-blur-[var(--blur-strong)] bg-white/[calc(var(--glass-alpha)*1.5)] border-white/[calc(var(--glass-border-alpha)*1.5)] shadow-[var(--shadow-3d)]',
    };

    const accentEdgeClasses: Record<string, string> = {
      top: 'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary-start)] before:to-[var(--color-primary-end)]',
      bottom: 'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary-start)] before:to-[var(--color-primary-end)]',
      left: 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[var(--color-primary-start)] before:to-[var(--color-primary-end)]',
      right: 'before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-[var(--color-primary-start)] before:to-[var(--color-primary-end)]',
      none: '',
    };

    const transform = tiltOnHover && isHovered
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * -10}deg) scale3d(1.05, 1.05, 1.05)`
      : floatOnHover && isHovered
      ? 'translateY(-8px) scale(1.02)'
      : 'translateY(0) scale(1)';

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
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-[var(--radius-lg)] border transition-all duration-[var(--motion-medium)]',
          'overflow-hidden',
          variantClasses[variant],
          accentEdgeClasses[accentEdge],
          className
        )}
        style={{
          transform,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={variant === '3d' ? { 
          boxShadow: '0 25px 50px -12px oklch(0 0 0 / 0.25)',
        } : undefined}
        {...motionProps}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-[var(--radius-lg)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Hover shimmer effect */}
        {isHovered && (variant === 'gradient' || variant === 'neon') && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Floating particles for 3D variant */}
        {variant === '3d' && isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[var(--color-primary-mid)] rounded-full"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  opacity: 0,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);

AceternityCard.displayName = 'AceternityCard';
