'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface AnimatedAvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const ringClasses = {
  sm: 'before:inset-[-3px]',
  md: 'before:inset-[-4px]',
  lg: 'before:inset-[-5px]',
  xl: 'before:inset-[-6px]',
};

/**
 * AnimatedAvatar - User avatar with breathing halo ring
 * 
 * @example
 * ```tsx
 * <AnimatedAvatar 
 *   src="/avatar.jpg" 
 *   alt="User Name" 
 *   size="lg" 
 * />
 * ```
 */
export function AnimatedAvatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}: AnimatedAvatarProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Pause animation when page loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const initials = fallback || alt.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        'relative inline-block',
        sizeClasses[size],
        className
      )}
    >
      {/* Breathing halo ring */}
      <div
        className={cn(
          'absolute rounded-full pointer-events-none',
          'before:absolute before:content-[""] before:rounded-full',
          'before:bg-gradient-to-br before:from-[oklch(0.65_0.25_280)] before:via-[oklch(0.70_0.22_260)] before:to-[oklch(0.75_0.18_220)]',
          'before:opacity-40',
          ringClasses[size],
          isVisible && 'before:animate-[breathing_3s_ease-in-out_infinite]'
        )}
        style={{
          inset: 0,
        }}
      />

      {/* Avatar image or fallback */}
      <div
        className={cn(
          'relative rounded-full overflow-hidden',
          'bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)]',
          'flex items-center justify-center',
          'text-white font-semibold',
          'shadow-[var(--shadow-elev-2)]',
          'w-full h-full'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`${sizeClasses[size]}`}
          />
        ) : (
          <span className={cn(
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-xl'
          )}>
            {initials}
          </span>
        )}
      </div>

      {/* Add breathing animation keyframes */}
      <style jsx>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
