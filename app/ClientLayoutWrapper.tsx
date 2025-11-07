'use client'

import dynamic from 'next/dynamic'
import { ToastProvider } from '@/components/providers/ToastProvider'
import Providers from './providers'

// ✅ Dynamically import the animated background as client-only
const AnimatedBackground = dynamic(
  () =>
    import('@/components/ui/AnimatedBackground').then((mod) => ({
      default: mod.AnimatedBackground,
    })),
  { ssr: false }
)

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      {/* ✅ Client-only animated visual layer */}
      <AnimatedBackground />
      {/* ✅ Main page content */}
      {children}
      {/* ✅ Toast notifications */}
      <ToastProvider />
    </Providers>
  )
}
