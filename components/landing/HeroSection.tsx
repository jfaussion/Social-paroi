import Link from "next/link";
import { AuroraBackground } from "./AuroraBackground";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-landing-bg px-6 text-center">
      <AuroraBackground />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Your climbing gym, tracked.
        </h1>
        <p className="max-w-xl text-lg text-white/70">
          Social Paroi helps climbing gym managers and climbers track routes,
          progress, and competitions — all in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-aurora-violet px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
          </Link>
          <a
            href="#early-access"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Register your gym
          </a>
        </div>
      </div>
    </section>
  );
}
