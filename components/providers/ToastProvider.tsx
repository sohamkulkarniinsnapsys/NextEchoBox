'use client';

import React from 'react';
import { Toaster } from 'sonner';

/**
 * ToastProvider - Configures Sonner toasts with premium theme
 * 
 * Features:
 * - Slide in from bottom-right
 * - Luminous borders matching theme
 * - Custom iconography
 * - Accessible ARIA labels
 * 
 * @example
 * ```tsx
 * <ToastProvider />
 * ```
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'oklch(0.18 0.03 265 / 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--ui-radius-md, 12px)',
          color: 'oklch(0.98 0.01 265)',
          boxShadow: '0 8px 32px oklch(0 0 0 / 0.16), 0 4px 8px oklch(0 0 0 / 0.20)',
        },
        className: 'fancy-toast',
      }}
    />
  );
}
