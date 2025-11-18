"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full text-white relative overflow-hidden bg-gradient-to-b from-[#0f0f13] via-[#121521] to-[#0f0f13]">
      {/* Background CRT / Noise */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[0.07] bg-[radial-gradient(transparent_60%,#000_61%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,.12) 0px, rgba(255,255,255,.12) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Floating ghost/glass Back button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-50 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5 text-xs text-white hover:bg-white/15 transition"
      >
        ← Back
      </button>

      <div className="relative mx-auto max-w-5xl px-6 py-20 space-y-20">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            I’m Ryan — a software engineer who cooks, or a cook who codes, depending on the day.
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            I build things because I like understanding how they work. I cook because I like understanding people.
            Most of my life has been about figuring things out while already in motion — so if you’re doing the same,
            you’re in good company.
          </p>
        </header>

        {/* Section 2: Hollywood photo LEFT, story RIGHT */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <Polaroid
            src="/hollywood.png"
            alt="Ryan at the Hollywood sign"
            caption="LA trail day"
            tilt="left"
          />
          <div>
            <p className="text-white/90 leading-relaxed">
              I grew up in a Filipino household where food was the first love language.
              You don’t ask someone how they’re doing — you hand them a plate.
              Somewhere between late-night debugging sessions and 12-hour kitchen shifts, I realized everything I enjoy
              comes back to the same thing: <span className="font-semibold">helping people feel seen, fed, or understood</span> —
              whether that’s through code or cooking.
            </p>
          </div>
        </section>

        {/* Section 3: Cooking photo RIGHT, reflection LEFT */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="text-white/90 leading-relaxed">
              <span className="font-semibold">Some people write with words. I write with food.</span>
              &nbsp;But building tools scratches the same itch — feeding someone’s day in a different way.
              Whether I’m serving kare-kare or shipping a feature, I care about the same things:
              <span className="font-semibold"> effort, kindness, and leaving someone better than I found them.</span>
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Polaroid
              src="/kitchen.jpg"
              alt="Ryan cooking and plating dishes"
              caption="Cooking at home"
              tilt="right"
            />
          </div>
        </section>

        {/* Closing / CTA */}
        <section className="text-center space-y-3">
          <p className="text-white/70 italic">If you made it this far — thanks for taking a moment to know me.</p>
          <p className="text-white/90 font-medium">Let’s build something good together.</p>
          <p className="text-white/70 italic">If you want to build or eat something together — hit me up.</p>

          {/* Contact button + socials */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <a
              href="mailto:ryanjoshvillaluz@gmail.com"
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur px-5 py-2 transition"
            >
              Email Me
            </a>
            <div className="flex items-center gap-5 text-sm">
              <a
                href="https://github.com/villaluzr20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
                title="GitHub"
              >
                <span aria-hidden>💻</span> <span>github.com/villaluzr20</span>
              </a>
              <span className="text-white/30">•</span>
              <a
                href="https://www.linkedin.com/in/ryan-josh-villaluz-10a812170/?skipRedirect=true"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
                title="LinkedIn"
              >
                <span aria-hidden>🔗</span> <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

/** Polaroid-style image card with subtle tilt */
function Polaroid({
  src,
  alt,
  caption,
  tilt = "left",
}: {
  src: string;
  alt: string;
  caption?: string;
  tilt?: "left" | "right";
}) {
  return (
    <figure
      className={`mx-auto w-full max-w-md bg-white text-black rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.45)] 
      transition hover:-translate-y-1 hover:rotate-0
      ${tilt === "left" ? "-rotate-2" : "rotate-2"}`}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-[12px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />
      </div>
      <figcaption className="px-4 py-3 text-center text-sm">{caption}</figcaption>
    </figure>
  );
}
