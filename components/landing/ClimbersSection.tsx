import { FaRoute, FaTrophy, FaChartBar } from "react-icons/fa";
import { AnimatedSection } from "./AnimatedSection";
import { FeatureCard } from "./FeatureCard";

export function ClimbersSection() {
  return (
    <section className="bg-landing-bg px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection delay={0}>
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
            For Climbers
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatedSection delay={0}>
            <FeatureCard
              icon={<FaRoute size={28} />}
              title="Track Your Routes"
              description="Log every route you attempt and complete. Visualise your progress over time and see how far you have come."
            />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <FeatureCard
              icon={<FaTrophy size={28} />}
              title="Climb the Leaderboard"
              description="Compete with other climbers in your gym and globally. See where you rank and push yourself to the next level."
            />
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <FeatureCard
              icon={<FaChartBar size={28} />}
              title="Know Your Stats"
              description="Get a detailed breakdown of the difficulties you climb most, your success rate, and your strongest disciplines."
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
