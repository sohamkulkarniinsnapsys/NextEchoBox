'use client';

import React, { ReactNode } from 'react';
import { motion, Variants, Transition } from 'framer-motion';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const baseItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as any,
    },
  },
};

export function AnimatedListItem({
  children,
  className = '',
  delay = 0,
}: AnimatedListItemProps) {
  const transitionWithDelay: Transition = {
    duration: 0.45,
    ease: 'easeOut' as any,
    delay,
  };

  const itemVariants: Variants = {
    hidden: baseItemVariants.hidden,
    visible: {
      opacity: 1,
      y: 0,
      transition: transitionWithDelay,
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 0.1,
}: AnimatedListProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => {
        const delay = i * staggerDelay;
        const key = (child as any)?.key ?? `alist-${i}`;
        return (
          <AnimatedListItem key={String(key)} delay={delay}>
            {child}
          </AnimatedListItem>
        );
      })}
    </div>
  );
}

export const slideInListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const slideInItemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

export const scaleInListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleInItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};
