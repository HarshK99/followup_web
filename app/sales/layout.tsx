'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../core/auth';
import { SalesLayout } from '../../design-system/layouts';

export default function SalesLayoutPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role?.toLowerCase() !== 'salesperson') {
      router.push('/auth/login');
    }
  }, [router]);

  return <SalesLayout>{children}</SalesLayout>;
}