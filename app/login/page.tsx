import SignInWithProviverButton from '../../components/ui/signInWithProvider.button';
import Image from 'next/image';
import socialParoiLogo from '../../public/social-paroi.png';
import { AuroraBackground } from '../../components/landing/AuroraBackground';

export default function LoginPage() {

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-landing-bg">
      <AuroraBackground />

      <div className="relative z-10 w-full max-w-sm mx-auto my-8 rounded-2xl p-px bg-feature-card-border shadow-2xl">
        <div className="rounded-2xl bg-white/40 dark:bg-[#0c0c14]/60 backdrop-blur-xl p-8 space-y-6">

          <div className="flex flex-col items-center space-y-3">
            <div className="h-16 w-16 rounded-full relative overflow-hidden ring-2 ring-black/10 dark:ring-white/10">
              <Image src={socialParoiLogo} alt="Social paroi logo" fill sizes='(max-width: 128px)' />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Social Paroi</h1>
              <p className="text-sm text-gray-500 dark:text-white/50">Sign in to continue</p>
            </div>
          </div>

          <div className="space-y-3">
            <SignInWithProviverButton provider="github" providerName='GitHub' providerImageLight='/github-mark.svg' providerImageDark='/github-mark-white.svg' />
            <SignInWithProviverButton provider="google" providerName='Google' providerImageLight='/google-icon.svg' providerImageDark='/google-icon.svg'/>
          </div>

        </div>
      </div>
    </main>
  );
}

