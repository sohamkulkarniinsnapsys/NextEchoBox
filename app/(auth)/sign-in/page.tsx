'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { FancyButton } from '@/components/ui/FancyButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Incorrect username or password');
        } else {
          toast.error(result.error);
        }
      }

      if (result?.url) {
        toast.success('Welcome back!');
        router.replace('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12">
      <GlassCard 
        variant="medium" 
        accentEdge="top" 
        accentColor="primary"
        className="w-full max-w-md p-8 md:p-10 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h1>
          <p className="text-[var(--text-secondary)]">
            Sign in to continue your secret conversations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <GlassInput
            label="Email or Username"
            {...form.register('identifier')}
            error={form.formState.errors.identifier?.message}
            disabled={isLoading}
          />

          <GlassInput
            label="Password"
            type="password"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
            disabled={isLoading}
          />

          <FancyButton 
            type="submit" 
            variant="solid" 
            size="lg" 
            className="w-full"
            loading={isLoading}
          >
            Sign In
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

        {/* Google Sign-In */}
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
          Sign in with Google
        </FancyButton>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/[0.08]">
          <p className="text-[var(--text-secondary)]">
            Not a member yet?{' '}
            <Link 
              href="/sign-up" 
              className="text-[oklch(0.75_0.18_220)] hover:text-[oklch(0.70_0.22_260)] transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}