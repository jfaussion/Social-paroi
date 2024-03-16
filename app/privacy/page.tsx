import MarkdownComponent from "@/components/ui/MarkdownComponent";

export default function PrivacyPage() {

  return (
    <main className="p-4 sm:p-24 sm:pt-8 sm:pb-8 w-full mx-auto max-w-7xl">
      <MarkdownComponent mdUrl="/privacy.md" />
    </main>
  );
}