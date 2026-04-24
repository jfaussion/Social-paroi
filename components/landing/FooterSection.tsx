import Image from "next/image";

export function FooterSection() {
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM ?? "#";

  return (
    <footer className="border-t border-white/5 bg-landing-bg px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Image
          src="/social-paroi.png"
          alt="Social Paroi"
          width={50}
          height={15}
        />
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
          <a href="#" className="transition-colors hover:text-white">GitHub</a>
          <a href={feedbackUrl} className="transition-colors hover:text-white">Feedback</a>
          <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
          <span className="text-white/20">· Built by Jérémie Faussion</span>
        </nav>
      </div>
    </footer>
  );
}
