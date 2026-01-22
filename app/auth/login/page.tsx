'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../../design-system/layouts';
import { Button, Input, Text, Card } from '../../../design-system/components';
import { login, getRoleHome, setSession } from '../../../core/auth';
import { tokens } from '../../../design-system/tokens';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const result = await login(phone, password);
    if (result) {
      setSession({ token: result.token, user: result.user });
      router.push(getRoleHome(result.user.role));
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Text as="h2" size="lg" weight="bold">Login</Text>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <Text color="danger">{error}</Text>}
        <Button onClick={handleLogin}>Login</Button>
        <Text size="sm" style={{ marginTop: tokens.spacing[4] }}>
          Sales: +919812345678 / password<br />
          Manager: +919876543210 / password
        </Text>
      </Card>
    </AuthLayout>
  );
}