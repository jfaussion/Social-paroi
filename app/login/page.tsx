import SignInWithProviverButton from '../ui/SignInWithProviderButton';

export default function LoginPage() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="max-w-sm mx-auto my-8 p-6 bg-gray-900 rounded-lg shadow-md space-y-4">

        <div className="bg-blue-500 h-20 w-20 rounded-full mx-auto">
          {/* Image placeholder */}
        </div>
        <SignInWithProviverButton provider="github" providerName='GitHub' providerImage='./github-mark-white.svg' />
        <SignInWithProviverButton provider="google" providerName='Google' providerImage='./google-icon.svg' />
      </div>
    </main>
  );
}

