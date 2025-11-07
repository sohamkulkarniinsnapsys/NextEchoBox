'use client';

import { FancyButton } from '@/components/ui/FancyButton';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { AuroraBackground } from '@/components/ui/aceternity/AuroraBackground';
import { BackgroundBeams } from '@/components/ui/aceternity/BackgroundBeams';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { ShieldCheck, Key, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
        'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <AuroraBackground showRadialGradient={false} />
        <BackgroundBeams />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <AceternityCard 
          variant="gradient" 
          accentEdge="top" 
          className="w-full p-8 md:p-10 space-y-8"
          floatOnHover
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
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-3 rounded-full bg-gradient-to-br from-[var(--color-accent-mint)] to-[var(--color-primary-end)] shadow-[var(--shadow-neon)]">
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
                  <ShieldCheck className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextGenerateEffect 
                words="Verify Your Account"
                className="text-3xl md:text-4xl font-bold text-gradient"
                duration={2}
              />
            </motion.div>
            
            <motion.p 
              className="text-[var(--text-secondary)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Enter the verification code sent to your email
            </motion.p>
            
            <motion.div 
              className="inline-block px-4 py-2 rounded-full glass border-gradient"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[var(--text-secondary)] text-sm">Username: </span>
              <motion.span 
                className="text-[var(--text-primary)] font-semibold text-gradient"
                whileHover={{ scale: 1.1 }}
              >
                @{params.username}
              </motion.span>
            </motion.div>
          </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <GlassInput
              label="Verification Code"
              icon={<Key className="w-4 h-4" />}
              {...form.register('code')}
              error={form.formState.errors.code?.message}
              disabled={isLoading}
              placeholder="Enter 6-digit code"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FancyButton 
              type="submit" 
              variant="gradient" 
              size="lg" 
              className="w-full gap-2"
              loading={isLoading}
            >
              Verify Account
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <CheckCircle className="w-4 h-4" />
              </motion.div>
            </FancyButton>
          </motion.div>
        </motion.form>
        </AceternityCard>
      </motion.div>
    </div>
  );
}