import Link from "next/link";
import { SectionContent } from "./SectionContent";

export function HeroSection() {
  return (
    <section className="h-screen md:snap-start flex items-center justify-center px-6 pt-10">
      <SectionContent>
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Climb, Track, Compete.
          </h1>
          <p className="max-w-xl text-lg text-gray-600 dark:text-white/70">
            Social Paroi gives openers and climbers the tools to do it — all in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-landing-btn-gradient border border-violet-500/30 px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign In
            </Link>
            <a
              href="#early-access"
              className="rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 px-6 py-3 text-base font-semibold text-gray-800 dark:text-white backdrop-blur-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              Register your gym
            </a>
          </div>
        </div>
      </SectionContent>
    </section>
  );
}
