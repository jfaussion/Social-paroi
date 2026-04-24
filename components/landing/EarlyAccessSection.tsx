"use client";

import Image from "next/image";
import { useState } from "react";

export function EarlyAccessSection() {
  const [gymName, setGymName] = useState("");
  const [yourName, setYourName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymName, yourName, email, message }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-aurora-violet focus:ring-1 focus:ring-aurora-violet";

  return (
    <section id="early-access" className="bg-landing-bg px-6 py-20">
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

        {status === "success" ? (
          <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-4 text-center text-green-400">
            Thank you! We will be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Gym Name"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className={inputClass}
              style={{ fontSize: "16px" }}
            />
            <input
              type="text"
              required
              placeholder="Your Name"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className={inputClass}
              style={{ fontSize: "16px" }}
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ fontSize: "16px" }}
            />
            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={inputClass}
              style={{ fontSize: "16px" }}
            />
            {status === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-aurora-violet px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Request Early Access"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
