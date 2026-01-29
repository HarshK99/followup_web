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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setPhone(value);
  };

  const getFullPhoneNumber = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('91')) {
      return `+${cleanPhone}`;
    }
    return `+91${cleanPhone}`;
  };

  const handleLogin = async () => {
    const fullPhoneNumber = getFullPhoneNumber();
    console.log('Login button clicked with phone:', fullPhoneNumber, 'password length:', password.length);
    const result = await login(fullPhoneNumber, password);
    console.log('Login result:', result);
    if (result) {
      console.log('Login: setting session for user role', result.user.role);
      setSession({ token: result.token, user: result.user });
      const home = getRoleHome(result.user.role);
      console.log('Login: navigating to', home);
      router.push(home);
    } else {
      console.log('Login failed - showing invalid credentials');
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
            onChange={handlePhoneChange}
            prefix="+91"
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
      </Card>
    </AuthLayout>
  );
}