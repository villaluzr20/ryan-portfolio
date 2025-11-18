"use client";

export default function ResumePage() {
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

      <div className="relative flex flex-col items-center text-center p-10 pt-20 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Professional Stuff</h1>
        <p className="text-white/70 mb-6">
          Here’s my resume — feel free to download or zoom in.
        </p>

        {/* Embedded PDF */}
        <div className="w-full max-w-4xl aspect-[8.5/11] border border-white/20 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="/Software Resume.pdf#view=fitH"
            className="w-full h-full"
          />
        </div>
      </div>
    </main>
  );
}
