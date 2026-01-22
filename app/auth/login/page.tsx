'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../design-system/layouts';
import { Button, Input, Text, Card } from '../../../design-system/components';
import { login, getRoleHome } from '../../../core/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const user = await login(email, password);
    if (user) {
      router.push(getRoleHome(user.role));
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Text as="h2" size="lg" weight="bold">Login</Text>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <Text color="danger">{error}</Text>}
        <Button onClick={handleLogin}>Login</Button>
        <Text size="sm" style={{ marginTop: '16px' }}>
          Sales: sales@example.com / password<br />
          Manager: manager@example.com / password
        </Text>
      </Card>
    </AuthLayout>
  );
}