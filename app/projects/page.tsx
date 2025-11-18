"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProjectsPage() {
  const [tab, setTab] = useState<"engineer" | "chef">("engineer");

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

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16">
        {/* Header Question */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            So what side of me are you here for?
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <TabButton active={tab === "engineer"} onClick={() => setTab("engineer")}>
            💡 Engineer
          </TabButton>
          <TabButton active={tab === "chef"} onClick={() => setTab("chef")}>
            🍳 Chef
          </TabButton>
        </div>

        {/* Panels */}
        {tab === "engineer" ? <EngineerPanel /> : <ChefPanel />}
      </div>
    </main>
  );
}

/* ---------- Engineer Panel (Hybrid Cards with Modal Demo) ---------- */

function EngineerPanel() {
  const [showDemo, setShowDemo] = useState(false);

  // ✅ ESC key closes modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDemo(false);
    }
    if (showDemo) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDemo]);

  return (
    <>
      <section className="grid sm:grid-cols-2 gap-6">
        <ProjectCard
          title="NC EMPT Testing Platform"
          blurb="I served as a software engineer on a real-time math placement platform used across North Carolina. Built to be reliable under load and simple for students and staff."
          tags={["Full-stack", "Real-time", "Education"]}
          href="https://ncempt.org"
          demo={() => setShowDemo(true)}
        />
        <ProjectCard
          title="Restaurant Inventory & Ordering System"
          blurb="I solved food-cost issues by digitizing inventory and par-based ordering—helping create an effective workplace environment without trading labor costs for food costs."
          tags={["Operations", "Cost Control", "Inventory"]}
        />
      </section>

      {/* ✅ Modal Lightbox for Demo */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowDemo(false)} // close if background clicked
        >
          <div
            className="relative w-[90%] max-w-3xl bg-black border border-white/20 rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside video
          >
            <video
              src="/ncempt-demo.mp4"
              controls
              autoPlay
              className="w-full h-auto"
            />
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({
  title,
  blurb,
  tags = [],
  href,
  demo,
}: {
  title: string;
  blurb: string;
  tags?: string[];
  href?: string;
  demo?: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:bg-white/5 transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-white/80">{blurb}</p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full border border-white/15 px-2 py-1 text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2 flex-wrap">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 transition"
          >
            View Project
          </a>
        )}
        {demo && (
          <button
            onClick={demo}
            className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 transition"
          >
            ▶ Watch Demo
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- Chef Panel (Static Polaroid Grid Without Tilt) ---------- */

function ChefPanel() {
  const photos = [
    { src: "/alfajores.png", alt: "Alfajores", caption: "Alfajores" },
    { src: "/potpie.jpg", alt: "Chicken Pot Pie", caption: "Chicken Pot Pie" },
    { src: "/villaluz.jpg", alt: "The Villaluz Sandwich", caption: "The Villaluz Sandwich" },
    { src: "/pasta.jpg", alt: "Steak & Pappardelle", caption: "Steak & Pappardelle" },
    { src: "/chowder.jpg", alt: "Dill Chowder", caption: "Dill Chowder" },
  ];

  return (
    <section className="space-y-6 text-center">
      <p className="text-white/85">Some people write with code. I write with garlic.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
        {photos.map((img, i) => (
          <StaticPolaroid key={i} src={img.src} alt={img.alt} caption={img.caption} />
        ))}
      </div>
    </section>
  );
}

function StaticPolaroid({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="mx-auto bg-white text-black rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="relative w-[260px] aspect-[4/5] overflow-hidden rounded-t-[12px]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="260px" />
      </div>
      {caption && <figcaption className="px-4 py-3 text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

/* ---------- UI Bits ---------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition backdrop-blur
      ${active
        ? "border-white/30 bg-white/10 hover:bg-white/15"
        : "border-white/10 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}
