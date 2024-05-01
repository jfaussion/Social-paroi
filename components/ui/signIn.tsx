'use client';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

export default function SignIn() {
  const router = useRouter();

  const navigateToLoginPage = () => {
    router.push('/login');
  };

  return (
    <Button onClick={navigateToLoginPage} btnStyle='primary'>Sign In</Button>
  );
};
