'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getRoleHome } from '../core/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      const home = getRoleHome(session.user.role);
      router.push(home);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return null; // or a loading spinner
}
