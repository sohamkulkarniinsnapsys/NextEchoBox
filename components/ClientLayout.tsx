'use client';

import dynamic from 'next/dynamic';
import { ToastProvider } from '@/components/providers/ToastProvider';
import Providers from '@/app/providers';

// ✅ Dynamic import with ssr: false is allowed in Client Components
const AnimatedBackground = dynamic(
  () => import('@/components/ui/AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AnimatedBackground variant="combined" showRadialGradient />
      {children}
      <ToastProvider />
    </Providers>
  );
}
