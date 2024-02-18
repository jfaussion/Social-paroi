'use client';
import { useRouter } from 'next/navigation';

const SignInButton = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <button onClick={handleSignIn}>Sign In</button>
  );
};

export default SignInButton;
