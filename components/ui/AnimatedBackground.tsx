'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuroraBackground } from './aceternity/AuroraBackground';
import { BackgroundBeams, ShootingStars } from './aceternity/BackgroundBeams';

export interface AnimatedBackgroundProps {
  powerSaver?: boolean;
  variant?: 'original' | 'aurora' | 'beams' | 'shooting-stars' | 'combined';
  showRadialGradient?: boolean;
}

/**
 * AnimatedBackground - Enhanced background with Aceternity effects
 * 
 * Renders multiple background variants:
 * 1. Original: Slow-morphing gradients and blobs
 * 2. Aurora: Animated aurora background effect
 * 3. Beams: Background beams with collision
 * 4. Shooting Stars: Animated shooting stars
 * 5. Combined: Multiple effects layered together
 * 
 * @example
 * ```tsx
 * <AnimatedBackground variant="aurora" showRadialGradient />
 * <AnimatedBackground variant="combined" />
 * ```
 */
export function AnimatedBackground({ 
  powerSaver = false, 
  variant = 'combined',
  showRadialGradient = true 
}: AnimatedBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (powerSaver) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20,
        });
      });
    };

    const handleScroll = () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY * 0.5);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [powerSaver]);

  if (powerSaver) {
    // Static gradient background for power saver mode
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-deep)] via-[oklch(0.15_0.04_265)] to-[var(--bg-surface)]" />
      </div>
    );
  }

  // Aurora variant
  if (variant === 'aurora') {
    return (
      <AuroraBackground showRadialGradient={showRadialGradient} className="fixed inset-0 -z-10 pointer-events-none" />
    );
  }

  // Beams variant
  if (variant === 'beams') {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <BackgroundBeams />
      </div>
    );
  }

  // Shooting stars variant
  if (variant === 'shooting-stars') {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-deep)] via-[oklch(0.15_0.04_265)] to-[var(--bg-surface)]" />
        <ShootingStars starCount={8} />
      </div>
    );
  }

  // Combined variant with multiple Aceternity effects
  if (variant === 'combined') {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Base gradient layer */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-br from-[var(--bg-deep)] via-[oklch(0.15_0.04_265)] to-[var(--bg-surface)]',
          )}
          style={{
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Aurora effect */}
        <AuroraBackground showRadialGradient={false} className="absolute inset-0 opacity-30" />
        
        {/* Background beams */}
        <BackgroundBeams className="opacity-20" />
        
        {/* Shooting stars */}
        <ShootingStars starCount={3} />
      </div>
    );
  }

  // Original variant (existing implementation)
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Morphing gradient sheet */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-br from-[var(--bg-deep)] via-[oklch(0.15_0.04_265)] to-[var(--bg-surface)]',
          'animate-[hueRotate_20s_ease-in-out_infinite]'
        )}
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Layer 2: Blurred SVG blobs with parallax */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y - scrollY}px, 0)`,
          transition: 'transform 0.4s ease-out',
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
          </filter>
          
          <linearGradient id="blob1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 280)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(0.70 0.22 260)" stopOpacity="0.08" />
          </linearGradient>
          
          <linearGradient id="blob2Gradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.18 220)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="oklch(0.72 0.20 35)" stopOpacity="0.06" />
          </linearGradient>
          
          <linearGradient id="blob3Gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.80 0.15 85)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 165)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Blob 1 - Top Left */}
        <circle
          cx="20%"
          cy="20%"
          r="300"
          fill="url(#blob1Gradient)"
          filter="url(#goo)"
          className="animate-[float1_15s_ease-in-out_infinite]"
        />

        {/* Blob 2 - Top Right */}
        <circle
          cx="80%"
          cy="30%"
          r="250"
          fill="url(#blob2Gradient)"
          filter="url(#goo)"
          className="animate-[float2_18s_ease-in-out_infinite]"
        />

        {/* Blob 3 - Bottom Center */}
        <circle
          cx="50%"
          cy="80%"
          r="280"
          fill="url(#blob3Gradient)"
          filter="url(#goo)"
          className="animate-[float3_20s_ease-in-out_infinite]"
        />
      </svg>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes hueRotate {
          0%, 100% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(15deg);
          }
        }

        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.95);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-25px, 35px) scale(1.08);
          }
          66% {
            transform: translate(35px, -25px) scale(0.92);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, 20px) scale(0.98);
          }
          66% {
            transform: translate(-30px, -30px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
