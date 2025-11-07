'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  duration?: number;
  filter?: boolean;
  cursor?: boolean;
}

/**
 * TextGenerateEffect - Animated text generation effect
 * 
 * @example
 * ```tsx
 * <TextGenerateEffect words="Welcome to NextEchoBox" duration={2} />
 * ```
 */
export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className,
  duration = 2,
  filter = true,
  cursor = true,
}) => {
  const [renderedText, setRenderedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < words.length) {
        setRenderedText(prev => prev + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, (duration * 1000) / words.length);

    return () => clearTimeout(timeout);
  }, [currentIndex, words, duration]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <span
          className={cn(
            'text-gradient font-bold',
            filter && 'animate-pulse'
          )}
        >
          {renderedText}
        </span>
        {cursor && currentIndex < words.length && (
          <motion.span
            className="inline-block w-1 h-5 bg-[var(--color-primary-mid)] ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Hidden full text for layout */}
      <div className="absolute opacity-0 pointer-events-none">
        {words}
      </div>
    </div>
  );
};

interface TextRevealCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TextRevealCard - Card with text reveal animation
 */
export const TextRevealCard: React.FC<TextRevealCardProps> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] glass p-6',
        className
      )}
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

interface FlipWordsProps {
  words: string[];
  className?: string;
  duration?: number;
}

/**
 * FlipWords - Animated word flip effect
 */
export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  className,
  duration = 3,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 150);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={cn('relative h-8', className)}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        key={currentWordIndex}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: -90, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-gradient font-bold text-2xl">
          {words[currentWordIndex]}
        </span>
      </motion.div>
      
      {/* Hidden words for layout */}
      <div className="opacity-0 pointer-events-none">
        {words.map((word, index) => (
          <span key={index} className="font-bold text-2xl">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
