'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, Send, Sparkles, MessageCircle, MessageSquare, Wand2, ArrowRight, UserPlus } from 'lucide-react';
import { FancyButton } from '@/components/ui/FancyButton';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { AuroraBackground } from '@/components/ui/aceternity/AuroraBackground';
import { BackgroundBeams } from '@/components/ui/aceternity/BackgroundBeams';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { cn } from '@/lib/utils';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [completion, setCompletion] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to sent message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    try {
      console.log('🤖 Fetching AI suggestions...');
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Suggestions received:', data);
      
      if (data.suggestions) {
        setCompletion(data.suggestions);
        console.log('📝 Set completion to:', data.suggestions);
      } else if (data.error) {
        setSuggestError(data.error);
        console.error('❌ API error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setSuggestError(error instanceof Error ? error.message : 'Failed to fetch suggestions');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <AuroraBackground showRadialGradient={false} />
        <BackgroundBeams />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 rounded-full bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)] shadow-[var(--shadow-neon)]">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <MessageSquare className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TextGenerateEffect 
              words={`Send Message to @${username}`}
              className="text-4xl md:text-5xl font-bold text-gradient"
              duration={2}
            />
          </motion.div>
          
          <motion.p 
            className="text-[var(--text-secondary)] text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Your message will be completely anonymous
          </motion.p>
        </motion.div>

        {/* Message Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AceternityCard
            variant="glass" 
            accentEdge="top" 
            className="p-6 md:p-8 space-y-6"
            tiltOnHover
          >
            <motion.form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              {/* Textarea */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="relative"
              >
                <motion.textarea
                  {...form.register('content')}
                  placeholder="Write your anonymous message here..."
                  rows={6}
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                  className={cn(
                    'w-full px-4 py-3 rounded-[var(--radius-md)]',
                    'glass border-2 border-white/[0.12]',
                    'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
                    'transition-all duration-[var(--motion-fast)]',
                    'focus:outline-none focus:border-[var(--color-primary-mid)] focus:bg-white/[0.08]',
                    'focus:shadow-[0_0_0_4px_var(--color-primary-mid)_/_0.1)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-none',
                    form.formState.errors.content && 'border-[var(--color-accent-error)]'
                  )}
                />
                {form.formState.errors.content && (
                  <motion.p 
                    className="mt-2 text-sm text-[var(--color-accent-error)]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {form.formState.errors.content.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Actions */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                {/* AI Suggest */}
                <motion.div
                  whileHover={{ scale: isSuggestLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isSuggestLoading ? 1 : 0.98 }}
                  className="flex-1"
                >
                  <FancyButton
                    type="button"
                    onClick={fetchSuggestedMessages}
                    variant="gradient"
                    size="lg"
                    disabled={isSuggestLoading}
                    className={cn(
                      'w-full inline-flex items-center justify-center',
                      'gap-3 px-5 py-2',
                      'rounded-full min-h-[48px]',
                      'whitespace-nowrap font-medium text-white',
                      'shadow-[0_8px_24px_rgba(59,130,246,0.10)]',
                      'transition-all duration-150 ease-in-out',
                      'cursor-pointer'
                    )}
                    style={{
                      // gradient consistent with your previous AI suggest
                      background: 'linear-gradient(90deg,#7c6cff 0%,#28b1ff 100%)',
                      filter: 'none',
                    }}
                    aria-label="AI Suggest"
                  >
                    {isSuggestLoading ? (
                      <>
                        <motion.span
                          className="inline-flex items-center justify-center w-5 h-5"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          aria-hidden="true"
                        >
                          <Loader2 className="w-4 h-4" />
                        </motion.span>
                        <span className="leading-none">Suggesting…</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center justify-center w-5 h-5" aria-hidden="true">
                          <Wand2 className="w-5 h-5" />
                        </span>
                        <span className="leading-none">AI Suggest</span>
                      </>
                    )}
                  </FancyButton>
                </motion.div>

                {/* Send Message — made to visually match AI Suggest */}
                <motion.div
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="cursor-pointer flex-1"
                >
                  {(() => {
                    const isDisabled = isLoading || !(messageContent && messageContent.toString().trim().length > 0);

                    const enabledBg = 'linear-gradient(90deg,#7c6cff 0%,#28b1ff 100%)';
                    const disabledBg = 'linear-gradient(90deg,#343a44 0%,#2a2f35 100%)';

                    return (
                      <FancyButton
                        type="submit"
                        variant="gradient"
                        size="lg"
                        disabled={isDisabled}
                        {...(isLoading ? { loading: true } : {})}
                        aria-label="Send message"
                        className={cn(
                          'w-full inline-flex items-center justify-center',
                          'gap-3 px-5 py-2',
                          'rounded-full min-h-[48px]',
                          'whitespace-nowrap font-medium text-white',
                          'shadow-[0_8px_24px_rgba(59,130,246,0.10)]',
                          'transition-all duration-150 ease-in-out',
                          'cursor-pointer'
                        )}
                        style={{
                          background: isDisabled ? disabledBg : enabledBg,
                          opacity: isDisabled ? 0.88 : 1,
                          pointerEvents: isDisabled ? 'none' as const : 'auto' as const,
                          filter: 'none',
                        }}
                      >
                        {isLoading ? (
                          <>
                            <motion.span
                              className="inline-flex items-center justify-center w-6 h-6"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              aria-hidden="true"
                            >
                              <Loader2 className="w-4 h-4" />
                            </motion.span>

                            <span className="flex-1 text-center leading-none">Sending…</span>

                            <span className="inline-flex items-center justify-center w-6 h-6 opacity-0" aria-hidden="true">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center justify-center w-6 h-6" aria-hidden="true">
                              <Send className="w-5 h-5" />
                            </span>

                            <span className="flex-1 text-center leading-none">Send Message</span>

                            <span className="inline-flex items-center justify-center w-6 h-6" aria-hidden="true">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </>
                        )}
                      </FancyButton>
                    );
                  })()}
                </motion.div>
              </motion.div>
            </motion.form>
          </AceternityCard>
        </motion.div>

        {/* AI Suggestions */}
        {(completion !== initialMessageString || suggestError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <AceternityCard 
              variant="gradient" 
              accentEdge="left" 
              className="p-6 md:p-8 space-y-4"
              floatOnHover
            >
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Sparkles className="w-5 h-5 text-[var(--color-accent-mint)]" />
                </motion.div>
                <motion.h3 
                  className="text-lg font-bold text-gradient mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  Suggested Messages
                </motion.h3>
              </motion.div>
              
              {suggestError ? (
                <motion.div 
                  className="p-4 rounded-[var(--radius-md)] glass border border-[var(--color-accent-error)]/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[var(--color-accent-error)] text-sm">{suggestError}</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: 0.1 }}
                >
                  {parseStringMessages(completion)
                    .filter((message) => message.trim().length > 0)
                    .map((message, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleMessageClick(message)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1, delay: 0.1 + index * 0.1 }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'p-4 rounded-[var(--radius-md)] text-left',
                          'glass border border-white/15',
                          'hover:bg-white/[0.08] hover:border-[var(--color-primary-mid)]/30',
                          'transition-all duration-var(--motion-fast)',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-mid)]',
                          'text-[var(--text-primary)]',
                          'cursor-pointer'
                        )}
                      >
                        {message}
                      </motion.button>
                    ))}
                </motion.div>
              )}
              <motion.p 
                className="text-[var(--text-tertiary)] text-sm mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                Click any suggestion to use it as your message
              </motion.p>
            </AceternityCard>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <AceternityCard 
            variant="gradient" 
            accentEdge="bottom" 
            className="p-6 md:p-8 text-center space-y-4"
            tiltOnHover
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.9 }}
            >
              <motion.h3 
                className="text-xl font-bold text-gradient"
                whileHover={{ scale: 1.05 }}
              >
                Want your own message board?
              </motion.h3>
            </motion.div>
            
            <motion.p 
              className="text-[var(--text-secondary)] m-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              Create your account and start receiving anonymous messages
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-up">
  <FancyButton
    variant="gradient"
    size="lg"
    className={cn(
      'inline-flex items-center justify-center gap-3 px-6 py-2',   // spacing
      'rounded-full min-h-[48px] whitespace-nowrap',              // pill shape
      'font-medium text-white text-base',                         // typography
      'shadow-[0_8px_24px_rgba(59,130,246,0.10)]',
      'transition-all duration-150 ease-in-out',
      // allow animated icon to grow without being clipped
      'overflow-visible bg-clip-padding',
      'cursor-pointer'
    )}
    style={{
      background: 'linear-gradient(90deg,#7c6cff 0%,#28b1ff 100%)',
      filter: 'none',
    }}
    aria-label="Create your account"
  >
    {/* Animated icon — only this element animates.
        Use a fixed-size inline-flex box so it doesn't change the label layout. */}
    <motion.span
      className="inline-flex items-center justify-center w-6 h-6 flex-shrink-0"
      animate={{ scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
      style={{ transformOrigin: 'center' }}
      aria-hidden="true"
    >
      <UserPlus className="w-4 h-4" />
    </motion.span>

    {/* Label stays centered and never moves */}
    <span className="leading-none">Create Your Account</span>

    {/* Right arrow — static so it doesn't affect centering */}
    <span className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0" aria-hidden="true">
      <ArrowRight className="w-4 h-4" />
    </span>
  </FancyButton>
</Link>

            </motion.div>
          </AceternityCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
