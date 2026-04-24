import { FaMapMarkerAlt, FaMedal, FaBuilding, FaHandshake } from "react-icons/fa";
import { AnimatedSection } from "./AnimatedSection";
import { FeatureCard } from "./FeatureCard";

export function GymsSection() {
  return (
    <section className="bg-[#0d0d16] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection delay={0}>
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            For Gyms
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatedSection delay={0}>
            <FeatureCard
              icon={<FaMapMarkerAlt size={28} />}
              title="Manage Routes & Zones"
              description="Create and organise your climbing routes across all zones and walls. Update grades and statuses in real time."
            />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <FeatureCard
              icon={<FaMedal size={28} />}
              title="Run Contests"
              description="Set up and manage climbing competitions with live rankings, custom scoring rules, and automated leaderboards."
            />
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <FeatureCard
              icon={<FaBuilding size={28} />}
              title="Multi-Location"
              description="Manage multiple gym locations from a single dashboard. Keep each site's data separate while sharing team access."
            />
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <FeatureCard
              icon={<FaHandshake size={28} />}
              title="Guided Onboarding"
              description="We walk you through the setup personally. Get your gym live quickly with hands-on support from our team."
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
