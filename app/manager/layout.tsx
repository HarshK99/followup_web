'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../../core/auth';
import { ManagerLayout } from '../../design-system/layouts';
import { Sidebar } from './Sidebar';

export default function ManagerLayoutPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session || session.user.role?.toLowerCase() === 'salesperson') {
      router.push('/auth/login');
    }
  }, [router]);

  return <ManagerLayout sidebar={<Sidebar />}>{children}</ManagerLayout>;
}