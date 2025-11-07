'use client';

import { FancyButton } from '@/components/ui/FancyButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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
    <div className="flex justify-center items-center min-h-screen px-4 py-12">
      <GlassCard 
        variant="medium" 
        accentEdge="top" 
        accentColor="mint"
        className="w-full max-w-md p-8 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.78_0.16_165)] to-[oklch(0.75_0.18_180)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Verify Your Account
          </h1>
          <p className="text-[var(--text-secondary)]">
            Enter the verification code sent to your email
          </p>
          <div className="inline-block px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.12]">
            <span className="text-[var(--text-secondary)] text-sm">Username: </span>
            <span className="text-[var(--text-primary)] font-semibold">@{params.username}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            label="Verification Code"
            {...form.register('code')}
            error={form.formState.errors.code?.message}
            disabled={isLoading}
            placeholder="Enter 6-digit code"
          />

          <FancyButton 
            type="submit" 
            variant="solid" 
            size="lg" 
            className="w-full"
            loading={isLoading}
          >
            Verify Account
          </FancyButton>
        </form>
      </GlassCard>
    </div>
  );
}