'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Clock } from 'lucide-react';
import { Message } from '@/model/User';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FancyButton } from './ui/FancyButton';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { cn } from '@/lib/utils';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to delete message'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <GlassCard 
      variant="medium" 
      accentEdge="left" 
      accentColor="primary"
      hoverable
      className="group"
    >
      <article className="p-6 space-y-4">
        {/* Header with timestamp */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)] text-sm">
            <Clock className="w-4 h-4" />
            <time dateTime={message.createdAt.toString()}>
              {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </time>
          </div>
          
          {/* Delete button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={cn(
                  'p-2 rounded-[var(--ui-radius-sm)]',
                  'text-[var(--text-secondary)] hover:text-[oklch(0.65_0.25_25)]',
                  'hover:bg-[oklch(0.65_0.25_25)]/10',
                  'transition-all duration-[var(--motion-fast)]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.65_0.25_25)]',
                  'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                )}
                aria-label="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[var(--bg-surface)]/95 backdrop-blur-[var(--blur-strong)] border border-white/[0.12] text-[var(--text-primary)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[var(--text-primary)]">Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-[var(--text-secondary)]">
                  This action cannot be undone. This will permanently delete this anonymous message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <FancyButton variant="ghost" size="sm">
                    Cancel
                  </FancyButton>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <FancyButton 
                    variant="solid" 
                    size="sm"
                    onClick={handleDeleteConfirm}
                    loading={isDeleting}
                    className="bg-gradient-to-br from-[oklch(0.65_0.25_25)] to-[oklch(0.70_0.20_15)] hover:shadow-[0_0_24px_oklch(0.65_0.25_25_/_0.3)]"
                  >
                    Delete
                  </FancyButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Message content */}
        <div className="space-y-2">
          <p className="text-[var(--text-primary)] text-base leading-relaxed">
            {message.content}
          </p>
        </div>
      </article>
    </GlassCard>
  );
}