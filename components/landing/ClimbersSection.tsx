import { FaRoute, FaTrophy, FaChartBar } from "react-icons/fa";
import { SectionContent } from "./SectionContent";
import { FeatureCard } from "./FeatureCard";

export function ClimbersSection() {
  return (
    <section className="min-h-screen md:h-screen md:snap-start flex items-center justify-center px-6 py-20 pt-24 md:pt-16">
      <div className="mx-auto max-w-6xl w-full">
        <SectionContent delay={0}>
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:pt-10">
            For Climbers
          </h2>
        </SectionContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SectionContent delay={0}>
            <FeatureCard
              icon={<FaRoute size={28} />}
              title="Track Your Routes"
              description="Log every route you attempt and complete. Visualise your progress over time and see how far you have come."
              screenshot="/track_list.png"
            />
          </SectionContent>
          <SectionContent delay={100}>
            <FeatureCard
              icon={<FaTrophy size={28} />}
              title="Climb the Leaderboard"
              description="Compete with other climbers in your gym and globally. See where you rank and push yourself to the next level."
              screenshot="/ranking_anonym.png"
            />
          </SectionContent>
          <SectionContent delay={200}>
            <FeatureCard
              icon={<FaChartBar size={28} />}
              title="Know Your Stats"
              description="Get a detailed breakdown of the difficulties you climb most, your success rate, and your strongest disciplines."
              screenshot="/stats.png"
            />
          </SectionContent>
        </div>
      </div>
    </section>
  );
}
