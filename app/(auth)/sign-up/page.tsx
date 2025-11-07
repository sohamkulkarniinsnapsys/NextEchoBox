'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { FancyButton } from '@/components/ui/FancyButton';
import { AceternityCard } from '@/components/ui/aceternity/AceternityCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { AuroraBackground } from '@/components/ui/aceternity/AuroraBackground';
import { BackgroundBeams } from '@/components/ui/aceternity/BackgroundBeams';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  UserPlus,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';
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
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(
            debouncedUsername
          )}`
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
        {/* NOTE: added overflow-hidden, transform-gpu and will-change to keep hover/tilt visual effects from affecting layout height */}
        <AceternityCard
          variant="glass"
          accentEdge="top"
          className="w-full h-full p-8 md:p-10 space-y-8 overflow-hidden transform-gpu will-change-transform"
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
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-3 rounded-full bg-gradient-to-br from-[var(--color-accent-warm)] to-[var(--color-accent-gold)] shadow-[var(--shadow-neon)]">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextGenerateEffect
                words="Join NextEchoBox"
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
              Sign up to start your anonymous adventure
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
            {/* Username Field with availability indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="relative"
            >
              {/* Wrap icon with flex container to vertically center within GlassInput */}
              <GlassInput
                label="Username"
                
                icon={
                  <div className="h-full flex items-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                }
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
                <motion.div
                  className="mt-2 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCheckingUsername ? (
                    <motion.div
                      className="flex items-center gap-2 text-[var(--text-secondary)] text-sm glass px-3 py-1 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                      Checking...
                    </motion.div>
                  ) : usernameMessage ? (
                    <motion.div
                      className={cn(
                        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                        'glass border transition-all duration-[var(--motion-fast)]',
                        usernameMessage === 'Username is available'
                          ? 'bg-[var(--color-accent-mint)]/20 border-[var(--color-accent-mint)]/40 text-[var(--color-accent-mint)]'
                          : 'bg-[var(--color-accent-error)]/20 border-[var(--color-accent-error)]/40 text-[var(--color-accent-error)]'
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, type: 'spring' }}
                    >
                      {usernameMessage === 'Username is available' ? (
                        <motion.span
                          className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.span>
                      ) : (
                        <motion.span
                          className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.span>
                      )}
                      <span>{usernameMessage}</span>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              {/* wrap icon to vertically center it */}
              <GlassInput
                label="Email"
                type="email"
                icon={
                  <div className="h-full flex items-center">
                    <Mail className="w-4 h-4 mb-6.5" />
                  </div>
                }
                {...form.register('email')}
                error={form.formState.errors.email?.message}
                helperText="We will send you a verification code"
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
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
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Ensure children are horizontally centered and vertically aligned */}
              <FancyButton
                type="submit"
                variant="gradient"
                size="lg"
                className="cursor-pointer w-full gap-2 min-h-[48px] px-6 flex items-center justify-center"
                loading={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* label centered */}
                <span className="flex-1 text-center">Sign Up</span>

                {/* make sure icon is vertically centered and spaced */}
                <span className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </FancyButton>
            </motion.div>
          </motion.form>

          {/* Divider (fixed layout, centered label, no overlap) */}
          <motion.div
            className="relative py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
              <span
                className="px-3 text-sm text-var(--text-tertiary) z-10"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                Or continue with
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </motion.div>

          {/* Google Sign-Up */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FancyButton
              type="button"
              variant="neon"
              size="lg"
              className="cursor-pointer w-full gap-3 min-h-[48px] px-6 flex items-center justify-center"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Add right spacing so icon isn't crammed to text */}
              <motion.span
                className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0 mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                aria-hidden="true"
              >
                <svg className="w-5 h-5 justify-center cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbcc05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </motion.span>

              <span className="flex-1 text-center">Sign up with Google</span>
            </FancyButton>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center pt-4 border-t"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
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
