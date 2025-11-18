"use client";

import { useEffect, useRef, useState } from "react";

type Persisted = {
  answers: string[];
  qIndex: number;
  done: boolean;
  savedAt: number; // ms epoch
};

const STORAGE_KEY = "qa_state_v1";
const TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const QUESTIONS = [
  "What’s your name?",
  "What’s one thing you’re proud of this week?",
  "What’s something you want to explore this month?",
  "If you could message future-you, what would you say?",
];

const SETTINGS = {
  typingDelayMs: 28,
  preQuestionDelayMs: 300,
  keySound: true,
  bgAccent: "from-[#0f0f13] via-[#121521] to-[#0f0f13]",
};

export default function Portfolio() {
  const [qIndex, setQIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [done, setDone] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Restore state from localStorage (respect TTL)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Persisted;
        const fresh = Date.now() - data.savedAt < TTL_MS;
        if (fresh) {
          setAnswers(data.answers || []);
          setQIndex(typeof data.qIndex === "number" ? data.qIndex : 0);
          setDone(!!data.done);
          setIsTyping(false);
          setDisplayed("");
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}
  }, []);

  // Persist state whenever it changes
  useEffect(() => {
    const payload: Persisted = {
      answers,
      qIndex,
      done,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [answers, qIndex, done]);

  // Init audio lazily
useEffect(() => {
  const handler = () => {
    if (!audioCtxRef.current) {
      const win = window as Window & {
        webkitAudioContext?: typeof AudioContext;
      };

      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    document.removeEventListener("pointerdown", handler);
    document.removeEventListener("keydown", handler);
  };
  document.addEventListener("pointerdown", handler, { once: true });
  document.addEventListener("keydown", handler, { once: true });
}, []);


  // Auto-scroll
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayed, qIndex, answers, isTyping, done]);

  // Typewriter effect (only when not done and when we haven't restored finished state)
  useEffect(() => {
    if (done) return; // skip typing if we're already finished
    let cancelled = false;
    const type = async () => {
      setDisplayed("");
      setIsTyping(true);
      await sleep(SETTINGS.preQuestionDelayMs);
      const text = QUESTIONS[qIndex];
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        setDisplayed((d) => d + text[i]);
        if (SETTINGS.keySound) clickSound(audioCtxRef.current, text[i]);
        await sleep(SETTINGS.typingDelayMs + jitter(0, 25));
      }
      setIsTyping(false);
    };
    if (qIndex < QUESTIONS.length) type();
    return () => {
      cancelled = true;
    };
  }, [qIndex, done]);

  function handleSubmit() {
    const val = inputValue.trim();
    if (!val) return;
    const next = [...answers];
    next[qIndex] = val;
    setAnswers(next);
    setInputValue("");
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setDone(true);
    }
  }

  function skipTyping() {
    if (isTyping) {
      setDisplayed(QUESTIONS[qIndex]);
      setIsTyping(false);
    }
  }

  function restartAll() {
    setQIndex(0);
    setAnswers([]);
    setDone(false);
    setDisplayed("");
    setIsTyping(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <main
      className={`min-h-screen w-full text-white relative overflow-hidden bg-gradient-to-b ${SETTINGS.bgAccent}`}
    >
      {/* Background CRT / Noise */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[0.07] bg-[radial-gradient(transparent_60%,#000_61%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,.12) 0px, rgba(255,255,255,.12) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <Noise />

      <div className="relative mx-auto max-w-2xl px-5 py-12">
        {/* Header */}
        <header className="mb-8 text-center select-none">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            I build things to understand the world — and myself.
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Answer a few questions. I’ll show you what I create.{" "}
            <span className="inline-block align-middle animate-pulse">▉</span>
          </p>
        </header>

        {/* Main QA Area */}
        <div
          ref={containerRef}
          className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] h-[60vh] overflow-y-auto"
        >
          <div className="space-y-6 font-mono text-[15px] leading-relaxed">
            {/* Transcript of previous answers (always show what's been answered) */}
            {answers.map((ans, i) => (
              <QA key={i} q={QUESTIONS[i]} a={ans} />
            ))}

            {/* Current prompt or final screen */}
            {!done ? (
              <div>
                <p className="whitespace-pre-wrap">
                  {displayed}
                  <Cursor active={isTyping} />
                </p>
                {!isTyping && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-white/60">&gt;</span>
                    <input
                      className="flex-1 bg-transparent outline-none border-b border-white/30 focus:border-white/70 pb-1 px-1"
                      placeholder="type and press Enter…"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      autoFocus
                    />
                  </div>
                )}
                {!isTyping && (
                  <div className="mt-4">
                    <button
                      className="rounded-xl border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
                      onClick={skipTyping}
                    >
                      skip typing
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-10 text-center">
                <p className="text-white/80 mb-6">
                  thanks for sharing a moment with me.
                  <br />
                  {"if you'd like to go further:"}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/projects"
                    className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 transition"
                  >
                    See What I Build
                  </a>
                  <a
                    href="/about"
                    className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 transition"
                  >
                    Who I Am
                  </a>
                  <a href="/resume" className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 transition">
  Professional Stuff
</a>

                </div>
                <div className="mt-6">
                  <button
                    className="rounded-xl border border-white/20 px-4 py-2 text-xs hover:bg-white/10"
                    onClick={restartAll}
                  >
                    Restart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer toggles */}
        <footer className="mt-6 flex items-center justify-between text-xs text-white/50">
          <div className="space-x-3">
            <Toggle
              label="sound"
              on={SETTINGS.keySound}
              onToggle={() => {
                SETTINGS.keySound = !SETTINGS.keySound;
              }}
            />
          </div>
          <div>press Enter to submit</div>
        </footer>
      </div>
    </main>
  );
}

function QA({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="whitespace-pre-wrap">{q}</p>
      <p className="mt-2">
        <span className="text-white/60">&gt;</span> {a}
      </p>
    </div>
  );
}

function Cursor({ active }: { active: boolean }) {
  return (
    <span
      className={`ml-1 inline-block w-3 ${
        active ? "bg-white/70 animate-pulse" : "bg-transparent"
      }`}
      style={{ height: "1em", transform: "translateY(0.18em)" }}
    />
  );
}

function Toggle({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs hover:bg-white/10"
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          on ? "bg-emerald-400" : "bg-white/30"
        }`}
      />
      <span className="uppercase tracking-wide">{label}</span>
    </button>
  );
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
function jitter(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clickSound(ctx: AudioContext | null, ch: string) {
  if (!ctx) return;
  if (ch === " " || ch === "\n") return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(220 + Math.random() * 40, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={{ backgroundImage: noiseDataURL() }}
    />
  );
}

function noiseDataURL() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.random() * 255;
    imgData.data[i] = v;
    imgData.data[i + 1] = v;
    imgData.data[i + 2] = v;
    imgData.data[i + 3] = 30;
  }
  ctx.putImageData(imgData, 0, 0);
  return `url(${c.toDataURL()})`;
}


