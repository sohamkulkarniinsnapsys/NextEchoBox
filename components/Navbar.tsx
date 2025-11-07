// components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FancyButton } from '@/components/ui/FancyButton';
import { AnimatedAvatar } from '@/components/ui/AnimatedAvatar';
import { LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const displayName = user?.username ?? user?.email ?? 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[var(--z-fixed)] px-4 md:px-6 py-4">
      <div 
        className="container mx-auto max-w-7xl
          bg-[var(--bg-surface)]/80 backdrop-blur-[var(--blur-strong)]
          border border-white/[0.12] rounded-[var(--ui-radius-lg)]
          shadow-[var(--shadow-elev-2)]
          px-4 md:px-6 py-3
          flex flex-col md:flex-row justify-between items-center gap-4
          transition-all duration-[var(--motion-medium)]"
      >
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]
            hover:scale-105 transition-transform duration-[var(--motion-fast)]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.70_0.22_260)] rounded-md px-2"
        >
          <Sparkles className="w-5 h-5 text-[oklch(0.75_0.18_220)]" />
          NextEchoBox
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
          {status === 'loading' ? (
            <span className="text-[var(--text-secondary)] text-sm">Loading...</span>
          ) : session ? (
            <>
              {/* User info */}
              <div className="hidden md:flex items-center gap-3">
                <AnimatedAvatar
                  src={user?.image}
                  alt={displayName}
                  size="md"
                />
                <span className="text-[var(--text-primary)] font-medium">
                  {displayName}
                </span>
              </div>
              
              {/* Logout button */}
              <FancyButton
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
                variant="outline"
                size="sm"
                className="w-full md:w-auto"
              >
                <LogOut className="w-4 h-4" />
                <span className="md:inline">Logout</span>
              </FancyButton>
            </>
          ) : (
            <Link href="/sign-in" className="w-full md:w-auto">
              <FancyButton variant="solid" size="sm" className="w-full md:w-auto">
                Login
              </FancyButton>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
