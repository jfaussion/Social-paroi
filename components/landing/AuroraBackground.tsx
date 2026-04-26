export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-aurora-violet/40 blur-3xl"
        style={{ animation: "auroraBlob 12s ease-in-out infinite alternate" }}
      />
      <div
        className="absolute top-1/3 -right-48 h-[560px] w-[560px] rounded-full bg-aurora-blue/35 blur-3xl"
        style={{ animation: "auroraBlob 16s ease-in-out infinite alternate-reverse" }}
      />
      <div
        className="absolute -bottom-24 left-1/3 h-[420px] w-[420px] rounded-full bg-aurora-indigo/40 blur-3xl"
        style={{ animation: "auroraBlob 14s ease-in-out infinite alternate" }}
      />
    </div>
  );
}
