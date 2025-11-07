'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageCircle } from 'lucide-react';
import { FancyButton } from '@/components/ui/FancyButton';
import { GlassCard } from '@/components/ui/GlassCard';
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)]">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            Send Message to <span className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] via-[oklch(0.70_0.22_260)] to-[oklch(0.75_0.18_220)] bg-clip-text text-transparent">@{username}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Your message will be completely anonymous
          </p>
        </div>

        {/* Message Composer */}
        <GlassCard variant="medium" accentEdge="top" accentColor="primary" className="p-6 md:p-8 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Textarea */}
            <div className="relative">
              <textarea
                {...form.register('content')}
                placeholder="Write your anonymous message here..."
                rows={6}
                disabled={isLoading}
                className={cn(
                  'w-full px-4 py-3 rounded-[var(--ui-radius-md)]',
                  'bg-white/[0.05] border-2 border-white/[0.12]',
                  'backdrop-blur-[var(--blur-subtle)]',
                  'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
                  'transition-all duration-[var(--motion-fast)]',
                  'focus:outline-none focus:border-[oklch(0.70_0.22_260)] focus:bg-white/[0.08]',
                  'focus:shadow-[0_0_0_4px_oklch(0.70_0.22_260_/_0.1)]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'resize-none',
                  form.formState.errors.content && 'border-[oklch(0.65_0.25_25)]'
                )}
              />
              {form.formState.errors.content && (
                <p className="mt-2 text-sm text-[oklch(0.65_0.25_25)] animate-in slide-in-from-top-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <FancyButton
                type="button"
                onClick={fetchSuggestedMessages}
                variant="outline"
                size="lg"
                disabled={isSuggestLoading}
                className="flex-1 gap-2"
              >
                {isSuggestLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                AI Suggest
              </FancyButton>
              <FancyButton
                type="submit"
                variant="solid"
                size="lg"
                disabled={isLoading || !messageContent}
                loading={isLoading}
                className="flex-1 gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </FancyButton>
            </div>
          </form>
        </GlassCard>

        {/* AI Suggestions */}
        {(completion !== initialMessageString || suggestError) && (
          <GlassCard variant="medium" className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[oklch(0.75_0.18_220)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Suggested Messages
              </h3>
            </div>
            
            {suggestError ? (
              <div className="p-4 rounded-[var(--ui-radius-md)] bg-[oklch(0.65_0.25_25)]/10 border border-[oklch(0.65_0.25_25)]/30">
                <p className="text-[oklch(0.65_0.25_25)] text-sm">{suggestError}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {parseStringMessages(completion)
                  .filter((message) => message.trim().length > 0)
                  .map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageClick(message)}
                      className={cn(
                        'p-4 rounded-[var(--ui-radius-md)] text-left',
                        'bg-white/[0.05] border border-white/[0.08]',
                        'hover:bg-white/[0.08] hover:border-white/[0.15]',
                        'transition-all duration-[var(--motion-fast)]',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.22_260)]',
                        'text-[var(--text-primary)]'
                      )}
                    >
                      {message}
                    </button>
                  ))}
              </div>
            )}
            <p className="text-[var(--text-tertiary)] text-sm">
              Click any suggestion to use it as your message
            </p>
          </GlassCard>
        )}

        {/* CTA */}
        <GlassCard variant="subtle" className="p-6 md:p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Want your own message board?
          </h3>
          <p className="text-[var(--text-secondary)]">
            Create your account and start receiving anonymous messages
          </p>
          <Link href="/sign-up">
            <FancyButton variant="warm" size="lg">
              Create Your Account
            </FancyButton>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}