// app/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignInForm from './(auth)/sign-in/page';
import Image from 'next/image';

export default function SignInLanding() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If a session exists, push to dashboard (so landing becomes sign-in when not authenticated)
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  // Simply render the sign-in form (it already has its own layout)
  return <SignInForm />;
}
