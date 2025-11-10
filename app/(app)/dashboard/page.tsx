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
import { motion } from 'framer-motion';
import { Loader2, RefreshCcw, Copy, Check, MessageSquare, BarChart3, Link as LinkIcon, Sparkles } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { cn } from '@/lib/utils';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { AuroraBackground } from '@/components/ui/aceternity/AuroraBackground';
import { AnimatedList, AnimatedListItem } from '@/components/ui/AnimatedList';

function UserDashboard() {
  const POLL_INTERVAL_MS = 5000;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const prevMessagesRef = useRef<Message[]>([]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id.toString() !== messageId));
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
    async (refresh: boolean = false, silent: boolean = false) => {
      if (!silent) {
        setIsLoading(true);
        setIsSwitchLoading(false);
      }

      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        const newMessages = (response.data.messages as Message[]) || [];

        setMessages((prev) => {
          const prevStr = JSON.stringify(prev.map((m) => m._id));
          const newStr = JSON.stringify(newMessages.map((m) => m._id));

          const changed = prevStr !== newStr;

          if (refresh) {
            toast.success('Showing latest messages');
          } else if (silent && changed) {
            const prevLen = prev.length;
            const newLen = newMessages.length;
            if (newLen > prevLen) {
              const diff = newLen - prevLen;
              toast.success(`${diff} new message${diff > 1 ? 's' : ''}`);
            } else {
              toast('Messages updated');
            }
          }

          prevMessagesRef.current = newMessages;
          return newMessages;
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (!silent) {
          toast.error(
            axiosError.response?.data.message ?? 'Failed to fetch messages'
          );
        }
      } finally {
        if (!silent) {
          setIsLoading(false);
          setIsSwitchLoading(false);
        } else {
          // ensure switch loading false even for silent fetches
          setIsSwitchLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!session || !session.user) return;

    // initial fetches
    fetchMessages(false, false);
    fetchAcceptMessages();

  }, [session?.user?._id]);

  useEffect(() => {
    if (!session || !session.user) return;

    const intervalId = setInterval(() => {
      fetchMessages(false, true);
    }, POLL_INTERVAL_MS);

    const immediateTimeout = setTimeout(() => fetchMessages(false, true), 2000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(immediateTimeout);
    };
  }, [session?.user?._id, fetchMessages]);

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

  // safe in client component
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
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          {/* Aurora background for hero */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <AuroraBackground showRadialGradient={false} />
          </div>
          
          <div className="relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TextGenerateEffect 
                words={`Welcome back, @${username}`}
                className="text-4xl md:text-5xl font-bold mb-4"
                duration={2}
              />
            </motion.div>
            
            
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Total Messages */}
          <AceternityCard 
            variant="3d" 
            accentEdge="top" 
            className="p-6"
            tiltOnHover
          >
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-3 rounded-full bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)]"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Total Messages</p>
                <motion.p 
                  className="text-[var(--text-primary)] text-3xl font-bold text-gradient"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {messages.length}
                </motion.p>
              </div>
            </motion.div>
          </AceternityCard>

          {/* Status */}
          <AceternityCard 
            variant="gradient" 
            accentEdge="top" 
            className="p-6"
            floatOnHover
          >
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-3 rounded-full bg-gradient-to-br from-[var(--color-accent-mint)] to-[var(--color-primary-end)]"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Status</p>
                <motion.p className={cn(
                  "text-2xl font-bold",
                  acceptMessages ? "text-[var(--color-accent-mint)]" : "text-[var(--text-secondary)]"
                )}
                animate={{
                  scale: acceptMessages ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: acceptMessages ? Infinity : 0,
                  repeatDelay: 3,
                }}>
                  {acceptMessages ? 'Accepting' : 'Paused'}
                </motion.p>
              </div>
            </motion.div>
          </AceternityCard>

          {/* Profile Link */}
          <AceternityCard 
            variant="3d" 
            accentEdge="top" 
            className="p-6"
            tiltOnHover
          >
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="p-3 rounded-full bg-gradient-to-br from-[var(--color-accent-warm)] to-[var(--color-accent-gold)]"
                animate={{
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <LinkIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Profile Link</p>
                <p className="text-[var(--text-primary)] text-lg font-semibold truncate text-gradient">u/{username}</p>
              </div>
            </motion.div>
          </AceternityCard>
        </motion.div>
      </motion.div>

      {/* Profile URL Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <AceternityCard 
          variant="glass" 
          accentEdge="left" 
          className="p-6 md:p-8 space-y-4"
          tiltOnHover
        >
          <motion.div 
            className="flex items-center justify-between"
            whileHover={{ scale: 1.01 }}
          >
            <motion.h2 
              className="text-xl font-bold text-gradient"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Sparkles className="inline w-5 h-5 mr-2 text-[var(--color-primary-end)]" />
              Your Unique Link
            </motion.h2>
            {/* top-right button (replace your existing motion.div + FancyButton here) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0"
            >
              <FancyButton
                onClick={copyToClipboard}
                variant="gradient"
                size="sm"
                className="
                cursor-pointer
                  inline-flex items-center justify-center
                  gap-2
                  px-3 py-1.5
                  rounded-full
                  min-h-9
                  min-w-[108px]
                  whitespace-nowrap
                  font-medium
                  text-white
                  shadow-[0_6px_18px_rgba(59,130,246,0.12)]
                  bg-linear-to-r from-[#7c6cff] to-[#28b1ff]
                  hover:shadow-lg hover:brightness-105
                  active:brightness-95
                  transition-all duration-150 ease-in-out
                "
              >
                {copied ? (
                  <>
                    <motion.span
                      className="inline-flex items-center justify-center w-5 h-5"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <Check className="w-4 h-3" />
                    </motion.span>
                    <span className="leading-none">Copied!</span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center justify-center w-5 h-5">
                      <Copy className="w-4 h-3" />
                    </span>
                    <span className="leading-none">Copy Link</span>
                  </>
                )}
              </FancyButton>
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] glass border-gradient mt-2 mb-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <LinkIcon className="w-5 h-5 text-[var(--color-primary-mid)] flex-shrink-0" />
            </motion.div>
            <motion.code 
              className="text-var(--text-primary) text-sm md:text-base font-mono flex-1 truncate mt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-blue-500"
              >
                {profileUrl}
              </a>
            </motion.code>
          </motion.div>
          
          <motion.p 
            className="text-[var(--text-tertiary)] text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Share this link to receive anonymous messages from anyone
          </motion.p>
        </AceternityCard>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <AceternityCard 
          variant="glass" 
          accentEdge="top" 
          className="p-6 md:p-8"
          floatOnHover
        >
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            whileHover={{ scale: 1.01 }}
          >
            <div className="space-y-1">
              <motion.h2 
                className="text-xl font-bold text-gradient"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                Message Settings
              </motion.h2>
              <motion.p 
                className="text-[var(--text-secondary)] text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {acceptMessages 
                  ? 'You are currently accepting anonymous messages' 
                  : 'Message receiving is paused'}
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{
                  scale: isSwitchLoading ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isSwitchLoading ? Infinity : 0,
                }}
              >
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="cursor-pointer data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[var(--color-primary-start)] data-[state=checked]:to-[var(--color-primary-end)]"
                />
              </motion.div>
                <motion.span
                className="text-[var(--text-primary)] font-medium"
                style={{ color: acceptMessages ? "var(--color-accent-mint)" : "#FF6B6B" }}
                animate={
                  { color: acceptMessages ? "var(--color-accent-mint)" : "#FF6B6B" }
                }
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                {acceptMessages ? "On" : "Off"}
              </motion.span>
            </motion.div>
          </motion.div>
        </AceternityCard>
      </motion.div>

      {/* Messages Section */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <motion.div 
          className="flex items-center justify-between"
          whileHover={{ scale: 1.01 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-gradient"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <MessageSquare className="inline w-6 h-6 mr-2 text-[var(--color-primary-mid)]" />
            Your Messages
          </motion.h2>
          <motion.div
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            className="flex-shrink-0"
          >
            <FancyButton
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true, false);
              }}
              variant="gradient"
              size="sm"
              disabled={isLoading}
              className={`
                cursor-pointer
                inline-flex items-center justify-center
                gap-2
                px-3 py-1.5
                rounded-full
                min-h-[36px]
                min-w-[108px]
                whitespace-nowrap
                font-medium
                text-white
                shadow-[0_6px_18px_rgba(59,130,246,0.12)]
                bg-gradient-to-r from-[#7c6cff] to-[#28b1ff]
                hover:shadow-lg hover:brightness-105
                active:brightness-95
                transition-all duration-150 ease-in-out
                ${isLoading ? "opacity-80 cursor-wait" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <motion.span
                    className="inline-flex items-center justify-center w-5 h-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.span>
                  <span className="leading-none">Refreshing</span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    <RefreshCcw className="w-4 h-3" />
                  </span>
                  <span className="leading-none">Refresh</span>
                </>
              )}
            </FancyButton>
          </motion.div>
        </motion.div>
        {/* Messages Grid */}
        {isLoading && messages.length === 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
              >
                <AceternityCard 
                  variant="glass" 
                  accentEdge="top" 
                  className="p-6"
                >
                  <div className="space-y-3">
                    <motion.div 
                      className="h-4 bg-white/[0.1] rounded w-3/4"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    ></motion.div>
                    <motion.div 
                      className="h-4 bg-white/[0.1] rounded w-1/2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + 0.3 }}
                    ></motion.div>
                  </div>
                </AceternityCard>
              </motion.div>
            ))}
          </motion.div>
        ) : messages.length > 0 ? (
          <AnimatedList 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            staggerDelay={0.1}
          >
            {messages.map((message: Message, index: number) => (
              <AnimatedListItem 
                key={message._id.toString()}
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </motion.div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <AceternityCard 
              variant="gradient" 
              accentEdge="top" 
              className="p-12 text-center"
              tiltOnHover
            >
              <motion.div 
                className="max-w-md mx-auto space-y-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)] flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <MessageSquare className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold text-gradient"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  No messages yet
                </motion.h3>
                <motion.p 
                  className="text-[var(--text-secondary)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                >
                  Share your profile link to start receiving anonymous messages
                </motion.p>
              </motion.div>
            </AceternityCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default UserDashboard;
