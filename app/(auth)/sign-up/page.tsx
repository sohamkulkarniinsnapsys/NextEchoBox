'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import { FancyButton } from '@/components/ui/FancyButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Loader2, CheckCircle2, XCircle, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Check username availability
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) {
        setUsernameMessage('');
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage('');

      try {
        // Updated type to match API
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`
        );

        if (response.data.success) {
          setUsernameMessage('Username is available');
        } else {
          setUsernameMessage('Username is already taken');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data?.message ?? 'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast.success(response.data.message);

      // Navigate to verification page
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ??
        'There was a problem with your sign-up. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12">
      <GlassCard 
        variant="medium" 
        accentEdge="top" 
        accentColor="warm"
        className="w-full max-w-md p-8 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.72_0.20_35)] to-[oklch(0.80_0.15_85)]">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Join NextEchoBox
          </h1>
          <p className="text-[var(--text-secondary)]">
            Sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field with availability indicator */}
          <div className="relative">
            <GlassInput
              label="Username"
              {...form.register('username')}
              onChange={(e) => {
                form.register('username').onChange(e);
                setUsername(e.target.value);
              }}
              error={form.formState.errors.username?.message}
              disabled={isSubmitting}
            />
            {/* Username availability chip */}
            {debouncedUsername && (
              <div className="mt-2 flex items-center gap-2">
                {isCheckingUsername ? (
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </div>
                ) : usernameMessage ? (
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                      'backdrop-blur-[var(--blur-subtle)] border',
                      'transition-all duration-[var(--motion-fast)]',
                      usernameMessage === 'Username is available'
                        ? 'bg-[oklch(0.78_0.16_165)]/10 border-[oklch(0.78_0.16_165)]/30 text-[oklch(0.78_0.16_165)]'
                        : 'bg-[oklch(0.65_0.25_25)]/10 border-[oklch(0.65_0.25_25)]/30 text-[oklch(0.65_0.25_25)]'
                    )}
                  >
                    {usernameMessage === 'Username is available' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {usernameMessage}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Email Field */}
          <GlassInput
            label="Email"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
            helperText="We will send you a verification code"
            disabled={isSubmitting}
          />

          {/* Password Field */}
          <GlassInput
            label="Password"
            type="password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <FancyButton 
            type="submit" 
            variant="warm" 
            size="lg" 
            className="w-full"
            loading={isSubmitting}
          >
            Sign Up
          </FancyButton>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[var(--bg-surface)] text-[var(--text-tertiary)]">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-Up */}
        <FancyButton
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-3"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </FancyButton>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/[0.08]">
          <p className="text-[var(--text-secondary)]">
            Already a member?{' '}
            <Link 
              href="/sign-in" 
              className="text-[oklch(0.72_0.20_35)] hover:text-[oklch(0.80_0.15_85)] transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
