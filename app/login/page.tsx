import SignInWithProviverButton from '../ui/SignInWithProviderButton';

export default function LoginPage() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div>
        <h1>Login</h1>
        <SignInWithProviverButton provider="github"/>
        <SignInWithProviverButton provider="google"/>
      </div>
    </main>
  );
}

