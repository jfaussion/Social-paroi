import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  screenshot?: string;
}

export function FeatureCard({ icon, title, description, screenshot }: FeatureCardProps) {
  return (
    <div
      className="rounded-2xl p-px bg-feature-card-border"
    >
      <div className="rounded-2xl bg-[#0c0c14] backdrop-blur-md p-6 flex flex-col h-full">
        <div className="mb-4 text-aurora-violet">{icon}</div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-sm text-white/60">{description}</p>
        <div className="mt-auto overflow-hidden rounded-xl border border-white/10 bg-white/5 flex items-start justify-center min-h-64 max-h-[580px]">
          {screenshot ? (
            <img src={screenshot} alt={title} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/20">screenshot</div>
          )}
        </div>
      </div>
    </div>
  );
}
