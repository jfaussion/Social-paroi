import Image from "next/image";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1.5 backdrop-blur-md bg-landing-bg/60 border-b border-white/5">
      <Image
        src="/social-paroi.png"
        alt="Social Paroi"
        width={60}
        height={18}
        priority
      />
      <Link
        href="/login"
        className="rounded-md bg-aurora-violet px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
      >
        Sign In
      </Link>
    </header>
  );
}
