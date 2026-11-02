"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MENU, Mode, PROJECTS, STACK } from "@/lib/content";
import { Screen } from "./Screens";

type K = "up" | "down" | "left" | "right" | "a" | "b" | "start";
const KEYMAP: Record<string, K> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "a", Escape: "b", Backspace: "b" };

export default function Portfolio() {
  const [mode, setMode] = useState<Mode>("title");
  const [mi, setMi] = useState(0), [pi, setPi] = useState(0), [si, setSi] = useState(0);
  const scr = useRef<HTMLDivElement>(null), cur = useRef<HTMLDivElement>(null);
  const nStack = Object.keys(STACK).length;

  const key = useCallback((k: K) => {
    const scroll = (d: number) => scr.current && (scr.current.scrollTop += d);
    if (mode === "title") { if (k === "start" || k === "a") { setMode("boot"); setTimeout(() => setMode("menu"), 900); } return; }
    if (mode === "boot") return;
    if (k === "start") return setMode("menu");
    if (mode === "menu") {
      if (k === "up") setMi((i) => (i + MENU.length - 1) % MENU.length);
      if (k === "down") setMi((i) => (i + 1) % MENU.length);
      if (k === "a" || k === "right") setMode(MENU[mi][0]);
      return;
    }
    if (k === "b") return setMode("menu");
    if (mode === "projects" && (k === "left" || k === "right")) setPi((i) => (i + (k === "left" ? -1 : 1) + PROJECTS.length) % PROJECTS.length);
    else if (mode === "stack" && (k === "left" || k === "right")) setSi((i) => (i + (k === "left" ? -1 : 1) + nStack) % nStack);
    else if (k === "up" || k === "down") scroll(k === "up" ? -40 : 40);
  }, [mode, mi, nStack]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || (t.tagName === "BUTTON" && e.key === "Enter")) return;
      const k = KEYMAP[e.key]; if (k) { e.preventDefault(); key(k); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key]);

  useEffect(() => { scr.current?.scrollTo(0, 0); }, [mode]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cur.current) return;
      cur.current.style.transform = `translate(${e.clientX - 9}px,${e.clientY - 9}px) scale(${(e.target as HTMLElement).closest("button,a,input,select,textarea") ? 2.2 : 1})`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const pick = (i: number) => { setMi(i); setMode(MENU[i][0]); };
  const Btn = ({ k, children, cls }: { k: K; children: React.ReactNode; cls?: string }) => (
    <button type="button" className={cls} onClick={() => key(k)} aria-label={k}>{children}</button>
  );

  return (
    <main className="mx-auto grid min-h-screen max-w-[1180px] items-center gap-10 px-5 py-7 md:grid-cols-[1.1fr_.9fr]">
      <div ref={cur} className="cursor pointer-events-none fixed left-0 top-0 z-[99] h-[18px] w-[18px] rounded-full border-2 border-acc" aria-hidden />
      <section>
        <p className="mb-4 font-head text-xs font-semibold tracking-[.2em] text-acc">▶ PLAYER 1 · RAJKOT, INDIA</p>
        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
          className="mb-5 font-head font-bold leading-[.95] tracking-[-0.03em]" style={{ fontSize: "clamp(44px,7vw,92px)" }}>
          KRUPALI<br />VEKARIYA
        </motion.h1>
        <p className="mb-3 font-head font-medium leading-snug" style={{ fontSize: "clamp(18px,2vw,24px)" }}>Building Ideas Into Digital Reality.</p>
        <p className="mb-6 text-lg text-mut">Full-Stack AI Engineer. Software Developer. Product Builder.</p>
        <p className="text-sm text-mut">Press START on the console, or use arrow keys + Enter. Esc goes back.</p>
        <nav aria-label="Sections" className="mt-5 flex flex-wrap gap-2">
          {MENU.map((m, i) => (
            <button key={m[0]} onClick={() => { if (mode === "title" || mode === "boot") setMode("menu"); pick(i); }}
              className="rounded-full border border-line px-4 py-2 font-head text-sm font-medium transition-colors hover:border-acc hover:text-acc focus-visible:border-acc focus-visible:text-acc focus-visible:outline-none">{m[1]}</button>
          ))}
        </nav>
      </section>

      <div className="console w-full max-w-[380px] justify-self-center" role="application" aria-label="Interactive portfolio console">
        <div className="bezel">
          <p className="mb-2 text-center font-head text-[9px] font-semibold tracking-[.18em] text-[color:var(--padtx)]">DOT MATRIX WITH STEREO SOUND</p>
          <div ref={scr} className="scr" tabIndex={0} aria-live="polite" onClick={() => mode === "title" && key("start")}>
            <AnimatePresence mode="wait">
              <motion.div key={mode + (mode === "projects" ? pi : "") + (mode === "stack" ? si : "")}
                initial={{ clipPath: "inset(50% 0 50% 0)" }} animate={{ clipPath: "inset(0% 0 0% 0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                <Screen mode={mode} mi={mi} pi={pi} si={si} onPick={pick} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center justify-between px-2 pb-1 pt-5">
          <div className="dp"><Btn k="up" cls="u">▲</Btn><Btn k="left" cls="l">◀</Btn><i /><Btn k="right" cls="r">▶</Btn><Btn k="down" cls="d">▼</Btn></div>
          <div className="flex -rotate-[20deg] gap-3.5"><Btn k="b" cls="abtn mt-[18px]">B</Btn><Btn k="a" cls="abtn">A</Btn></div>
        </div>
        <div className="mt-3 flex -rotate-[20deg] justify-center gap-5 font-head text-[10px] font-semibold tracking-wider">
          <Btn k="b" cls="rounded-[10px] bg-[#45454c] px-3 py-1 text-[#e4e4ea]">SELECT</Btn>
          <Btn k="start" cls="rounded-[10px] bg-acc px-3 py-1 text-white">START</Btn>
        </div>
      </div>
    </main>
  );
}
