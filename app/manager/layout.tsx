'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../core/auth';
import { ManagerLayout } from '../../design-system/layouts';

export default function ManagerLayoutPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role !== 'manager') {
      router.push('/auth/login');
    }
  }, [router]);

  return <ManagerLayout>{children}</ManagerLayout>;
}