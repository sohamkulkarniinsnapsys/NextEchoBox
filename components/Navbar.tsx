// components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FancyButton } from '@/components/ui/FancyButton';
import { AnimatedAvatar } from '@/components/ui/AnimatedAvatar';
import { LogOut, Sparkles, User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const displayName = user?.username ?? user?.email ?? 'User';

  const sharedPillClasses = `
    inline-flex items-center justify-center
    gap-2
    px-3 py-1.5
    rounded-full
    min-h-[36px]
    md:min-w-[108px] min-w-[44px]
    whitespace-nowrap
    font-medium
    text-white
    shadow-[0_6px_18px_rgba(59,130,246,0.12)]
    bg-gradient-to-r from-[#7c6cff] to-[#28b1ff]
    hover:shadow-lg hover:brightness-105
    active:brightness-95
    transition-all duration-150 ease-in-out
    cursor-pointer
  `;

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-[var(--z-fixed)] px-4 md:px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ y: 0 }}
    >
      <motion.div 
        className="container mx-auto max-w-7xl
          glass-strong
          border-gradient
          px-4 md:px-6 py-3
          flex flex-col md:flex-row justify-between items-center gap-4
          transition-all duration-[var(--motion-medium)]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        whileHover={{ 
          scale: 1.01,
          boxShadow: '0 10px 40px rgba(120, 119, 198, 0.3)',
        }}
      >
        {/* Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-gradient
              hover:text-[var(--color-primary-mid)] transition-colors duration-[var(--motion-fast)]"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            NextEchoBox
          </Link>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {status === 'loading' ? (
            <motion.span 
              className="text-[var(--text-secondary)] text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.span>
          ) : session ? (
            <>
              {/* User info (desktop) */}
              <motion.div 
                className="hidden md:flex items-center gap-3 glass px-3 py-2 rounded-[var(--radius-md)]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedAvatar
                  src={user?.image}
                  alt={displayName}
                  size="md"
                />
                <span className="text-[var(--text-primary)] font-medium">
                  {displayName}
                </span>
              </motion.div>
              
              {/* Mobile user avatar */}
              <div className="md:hidden">
                <AnimatedAvatar
                  src={user?.image}
                  alt={displayName}
                  size="md"
                />
              </div>
              
              {/* Logout button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                <FancyButton
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  variant="gradient"
                  size="sm"
                  aria-label="Sign out"
                  title="Sign out"
                  
                  className={sharedPillClasses}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    <LogOut className="cursor-pointer w-4 h-3" aria-hidden="true" />
                  </span>
                  {/* visible only on md+ */}
                  <span className="hidden md:inline leading-none">Logout</span>
                </FancyButton>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 w-full md:w-auto">
              <Link href="/sign-in" className="w-full md:w-auto">
                <FancyButton
                  variant="gradient"
                  size="sm"
                  className={`
                    ${sharedPillClasses}
                    w-full md:w-auto
                  `}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    <User className="w-4 h-4" />
                  </span>
                  <span className="hidden md:inline leading-none">Login</span>
                </FancyButton>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
