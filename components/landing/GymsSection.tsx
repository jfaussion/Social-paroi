import { FaMapMarkerAlt, FaMedal, FaBuilding, FaHandshake } from "react-icons/fa";
import { SectionContent } from "./SectionContent";
import { FeatureCard } from "./FeatureCard";

export function GymsSection() {
  return (
    <section className="min-h-screen md:h-screen md:snap-start flex items-center justify-center px-6 py-20 pt-24 md:pt-16">
      <div className="mx-auto max-w-6xl w-full">
        <SectionContent delay={0}>
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl md:pt-10">
            For Openers &amp; Gym Managers
          </h2>
        </SectionContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SectionContent delay={0}>
            <FeatureCard
              icon={<FaMapMarkerAlt size={28} />}
              title="Manage Routes & Zones"
              description="Create and organise your climbing routes across all zones and walls. Update grades and statuses in real time."
              screenshot="/manage_difficulty.png"
            />
          </SectionContent>
          <SectionContent delay={100}>
            <FeatureCard
              icon={<FaMedal size={28} />}
              title="Run Contests"
              description="Set up and manage climbing competitions with live rankings, custom scoring rules, and automated leaderboards."
              screenshot="/run_contests.png"
            />
          </SectionContent>
          <SectionContent delay={200}>
            <FeatureCard
              icon={<FaBuilding size={28} />}
              title="Multi-Location"
              description="Manage multiple gym locations from a single dashboard. Keep each site's data separate while sharing team access."
              screenshot="/multi_location.png"
            />
          </SectionContent>
        </div>
      </div>
    </section>
  );
}
