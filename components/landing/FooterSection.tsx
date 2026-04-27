import Image from "next/image";
import { FaGithub } from "react-icons/fa";

export function FooterSection() {
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_FORM ?? "#";

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/5 px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <Image src="/social-paroi.png" alt="Social Paroi" width={36} height={11} />
        <nav className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-white/60">
          <a href="https://github.com/jfaussion/Social-paroi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-white">
            <FaGithub size={14} />
            GitHub
          </a>
          <a href={feedbackUrl} className="transition-colors hover:text-gray-900 dark:hover:text-white">Feedback</a>
          <a href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">Privacy</a>
          <span className="text-gray-600 dark:text-white/70">Made with ❤️ by Jérémie Faussion</span>
        </nav>
      </div>
    </footer>
  );
}
