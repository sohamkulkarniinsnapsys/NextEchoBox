'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TextGenerateEffectOptimizedProps {
  words: string;
  className?: string;
  duration?: number;
  filter?: boolean;
  cursor?: boolean;
}

/**
 * TextGenerateEffectOptimized - Optimized text generation with reduced re-renders
 * Uses requestAnimationFrame for smoother animations and less CPU usage
 * 
 * @example
 * ```tsx
 * <TextGenerateEffectOptimized words="Welcome to NextEchoBox" duration={2} />
 * ```
 */
export const TextGenerateEffectOptimized: React.FC<TextGenerateEffectOptimizedProps> = React.memo(({
  words,
  className,
  duration = 2,
  filter = true,
  cursor = true,
}) => {
  const [renderedText, setRenderedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!words) return;
    
    const totalDuration = duration * 1000;
    const startTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const charIndex = Math.floor(progress * words.length);

      setRenderedText(words.slice(0, charIndex));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [words, duration]);

  const cursorElement = useMemo(() => {
    if (!cursor || isComplete) return null;
    
    return (
      <span
        className="inline-block w-1 h-5 bg-[var(--color-primary-mid)] ml-1 animate-pulse"
        style={{
          animation: 'blink 0.5s infinite',
        }}
      />
    );
  }, [cursor, isComplete]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <span
          className={cn(
            'text-gradient font-bold',
            filter && !isComplete && 'animate-pulse'
          )}
        >
          {renderedText}
        </span>
        {cursorElement}
      </div>
      
      {/* Hidden full text for layout - prevents CLS */}
      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
        {words}
      </div>
      
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
});

TextGenerateEffectOptimized.displayName = 'TextGenerateEffectOptimized';

interface TextRevealCardOptimizedProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TextRevealCardOptimized - Card with CSS-only reveal animation
 */
export const TextRevealCardOptimized: React.FC<TextRevealCardOptimizedProps> = React.memo(({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] glass p-6',
        'animate-reveal',
        className
      )}
    >
      <div className="animate-fade-in-up">
        {children}
      </div>
      
      <style jsx>{`
        @keyframes reveal {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 1000px;
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .animate-reveal {
          animation: reveal 0.5s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
});

TextRevealCardOptimized.displayName = 'TextRevealCardOptimized';

interface FlipWordsOptimizedProps {
  words: string[];
  className?: string;
  duration?: number;
}

/**
 * FlipWordsOptimized - CSS-based word flip with reduced JS
 */
export const FlipWordsOptimized: React.FC<FlipWordsOptimizedProps> = React.memo(({
  words,
  className,
  duration = 3,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={cn('relative h-8', className)}>
      <div
        key={currentWordIndex}
        className="absolute inset-0 flex items-center justify-center animate-flip-word"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <span className="text-gradient font-bold text-2xl">
          {words[currentWordIndex]}
        </span>
      </div>
      
      {/* Hidden words for layout */}
      <div className="opacity-0 pointer-events-none" aria-hidden="true">
        {words.map((word, index) => (
          <span key={index} className="font-bold text-2xl">
            {word}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes flip-word {
          0% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          50% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
        
        .animate-flip-word {
          animation: flip-word 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
});

FlipWordsOptimized.displayName = 'FlipWordsOptimized';
