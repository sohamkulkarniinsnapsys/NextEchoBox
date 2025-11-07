// app/providers.tsx
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

type Props = {
  children: React.ReactNode;
  session?: any;
};

export default function Providers({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
