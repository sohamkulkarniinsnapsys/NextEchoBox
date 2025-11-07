'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * GlassInput - Premium input with floating label and glass aesthetic
 * 
 * @example
 * ```tsx
 * <GlassInput 
 *   label="Email" 
 *   type="email" 
 *   error="Invalid email"
 * />
 * ```
 */
export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative w-full">
        {/* Input */}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-[var(--ui-radius-md)]',
            'bg-white/[0.05] border-2 border-white/[0.12]',
            'backdrop-blur-[var(--blur-subtle)]',
            'text-[var(--text-primary)] placeholder-transparent',
            'transition-all duration-[var(--motion-fast)]',
            'focus:outline-none focus:border-[oklch(0.70_0.22_260)] focus:bg-white/[0.08]',
            'focus:shadow-[0_0_0_4px_oklch(0.70_0.22_260_/_0.1)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[oklch(0.65_0.25_25)] focus:border-[oklch(0.65_0.25_25)]',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={label || props.placeholder}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <label
            className={cn(
              'absolute left-4 pointer-events-none',
              'transition-all duration-[var(--motion-fast)]',
              'text-[var(--text-secondary)]',
              (isFocused || hasValue) ? [
                'top-[-10px] text-xs px-2',
                'bg-[var(--bg-deep)] rounded-md',
                isFocused && 'text-[oklch(0.70_0.22_260)]',
              ] : 'top-3 text-base'
            )}
          >
            {label}
          </label>
        )}

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <div
            className={cn(
              'mt-2 text-sm px-1',
              'animate-in slide-in-from-top-1 duration-200',
              error ? 'text-[oklch(0.65_0.25_25)]' : 'text-[var(--text-tertiary)]'
            )}
            role={error ? 'alert' : undefined}
            aria-live={error ? 'polite' : undefined}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
