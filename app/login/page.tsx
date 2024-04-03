import SignInWithProviverButton from '../../components/ui/signInWithProvider.button';
import Image from 'next/image';
import socialParoiLogo from '../../public/social-paroi.png';

export default function LoginPage() {

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="max-w-sm mx-auto my-8 p-6 bg-gray-200 dark:bg-gray-900 rounded-lg shadow-md space-y-4">

        <div className="flex-shrink-0 bg-slate-400 dark:bg-slate-700 h-20 w-20 rounded-full relative mx-auto overflow-hidden">
          <Image src={socialParoiLogo} alt="Social paroi logo" fill sizes='(max-width: 200px)' />
        </div>
        <SignInWithProviverButton provider="github" providerName='GitHub' providerImageLight='./github-mark.svg' providerImageDark='./github-mark-white.svg' />
        <SignInWithProviverButton provider="google" providerName='Google' providerImageLight='./google-icon.svg' providerImageDark='./google-icon.svg'/>
      </div>
    </main>
  );
}

