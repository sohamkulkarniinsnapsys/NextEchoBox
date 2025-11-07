'use client';

import React, { ComponentProps } from 'react';
import { motion, LazyMotion, domAnimation, m } from 'framer-motion';

/**
 * OptimizedMotion - Lazy-loaded motion components for better performance
 * Uses LazyMotion to reduce initial bundle size by ~30KB
 * 
 * Usage: Replace `motion.div` with `OptimizedMotion.div`
 */

// Create optimized motion components using LazyMotion
export const OptimizedMotion = {
  div: React.forwardRef<HTMLDivElement, ComponentProps<typeof m.div>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.div ref={ref} {...props} />
    </LazyMotion>
  )),
  
  span: React.forwardRef<HTMLSpanElement, ComponentProps<typeof m.span>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.span ref={ref} {...props} />
    </LazyMotion>
  )),
  
  button: React.forwardRef<HTMLButtonElement, ComponentProps<typeof m.button>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.button ref={ref} {...props} />
    </LazyMotion>
  )),
  
  nav: React.forwardRef<HTMLElement, ComponentProps<typeof m.nav>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.nav ref={ref} {...props} />
    </LazyMotion>
  )),
  
  article: React.forwardRef<HTMLElement, ComponentProps<typeof m.article>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.article ref={ref} {...props} />
    </LazyMotion>
  )),
  
  section: React.forwardRef<HTMLElement, ComponentProps<typeof m.section>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.section ref={ref} {...props} />
    </LazyMotion>
  )),
  
  p: React.forwardRef<HTMLParagraphElement, ComponentProps<typeof m.p>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.p ref={ref} {...props} />
    </LazyMotion>
  )),
  
  h1: React.forwardRef<HTMLHeadingElement, ComponentProps<typeof m.h1>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.h1 ref={ref} {...props} />
    </LazyMotion>
  )),
  
  h2: React.forwardRef<HTMLHeadingElement, ComponentProps<typeof m.h2>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.h2 ref={ref} {...props} />
    </LazyMotion>
  )),
  
  h3: React.forwardRef<HTMLHeadingElement, ComponentProps<typeof m.h3>>((props, ref) => (
    <LazyMotion features={domAnimation} strict>
      <m.h3 ref={ref} {...props} />
    </LazyMotion>
  )),
};

// Add display names for better debugging
OptimizedMotion.div.displayName = 'OptimizedMotion.div';
OptimizedMotion.span.displayName = 'OptimizedMotion.span';
OptimizedMotion.button.displayName = 'OptimizedMotion.button';
OptimizedMotion.nav.displayName = 'OptimizedMotion.nav';
OptimizedMotion.article.displayName = 'OptimizedMotion.article';
OptimizedMotion.section.displayName = 'OptimizedMotion.section';
OptimizedMotion.p.displayName = 'OptimizedMotion.p';
OptimizedMotion.h1.displayName = 'OptimizedMotion.h1';
OptimizedMotion.h2.displayName = 'OptimizedMotion.h2';
OptimizedMotion.h3.displayName = 'OptimizedMotion.h3';

/**
 * Hardware-accelerated animation variants
 * Use transform and opacity for 60fps animations
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' },
  animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
  exit: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9, transform: 'scale(0.9)' },
  animate: { opacity: 1, scale: 1, transform: 'scale(1)' },
  exit: { opacity: 0, scale: 0.9, transform: 'scale(0.9)' },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' },
  animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
  exit: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' },
  animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
  exit: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' },
};

/**
 * Optimized transition presets
 */
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  medium: { duration: 0.3, ease: 'easeInOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springSmooth: { type: 'spring', stiffness: 200, damping: 25 },
};
