"use client";

import Image from "next/image";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { SectionContent } from "./SectionContent";
import { FooterSection } from "./FooterSection";

export function EarlyAccessSection() {
  const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID!);

  useEffect(() => {
    if (state.succeeded) {
      toast.success("Thank you! We will be in touch shortly.");
    }
  }, [state.succeeded]);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-aurora-violet focus:ring-1 focus:ring-aurora-violet";

  return (
    <section id="early-access" className="min-h-screen md:h-screen md:snap-start flex flex-col pt-16 overflow-y-auto">
      <div className="flex flex-1 items-center justify-center px-6">
      <SectionContent>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            Bring your gym to Social Paroi
          </h2>
          <p className="mb-8 text-center text-white/60">
            Free during early access. We onboard you personally.
          </p>

          <div className="mb-10 flex items-center justify-center gap-4">
            <Image
              src="/social-paroi.png"
              alt="Social Paroi"
              width={80}
              height={24}
            />
            <p className="text-sm text-white/60">Already trusted by Pic &amp; Paroi</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="gymName"
                required
                placeholder="Gym Name"
                className={inputClass}
                style={{ fontSize: "16px" }}
              />
              <ValidationError field="gymName" errors={state.errors} className="text-sm text-red-400" />
              <input
                type="text"
                name="yourName"
                required
                placeholder="Your Name"
                className={inputClass}
                style={{ fontSize: "16px" }}
              />
              <ValidationError field="yourName" errors={state.errors} className="text-sm text-red-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className={inputClass}
                style={{ fontSize: "16px" }}
              />
              <ValidationError field="email" errors={state.errors} className="text-sm text-red-400" />
              <textarea
                name="message"
                placeholder="Message (optional)"
                rows={4}
                className={inputClass}
                style={{ fontSize: "16px" }}
              />
              <ValidationError field="message" errors={state.errors} className="text-sm text-red-400" />
              <ValidationError errors={state.errors} className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-400" />
              <button
                type="submit"
                disabled={state.submitting}
                className="rounded-xl bg-landing-btn-gradient border border-violet-500/30 px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {state.submitting ? "Sending…" : "Request Early Access"}
              </button>
            </form>
        </div>
      </SectionContent>
      </div>
      <FooterSection />
    </section>
  );
}
