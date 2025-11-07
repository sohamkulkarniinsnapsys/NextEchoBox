'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Clock, AlertTriangle } from 'lucide-react';
import { Message } from '@/model/User';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <AceternityCard
        variant="glass"
        accentEdge="left"
        className="group"
        tiltOnHover
      >
        <article className="p-6 space-y-4">
          {/* Header with timestamp */}
          <div className="flex items-start justify-between gap-4">
            <motion.div
              className="flex items-center gap-2 text-[var(--text-tertiary)] text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Clock className="w-4 h-4" />
              </motion.div>
              <time dateTime={message.createdAt.toString()}>
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
              </time>
            </motion.div>

            {/* Delete button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.button
                  className={cn(
                    'p-2 rounded-[var(--radius-sm)] glass',
                    'text-[var(--text-secondary)] hover:text-[var(--color-accent-error)]',
                    'hover:bg-[var(--color-accent-error)]/10',
                    'transition-all duration-[var(--motion-fast)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-error)]',
                    'opacity-60 group-hover:opacity-100 group-focus-within:opacity-100'
                  )}
                  aria-label="Delete message"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  whileFocus={{ opacity: 1 }}
                >
                  <Trash2 className="cursor-pointer w-4 h-4" />
                </motion.button>
              </AlertDialogTrigger>

              <AlertDialogContent className="glass border-gradient text-[var(--text-primary)]">
                <AlertDialogHeader>
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <AlertTriangle className="w-6 h-6 text-[var(--color-accent-error)]" />
                    </motion.div>
                    <AlertDialogTitle className="text-[var(--text-primary)]">
                      Delete Message?
                    </AlertDialogTitle>
                  </motion.div>
                  <AlertDialogDescription className="text-[var(--text-secondary)]">
                    This action cannot be undone. This will permanently delete
                    this anonymous message.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-end items-center gap-3">
                  {/* Cancel - neutral/outline look */}
                  <AlertDialogCancel asChild>
                    <FancyButton
                      variant="gradient"
                      size="sm"
                      className="cursor-pointer h-9 px-3 text-sm bg-opacity-60 border-white/10 text-white/90 hover:bg-white/5 hover:text-amber-50 hover:scale-109"
                    >
                      Cancel
                    </FancyButton>
                  </AlertDialogCancel>

                  {/* Delete - destructive / warm gradient */}
                  <AlertDialogAction asChild>
                    <FancyButton
                      variant="gradient"
                      size="sm"
                      onClick={handleDeleteConfirm}
                      loading={isDeleting}
                      className="cursor-pointer h-9 px-3 text-sm bg-gradient-to-br from-[#ff0202] via-[#e84343] to-[#d06a6a] text-white shadow-var(--shadow-elev-2) hover:shadow-var(--shadow-button-hover) hover:scale-109"
                    >
                      Delete
                    </FancyButton>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Message content */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-[var(--text-primary)] text-base leading-relaxed">
              {message.content}
            </p>
          </motion.div>
        </article>
      </AceternityCard>
    </motion.div>
  );
}
