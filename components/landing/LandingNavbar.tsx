import Image from "next/image";
import Link from "next/link";

export function LandingNavbar() {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md shadow-lg shadow-black/20">
      <Image
        src="/social-paroi.png"
        alt="Social Paroi"
        width={44}
        height={13}
        priority
      />
      <Link
        href="/login"
        className="rounded-md bg-landing-btn-gradient px-4 py-1 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Sign In
      </Link>
    </header>
  );
}
