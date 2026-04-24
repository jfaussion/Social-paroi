import Image from "next/image";

export function FooterSection() {
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM ?? "#";

  return (
    <footer className="w-full border-t border-white/5 px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <Image src="/social-paroi.png" alt="Social Paroi" width={36} height={11} />
        <nav className="flex flex-wrap items-center gap-3 text-[10px] text-white/40">
          <a href="#" className="transition-colors hover:text-white">GitHub</a>
          <a href={feedbackUrl} className="transition-colors hover:text-white">Feedback</a>
          <a href="#" className="transition-colors hover:text-white">Privacy</a>
          <span className="text-white/20">· Jérémie Faussion</span>
        </nav>
      </div>
    </footer>
  );
}
