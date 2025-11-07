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
            <div className="p-3 rounded-full bg-linear-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.18_220)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
            Welcome Back
          </h1>
          <p className="text-var(--text-secondary)">
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

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/8">
          <p className="text-var(--text-secondary)">
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