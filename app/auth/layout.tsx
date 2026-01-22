import { AuthLayout } from '../../design-system/layouts';

export default function AuthLayoutPage({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}