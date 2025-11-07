'use client';

import { MessageCard } from '@/components/MessageCard';
import { FancyButton } from '@/components/ui/FancyButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Check, MessageSquare, BarChart3, Link as LinkIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { cn } from '@/lib/utils';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', !!response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
        'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages((response.data.messages as Message[]) || []);

        if (refresh) {
          toast.success('Showing latest messages');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? 'Failed to fetch messages'
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [] // State setters are stable, no deps needed
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?._id]); // Only re-fetch when user ID changes, not entire session object

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
        'Failed to update message settings'
      );
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success('Profile URL has been copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl space-y-8">
      {/* Hero Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
            Welcome back, <span className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] via-[oklch(0.70_0.22_260)] to-[oklch(0.75_0.18_220)] bg-clip-text text-transparent">@{username}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Manage your anonymous messages and share your profile
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Messages */}
          <GlassCard variant="medium" accentEdge="left" accentColor="primary" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)]">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Total Messages</p>
                <p className="text-[var(--text-primary)] text-3xl font-bold">{messages.length}</p>
              </div>
            </div>
          </GlassCard>

          {/* Status */}
          <GlassCard variant="medium" accentEdge="left" accentColor="mint" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.78_0.16_165)] to-[oklch(0.75_0.18_180)]">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Status</p>
                <p className={cn(
                  "text-2xl font-bold",
                  acceptMessages ? "text-[oklch(0.78_0.16_165)]" : "text-[var(--text-secondary)]"
                )}>
                  {acceptMessages ? 'Accepting' : 'Paused'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Profile Link */}
          <GlassCard variant="medium" accentEdge="left" accentColor="warm" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.72_0.20_35)] to-[oklch(0.80_0.15_85)]">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Profile Link</p>
                <p className="text-[var(--text-primary)] text-lg font-semibold truncate">u/{username}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Profile URL Section */}
      <GlassCard variant="medium" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Your Unique Link</h2>
          <FancyButton
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </FancyButton>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-[var(--ui-radius-md)] bg-white/[0.05] border border-white/[0.08]">
          <LinkIcon className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
          <code className="text-[var(--text-primary)] text-sm md:text-base font-mono flex-1 truncate">
            {profileUrl}
          </code>
        </div>
        <p className="text-[var(--text-tertiary)] text-sm">
          Share this link to receive anonymous messages from anyone
        </p>
      </GlassCard>

      {/* Settings Section */}
      <GlassCard variant="medium" className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Message Settings</h2>
            <p className="text-[var(--text-secondary)] text-sm">
              {acceptMessages 
                ? 'You are currently accepting anonymous messages' 
                : 'Message receiving is paused'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[oklch(0.65_0.25_280)] data-[state=checked]:to-[oklch(0.75_0.18_220)]"
            />
            <span className="text-[var(--text-primary)] font-medium">
              {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Your Messages
          </h2>
          <FancyButton
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            Refresh
          </FancyButton>
        </div>

        {/* Messages Grid */}
        {isLoading && messages.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} variant="subtle" className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-white/[0.1] rounded w-3/4"></div>
                  <div className="h-4 bg-white/[0.1] rounded w-1/2"></div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((message: Message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <GlassCard variant="medium" className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)] flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                No messages yet
              </h3>
              <p className="text-[var(--text-secondary)]">
                Share your profile link to start receiving anonymous messages
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;