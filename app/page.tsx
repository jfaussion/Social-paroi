import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ClimbersSection } from "@/components/landing/ClimbersSection";
import { GymsSection } from "@/components/landing/GymsSection";
import { EarlyAccessSection } from "@/components/landing/EarlyAccessSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <div className="bg-landing-bg pt-16">
        <ClimbersSection />
        <GymsSection />
        <EarlyAccessSection />
        <FooterSection />
      </div>
    </>
  );
}
