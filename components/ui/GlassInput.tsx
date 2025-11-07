'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
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
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative w-full">
        {/* Input */}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-[var(--radius-md)]',
            'bg-white/[0.05] border-2 border-white/[0.12]',
            'backdrop-blur-[var(--blur-subtle)]',
            'text-[var(--text-primary)] placeholder-transparent',
            'transition-all duration-[var(--motion-fast)]',
            'focus:outline-none focus:border-[var(--color-primary-mid)] focus:bg-white/[0.08]',
            'focus:shadow-[0_0_0_4px_var(--color-primary-mid)_/_0.1)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-accent-error)] focus:border-[var(--color-accent-error)]',
            icon && 'pl-12',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={label || props.placeholder}
          {...props}
        />

        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            {icon}
          </div>
        )}

        {/* Floating Label */}
        {label && (
          <label
            className={cn(
              'absolute pointer-events-none',
              'transition-all duration-[var(--motion-fast)]',
              'text-[var(--text-secondary)]',
              icon ? 'left-12' : 'left-4',
              (isFocused || hasValue) ? [
                'top-[-10px] text-xs px-2',
                'bg-[var(--bg-deep)] rounded-md',
                isFocused && 'text-[var(--color-primary-mid)]',
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
