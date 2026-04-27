import { AuroraBackground } from "@/components/landing/AuroraBackground";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ClimbersSection } from "@/components/landing/ClimbersSection";
import { GymsSection } from "@/components/landing/GymsSection";
import { EarlyAccessSection } from "@/components/landing/EarlyAccessSection";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden bg-white dark:bg-landing-bg">
        <AuroraBackground />
      </div>

      <LandingNavbar />

      <main className="relative z-10 h-screen overflow-y-scroll md:snap-y md:snap-mandatory">
        <HeroSection />
        <ClimbersSection />
        <GymsSection />
        <EarlyAccessSection />
      </main>
    </>
  );
}
