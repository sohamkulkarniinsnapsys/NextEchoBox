'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { color, motion } from 'framer-motion';
import { FancyButton } from '@/components/ui/FancyButton';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { AuroraBackground } from '@/components/ui/aceternity/AuroraBackground';
import { BackgroundBeams } from '@/components/ui/aceternity/BackgroundBeams';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
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
        {/* Prevent hover/tilt visual from affecting layout height */}
        <AceternityCard
          variant="glass"
          accentEdge="top"
          className="w-full p-8 md:p-10 space-y-8 overflow-hidden transform-gpu will-change-transform"
          tiltOnHover
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
              <div className="p-3 rounded-full bg-gradient-to-br from-[var(--color-primary-start)] to-[var(--color-primary-end)] shadow-[var(--shadow-neon)]">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextGenerateEffect
                words="Welcome..."
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
              Sign in to continue your secret conversations
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {/* vertically center icon by wrapping it in a full-height flex container */}
              <GlassInput
                label="Email or Username"
                icon={
                  <div className="h-full flex items-center">
                    <Mail className="w-4 h-4" />
                  </div>
                }
                {...form.register('identifier')}
                error={form.formState.errors.identifier?.message}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <GlassInput
                label="Password"
                type="password"
                icon={
                  <div className="h-full flex items-center">
                    <Lock className="w-4 h-4" />
                  </div>
                }
                {...form.register('password')}
                error={form.formState.errors.password?.message}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* ensure button content is aligned horizontally and vertically */}
              <FancyButton
                type="submit"
                variant="gradient"
                size="lg"
                className="cursor-pointer w-full gap-2 flex items-center justify-center min-h-[48px]"
                loading={isLoading}
              >
                <span className="flex-1 text-center">Sign In</span>

                {/* arrow wrapped so baseline alignment issue is avoided */}
                <span className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </FancyButton>
            </motion.div>
          </motion.form>

          {/* Divider — match sign-up styling (lines + centered label) */}
          <motion.div
            className="relative py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span
                className="px-3 text-sm text-[var(--text-tertiary)] z-10"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                Or continue with
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </motion.div>

          {/* Google Sign-In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FancyButton
              type="button"
              variant="gradient"
              size="lg"
              className="cursor-pointer w-full gap-3 flex items-center justify-center min-h-12"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <motion.span
                className="inline-flex mt-1 items-center justify-center w-5 h-5 shrink-0 mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                aria-hidden="true"
              >
                <svg className=" w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbcc05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4225"/>
                </svg>
              </motion.span>

              <span className="text-center">Sign in with Google</span>
            </FancyButton>
          </motion.div>

          {/* Footer - no div inside a p to avoid hydration error */}
          <motion.div
            className="text-center pt-4 border-t"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {/* keep this as semantic p and use inline motion/span for interaction so no div ends up inside p */}
            <p className="text-[var(--text-secondary)]">
              Not a member yet?{' '}
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/sign-up" className="text-gradient font-medium hover:underline">
                  Sign up
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </AceternityCard>
      </motion.div>
    </div>
  );
}
