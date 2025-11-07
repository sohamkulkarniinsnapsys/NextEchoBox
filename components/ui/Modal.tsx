'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal - Accessible dialog with frosted backdrop and scale-fade entrance
 * 
 * @example
 * ```tsx
 * <Modal
 *   trigger={<button>Open Modal</button>}
 *   title="Modal Title"
 *   description="Modal description"
 * >
 *   <p>Modal content</p>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[var(--z-modal-backdrop)]',
            'bg-[var(--bg-deep)]/80 backdrop-blur-[var(--blur-medium)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'transition-all duration-[var(--motion-medium)]'
          )}
        />
        
        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-[var(--z-modal)]',
            'translate-x-[-50%] translate-y-[-50%]',
            'w-[90vw] max-w-lg max-h-[85vh] overflow-auto',
            'bg-[var(--bg-surface)]/90 backdrop-blur-[var(--blur-strong)]',
            'border border-white/[0.12] rounded-[var(--ui-radius-xl)]',
            'shadow-[var(--shadow-elev-3)]',
            'p-6 md:p-8',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-[var(--motion-medium)]',
            'focus:outline-none',
            className
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <Dialog.Title className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-base text-[var(--text-secondary)]">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="text-[var(--text-primary)]">
            {children}
          </div>
          
          {/* Close button */}
          <Dialog.Close
            className={cn(
              'absolute right-4 top-4',
              'inline-flex items-center justify-center',
              'rounded-[var(--ui-radius-sm)] p-2',
              'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              'hover:bg-white/[0.08] transition-all duration-[var(--motion-fast)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.22_260)]'
            )}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
