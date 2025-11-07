import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NextEchoBox',
  description: 'Anonymous feedback platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg-deep)] text-[var(--text-primary)]`}>
        <PerformanceProvider>
          <MotionProvider>
            <ClientLayout>{children}</ClientLayout>
          </MotionProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
