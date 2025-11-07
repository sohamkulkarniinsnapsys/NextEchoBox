'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  /** Enable 3D tilt on hover */
  tiltOnHover?: boolean;
  /** Enable floating animation on hover */
  floatOnHover?: boolean;
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
  primary: 'from-[var(--color-primary-start)] via-[var(--color-primary-mid)] to-[var(--color-primary-end)]',
  warm: 'from-[var(--color-accent-warm)] to-[var(--color-accent-gold)]',
  gold: 'from-[var(--color-accent-gold)] to-[var(--color-accent-mint)]',
  mint: 'from-[var(--color-accent-mint)] to-[var(--color-primary-end)]',
};

const accentPositions = {
  none: '',
  left: 'before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-l-[inherit]',
  top: 'before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-[inherit]',
  right: 'before:right-0 before:top-0 before:bottom-0 before:w-[3px] before:rounded-r-[inherit]',
  bottom: 'before:bottom-0 before:left-0 before:right-0 before:h-[3px] before:rounded-b-[inherit]',
};

/**
 * GlassCard - Enhanced glass card with Aceternity 3D effects and micro-interactions
 * 
 * @example
 * ```tsx
 * <GlassCard variant="medium" accentEdge="left" accentColor="primary" tiltOnHover>
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
  tiltOnHover = false,
  floatOnHover = false,
  blur = 'medium',
  className,
  children,
  ...props
}: GlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltOnHover) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
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

    const transform = tiltOnHover && isHovered
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * -10}deg) scale3d(1.05, 1.05, 1.05)`
      : floatOnHover && isHovered
      ? 'translateY(-8px) scale(1.02)'
      : 'translateY(0) scale(1)';

    return (
      <motion.div
        className={cn(
          // Base styles
          'relative rounded-[var(--radius-lg)] border',
          'transition-all duration-[var(--motion-medium)] ease-[var(--ease-smooth)]',
          'overflow-hidden',
          
          // Variant styles
          variantStyles[variant],
          blurStyles[blur],
          
          // Inner glow
          'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
          
          // Hover effect
          hoverable && [
            'hover:shadow-[var(--shadow-card-hover)]',
            'hover:bg-white/[calc(var(--glass-alpha)*1.5)] hover:border-white/[calc(var(--glass-border-alpha)*1.5)]',
            'cursor-pointer',
          ],
          
          // Accent edge positioning
          accentEdge !== 'none' && [
            'before:absolute before:content-[""]',
            'before:bg-gradient-to-br',
            accentPositions[accentEdge],
            accentGradients[accentColor],
            'before:opacity_80',
          ],
          
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
        whileHover={tiltOnHover ? { 
          boxShadow: 'var(--shadow-3d)',
        } : floatOnHover ? {
          y: -8,
          scale: 1.02,
        } : hoverable ? {
          scale: 1.02,
        } : undefined}
        {...motionProps}
      >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-[var(--radius-lg)] bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Hover shimmer effect */}
      {isHovered && hoverable && (
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
      {tiltOnHover && isHovered && (
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
